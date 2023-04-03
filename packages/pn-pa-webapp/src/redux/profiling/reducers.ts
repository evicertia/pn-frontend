import {createSlice} from "@reduxjs/toolkit";
import {BillingDetail} from "../../models/UsageEstimation";


interface ProfilingState {
  billings: Array<BillingDetail>;
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

