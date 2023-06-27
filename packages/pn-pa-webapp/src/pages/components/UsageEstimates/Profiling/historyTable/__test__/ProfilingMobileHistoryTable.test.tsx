import {act, cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {BrowserRouter, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ProfilingMobileHistoryTable} from '../ProfilingMobileHistoryTable';
import {EstimateStatusEnum} from "../../../../../../models/UsageEstimation";
import * as util from "../../../../../../utils/utility"
import {GET_DETAIL_PROFILING_PATH} from "../../../../../../navigation/routes.const";


const mockProfilings = [
  {
    referenceYear: "2024",
    status: EstimateStatusEnum.VALIDATED,
    lastModifiedDate: "2024-05-22T13:36:27.000+00:00",
    deadlineDate: "2024-06-15T23:59:00.000+00:00",
  },
  {
    referenceYear: "2023",
    status: EstimateStatusEnum.VALIDATED,
    lastModifiedDate: "2023-04-22T13:36:27.000+00:00",
    deadlineDate: "2023-05-15T23:59:00.000+00:00",
  },
  {
    referenceYear: "2022",
    status: EstimateStatusEnum.ABSENT,
    lastModifiedDate: "2022-03-22T13:36:27.000+00:00",
    deadlineDate: "2022-04-15T23:59:00.000+00:00",
  },
  {
    referenceYear: "2021",
    status: EstimateStatusEnum.VALIDATED,
    lastModifiedDate: "2021-02-22T13:36:27.000+00:00",
    deadlineDate: "2021-03-15T23:59:00.000+00:00",
  },
];

const mockProfiling = [
  {
    referenceYear: "2024",
    status: EstimateStatusEnum.VALIDATED,
    lastModifiedDate: "2024-05-22T13:36:27.000+00:00",
    deadlineDate: "2024-06-15T23:59:00.000+00:00",
  }
];


describe('ProfilingMobileHistoryTable', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  afterEach(cleanup);

  it('renders table columns and rows correctly', () => {

    render(
      <Router>
        <ProfilingMobileHistoryTable profilings={mockProfilings} />
      </Router>
    );

    // Assert the presence and text content of the columnss
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('22/05/2024, alle 13:36')).toBeInTheDocument();


    // Assert the presence and text content of the table rows
    mockProfilings.forEach((estimate) => {
      expect(screen.getByText(util.localeStringReferenceId(estimate.referenceYear))).toBeInTheDocument();
      expect(screen.getByText(util.getFormattedDateTime(estimate.deadlineDate))).toBeInTheDocument();
      expect(screen.getByText(util.getFormattedDateTime(estimate.lastModifiedDate))).toBeInTheDocument();
    });
  });


  it('handle validated row', async () => {
    render(<BrowserRouter>
      <Routes>
        <Route path={"/"} element={<ProfilingMobileHistoryTable profilings={mockProfiling}/>} />
        <Route path={GET_DETAIL_PROFILING_PATH(mockProfiling[0].referenceYear)}
               element={<h1 data-testid={"profiling-detail-page"}>Profiling page route</h1>}/>
      </Routes>
    </BrowserRouter>);
    const profilingButtons = screen.getAllByText("show-detail");
    const firstButton= profilingButtons[0]
    fireEvent.click(firstButton);
    await act(async () => {
      await waitFor(() => {
        expect(location.pathname).toEqual(GET_DETAIL_PROFILING_PATH(mockProfiling[0].referenceYear));
        expect(screen.getByTestId("profiling-detail-page")).toBeInTheDocument()
      })

    })
  });

});
