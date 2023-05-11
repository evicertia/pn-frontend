import {createAsyncThunk} from "@reduxjs/toolkit";
import { performThunkAction} from "@pagopa-pn/pn-commons";
import {
  EstimateBodyRequest, EstimateDetail,
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
  VALIDATED_ESTIMATE = 'validatedEstimate',
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

export const getDetailEstimate = createAsyncThunk<EstimateDetail, DetailEstimateParams>(
  ESTIMATE_ACTIONS.GET_DETAIL_ESTIMATE,
  performThunkAction((params: DetailEstimateParams) => UsageEstimatesApi.getDetailEstimate(params.paId, params.referenceMonth))
);

export const updateEstimate = createAsyncThunk<EstimatePeriod, UpdateEstimateParams>(
  ESTIMATE_ACTIONS.UPDATE_ESTIMATE,
  performThunkAction((params: UpdateEstimateParams) => UsageEstimatesApi.updateEstimate(params.paId, params.referenceMonth, params.status, params.body))
);

export const validatedEstimate = createAsyncThunk<EstimatePeriod, DetailEstimateParams>(
  ESTIMATE_ACTIONS.VALIDATED_ESTIMATE,
  performThunkAction((params: DetailEstimateParams) => UsageEstimatesApi.validatedEstimate(params.paId, params.referenceMonth))
);
