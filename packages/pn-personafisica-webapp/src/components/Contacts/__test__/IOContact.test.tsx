import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { RenderResult, fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { COURTESY_CONTACT } from '../../../api/contacts/contacts.routes';
import { CourtesyChannelType, IOAllowedValues } from '../../../models/contacts';
import IOContact from '../IOContact';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const IOAddress = digitalAddresses.courtesy.find(
  (addr) => addr.channelType === CourtesyChannelType.IOMSG
);

describe('IOContact component', async () => {
  let mock: MockAdapter;
  let result: RenderResult;
  // this is needed because there is a bug when vi.mock is used
  // https://github.com/vitest-dev/vitest/issues/3300
  // maybe with vitest 1, we can remove the workaround
  const apiClients = await import('../../../api/apiClients');
  const testUtils = await import('../../../__test__/test-utils');

  beforeAll(() => {
    mock = new MockAdapter(apiClients.apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders component - no contacts', () => {
    result = render(<IOContact recipientId={IOAddress!.recipientId} contact={null} />);
    const cardAvatar = result.container.querySelector('svg>title');
    expect(cardAvatar).toBeInTheDocument();
    const title = result.getByRole('heading', { name: 'io-contact.subtitle' });
    expect(title).toBeInTheDocument();
    const ioCheckbox = result.queryByRole('checkbox', { name: 'io-contact.switch-label' });
    expect(ioCheckbox).not.toBeInTheDocument();
    const alert = result.queryByTestId('appIO-contact-disclaimer');
    expect(alert).not.toBeInTheDocument();
    const link = result.container.querySelector('a');
    expect(link).not.toBeInTheDocument();
  });

  it('IO unavailable', () => {
    result = render(<IOContact recipientId={IOAddress!.recipientId} contact={undefined} />);
    const ioCheckbox = result.queryByRole('checkbox', { name: 'io-contact.switch-label' });
    expect(ioCheckbox).not.toBeInTheDocument();
    const alert = result.getByTestId('appIO-contact-disclaimer');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('io-contact.disclaimer-message-unavailable');
    /** Waiting for FAQs */
    // expect(alert).not.toHaveTextContent('io-contact.disclaimer-link');
    const link = result.container.querySelector('a');
    expect(link).not.toBeInTheDocument();
  });

  it('IO available and disabled', async () => {
    mock
      .onPost(COURTESY_CONTACT('default', CourtesyChannelType.IOMSG), {
        value: 'APPIO',
        verificationCode: '00000',
      })
      .reply(204);
    result = render(<IOContact recipientId={IOAddress!.recipientId} contact={IOAddress} />, {
      preloadedState: { contactsState: { digitalAddresses: { courtesy: [IOAddress] } } },
    });
    result.getByTestId('CloseIcon');
    result.getByText('io-contact.disabled');
    const enableBtn = result.getByRole('button', { name: 'button.enable' });
    expect(enableBtn).toBeInTheDocument();
    expect(enableBtn).toBeEnabled();
    const alert = result.getByTestId('appIO-contact-disclaimer');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('io-contact.disclaimer-message');
    /** Waiting for FAQs */
    // expect(alert).toHaveTextContent('io-contact.disclaimer-link');
    // const link = result.container.querySelector('a');
    // expect(link).toBeInTheDocument();
    // expect(link).toHaveTextContent('io-contact.disclaimer-link');
    // enable IO
    fireEvent.click(enableBtn);
    const disclaimerCheckbox = await waitFor(() => result.getByTestId('disclaimer-checkbox'));
    const disclaimerConfirmButton = result.getByTestId('disclaimer-confirm-button');
    expect(disclaimerConfirmButton).toHaveTextContent('io-contact.enable-modal.confirm');
    expect(disclaimerConfirmButton).toBeDisabled();
    fireEvent.click(disclaimerCheckbox);
    await waitFor(() => {
      expect(disclaimerConfirmButton).toBeEnabled();
    });
    fireEvent.click(disclaimerConfirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: 'APPIO',
        verificationCode: '00000',
      });
    });
    expect(testUtils.testStore.getState().contactsState.digitalAddresses.courtesy).toStrictEqual([
      { ...IOAddress, value: IOAllowedValues.ENABLED },
    ]);
  });

  it('IO available and enabled', async () => {
    mock.onDelete(COURTESY_CONTACT('default', CourtesyChannelType.IOMSG)).reply(200);
    result = render(
      <IOContact
        recipientId={IOAddress!.recipientId}
        contact={{ ...IOAddress!, value: IOAllowedValues.ENABLED }}
      />,
      {
        preloadedState: {
          contactsState: {
            digitalAddresses: { courtesy: [{ ...IOAddress!, value: IOAllowedValues.ENABLED }] },
          },
        },
      }
    );
    result.getByTestId('CheckIcon');
    result.getByText('io-contact.enabled');
    const disableBtn = result.getByRole('button', { name: 'button.disable' });
    expect(disableBtn).toBeInTheDocument();
    expect(disableBtn).toBeEnabled();
    const alert = result.getByTestId('appIO-contact-disclaimer');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('io-contact.disclaimer-message');
    /** Waiting for FAQs */
    // expect(alert).toHaveTextContent('io-contact.disclaimer-link');
    // const link = result.container.querySelector('a');
    // expect(link).toBeInTheDocument();
    // expect(link).toHaveTextContent('io-contact.disclaimer-link');
    // disable IO
    fireEvent.click(disableBtn);
    const disclaimerCheckbox = await waitFor(() => result.getByTestId('disclaimer-checkbox'));
    const disclaimerConfirmButton = result.getByTestId('disclaimer-confirm-button');
    expect(disclaimerConfirmButton).toHaveTextContent('io-contact.disable-modal.confirm');
    expect(disclaimerConfirmButton).toBeDisabled();
    fireEvent.click(disclaimerCheckbox);
    await waitFor(() => {
      expect(disclaimerConfirmButton).toBeEnabled();
    });
    fireEvent.click(disclaimerConfirmButton);
    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(1);
    });
    expect(testUtils.testStore.getState().contactsState.digitalAddresses.courtesy).toStrictEqual([
      { ...IOAddress, value: IOAllowedValues.DISABLED },
    ]);
  });
});
