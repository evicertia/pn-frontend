import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {BrowserRouter, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ProfilingHistoryTable} from '../ProfilingHistoryTable';
import {EstimateStatusEnum} from "../../../../../../models/UsageEstimation";
import userEvent from '@testing-library/user-event';
import {createMemoryHistory} from 'history';
import {GET_DETAIL_PROFILING_PATH} from "../../../../../../navigation/routes.const";


const mockProfiling = [
  {
    referenceYear: "2024",
    status: EstimateStatusEnum.ABSENT,
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



describe('ProfilingHistoryTable', () => {
  it('renders table columns and rows correctly', () => {
    render(
      <Router>
        <ProfilingHistoryTable profilings={mockProfiling} />
      </Router>
    );

    // Assert the presence and text content of the columns
    expect(screen.getByText('15/06/2024, alle 23:59')).toBeInTheDocument();
    expect(screen.getAllByText('absent-label-chip').at(0)).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();

  });

  it('handle validated row', async () => {
    render(<BrowserRouter>
      <Routes>
        <Route path={"/"} element={<ProfilingHistoryTable profilings={mockProfiling}/>} />
        <Route path={GET_DETAIL_PROFILING_PATH(mockProfiling[1].referenceYear)}
               element={<h1 data-testid={"profiling-detail-page"}>Profiling page route</h1>}/>
      </Routes>
    </BrowserRouter>);
    const profilingButton = screen.getByText("2023");
    fireEvent.click(profilingButton);
    await act(async () => {
      await waitFor(() => {
        expect(location.pathname).toEqual(GET_DETAIL_PROFILING_PATH(mockProfiling[1].referenceYear));
        expect(screen.getByTestId("profiling-detail-page")).toBeInTheDocument()
      })

    })
  });

  it('handle not validated row', () => {
    const history = createMemoryHistory();
    const navigate = jest.fn();
    history.push = navigate;

    render(
      <Router >
        <ProfilingHistoryTable profilings={mockProfiling} />
      </Router>
    );

    const nonValidatedRow = screen.getByText('2024');
    userEvent.click(nonValidatedRow);
    expect(navigate).not.toHaveBeenCalled();
  });

});


