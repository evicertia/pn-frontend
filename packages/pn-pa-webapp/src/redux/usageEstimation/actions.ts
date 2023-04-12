import {createAsyncThunk} from "@reduxjs/toolkit";
import {performThunkAction} from "@pagopa-pn/pn-commons";
import {BillingDetail, EstimateDetail, EstimatePeriod, EstimateStatusEnum, PaInfo} from "../../models/UsageEstimation";


export enum ESTIMATE_ACTIONS {
  GET_DETAIL_ESTIMATE = 'getDetailEstimate',
  
}

interface DetailEstimateParams {
  paId: string;
  referenceMonth: string;
}

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
      } as PaInfo,
      status: EstimateStatusEnum.Validated,
      showEdit: true,
      deadlineDate: "2023-05-15T03:24:00",
      referenceMonth: params.referenceMonth,
      lastModifiedTimestamp: "2023-04-17T03:24:00",
      estimate: {
        totalDigitalNotif: 10,
        totalPaper890Notif: 72,
        totalPaperNationalNotif: 56,
        totalPaperInternationalNotif: 14,
      } as EstimateDetail,
      billing: {
        sdiCode: "1234SDI",
        splitPayment: true,
        description: "",
        mailAddress: "milano.comune@gmail.com",

      } as BillingDetail,
    } as EstimatePeriod
  ))
  // performThunkAction((params: DetailEstimateParams) => UsageEstimatesApi.getDetailEstimate(params.paId, params.referenceMonth))
);