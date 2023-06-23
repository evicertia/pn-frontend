import {apiClient} from "../../apiClients";
import {
  ProfilingDetail,
  FilterRequestProfiling,
  HistoryProfilings,
  ProfilingBodyRequest,
  ProfilingPeriod,
  StatusUpdateEnum,
} from "../../../models/UsageEstimation";
import {
  PAGINATION_LIST_PROFILING,
  UPDATE_PROFILING,
  VALIDATED_PROFILING,
  DETAIL_PROFILING} from "./profiling.routes";


export const ProfilingApi = {

  /**
   * Gets all profiling from PA-ID with pagination
   * @returns Promise
   * @param paId
   */
  getAllProfiling: async (params: FilterRequestProfiling): Promise<HistoryProfilings> => {
    const config = {
      headers:{
        // originFe: "PN-PLATFORM-NOTIFICATION-FE"
      }
    };
    const response = await apiClient.get<HistoryProfilings>(PAGINATION_LIST_PROFILING(params.paId, params.taxId, params.ipaId, params.page, params.size), config);
    return response.data;
  },

  /**
   * Update profiling from PA-ID and referenceYear
   * @returns Promise
   * @param paId
   * @param referenceYear format = 2023
   * @param status  DRAFT or VALIDATED
   * @param body new info of billing
   */
  updateProfiling: async (paId: string, referenceYear: string, status: StatusUpdateEnum, body: ProfilingBodyRequest): Promise<ProfilingPeriod> => {
    const response = await apiClient.post<ProfilingPeriod>(UPDATE_PROFILING(paId, referenceYear, status), body);
    return response.data;
  },

  /**
   * validated profiling from PA-ID and referenceYear
   * @returns Promise
   * @param paId
   * @param referenceYear format = 2023
   */
  validatedProfiling: async (paId: string, referenceYear: string): Promise<ProfilingPeriod> => {
    const response = await apiClient.get<ProfilingPeriod>(VALIDATED_PROFILING(paId, referenceYear));
    return response.data;
  },


  /**
   * Get detail profiling from PA-ID and reference Year
   * @param  {string} paId
   * @param  {string:'2023'} referenceYear
   * @returns Promise
   */
  getDetailProfiling: async (paId: string, referenceYear: string): Promise<ProfilingDetail> => {
    const response = await apiClient.get<ProfilingDetail>(DETAIL_PROFILING(paId, referenceYear));
    return response.data;
  },

};