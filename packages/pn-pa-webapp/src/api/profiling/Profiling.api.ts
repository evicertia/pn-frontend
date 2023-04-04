import {apiClient} from "../apiClients";
import {BillingDetail, Profiling, ProfilingDetail, StatusUpdateEnum} from "../../models/UsageEstimation";
import {PROFILING_ALL_FROM_PAID, PROFILING_UPDATE} from "./profiling.routes";


export const ProfilingApi = {

  /**
   * Gets all profiling from PA-ID
   * @returns Promise
   * @param paId
   */
  getAllProfiling: async (paId: string): Promise<Profiling> => {
    const response = await apiClient.get<Profiling>(PROFILING_ALL_FROM_PAID(paId));
    return response.data;
  },

  /**
   * Gets all profiling from PA-ID
   * @returns Promise
   * @param paId
   * @param referenceYear format = 2023
   * @param status CREATED or VALIDATED
   * @param body new info of billing
   */
  updateBilling: async (paId: string, referenceYear: string, status: StatusUpdateEnum, body: BillingDetail): Promise<ProfilingDetail> => {
    const response = await apiClient.post<ProfilingDetail>(PROFILING_UPDATE(paId, referenceYear, status), body);
    return response.data;
  },


};