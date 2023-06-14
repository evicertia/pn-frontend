import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {BrowserRouter, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {HistoryTable} from '../HistoryTable';
import {EstimateStatusEnum} from "../../../../../models/UsageEstimation";
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import {ActualEstimateCard} from "../../actualEstimateCard/ActualEstimateCard";
import {GET_DETAIL_ESTIMATE_PATH, GET_EDIT_ESTIMATE_PATH} from "../../../../../navigation/routes.const";

const mockEstimates = [
   {
       referenceMonth: "GIU-2023",
       status: EstimateStatusEnum.ABSENT,
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



describe('HistoryTable', () => {
    test('renders table columns and rows correctly', () => {

        render(
            <Router>
                <HistoryTable estimates={mockEstimates} />
            </Router>
        );

        // Assert the presence and text content of the columnss
        expect(screen.getByText('22/05/2023, alle 13:36')).toBeInTheDocument();
        expect(screen.getAllByText('absent-label-chip').at(0)).toBeInTheDocument();
        expect(screen.getByText('Giugno 2023')).toBeInTheDocument();

        });

    describe('HistoryTableHandleRowClick', () => {


        it('handle validated row', async () => {
            render(<BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<HistoryTable estimates={mockEstimates}/>} />
                    <Route path={GET_DETAIL_ESTIMATE_PATH(mockEstimates[1].referenceMonth)}
                           element={<h1 data-testid={"estimate-detail-page"}>Estimate page route</h1>}/>
                </Routes>
            </BrowserRouter>);
            const estimateButton = screen.getByText("Maggio 2023");
            fireEvent.click(estimateButton);
            await act(async () => {
                await waitFor(() => {
                    expect(location.pathname).toEqual(GET_DETAIL_ESTIMATE_PATH(mockEstimates[1].referenceMonth));
                    expect(screen.getByTestId("estimate-detail-page")).toBeInTheDocument()
                })

            })
        });

        it('handle not validated row', () => {
            const history = createMemoryHistory();
            const navigate = jest.fn();
            history.push = navigate;

            render(
                <Router history={history}>
                    <HistoryTable estimates={mockEstimates} />
                </Router>
            );

            const nonValidatedRow = screen.getByText('Giugno 2023');
            userEvent.click(nonValidatedRow);
            expect(navigate).not.toHaveBeenCalled();
        });
    });

});


