import {createAsyncThunk} from "@reduxjs/toolkit";
import {performThunkAction} from "@pagopa-pn/pn-commons";
import {
  EstimateBodyRequest,
  EstimatePeriod,
  FilterRequestEstimate,
  HistoryEstimates,
  StatusUpdateEnum
} from "../../models/UsageEstimation";
import {UsageEstimatesApi} from "../../api/usage-estimates/UsageEstimates.api";


export enum ESTIMATE_ACTIONS {
  GET_DETAIL_ESTIMATE = 'getDetailEstimate',
  GET_ALL_ESTIMATE = 'getAllEstimate',
  UPDATE_ESTIMATE = 'updateEstimate',
}

interface DetailEstimateParams {
  paId: string;
  referenceMonth: string;
}

interface UpdateEstimateParams {
  paId: string;
  referenceMonth: string;
  status: StatusUpdateEnum;
  body: EstimateBodyRequest;
}

export const getAllEstimate = createAsyncThunk<HistoryEstimates, FilterRequestEstimate>(
  ESTIMATE_ACTIONS.GET_ALL_ESTIMATE,
  performThunkAction((params:FilterRequestEstimate) => UsageEstimatesApi.getAllEstimate(params))
);

export const getDetailEstimate = createAsyncThunk<EstimatePeriod, DetailEstimateParams>(
  ESTIMATE_ACTIONS.GET_DETAIL_ESTIMATE,

  performThunkAction((params: DetailEstimateParams) => UsageEstimatesApi.getDetailEstimate(params.paId, params.referenceMonth))
);

export const updateEstimate = createAsyncThunk<EstimatePeriod, UpdateEstimateParams>(
  ESTIMATE_ACTIONS.UPDATE_ESTIMATE,
  performThunkAction((params: UpdateEstimateParams) => UsageEstimatesApi.updateEstimate(params.paId, params.referenceMonth, params.status, params.body))
);