import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
  FilterRequest,
  HistoryProfilings,
  ProfilingDetail,
  ProfilingPeriod
} from "../../../models/UsageEstimation";
import {getAllProfiling} from "./actions";

interface ProfilingState {
  historyProfilings: HistoryProfilings;
  detail: ProfilingDetail | undefined;
  formData: ProfilingPeriod | undefined;
  pagination: FilterRequest;
  loading: boolean;
  error: string | number | undefined;
}

const initialState: ProfilingState = {
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

/* eslint-disable functional/immutable-data */
const profilingSlice = createSlice({
  name: "profilingSlice",
  initialState,
  reducers: {
    setPagination: (state, action: PayloadAction<FilterRequest>) => {
      state.pagination.page = action.payload.page;
      state.pagination.size = action.payload.size;
    },
    resetDetailState: (state) => {
      state.detail = undefined;
      state.formData = undefined;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAllProfiling.pending, (state,) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getAllProfiling.fulfilled, (state, action) => {
      state.loading = false;
      state.historyProfilings = action.payload;
    });
    builder.addCase(getAllProfiling.rejected, (state) => {
      state.historyProfilings = {} as HistoryProfilings;
      state.loading = false;
      state.error = "ERROR with history profilings";
    });
  }
});

export const { setPagination, resetDetailState } = profilingSlice.actions;

export default profilingSlice;

