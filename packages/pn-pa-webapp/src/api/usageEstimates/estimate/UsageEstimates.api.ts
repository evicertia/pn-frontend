import {apiClient} from "../../apiClients";
import {
  EstimateBodyRequest,
  EstimateDetail,
  EstimatePeriod,
  FilterRequestEstimate,
  HistoryEstimates,
  StatusUpdateEnum
} from "../../../models/UsageEstimation";
import {
  ESTIMATE_DETAIL,
  ESTIMATE_PAGINATION_LIST,
  ESTIMATE_UPDATE,
  ESTIMATE_VALIDATED
} from "./UsageEstimates.routes";

export const UsageEstimatesApi = {
  /**
   * Gets all estimate from PA-ID with pagination
   * @returns Promise
   * @param params
   */
  getAllEstimate: async (params: FilterRequestEstimate): Promise<HistoryEstimates> => {
    const config = {
      headers:{
        originFe: "PN-PLATFORM-NOTIFICATION-FE"
      }
    };
    const response = await apiClient.get<HistoryEstimates>(ESTIMATE_PAGINATION_LIST(params.paId, params.page, params.size), config);
    return response.data;
  },

  /**
   * Update estimate from PA-ID and reference Month
   * @returns Promise
   * @param paId
   * @param referenceMonth format = MAR-2023
   * @param status  DRAFT or VALIDATED
   * @param body  estimate body updated
   */
  updateEstimate: async (paId: string, referenceMonth: string, status: StatusUpdateEnum, body: EstimateBodyRequest): Promise<EstimatePeriod> => {
    const response = await apiClient.post<EstimatePeriod>(ESTIMATE_UPDATE(paId, referenceMonth, status), body);
    return response.data;
  },

  /**
   * validated estimate from PA-ID and reference Month
   * @returns Promise
   * @param paId
   * @param referenceMonth format = MAR-2023
   */
  validatedEstimate: async (paId: string, referenceMonth: string): Promise<EstimatePeriod> => {
    const response = await apiClient.get<EstimatePeriod>(ESTIMATE_VALIDATED(paId, referenceMonth));
    return response.data;
  },


  /**
   * Get detail estimate from PA-ID and reference Month
   * @param  {string} paId
   * @param  {string:'MAR-2023'} referenceMonth
   * @returns Promise
   */
  getDetailEstimate: async (paId: string, referenceMonth: string): Promise<EstimateDetail> => {
    const response = await apiClient.get<EstimateDetail>(ESTIMATE_DETAIL(paId, referenceMonth));
    return response.data;
  }
};