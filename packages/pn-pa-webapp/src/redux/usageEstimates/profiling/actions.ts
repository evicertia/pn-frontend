import {createAsyncThunk} from "@reduxjs/toolkit";
import { performThunkAction} from "@pagopa-pn/pn-commons";
import {
  FilterRequestProfiling,
  HistoryProfilings,
  ProfilingBodyRequest,
  ProfilingDetail,
  ProfilingPeriod,
  StatusUpdateEnum
} from "../../../models/UsageEstimation";
import {ProfilingApi} from "../../../api/usageEstimates/profiling/Profiling.api";


export enum PROFILING_ACTIONS {
  GET_DETAIL_PROFILING = 'getDetailProfiling',
  GET_ALL_PROFILING = 'getAllProfiling',
  UPDATE_PROFILING = 'updateProfiling',
  VALIDATED_PROFILING = 'validatedProfiling',
}

interface DetailProfilingParams {
  paId: string;
  referenceYear: string;
}

interface UpdateProfilingParams {
  paId: string;
  referenceYear: string;
  status: StatusUpdateEnum;
  body: ProfilingBodyRequest;
}

export const getAllProfiling = createAsyncThunk<HistoryProfilings, FilterRequestProfiling>(
  PROFILING_ACTIONS.GET_ALL_PROFILING,
  performThunkAction((params:FilterRequestProfiling) => ProfilingApi.getAllProfiling(params))
);

export const getDetailProfiling = createAsyncThunk<ProfilingDetail, DetailProfilingParams>(
  PROFILING_ACTIONS.GET_DETAIL_PROFILING,
  performThunkAction((params: DetailProfilingParams) => ProfilingApi.getDetailProfiling(params.paId, params.referenceYear))
);

export const updateProfiling = createAsyncThunk<ProfilingPeriod, UpdateProfilingParams>(
  PROFILING_ACTIONS.UPDATE_PROFILING,
  performThunkAction((params: UpdateProfilingParams) => ProfilingApi.updateProfiling(params.paId, params.referenceYear, params.status, params.body))
);

export const validatedProfiling = createAsyncThunk<ProfilingPeriod, DetailProfilingParams>(
  PROFILING_ACTIONS.VALIDATED_PROFILING,
  performThunkAction((params: DetailProfilingParams) => ProfilingApi.validatedProfiling(params.paId, params.referenceYear))
);
