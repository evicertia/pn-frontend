import {createSlice} from "@reduxjs/toolkit";
import {Estimate, EstimateSearchTable} from "../../models/UsageEstimation";


interface UsageEstimationState {
  estimates: Array<EstimateSearchTable>;
  selected: Estimate | undefined;
}

const initialState: UsageEstimationState = {
  estimates: [],
  selected: undefined
};


const usageEstimateSlice = createSlice({
  name: "usageEstimateSlice",
  initialState,
  reducers: {}
});

export default usageEstimateSlice;

