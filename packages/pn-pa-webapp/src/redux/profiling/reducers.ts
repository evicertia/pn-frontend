import {createSlice} from "@reduxjs/toolkit";
import {Profiling, ProfilingDetail} from "../../models/UsageEstimation";


interface ProfilingState {
  profiling: Profiling | undefined;
  selected: ProfilingDetail | undefined;
  loading: boolean;
  error: string | undefined;
}

const initialState: ProfilingState = {
  profiling: undefined,
  selected: undefined,
  loading: false,
  error: undefined
};


const profilingSlice = createSlice({
  name: "profilingSlice",
  initialState,
  reducers: {}
});

export default profilingSlice;

