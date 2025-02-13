import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../__mocks__/Contacts.mock';
import { RenderResult, act, fireEvent, render, screen } from '../../__test__/test-utils';
import { CONTACTS_LIST } from '../../api/contacts/contacts.routes';
import { PROFILE } from '../../navigation/routes.const';
import { CONTACT_ACTIONS } from '../../redux/contact/actions';
import Contacts from '../Contacts.page';

const mockOpenFn = vi.fn();

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('Contacts page', async () => {
  let mock: MockAdapter;
  let result: RenderResult;
  const original = window.open;
  // this is needed because there is a bug when vi.mock is used
  // https://github.com/vitest-dev/vitest/issues/3300
  // maybe with vitest 1, we can remove the workaround
  const apiClients = await import('../../api/apiClients');

  beforeAll(() => {
    mock = new MockAdapter(apiClients.apiClient);
    Object.defineProperty(window, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    vi.resetAllMocks();
    Object.defineProperty(window, 'open', { configurable: true, value: original });
  });

  it('renders Contacts (no contacts)', async () => {
    mock.onGet(CONTACTS_LIST()).reply(200, []);
    await act(async () => {
      result = await render(<Contacts />);
    });
    expect(result.container).toHaveTextContent(/title/i);
    expect(result.container).toHaveTextContent(/subtitle/i);
    const insertLegalContact = result?.getByTestId('insertLegalContact');
    expect(insertLegalContact).toBeInTheDocument();
    const courtesyContacts = result?.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
    const legalContacts = result?.queryByTestId('legalContacts');
    expect(legalContacts).not.toBeInTheDocument();
    const specialContact = result?.queryByTestId('specialContact');
    expect(specialContact).not.toBeInTheDocument();
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain(CONTACTS_LIST());
  });

  it('renders Contacts (legal contacts)', async () => {
    mock.onGet(CONTACTS_LIST()).reply(200, { legal: digitalAddresses.legal });
    await act(async () => {
      result = await render(<Contacts />);
    });
    const insertLegalContact = result?.queryByTestId('insertLegalContact');
    expect(insertLegalContact).not.toBeInTheDocument();
    const courtesyContacts = result?.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
    const legalContacts = result?.getByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const specialContact = result?.getByTestId('specialContact');
    expect(specialContact).toBeInTheDocument();
  });

  it('renders Contacts (courtesy contacts)', async () => {
    mock.onGet(CONTACTS_LIST()).reply(200, { courtesy: digitalAddresses.courtesy });
    await act(async () => {
      result = await render(<Contacts />);
    });
    const insertLegalContact = result?.getByTestId('insertLegalContact');
    expect(insertLegalContact).toBeInTheDocument();
    const courtesyContacts = result?.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
    const legalContacts = result?.queryByTestId('legalContacts');
    expect(legalContacts).not.toBeInTheDocument();
    const specialContact = result?.getByTestId('specialContact');
    expect(specialContact).toBeInTheDocument();
  });

  it('renders Contacts (courtesy and legal contacts filled)', async () => {
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    await act(async () => {
      result = await render(<Contacts />);
    });
    const insertLegalContact = result?.queryByTestId('insertLegalContact');
    expect(insertLegalContact).not.toBeInTheDocument();
    const courtesyContacts = result?.getByTestId('courtesyContacts');
    expect(courtesyContacts).toBeInTheDocument();
    const legalContacts = result?.getByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    const specialContact = result?.getByTestId('specialContact');
    expect(specialContact).toBeInTheDocument();
  });

  it('subtitle link properly redirects to profile page', async () => {
    mock.onGet(CONTACTS_LIST()).reply(200, []);
    await act(async () => {
      result = await render(<Contacts />, {
        preloadedState: {
          userState: {
            user: {
              organization: {
                id: 'mocked-id',
              },
            },
          },
        },
      });
    });
    const subtitleLink = result?.getByText('subtitle-link');
    expect(subtitleLink).toBeInTheDocument();
    fireEvent.click(subtitleLink!);
    expect(mockOpenFn).toBeCalledTimes(1);
    expect(mockOpenFn).toBeCalledWith(PROFILE('mocked-id'));
  });

  it('API error', async () => {
    mock.onGet(CONTACTS_LIST()).reply(500);
    await act(async () => {
      render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <Contacts />
        </>
      );
    });
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${CONTACT_ACTIONS.GET_DIGITAL_ADDRESSES}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });
});
