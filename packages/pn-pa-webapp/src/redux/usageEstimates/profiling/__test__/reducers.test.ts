import {HistoryProfilings} from "../../../../models/UsageEstimation";
import {getAllProfiling, getDetailProfiling, updateProfiling, validatedProfiling} from "../../profiling/actions";
import profilingSlice, {resetDetailState, setPagination} from "../reducers";


describe('profilingSlice', () => {
  const initialState = {
    historyProfilings: {} as HistoryProfilings,
    detail: undefined,
    formData: undefined,
    pagination: {
      page: 1,
      size: 5,
    },
    loading: false,
    error: undefined
  };

  describe('profilingReducer', () => {
    it('should handle setPagination', () => {

      const filterRequest = {
        page: 2,
        size: 10,
      };

      const nextState = profilingSlice.reducer(initialState, setPagination(filterRequest));

      expect(nextState.pagination.page).toEqual(2);
      expect(nextState.pagination.size).toEqual(10);
    });

    it('should handle resetDetailState', () => {
      const initialState = {
        historyProfilings: {} as HistoryProfilings,
        detail: undefined,
        formData: undefined,
        pagination: {
          page: 1,
          size: 5,
        },
        loading: false,
        error: undefined
      };

      const nextState = profilingSlice.reducer(initialState, resetDetailState());

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

      expect(action.type).toEqual('profilingSlice/setPagination');
      expect(action.payload).toEqual(filterRequest);
    });

    it('should create resetDetailState action', () => {
      const action = resetDetailState();

      expect(action.type).toEqual('profilingSlice/resetDetailState');
    });
  });

  describe('extraReducers', () => {
    it('handle getAllProfiling.pending', () => {
      const filterRequest = {
        paId:"test",
        page: 2,
        size: 10,
      };
      const nextState = profilingSlice.reducer(initialState, getAllProfiling.pending("testPending", filterRequest));

      expect(nextState.loading).toEqual(true);
      expect(nextState.error).toBeUndefined();
    });

    it('handle getAllProfiling.fulfilled', () => {
      const filterRequest = {
        paId:"test",
        page: 2,
        size: 10,
      };

      const mockPayload = {
        result:"testFulfilled"
      };

      const nextState = profilingSlice.reducer(initialState, getAllProfiling.fulfilled("testFulfilled","testFulfilled",filterRequest));

      expect(nextState.loading).toEqual(false);
      expect(nextState.historyProfilings).toEqual(mockPayload.result);
    });

    it('handle getAllProfiling.rejected', () => {
      const state = {
        loading: true,
        historyProfilings: {},
        error: 'ERROR with history estimate',
      };

      const nextState = profilingSlice.reducer(initialState, getAllProfiling.rejected("testRejected", state));

      expect(nextState.loading).toEqual(false);
      expect(nextState.historyProfilings).toEqual({});
      expect(nextState.error).toEqual('ERROR with history profiling');
    });

    it('handle validatedProfiling.pending', () => {
      const initialState = {
        historyProfilings: null,
        detail:  undefined,
        formData:  undefined,
        pagination: null,
        loading: false,
        error: 'Some error message',
      };

      const nextState = profilingSlice.reducer(initialState, validatedProfiling.pending());

      expect(nextState.loading).toBe(true);
      expect(nextState.error).toBeUndefined();
    });

    it('handle validatedProfiling.fulfilled', () => {
      const initialState = {
        loading: true,
        historyProfilings: {
          actual: null,
        },
      };

      const payload = {  };
      const nextState = profilingSlice.reducer(initialState, validatedProfiling.fulfilled(payload));

      expect(nextState.loading).toBe(false);
      expect(nextState.historyProfilings.actual).toBe(payload);
    });

    it('handle validatedProfiling.rejected"', () => {
      const initialState = {
        loading: true,
        error: undefined,
      };

      const nextState = profilingSlice.reducer(initialState, validatedProfiling.rejected());

      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('ERROR with history profiling');
    });

    it('handle getDetailProfiling.pending', () => {
      const initialState = {
        loading: false,
        detail: { },
        error: 'Some error message',
      };

      const payload = {  };
      const nextState = profilingSlice.reducer(initialState, getDetailProfiling.pending(payload));
      expect(nextState.loading).toBe(true);
      expect(nextState.detail).toBe(undefined);
      expect(nextState.error).toBeUndefined();
    });

    it('handle getDetailProfiling.fulfilled', () => {
      const initialState = {
        loading: true,
        detail: null,
        formData: null,
      };

      const payload = { /* payload data */ };
      const nextState = profilingSlice.reducer(initialState, getDetailProfiling.fulfilled(payload));

      expect(nextState.loading).toBe(false);
      expect(nextState.detail).toBe(payload);
      expect(nextState.formData).toEqual(payload);
    });

    it('handle getDetailProfiling.rejected', () => {
      const initialState = {
        loading: true,
        detail: { /* some existing detail */ },
        error: undefined,
      };

      const action = {
        payload: { /* AxiosError data */ },
      };

      const nextState = profilingSlice.reducer(initialState, getDetailProfiling.rejected(action));

      expect(nextState.detail).toBeUndefined();
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('ERROR with detail profiling');
    });

    it('handle updateProfiling.pending', () => {
      const initialState = {
        loading: false,
        error: 'Some error message',
      };
      const nextState = profilingSlice.reducer(initialState, updateProfiling.pending());

      expect(nextState.loading).toBe(true);
      expect(nextState.error).toBeUndefined();
    });

    it('handle updateProfiling.fulfilled', () => {
      const initialState = {
        loading: true,
        formData: null,
      };

      const payload = { /* payload data */ };
      const nextState = profilingSlice.reducer(initialState, updateProfiling.fulfilled(payload));
      expect(nextState.loading).toBe(false);
      expect(nextState.formData).toBe(payload);
    });

    it('handle updateProfiling.rejected', () => {
      const initialState = {
        loading: true,
        error: undefined,
      };
      const nextState = profilingSlice.reducer(initialState, updateProfiling.rejected());

      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('ERROR with update profiling');
    });

  });
});
