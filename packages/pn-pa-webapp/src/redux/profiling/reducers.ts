import {createSlice} from "@reduxjs/toolkit";
import {BillingDetail, BillingTimeline} from "../../models/UsageEstimation";


interface ProfilingState {
  billings: Array<BillingTimeline>;
  selected: BillingDetail | undefined;
}

const initialState: ProfilingState = {
  billings: [],
  selected: undefined
};


const profilingSlice = createSlice({
  name: "profilingSlice",
  initialState,
  reducers: {}
});

export default profilingSlice;

