import MockAdapter from 'axios-mock-adapter';
import { ReactNode } from 'react';
import { vi } from 'vitest';

import {
  ConsentUser,
  PRIVACY_LINK_RELATIVE_PATH,
  TOS_LINK_RELATIVE_PATH,
} from '@pagopa-pn/pn-commons';

import { fireEvent, render, waitFor } from '../../__test__/test-utils';
import { SET_CONSENTS } from '../../api/consents/consents.routes';
import { ConsentActionType, ConsentType } from '../../models/consents';
import * as routes from '../../navigation/routes.const';
import ToSAcceptance from '../ToSAcceptance.page';

const mockNavigateFn = vi.fn();

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  Trans: (props: { i18nKey: string; components: Array<ReactNode> }) => (
    <>
      {props.i18nKey} {props.components.map((c) => c)}
    </>
  ),
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const tosConsent: ConsentUser = {
  accepted: false,
  isFirstAccept: true,
  consentVersion: 'mocked-version-1',
};

const privacyConsent: ConsentUser = {
  accepted: false,
  isFirstAccept: true,
  consentVersion: 'mocked-version-1',
};

describe('test Terms of Service page', async () => {
  let mock: MockAdapter;
  // this is needed because there is a bug when vi.mock is used
  // https://github.com/vitest-dev/vitest/issues/3300
  // maybe with vitest 1, we can remove the workaround
  const apiClients = await import('../../api/apiClients');

  beforeAll(() => {
    mock = new MockAdapter(apiClients.apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('checks the texts in the page - First ToS acceptance', () => {
    const { container } = render(
      <ToSAcceptance tosConsent={tosConsent} privacyConsent={privacyConsent} />
    );

    expect(container).toHaveTextContent(/tos.title/i);
    expect(container).toHaveTextContent(/tos.body/i);
    expect(container).toHaveTextContent(/tos.switch-label/i);
    expect(container).toHaveTextContent(/tos.button/i);
  });

  it('checks the texts in the page - Not first ToS acceptance', () => {
    const { container } = render(
      <ToSAcceptance
        tosConsent={{ ...tosConsent, isFirstAccept: false }}
        privacyConsent={{ ...privacyConsent, isFirstAccept: false }}
      />
    );

    expect(container).toHaveTextContent(/tos.title/i);
    expect(container).toHaveTextContent(/tos.redo-body/i);
    expect(container).toHaveTextContent(/tos.switch-label/i);
    expect(container).toHaveTextContent(/tos.button/i);
  });

  it('accept ToS and Privacy', async () => {
    mock
      .onPut(SET_CONSENTS(ConsentType.TOS, tosConsent.consentVersion), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(200);
    mock
      .onPut(SET_CONSENTS(ConsentType.DATAPRIVACY, privacyConsent.consentVersion), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(200);
    const { getByRole } = render(
      <ToSAcceptance tosConsent={tosConsent} privacyConsent={privacyConsent} />
    );
    const switchElement = getByRole('checkbox');
    const acceptButton = getByRole('button');
    expect(acceptButton).toBeDisabled();
    fireEvent.click(switchElement);
    await waitFor(() => expect(acceptButton).toBeEnabled());
    fireEvent.click(acceptButton);
    await waitFor(() => {
      expect(mock.history.put).toHaveLength(2);
      expect(mock.history.put[0].url).toBe(
        SET_CONSENTS(ConsentType.TOS, tosConsent.consentVersion)
      );
      expect(mock.history.put[1].url).toBe(
        SET_CONSENTS(ConsentType.DATAPRIVACY, privacyConsent.consentVersion)
      );
    });
  });

  it('navigate to dashboard if tos and privacy are accepted', async () => {
    render(
      <ToSAcceptance
        tosConsent={{ ...tosConsent, accepted: true }}
        privacyConsent={{ ...privacyConsent, accepted: true }}
      />
    );
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(routes.NOTIFICHE);
  });

  it('navigate to privacy and tos pages', async () => {
    const { getByTestId } = render(
      <ToSAcceptance tosConsent={tosConsent} privacyConsent={privacyConsent} />
    );
    const tosLink = getByTestId('terms-and-conditions');
    fireEvent.click(tosLink!);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(TOS_LINK_RELATIVE_PATH);
    const privacyLink = getByTestId('privacy-link');
    fireEvent.click(privacyLink!);
    expect(mockNavigateFn).toBeCalledTimes(2);
    expect(mockNavigateFn).toBeCalledWith(PRIVACY_LINK_RELATIVE_PATH);
  });
});
