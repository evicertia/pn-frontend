import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import {
  AppResponseMessage,
  DOWNTIME_HISTORY,
  DOWNTIME_LEGAL_FACT_DETAILS,
  LegalFactId,
  NotificationDetail as NotificationDetailModel,
  NotificationStatus,
  ResponseEventDispatcher,
  TimelineCategory,
} from '@pagopa-pn/pn-commons';

import { downtimesDTO, simpleDowntimeLogPage } from '../../__mocks__/AppStatus.mock';
import {
  notificationDTO,
  notificationDTOMultiRecipient,
} from '../../__mocks__/NotificationDetail.mock';
import * as actions from '../../redux/notification/actions';
import { RenderResult, act, fireEvent, render, waitFor, within } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import {
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
} from '../../api/notifications/notifications.routes';
import { NOTIFICATION_ACTIONS } from '../../redux/notification/actions';
import NotificationDetail from '../NotificationDetail.page';

const mockNavigateFn = jest.fn();

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'RTRD-UDGU-QTQY-202308-P-1' }),
  useNavigate: () => mockNavigateFn,
}));

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const getLegalFactIds = (notification: NotificationDetailModel, recIndex: number) => {
  const timelineElementDigitalSuccessWorkflow = notification.timeline.filter(
    (t) =>
      t.category === TimelineCategory.DIGITAL_SUCCESS_WORKFLOW && t.details.recIndex === recIndex
  )[0];
  return timelineElementDigitalSuccessWorkflow.legalFactsIds![0] as LegalFactId;
};

describe('NotificationDetail Page (one recipient)', () => {
  const mockLegalIds = getLegalFactIds(notificationDTO, 0);

  let result: RenderResult | undefined;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  const changeStatus = (status: NotificationStatus) => {
    result = render(<NotificationDetail />, {
      preloadedState: {
        notificationState: {
          notification: { ...notificationDTO, notificationStatus: status },
          documentDownloadUrl: 'mocked-download-url',
          legalFactDownloadUrl: 'mocked-legal-fact-url',
        },
        userState: { user: { organization: { id: 'mocked-sender' } } },
      },
    });
  };

  afterEach(() => {
    result = undefined;
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders NotificationDetail page - mono recipient', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    expect(mock.history.get[1].url).toContain('/downtime/v1/history');
    expect(result?.getByRole('link')).toHaveTextContent(/detail.breadcrumb-root/i);
    expect(result?.container.querySelector('h4')).toHaveTextContent(notificationDTO.subject);
    expect(result?.container).toHaveTextContent(notificationDTO.abstract!);
    // check summary table
    const notificationDetailTable = result?.getByTestId('notificationDetailTable');
    expect(notificationDetailTable).toBeInTheDocument();
    const tableRows = notificationDetailTable?.querySelectorAll('tr');
    expect(tableRows![0]).toHaveTextContent(`detail.sender${notificationDTO.senderDenomination}`);
    expect(tableRows![1]).toHaveTextContent(
      `detail.recipient${notificationDTO.recipients[0].denomination}`
    );
    expect(tableRows![2]).toHaveTextContent(
      `detail.tax-id-citizen-recipient${notificationDTO.recipients[0].taxId}`
    );
    expect(tableRows![3]).toHaveTextContent(`detail.date${notificationDTO.sentAt}`);
    expect(tableRows![4]).toHaveTextContent(`detail.iun${notificationDTO.iun}`);
    expect(tableRows![5]).toHaveTextContent(
      `detail.notice-code${notificationDTO.recipients[0].payment?.creditorTaxId} - ${notificationDTO.recipients[0].payment?.noticeCode}`
    );
    expect(tableRows![6]).toHaveTextContent(`detail.groups${notificationDTO.group}`);
    // check documents box
    const notificationDetailDocuments = result?.getAllByTestId('notificationDetailDocuments');
    expect(notificationDetailDocuments).toHaveLength(
      notificationDTO.documents.length + notificationDTO.otherDocuments?.length!
    );
    const notificationDetailDocumentsMessage = result?.getAllByTestId('documentsMessage');
    for (const notificationDetailDocumentMessage of notificationDetailDocumentsMessage!) {
      expect(notificationDetailDocumentMessage).toHaveTextContent(
        /detail.download-aar-available|detail.download-message-available/
      );
    }
    // check timeline box
    const NotificationDetailTimeline = result?.getByTestId('NotificationDetailTimeline');
    expect(NotificationDetailTimeline).toBeInTheDocument();
    // check payment history box
    const timelinePayments = notificationDTO.timeline.filter(
      (elem) => elem.category === TimelineCategory.PAYMENT
    );
    const paymentsTable = result?.getAllByTestId('paymentTable');
    expect(paymentsTable).toHaveLength(timelinePayments.length);
    // check downtimes box
    const downtimesBox = result?.getByTestId('downtimesBox');
    expect(downtimesBox).toBeInTheDocument();
  });

  it('checks not available documents - mono recipient', async () => {
    mock
      .onGet(NOTIFICATION_DETAIL(notificationDTO.iun))
      .reply(200, { ...notificationDTO, documentsAvailable: false });
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    // check documents box
    const notificationDetailDocumentsMessage = result?.getAllByTestId('documentsMessage');
    for (const notificationDetailDocumentMessage of notificationDetailDocumentsMessage!) {
      expect(notificationDetailDocumentMessage).toHaveTextContent(
        /detail.download-aar-expired|detail.download-message-expired/
      );
    }
  });

  it('executes the document download handler - mono recipient', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    mock.onGet(NOTIFICATION_DETAIL_DOCUMENTS(notificationDTO.iun, '0')).reply(200, {
      filename: notificationDTO.documents[0].ref.key,
      contentType: notificationDTO.documents[0].contentType,
      contentLength: 3028,
      sha256: notificationDTO.documents[0].digests.sha256,
      url: 'https://mocked-url.com',
    });
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    expect(mock.history.get[1].url).toContain('/downtime/v1/history');
    const documentButton = result?.getAllByTestId('documentButton');
    fireEvent.click(documentButton![0]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain(
        `/delivery/notifications/sent/${notificationDTO.iun}/attachments/documents/0`
      );
    });
  });

  it('executes the legal fact download handler - mono recipient', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    mock
      .onGet(NOTIFICATION_DETAIL_LEGALFACT(notificationDTO.iun, mockLegalIds as LegalFactId))
      .reply(200, {
        retryAfter: 1,
      });
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    expect(mock.history.get[1].url).toContain('/downtime/v1/history');
    const legalFactButton = result?.getAllByTestId('download-legalfact');
    fireEvent.click(legalFactButton![0]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain(
        `/delivery-push/${notificationDTO.iun}/legal-facts/${mockLegalIds.category}/${mockLegalIds.key}`
      );
    });
    const docNotAvailableAlert = await waitFor(() => result?.getByTestId('docNotAvailableAlert'));
    expect(docNotAvailableAlert).toBeInTheDocument();
    mock
      .onGet(NOTIFICATION_DETAIL_LEGALFACT(notificationDTO.iun, mockLegalIds as LegalFactId))
      .reply(200, {
        filename: 'mocked-filename',
        contentLength: 1000,
        retryAfter: null,
        url: 'https://mocked-url-com',
      });
    // simulate that legal fact is now available
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1000));
    });
    expect(docNotAvailableAlert).not.toBeInTheDocument();
    fireEvent.click(legalFactButton![0]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(4);
      expect(mock.history.get[3].url).toContain(
        `/delivery-push/${notificationDTO.iun}/legal-facts/${mockLegalIds.category}/${mockLegalIds.key}`
      );
    });
  });

  it('executes the downtimws legal fact download handler - mono recipient', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(200, notificationDTO);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    mock
      .onGet(DOWNTIME_LEGAL_FACT_DETAILS(simpleDowntimeLogPage.downtimes[0].legalFactId!))
      .reply(200, {
        filename: 'mocked-filename',
        contentLength: 1000,
        url: 'https://mocked-url-com',
      });
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    expect(mock.history.get[1].url).toContain('/downtime/v1/history');
    const downtimesBox = result?.getByTestId('downtimesBox');
    const legalFactDowntimesButton = downtimesBox?.querySelectorAll('button');
    fireEvent.click(legalFactDowntimesButton![0]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain(
        `/downtime/v1/legal-facts/${simpleDowntimeLogPage.downtimes[0].legalFactId}`
      );
    });
  });

  it('clicks on the back button - mono recipient', async () => {
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    const backButton = result?.getByRole('button', { name: /indietro/i });
    fireEvent.click(backButton!);
    expect(mockNavigateFn).toBeCalledTimes(1);
  });

  test('check alert on screen with change status', () => {
    changeStatus(NotificationStatus.CANCELLED);
    const alert = result?.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    expect(result?.container).toHaveTextContent('detail.alert-cancellation-confirmed');
    changeStatus(NotificationStatus.CANCELLATION_IN_PROGRESS);
    expect(result?.container).toHaveTextContent('detail.alert-cancellation-in-progress');
    changeStatus(NotificationStatus.DELIVERED);
    expect(alert).not.toBeInTheDocument();
  });

  it('errors on api call - mono recipient', async () => {
    mock.onGet(NOTIFICATION_DETAIL(notificationDTO.iun)).reply(500);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <NotificationDetail />
        </>
      );
    });
    const statusApiErrorComponent = result?.queryByTestId(
      `api-error-${NOTIFICATION_ACTIONS.GET_SENT_NOTIFICATION}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });

  // pn-1714 - cancel notification ("Annulla notifica") button temporarily non operative
  // (in the context of pn-2712, I decide to keep this test as skipped - Carlos Lombardi, 2022.12.14)
  it.skip('clicks on the cancel button and on close modal', async () => {
    const cancelNotificationBtn = result?.getByTestId('cancelNotificationBtn');
    fireEvent.click(cancelNotificationBtn!);
    const modal = await waitFor(() => result?.queryByTestId('modalId'));
    expect(modal).toBeInTheDocument();
    const closeModalBtn = modal?.querySelector('[data-testid="modalCloseBtnId"]');
    fireEvent.click(closeModalBtn!);
    await waitFor(() => expect(modal).not.toBeInTheDocument());
  });

  // pn-1714 - cancel notification ("Annulla notifica") button temporarily non operative
  // (in the context of pn-2712, I decide to keep this test as skipped - Carlos Lombardi, 2022.12.14)
  it.skip('clicks on the cancel button and on confirm button', async () => {
    const cancelNotificationBtn = result?.getByTestId('cancelNotificationBtn');
    fireEvent.click(cancelNotificationBtn!);
    const modal = await waitFor(() => result?.queryByTestId('modalId'));
    expect(modal).toBeInTheDocument();
    const modalCloseAndProceedBtn = within(modal!).getByTestId('modalCloseAndProceedBtnId');
    fireEvent.click(modalCloseAndProceedBtn!);
    await waitFor(() => expect(modal).not.toBeInTheDocument());
  });

  it('renders NotificationDetail page - multi recipient', async () => {
    mock
      .onGet(NOTIFICATION_DETAIL(notificationDTOMultiRecipient.iun))
      .reply(200, notificationDTOMultiRecipient);
    // we use regexp to not set the query parameters
    mock.onGet(new RegExp(DOWNTIME_HISTORY({ startDate: '' }))).reply(200, downtimesDTO);
    await act(async () => {
      result = render(<NotificationDetail />);
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    expect(mock.history.get[1].url).toContain('/downtime/v1/history');
    // the only thing that change from mono to multi recipient is the data shown in the table and the payments number
    // check summary table
    const notificationDetailTable = result?.getByTestId('notificationDetailTable');
    expect(notificationDetailTable).toBeInTheDocument();
    const tableRows = notificationDetailTable?.querySelectorAll('tr');
    expect(tableRows![0]).toHaveTextContent(
      `detail.sender${notificationDTOMultiRecipient.senderDenomination}`
    );
    notificationDTOMultiRecipient.recipients.forEach((recipient, index) => {
      expect(tableRows![1]).toHaveTextContent(
        index === 0
          ? `detail.recipients${recipient.taxId} - ${recipient.denomination}`
          : `${recipient.taxId} - ${recipient.denomination}`
      );
    });
    expect(tableRows![2]).toHaveTextContent(`detail.date${notificationDTOMultiRecipient.sentAt}`);
    expect(tableRows![3]).toHaveTextContent(`detail.iun${notificationDTOMultiRecipient.iun}`);
    notificationDTOMultiRecipient.recipients.forEach((recipient, index) => {
      expect(tableRows![4]).toHaveTextContent(
        index === 0
          ? `detail.notice-code${recipient.taxId} - ${recipient.payment?.creditorTaxId} - ${recipient.payment?.noticeCode}`
          : `${recipient.taxId} - ${recipient.payment?.creditorTaxId} - ${recipient.payment?.noticeCode}`
      );
    });
    expect(tableRows![5]).toHaveTextContent(`detail.groups${notificationDTOMultiRecipient.group}`);
    // check payment history box
    const timelinePayments = notificationDTOMultiRecipient.timeline.filter(
      (elem) => elem.category === TimelineCategory.PAYMENT
    );
    const paymentsTable = result?.getAllByTestId('paymentTable');
    expect(paymentsTable).toHaveLength(timelinePayments.length);
    for (const recipient of notificationDTOMultiRecipient.recipients) {
      expect(result?.container).toHaveTextContent(
        `${recipient.taxId} - ${recipient.payment?.creditorTaxId} - ${recipient.payment?.noticeCode}`
      );
    }
    // check documents box
    const notificationDetailDocuments = result?.getAllByTestId('notificationDetailDocuments');
    expect(notificationDetailDocuments).toHaveLength(
      notificationDTOMultiRecipient.documents.length +
        notificationDTOMultiRecipient.otherDocuments?.length!
    );
    // check timeline box
    const NotificationDetailTimeline = result?.getByTestId('NotificationDetailTimeline');
    expect(NotificationDetailTimeline).toBeInTheDocument();
    // check downtimes box
    const downtimesBox = result?.getByTestId('downtimesBox');
    expect(downtimesBox).toBeInTheDocument();
  });
});
