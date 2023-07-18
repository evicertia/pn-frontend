import {apiClient} from "../../apiClients";
import {FileReport} from "../../../models/UsageEstimation";
import {
  ESTIMATE_DOWNLOAD_FILE_REPORT,
  ESTIMATE_FILES_REPORTS
} from "./FilesReports.routes";


export const FilesReportsApi = {
  /**
   * Get all reports of estimate from PA-ID and reference Month
   * @param  {string} paId
   * @param  {string:'GIU-2023'} referenceMonth
   * @returns Promise
   */
  getAllReportsFile: async (paId: string, referenceMonth: string): Promise<Array<FileReport>> => {
    const response = await apiClient.get<Array<FileReport>>(ESTIMATE_FILES_REPORTS(paId, referenceMonth));
    return response.data;
  },

  /**
   * Get file reports of estimate from PA-ID and id
   * @param  {string} paId
   * @param  {string} reportKey
   * @returns Promise
   */
  getReportFile: async (paId: string, reportKey: string): Promise<FileReport> => {
    const response = await apiClient.get<FileReport>(ESTIMATE_DOWNLOAD_FILE_REPORT(paId, reportKey));
    return response.data;
  }
};