import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { ThemeProvider } from '@emotion/react';
import { theme } from '@pagopa/mui-italia';

import App from '../App';
import { currentStatusDTO } from '../__mocks__/AppStatus.mock';
import { userResponse } from '../__mocks__/Auth.mock';
import { digitalAddresses } from '../__mocks__/Contacts.mock';
import { arrayOfDelegators } from '../__mocks__/Delegations.mock';
import { GET_CONSENTS } from '../api/consents/consents.routes';
import { CONTACTS_LIST } from '../api/contacts/contacts.routes';
import { DELEGATIONS_BY_DELEGATE } from '../api/delegations/delegations.routes';
import { ConsentType } from '../models/consents';
import { RenderResult, act, axe, render } from './test-utils';

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  Trans: (props: { i18nKey: string }) => props.i18nKey,
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

vi.mock('../pages/Notifiche.page', () => ({ default: () => <div>Generic Page</div> }));

const unmockedFetch = global.fetch;

const Component = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

const reduxInitialState = {
  userState: {
    user: userResponse,
    fetchedTos: false,
    fetchedPrivacy: false,
    tosConsent: {
      accepted: false,
      isFirstAccept: false,
      currentVersion: 'mocked-version-1',
    },
    privacyConsent: {
      accepted: false,
      isFirstAccept: false,
      currentVersion: 'mocked-version-1',
    },
  },
};

describe('App - accessbility tests', async () => {
  let mock: MockAdapter;
  // this is needed because there is a bug when vi.mock is used
  // https://github.com/vitest-dev/vitest/issues/3300
  // maybe with vitest 1, we can remove the workaround
  const apiClients = await import('../api/apiClients');

  beforeAll(() => {
    mock = new MockAdapter(apiClients.apiClient);
    // FooterPreLogin (mui-italia) component calls an api to fetch selfcare products list.
    // this causes an error, so we mock to avoid it
    global.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      }) as Promise<Response>;
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
    global.fetch = unmockedFetch;
  });

  it('Test if automatic accessibility tests passes - user not logged in', async () => {
    let renderResult: RenderResult | undefined;
    await act(async () => {
      renderResult = render(<Component />);
    });
    if (renderResult) {
      const result = await axe(renderResult.container);
      expect(result).toHaveNoViolations();
    }
  });

  it('Test if automatic accessibility tests passes - user logged in', async () => {
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(200, {
      recipientId: userResponse.uid,
      consentType: ConsentType.DATAPRIVACY,
      accepted: true,
    });
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(200, {
      recipientId: userResponse.uid,
      consentType: ConsentType.TOS,
      accepted: true,
    });
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
    let result: RenderResult | undefined;
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);

  it('Test if automatic accessibility tests passes - errors on API call', async () => {
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(200, {
      recipientId: userResponse.uid,
      consentType: ConsentType.DATAPRIVACY,
      accepted: true,
    });
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(500);
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
    let result: RenderResult | undefined;
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);
});
