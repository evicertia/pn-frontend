import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {EstimateDetail, EstimatePeriod, FilterRequest, HistoryEstimates} from "../../models/UsageEstimation";
import {getAllEstimate, getDetailEstimate, updateEstimate, validatedEstimate} from "./actions";


interface UsageEstimationState {
  historyEstimates: HistoryEstimates;
  detail: EstimateDetail | undefined;
  formData: EstimatePeriod | undefined;
  pagination: FilterRequest;
  loading: boolean;
  error: string | number | undefined;
}

const initialState: UsageEstimationState = {
  historyEstimates: {} as HistoryEstimates,
  detail: undefined,
  formData: undefined,
  pagination: {
    page: 1,
    tot: 10,
  },
  loading: false,
  error: undefined
};

/* eslint-disable functional/immutable-data */
const usageEstimateSlice = createSlice({
  name: "usageEstimateSlice",
  initialState,
  reducers: {
    setPagination: (state, action: PayloadAction<FilterRequest>) => {
      state.pagination = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAllEstimate.pending, (state,) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getAllEstimate.fulfilled, (state, action) => {
      state.loading = false;
      state.historyEstimates = action.payload;
    });
    builder.addCase(getAllEstimate.rejected, (state) => {
      state.historyEstimates = {} as HistoryEstimates;
      state.loading = false;
      state.error = "ERROR with history estimate";
    });

    builder.addCase(validatedEstimate.pending, (state,) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(validatedEstimate.fulfilled, (state, action) => {
      state.loading = false;
      state.historyEstimates.actual = action.payload;
    });
    builder.addCase(validatedEstimate.rejected, (state) => {
      state.loading = false;
      state.error = "ERROR with history estimate";
    });

    builder.addCase(getDetailEstimate.pending, (state, action) => {
      state.loading = true;
      state.detail = action.payload;
      state.error = undefined;
    });
    builder.addCase(getDetailEstimate.fulfilled, (state, action) => {
      state.loading = false;
      state.detail = action.payload;
      state.formData = {
        ...action.payload
      } as EstimatePeriod;
    });
    builder.addCase(getDetailEstimate.rejected, (state, action) => {
      state.detail = undefined;
      state.loading = false;
      console.log("ERROR DETAIL ", action);
      const tmp = action.payload as AxiosError;
      state.error = (tmp?.response?.status) || "ERROR DETAIL ESTIMATE";
    });

    builder.addCase(updateEstimate.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(updateEstimate.fulfilled, (state, action) => {
      state.loading = false;
      state.formData = action.payload;
    });
    builder.addCase(updateEstimate.rejected, (state) => {
      state.loading = false;
      state.error = "ERROR with update estimate";
    });
  }
});

export default usageEstimateSlice;

