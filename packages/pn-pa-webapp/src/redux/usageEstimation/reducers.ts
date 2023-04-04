import {createSlice} from "@reduxjs/toolkit";
import {EstimatePeriod, EstimateSearchTable} from "../../models/UsageEstimation";


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


const usageEstimateSlice = createSlice({
  name: "usageEstimateSlice",
  initialState,
  reducers: {}
});

export default usageEstimateSlice;

