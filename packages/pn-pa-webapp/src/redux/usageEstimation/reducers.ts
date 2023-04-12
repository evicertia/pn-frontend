import {createSlice} from "@reduxjs/toolkit";
import {EstimatePeriod, EstimateSearchTable} from "../../models/UsageEstimation";
import {getDetailEstimate} from "./actions";


interface UsageEstimationState {
  estimates: Array<EstimateSearchTable>;
  selected: EstimatePeriod | undefined;
  loading: boolean;
  error: string | undefined;
}

const initialState: UsageEstimationState = {
  estimates: [],
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
    builder.addCase(getDetailEstimate.fulfilled, (state, action) => {
      state.selected = action.payload;
    });
    builder.addCase(getDetailEstimate.rejected, (state) => {
      state.selected = undefined;
      state.error = "ERROR with detail estimate";
    });

  }
});

export default usageEstimateSlice;

