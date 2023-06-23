import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {
  FilterRequest,
  HistoryProfilings,
  ProfilingDetail,
  ProfilingPeriod
} from "../../../models/UsageEstimation";
import {getAllProfiling, getDetailProfiling, updateProfiling} from "../profiling/actions";


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
      state.error = "ERROR with history profiling";
    });

    builder.addCase(getDetailProfiling.pending, (state, action) => {
      state.loading = true;
      state.detail = action.payload;
      state.error = undefined;
    });
    builder.addCase(getDetailProfiling.fulfilled, (state, action) => {
      state.loading = false;
      state.detail = action.payload;
      state.formData = {
        ...action.payload
      } as ProfilingPeriod;
    });
    builder.addCase(getDetailProfiling.rejected, (state, action) => {
      state.detail = undefined;
      state.loading = false;
      console.log("ERROR DETAIL ", action);
      const tmp = action.payload as AxiosError;
      state.error = (tmp?.response?.status) || "ERROR with detail profiling";
    });

    builder.addCase(updateProfiling.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(updateProfiling.fulfilled, (state, action) => {
      state.loading = false;
      state.formData = action.payload;
    });
    builder.addCase(updateProfiling.rejected, (state) => {
      state.loading = false;
      state.error = "ERROR with update profiling";
    });
  }
});

export const { setPagination, resetDetailState } = profilingSlice.actions;

export default profilingSlice;

