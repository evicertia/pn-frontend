import usageEstimateSlice, { setPagination, resetDetailState } from '../reducers';
import {HistoryEstimates} from "../../../../models/UsageEstimation";
import {getAllEstimate, getDetailEstimate, updateEstimate, validatedEstimate} from "../actions";


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

    describe('estimateReducer', () => {
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
        it('handle getAllEstimate.pending', () => {
            const filterRequest = {
                paId:"test",
                page: 2,
                size: 10,
            };
            const nextState = usageEstimateSlice.reducer(initialState, getAllEstimate.pending("testPending",filterRequest));

            expect(nextState.loading).toEqual(true);
            expect(nextState.error).toBeUndefined();
        });

        it('handle getAllEstimate.fulfilled', () => {
            const filterRequest = {
                paId:"test",
                page: 2,
                size: 10,
            };

            const mockPayload = {
                result:"testFulfilled"
            };

            const nextState = usageEstimateSlice.reducer(initialState, getAllEstimate.fulfilled("testFulfilled","testFulfilled",filterRequest));

            expect(nextState.loading).toEqual(false);
            expect(nextState.historyEstimates).toEqual(mockPayload.result);
        });

        it('handle getAllEstimate.rejected', () => {
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

        it('handle validatedEstimate.pending', () => {
            const initialState = {
                historyEstimates: null,
                detail:  undefined,
                formData:  undefined,
                pagination: null,
                loading: false,
                error: 'Some error message',
            };

            const nextState = usageEstimateSlice.reducer(initialState, validatedEstimate.pending());

            expect(nextState.loading).toBe(true);
            expect(nextState.error).toBeUndefined();
        });

        it('handle validatedEstimate.fulfilled', () => {
            const initialState = {
                loading: true,
                historyEstimates: {
                    actual: null,
                },
            };

            const payload = {  };
            const nextState = usageEstimateSlice.reducer(initialState, validatedEstimate.fulfilled(payload));

            expect(nextState.loading).toBe(false);
            expect(nextState.historyEstimates.actual).toBe(payload);
        });

        it('handle validatedEstimate.rejected"', () => {
            const initialState = {
                loading: true,
                error: undefined,
            };

            const nextState = usageEstimateSlice.reducer(initialState, validatedEstimate.rejected());

            expect(nextState.loading).toBe(false);
            expect(nextState.error).toBe('ERROR with history estimate');
        });

        it('handle getDetailEstimate.pending', () => {
            const initialState = {
                loading: false,
                detail: { },
                error: 'Some error message',
            };

            const payload = {  };
            const nextState = usageEstimateSlice.reducer(initialState, getDetailEstimate.pending(payload));
            expect(nextState.loading).toBe(true);
            expect(nextState.detail).toBe(undefined);
            expect(nextState.error).toBeUndefined();
        });

        it('handle getDetailEstimate.fulfilled', () => {
            const initialState = {
            loading: true,
            detail: null,
            formData: null,
        };

            const payload = { /* payload data */ };
            const nextState = usageEstimateSlice.reducer(initialState, getDetailEstimate.fulfilled(payload));

            expect(nextState.loading).toBe(false);
            expect(nextState.detail).toBe(payload);
            expect(nextState.formData).toEqual(payload);
            });

        it('handle getDetailEstimate.rejected', () => {
            const initialState = {
                loading: true,
                detail: { /* some existing detail */ },
                error: undefined,
            };

            const action = {
                payload: { /* AxiosError data */ },
            };

            const nextState = usageEstimateSlice.reducer(initialState, getDetailEstimate.rejected(action));

            expect(nextState.detail).toBeUndefined();
            expect(nextState.loading).toBe(false);
            expect(nextState.error).toBe('ERROR with detail estimate');
        });

        it('handle updateEstimate.pending', () => {
            const initialState = {
                loading: false,
                error: 'Some error message',
                        };
            const nextState = usageEstimateSlice.reducer(initialState, updateEstimate.pending());

            expect(nextState.loading).toBe(true);
            expect(nextState.error).toBeUndefined();
        });

        it('handle updateEstimate.fulfilled', () => {
            const initialState = {
                loading: true,
                formData: null,
            };

            const payload = { /* payload data */ };
            const nextState = usageEstimateSlice.reducer(initialState, updateEstimate.fulfilled(payload));
            expect(nextState.loading).toBe(false);
            expect(nextState.formData).toBe(payload);
        });

        it('handle handle updateEstimate.rejected"', () => {
            const initialState = {
                loading: true,
                error: undefined,
            };
            const nextState = usageEstimateSlice.reducer(initialState, updateEstimate.rejected());

            expect(nextState.loading).toBe(false);
            expect(nextState.error).toBe('ERROR with update estimate');
        });

    });
});



