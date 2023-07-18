import {createSlice} from "@reduxjs/toolkit";
import {FileReport} from "../../../models/UsageEstimation";
import {getAllReportsFile, getReportFile} from "./actions";


export interface FileReportsState {
  filesReports: Array<FileReport>;
  fileReportUrl?: string;
  loading: boolean;
  error: string | number | undefined;
}

const initialState: FileReportsState = {
  filesReports: [] as Array<FileReport>,
  fileReportUrl: undefined,
  loading: false,
  error: undefined
};

/* eslint-disable functional/immutable-data */
const fileReportsEstimateSlice = createSlice({
  name: "fileReportsEstimateSlice",
  initialState,
  reducers: {
    resetFileReportUrl: (state) => {
      state.fileReportUrl = undefined;
      state.error = undefined;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllReportsFile.pending, (state,) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getAllReportsFile.fulfilled, (state, action) => {
      state.loading = false;
      state.filesReports = action.payload;
    });
    builder.addCase(getAllReportsFile.rejected, (state) => {
      state.filesReports = [] as Array<FileReport>;
      state.loading = false;
      state.error = "ERROR with files reports";
    });

    builder.addCase(getReportFile.pending, (state,) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getReportFile.fulfilled, (state, action) => {
      state.loading = false;
      state.fileReportUrl = action.payload.url;
    });
    builder.addCase(getReportFile.rejected, (state) => {
      state.loading = false;
      state.error = "ERROR with file report";
    });
  }
});

export const {resetFileReportUrl} = fileReportsEstimateSlice.actions;

export default fileReportsEstimateSlice;
