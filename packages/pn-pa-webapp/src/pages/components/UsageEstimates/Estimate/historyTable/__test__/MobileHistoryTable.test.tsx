import {act, cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {BrowserRouter, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {MobileHistoryTable} from '../MobileHistoryTable';
import {EstimateStatusEnum} from "../../../../../../models/UsageEstimation";
import * as util from "../../../../../../utils/utility"
import {HistoryTable} from "../HistoryTable";
import {GET_DETAIL_ESTIMATE_PATH} from "../../../../../../navigation/routes.const";


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
    test('renders table columns and rows correctly', () => {

        render(
            <Router>
                <MobileHistoryTable estimates={mockEstimates} />
            </Router>
        );

        // Assert the presence and text content of the columnss
        expect(screen.getByText('Giugno 2023')).toBeInTheDocument();
        expect(screen.getByText('22/05/2023, alle 13:36')).toBeInTheDocument();


        // Assert the presence and text content of the table rows
        mockEstimates.forEach((estimate) => {
            expect(screen.getByText(util.localeStringReferenceMonth(estimate.referenceMonth))).toBeInTheDocument();
            expect(screen.getByText(util.getFormattedDateTime(estimate.deadlineDate))).toBeInTheDocument();
            expect(screen.getByText(util.getFormattedDateTime(estimate.lastModifiedDate))).toBeInTheDocument();
        });
    });


    it('handle validated row', async () => {
        render(<BrowserRouter>
            <Routes>
                <Route path={"/"} element={<MobileHistoryTable estimates={mockEstimate}/>} />
                <Route path={GET_DETAIL_ESTIMATE_PATH(mockEstimate[0].referenceMonth)}
                       element={<h1 data-testid={"estimate-detail-page"}>Estimate page route</h1>}/>
            </Routes>
        </BrowserRouter>);
        const estimateButtons = screen.getAllByText("show-detail");
        const firstButton= estimateButtons[0]
        fireEvent.click(firstButton);
        await act(async () => {
            await waitFor(() => {
                expect(location.pathname).toEqual(GET_DETAIL_ESTIMATE_PATH(mockEstimate[0].referenceMonth));
                expect(screen.getByTestId("estimate-detail-page")).toBeInTheDocument()
            })

        })
    });

});
