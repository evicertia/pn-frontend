import {compileRoute} from "@pagopa-pn/pn-commons";


// PREFIXES
const API_ESTIMATE_PREFIX = 'pn-usage-estimates';

// Segments
const API_ESTIMATE_SEGMENT = 'estimate';
const API_ESTIMATE_REPORTS_SEGMENT = 'reports';

// Parameters
const API_ESTIMATE_PA_ID_PARAMETER = 'paId';
const API_ESTIMATE_REFERENCE_MONTH_PARAMETER = 'referenceMonth';
const API_ESTIMATE_FILE_REPORT_KEY_PARAMETER = 'reportKey';
const API_ESTIMATE_FILE_REPORT_TYPE_PARAMETER = 'type';

// /{paId}/reports/{referenceMonth}
const API_ESTIMATE_FILES_REPORTS_PATH = `:${API_ESTIMATE_PA_ID_PARAMETER}/${API_ESTIMATE_REPORTS_SEGMENT}/:${API_ESTIMATE_REFERENCE_MONTH_PARAMETER}`;

// estimate/{paId}/reports/{reportKey}
const API_ESTIMATE_DOWNLOAD_FILES_REPORTS_PATH = `${API_ESTIMATE_SEGMENT}/:${API_ESTIMATE_PA_ID_PARAMETER}/${API_ESTIMATE_REPORTS_SEGMENT}/:${API_ESTIMATE_FILE_REPORT_KEY_PARAMETER}`;

export function ESTIMATE_FILES_REPORTS(paId: string, referenceMonth: string){
  return compileRoute({
    prefix: API_ESTIMATE_PREFIX,
    path: API_ESTIMATE_FILES_REPORTS_PATH,
    params: {
      [API_ESTIMATE_PA_ID_PARAMETER]: paId,
      [API_ESTIMATE_REFERENCE_MONTH_PARAMETER]: referenceMonth
    }
  });
}

export function ESTIMATE_DOWNLOAD_FILE_REPORT(paId: string, reportKey: string){
  return compileRoute({
    prefix: API_ESTIMATE_PREFIX,
    path: API_ESTIMATE_DOWNLOAD_FILES_REPORTS_PATH,
    params: {
      [API_ESTIMATE_PA_ID_PARAMETER]: paId,
      [API_ESTIMATE_FILE_REPORT_KEY_PARAMETER]: reportKey,
    },
    query: {[API_ESTIMATE_FILE_REPORT_TYPE_PARAMETER]: 'SOURCE'}
  });
}