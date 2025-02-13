import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import { RenderResult, act, axe, render } from '../../../__test__/test-utils';
import { GET_ALL_ACTIVATED_PARTIES } from '../../../api/external-registries/external-registries-routes';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import SpecialContacts from '../SpecialContacts';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('SpecialContacts Component - accessibility tests', async () => {
  let result: RenderResult;
  let mock: MockAdapter;
  // this is needed because there is a bug when vi.mock is used
  // https://github.com/vitest-dev/vitest/issues/3300
  // maybe with vitest 1, we can remove the workaround
  const apiClients = await import('../../../api/apiClients');

  beforeAll(() => {
    mock = new MockAdapter(apiClients.apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('does not have basic accessibility issues - API OK', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES()).reply(200, parties);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContacts
            recipientId="mocked-recipientId"
            legalAddresses={digitalAddresses.legal}
            courtesyAddresses={digitalAddresses.courtesy}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  }, 10000);

  it('does not have basic accessibility issues - API ERROR', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES()).reply(500);
    // render component
    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <DigitalContactsCodeVerificationProvider>
            <SpecialContacts
              recipientId="mocked-recipientId"
              legalAddresses={digitalAddresses.legal}
              courtesyAddresses={digitalAddresses.courtesy}
            />
          </DigitalContactsCodeVerificationProvider>
        </>
      );
    });

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  }, 10000);
});
