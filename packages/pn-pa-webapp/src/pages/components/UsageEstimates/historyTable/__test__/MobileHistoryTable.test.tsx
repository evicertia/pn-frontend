import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import MobileHistoryTable from '../MobileHistoryTable';
import {EstimateStatusEnum} from "../../../../../models/UsageEstimation";


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
                <MobileHistoryTable estimates={mockEstimates} />
            </Router>
        );

        // Assert the presence and text content of the columnss
        expect(screen.getByText('Giugno 2023')).toBeInTheDocument();
        expect(screen.getByText('22/05/2023, alle 13:36')).toBeInTheDocument();
        expect(screen.getByText('absent-label-chip')).toBeInTheDocument();

        // Assert the presence and text content of the table rows
        mockEstimates.forEach((estimate) => {
            expect(screen.getByText(estimate.referenceMonth)).toBeInTheDocument();
            expect(screen.getByText(estimate.deadlineDate)).toBeInTheDocument();
            expect(screen.getByText(estimate.lastModifiedDate)).toBeInTheDocument();
        });
    });

});
