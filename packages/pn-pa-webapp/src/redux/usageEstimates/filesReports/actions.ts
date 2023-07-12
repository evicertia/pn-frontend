import {createAsyncThunk} from "@reduxjs/toolkit";
import { performThunkAction} from "@pagopa-pn/pn-commons";
import {
  FileReport,
  FilterRequestEstimate
} from "../../../models/UsageEstimation";
import {FilesReportsApi} from "../../../api/usageEstimates/filesReports/FilesReports.api";


export enum FILES_REPORTS_ACTIONS {
  GET_ALL_REPORTS = 'getAllReportsFile',
  GET_REPORT = 'getReportFile',
  GET_ALL_DEANONYMISED = 'getAllDeanonymisedFile',
  SCHEDULE_ALL_DEANONYMISED = 'scheduleAllDeanonymisedFile',
}

interface GetAllReportsFileParams {
  paId: string;
  referenceMonth: string;
}

interface GetReportFileParams {
  paId: string;
  reportKey: string;
}

export const getAllReportsFile = createAsyncThunk<Array<FileReport>, GetAllReportsFileParams>(
  FILES_REPORTS_ACTIONS.GET_ALL_REPORTS,
  performThunkAction((params: GetAllReportsFileParams) => FilesReportsApi.getAllReportsFile(params.paId, params.referenceMonth))
);

export const getReportFile = createAsyncThunk<FileReport, GetReportFileParams>(
  FILES_REPORTS_ACTIONS.GET_REPORT,
  performThunkAction((params: GetReportFileParams) => FilesReportsApi.getReportFile(params.paId, params.reportKey))
);

export const getAllDeanonymisedFile = createAsyncThunk<Array<FileReport>, FilterRequestEstimate>(
  FILES_REPORTS_ACTIONS.GET_ALL_DEANONYMISED,
  performThunkAction((params: FilterRequestEstimate) => FilesReportsApi.getAllDeanonymisedFile(params.paId))
);

export const scheduleAllDeanonymisedFile = createAsyncThunk<Array<FileReport>, GetAllReportsFileParams>(
  FILES_REPORTS_ACTIONS.SCHEDULE_ALL_DEANONYMISED,
  performThunkAction((params: GetAllReportsFileParams) => FilesReportsApi.scheduleAllDeanonymisedFile(params.paId, params.referenceMonth))
);
