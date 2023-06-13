import usageEstimateSlice, { setPagination, resetDetailState } from '../reducers';
import {HistoryEstimates} from "../../../models/UsageEstimation";
import {getAllEstimate} from "../actions";

describe('usageEstimateSlice', () => {
    const initialState = {
        historyEstimates: {} as HistoryEstimates,
        detail: undefined,
        formData: undefined,
        pagination: {
            page: 1,
            size: 5,
        },
        loading: false,
        error: undefined
    };

    describe('reducer', () => {
        it('should handle setPagination', () => {


            const filterRequest = {
                page: 2,
                size: 10,
            };

            const nextState = usageEstimateSlice.reducer(initialState, setPagination(filterRequest));

            expect(nextState.pagination.page).toEqual(2);
            expect(nextState.pagination.size).toEqual(10);
        });

        it('should handle resetDetailState', () => {
            const initialState = {
                historyEstimates: {} as HistoryEstimates,
                detail: undefined,
                formData: undefined,
                pagination: {
                    page: 1,
                    size: 5,
                },
                loading: false,
                error: undefined
            };

            const nextState = usageEstimateSlice.reducer(initialState, resetDetailState());

            expect(nextState.detail).toBeUndefined();
            expect(nextState.formData).toBeUndefined();
        });
    });

    describe('actions', () => {
        it('should create setPagination action', () => {
            const filterRequest = {
                page: 2,
                size: 10,
            };

            const action = setPagination(filterRequest);

            expect(action.type).toEqual('usageEstimateSlice/setPagination');
            expect(action.payload).toEqual(filterRequest);
        });

        it('should create resetDetailState action', () => {
            const action = resetDetailState();

            expect(action.type).toEqual('usageEstimateSlice/resetDetailState');
        });
    });

    describe('extraReducers', () => {
        it('should handle getAllEstimate.pending', () => {
            const filterRequest = {
                paId:"test",
                page: 2,
                size: 10,
            };
            const nextState = usageEstimateSlice.reducer(initialState, getAllEstimate.pending("testPending",filterRequest));

            expect(nextState.loading).toEqual(true);
            expect(nextState.error).toBeUndefined();
        });

        it('should handle getAllEstimate.fulfilled', () => {
            const filterRequest = {
                paId:"test",
                page: 2,
                size: 10,
            };

            const mockPayload = {
                result:"testFulfilled"
            };

            const nextState = usageEstimateSlice.reducer(initialState, getAllEstimate.fulfilled("testFulfilled",filterRequest));

            expect(nextState.loading).toEqual(false);
            expect(nextState.historyEstimates).toEqual(mockPayload.result);
        });

        it('should handle getAllEstimate.rejected', () => {
            const state = {
                loading: true,
                historyEstimates: {},
                error: 'ERROR with history estimate',
            };

            const nextState = usageEstimateSlice.reducer(initialState, getAllEstimate.rejected("testRejected",state));

            expect(nextState.loading).toEqual(false);
            expect(nextState.historyEstimates).toEqual({});
            expect(nextState.error).toEqual('ERROR with history estimate');
        });
    });


});
