import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {MobileHistoryTable} from '../MobileHistoryTable';
import {EstimateStatusEnum} from "../../../../../../models/UsageEstimation";
import * as util from "../../../../../../utils/utility"
import {GET_DETAIL_ESTIMATE_PATH} from "../../../../../../navigation/routes.const";

const mockNavigateFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

const mockEstimates = [
  {
    referenceMonth: "GIU-2023",
    status: EstimateStatusEnum.VALIDATED,
    lastModifiedDate: "2023-05-22T13:36:27.000+00:00",
    deadlineDate: "2023-06-15T23:59:00.000+00:00",
  },
  {
    referenceMonth: "MAG-2023",
    status: EstimateStatusEnum.VALIDATED,
    lastModifiedDate: "2023-04-22T13:36:27.000+00:00",
    deadlineDate: "2023-05-15T23:59:00.000+00:00",
  },
  {
    referenceMonth: "APR-2023",
    status: EstimateStatusEnum.ABSENT,
    lastModifiedDate: "2023-03-22T13:36:27.000+00:00",
    deadlineDate: "2023-04-15T23:59:00.000+00:00",
  },
  {
    referenceMonth: "MAR-2023",
    status: EstimateStatusEnum.VALIDATED,
    lastModifiedDate: "2023-02-22T13:36:27.000+00:00",
    deadlineDate: "2023-03-15T23:59:00.000+00:00",
  },
];

const mockEstimate = [
  {
    referenceMonth: "GIU-2023",
    status: EstimateStatusEnum.VALIDATED,
    lastModifiedDate: "2023-05-22T13:36:27.000+00:00",
    deadlineDate: "2023-06-15T23:59:00.000+00:00",
  }
];


describe('MobileHistoryTable', () => {

  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  afterEach(cleanup);

  it('Test render table correctly', () => {

    render(<MobileHistoryTable estimates={mockEstimates} />);

    // Assert the presence and text content of the table rows
    mockEstimates.forEach((estimate) => {
      expect(screen.getByText(util.localeStringReferenceId(estimate.referenceMonth))).toBeInTheDocument();
      expect(screen.getByText(util.getFormattedDateTime(estimate.deadlineDate))).toBeInTheDocument();
      expect(screen.getByText(util.getFormattedDateTime(estimate.lastModifiedDate))).toBeInTheDocument();
    });
  });


  it('Test click on show detail on item with Status is VALIDATED', async () => {
    render(<MobileHistoryTable estimates={mockEstimate}/>);

    const estimateButtons = screen.getAllByText("show-detail");
    const firstButton= estimateButtons[0]

    fireEvent.click(firstButton);

    await act(async () => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(GET_DETAIL_ESTIMATE_PATH(mockEstimate[0].referenceMonth))
    })
  });

});
