import {createAsyncThunk} from "@reduxjs/toolkit";
import { performThunkAction} from "@pagopa-pn/pn-commons";
import {
  BillingDetail,
  EstimateBodyRequest, EstimateDetail,
  EstimatePeriod, EstimateStatusEnum,
  FilterRequestEstimate,
  HistoryEstimates, PaInfo,
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
  performThunkAction((params: DetailEstimateParams) => Promise.resolve(
    {
      paInfo: {
        paId: params.paId,
        paName: "Comune di Milano",
        taxId: "12345678910",
        address: "Via Aldo Moro",
        fiscalCode: "ABCDFG89ER33DD",
        ipaCode: "1234gh",
        pec: "milano.comune@pec.it",
        sdiCode: "1234SDI",

      } as PaInfo,
      status: EstimateStatusEnum.DRAFT,
      showEdit: true,
      deadlineDate: "2023-05-15T03:24:00",
      referenceMonth: params.referenceMonth,
      lastModifiedDate: "2023-04-17T03:24:00",
      estimate: {
        totalDigitalNotif: 10,
        total890Notif: 72,
        totalAnalogNotif: 56,
      } as EstimateDetail,
      billing: {
        splitPayment: true,
        description: "",
        mailAddress: "milano.comune@gmail.com",

      } as BillingDetail,
    } as EstimatePeriod
  ))
  // performThunkAction((params: DetailEstimateParams) => UsageEstimatesApi.getDetailEstimate(params.paId, params.referenceMonth))
);

export const updateEstimate = createAsyncThunk<EstimatePeriod, UpdateEstimateParams>(
  ESTIMATE_ACTIONS.UPDATE_ESTIMATE,
  performThunkAction((params: UpdateEstimateParams) => UsageEstimatesApi.updateEstimate(params.paId, params.referenceMonth, params.status, params.body))
);
