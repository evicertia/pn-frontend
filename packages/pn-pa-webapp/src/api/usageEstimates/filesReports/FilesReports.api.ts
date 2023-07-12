import {apiClient} from "../../apiClients";
import {FileReport} from "../../../models/UsageEstimation";
import {
  ESTIMATE_DOWNLOAD_FILE_REPORT,
  ESTIMATE_FILES_REPORTS,
  ESTIMATE_FILES_REPORTS_DEANONYMISED,
  ESTIMATE_SCHEDULE_FILES_REPORTS_DEANONYMISED,
} from "./FilesReports.routes";

export const FilesReportsApi = {
  /**
   * Get all reports of estimate from PA-ID and reference Month
   * @param  {string} paId
   * @param  {string:'Marzo-2023'} referenceMonth
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
  },

  /**
   * Get all deanonymised file reports of estimate from PA-ID and id
   * @param  {string} paId
   * @returns Promise
   */
  getAllDeanonymisedFile: async (paId: string): Promise<FileReport> => {
    const response = await apiClient.get<FileReport>(ESTIMATE_FILES_REPORTS_DEANONYMISED(paId));
    return response.data;
  },

  /**
   * Get schedule deanonymised file reports of estimate from PA-ID and id
   * @param  {string} paId
   * @param  {string} reportKey
   * @returns Promise
   */
  scheduleAllDeanonymisedFile: async (paId: string, reportKey: string): Promise<FileReport> => {
    const response = await apiClient.get<FileReport>(ESTIMATE_SCHEDULE_FILES_REPORTS_DEANONYMISED(paId, reportKey));
    return response.data;
  }
};