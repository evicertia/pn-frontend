import {apiClient} from "../apiClients";
import {
  EstimateDetail,
  EstimateSearchTable,
  FilterRequestEstimate,
  InfoDownload,
  Page
} from "../../models/UsageEstimation";
import {ESTIMATE_DETAIL, ESTIMATE_FILE_DETAIL, ESTIMATE_FILES, ESTIMATE_PAGINATION_LIST} from "./usageestimates.routes";

export const UsageEstimatesApi = {
  /**
   * Gets all estimate from PA-ID with pagination
   * @returns Promise
   * @param params
   */
  getAllEstimate: async (params: FilterRequestEstimate): Promise<Page<EstimateSearchTable>> => {
    const response = await apiClient.get<Page<EstimateSearchTable>>(ESTIMATE_PAGINATION_LIST(params.paId, params.page, params.tot));
    return response.data;
  },


  /**
   * Get detail estimate from PA-ID and reference Month
   * @param  {string} paId
   * @param  {string:'Marzo-2023'} referenceMonth
   * @returns Promise
   */
  getDetailEstimate: async (paId: string, referenceMonth: string): Promise<EstimateDetail> => {
    const response = await apiClient.get<EstimateDetail>(ESTIMATE_DETAIL(paId, referenceMonth));
    return response.data;
  },

  /**
   * Get all files of estimate from PA-ID and reference Month
   * @param  {string} paId
   * @param  {string:'Marzo-2023'} referenceMonth
   * @returns Promise
   */
  getFilesEstimate: async (paId: string, referenceMonth: string): Promise<Array<InfoDownload>> => {
    const response = await apiClient.get<Array<InfoDownload>>(ESTIMATE_FILES(paId, referenceMonth));
    return response.data;
  },

  /**
   * Get file of estimate from PA-ID and id
   * @param  {string} paId
   * @param  {string} id
   * @returns Promise
   */
  getFileEstimate: async (paId: string, id: string): Promise<InfoDownload> => {
    const response = await apiClient.get<InfoDownload>(ESTIMATE_FILE_DETAIL(paId, id));
    return response.data;
  }

};