import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { vi } from 'vitest';

import { DOWNTIME_HISTORY } from '@pagopa-pn/pn-commons';

import { downtimesDTO } from '../../__mocks__/AppStatus.mock';
import { userResponse } from '../../__mocks__/Auth.mock';
import { arrayOfDelegators } from '../../__mocks__/Delegations.mock';
import { notificationDTO } from '../../__mocks__/NotificationDetail.mock';
import { RenderResult, act, axe, render } from '../../__test__/test-utils';
import { getApiClient } from '../../api/apiClients';
import {
  NOTIFICATION_DETAIL,
  NOTIFICATION_PAYMENT_INFO,
} from '../../api/notifications/notifications.routes';
import NotificationDetail from '../NotificationDetail.page';

let mockIsDelegate = false;

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')) as any,
  useParams: () =>
    mockIsDelegate
      ? { id: 'DAPQ-LWQV-DKQH-202308-A-1', mandateId: '5' }
      : { id: 'DAPQ-LWQV-DKQH-202308-A-1' },
}));

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const delegator = arrayOfDelegators.find(
  (delegator) => delegator.delegator?.fiscalCode === notificationDTO.recipients[1].taxId
);

describe('NotificationDetail Page - accessibility tests', () => {
  let result: RenderResult | undefined;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(getApiClient());
  });

  afterEach(() => {
    result = undefined;
    vi.clearAllMocks();
    mock.reset();
    mockIsDelegate = false;
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders NotificationDetail page', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    mock
      .onGet(
        NOTIFICATION_PAYMENT_INFO(
          notificationDTO.recipients[1].payment?.creditorTaxId!,
          notificationDTO.recipients[1].payment?.noticeCode!
        )
      )
      .reply(200, {
        status: 'SUCCEEDED',
        amount: 250,
      });
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: {
            user: userResponse,
          },
        },
      });
    });
    expect(await axe(result?.container!)).toHaveNoViolations();
  }, 15000);

  it('renders NotificationDetail page with delegator logged', async () => {
    mockIsDelegate = true;
    mock
      .onGet(NOTIFICATION_DETAIL(notificationDTO.iun, delegator?.mandateId))
      .reply(200, notificationDTO);
    mock
      .onGet(
        NOTIFICATION_PAYMENT_INFO(
          notificationDTO.recipients[1].payment?.creditorTaxId!,
          notificationDTO.recipients[1].payment?.noticeCode!
        )
      )
      .reply(200, {
        status: 'SUCCEEDED',
        amount: 250,
      });
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />, {
        preloadedState: {
          userState: { user: userResponse },
        },
      });
    });
    expect(await axe(result?.container!)).toHaveNoViolations(); // Accesibility test
  }, 15000);
});
