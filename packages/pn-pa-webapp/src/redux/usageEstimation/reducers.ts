import {createSlice} from "@reduxjs/toolkit";
import {EstimatePeriod, EstimateSearchTable, Page} from "../../models/UsageEstimation";
import {getDetailEstimate} from "./actions";


interface UsageEstimationState {
  estimates: Page<EstimateSearchTable>;
  selected: EstimatePeriod | undefined;
  loading: boolean;
  error: string | undefined;
}

const initialState: UsageEstimationState = {
  estimates: {} as Page<EstimateSearchTable>,
  selected: undefined,
  loading: false,
  error: undefined
};

/* eslint-disable functional/immutable-data */
const usageEstimateSlice = createSlice({
  name: "usageEstimateSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDetailEstimate.pending, (state, action) => {
      state.loading = true;
      state.selected = action.payload;
    });
    builder.addCase(getDetailEstimate.fulfilled, (state, action) => {
      state.loading = false;
      state.selected = action.payload;
    });
    builder.addCase(getDetailEstimate.rejected, (state) => {
      state.selected = undefined;
      state.loading = false;
      state.error = "ERROR with detail estimate";
    });

  }
});

export default usageEstimateSlice;

