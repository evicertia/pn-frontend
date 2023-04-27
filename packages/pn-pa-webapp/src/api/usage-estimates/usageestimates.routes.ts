import {compileRoute} from "@pagopa-pn/pn-commons";
import {StatusUpdateEnum} from "../../models/UsageEstimation";

// PREFIXES
const API_ESTIMATE_PREFIX = 'pn-usage-estimates';

const API_ESTIMATE_SEGMENT = 'estimate';
const API_ESTIMATES_SEGMENT = 'estimates';
const API_ESTIMATE_DETAIL_SEGMENT = 'detail';
const API_ESTIMATE_FILES_SEGMENT = 'files';
const API_ESTIMATE_FILE_SEGMENT = 'file';

// Parameters
const API_ESTIMATE_PA_ID_PARAMETER = 'paId';
const API_ESTIMATE_REFERENCE_MONTH_PARAMETER = 'referenceMonth';
const API_ESTIMATE_ID_FILE_PARAMETER = 'id';
const API_ESTIMATE_PAGE_PARAMETER = 'page';
const API_ESTIMATE_TOT_PARAMETER = 'tot';
const API_ESTIMATE_STATUS_PARAMETER = 'status';


// Paths

// v1/estimates
const API_ESTIMATES_FROM_PA_ID_PATH = `/${API_ESTIMATES_SEGMENT}`;

// v1/{paId}/estimate/{referenceMonth}
const API_UPDATE_ESTIMATES_PATH = `/:${API_ESTIMATE_PA_ID_PARAMETER}/${API_ESTIMATE_SEGMENT}/:${API_ESTIMATE_REFERENCE_MONTH_PARAMETER}`;

// v1/estimate/{paId}/detail/{referenceMonth}
const API_ESTIMATE_DETAIL_PATH = `/${API_ESTIMATE_SEGMENT}/:${API_ESTIMATE_PA_ID_PARAMETER}/${API_ESTIMATE_DETAIL_SEGMENT}/:${API_ESTIMATE_REFERENCE_MONTH_PARAMETER}`;

// v1/estimate/{paId}/files/{referenceMonth}
const API_ESTIMATE_FILES_PATH = `/${API_ESTIMATE_SEGMENT}/:${API_ESTIMATE_PA_ID_PARAMETER}/${API_ESTIMATE_FILES_SEGMENT}/:${API_ESTIMATE_REFERENCE_MONTH_PARAMETER}`;

// v1/estimate/{paId}/file/{fileId}
const API_ESTIMATE_FILE_PATH = `/${API_ESTIMATE_SEGMENT}/:${API_ESTIMATE_PA_ID_PARAMETER}/${API_ESTIMATE_FILE_SEGMENT}/:${API_ESTIMATE_ID_FILE_PARAMETER}`;


export function ESTIMATE_PAGINATION_LIST(paId: string, page:number, tot:number){
  return compileRoute({
    prefix: API_ESTIMATE_PREFIX,
    path: API_ESTIMATES_FROM_PA_ID_PATH,
    query: {
      [API_ESTIMATE_PA_ID_PARAMETER]: paId,
      [API_ESTIMATE_PAGE_PARAMETER]: page,
      [API_ESTIMATE_TOT_PARAMETER]: tot,
    }
  });
}

export function UPDATE_ESTIMATE(paId: string, referenceMonth: string, status: StatusUpdateEnum){
  return compileRoute({
    prefix: API_ESTIMATE_PREFIX,
    path: API_UPDATE_ESTIMATES_PATH,
    params: {
      [API_ESTIMATE_PA_ID_PARAMETER]: paId,
      [API_ESTIMATE_REFERENCE_MONTH_PARAMETER]: referenceMonth,
    },
    query: {
      [API_ESTIMATE_STATUS_PARAMETER]: status,
    }
  });
}

export function ESTIMATE_DETAIL(paId: string, referenceMonth: string){
  return compileRoute({
    prefix: API_ESTIMATE_PREFIX,
    path: API_ESTIMATE_DETAIL_PATH,
    params: {
      [API_ESTIMATE_PA_ID_PARAMETER]: paId,
      [API_ESTIMATE_REFERENCE_MONTH_PARAMETER]: referenceMonth,
    }
  });
}

export function ESTIMATE_FILES(paId: string, referenceMonth: string){
  return compileRoute({
    prefix: API_ESTIMATE_PREFIX,
    path: API_ESTIMATE_FILES_PATH,
    params: {
      [API_ESTIMATE_PA_ID_PARAMETER]: paId,
      [API_ESTIMATE_REFERENCE_MONTH_PARAMETER]: referenceMonth
    }
  });
}

export function ESTIMATE_FILE_DETAIL(paId: string, id: string){
  return compileRoute({
    prefix: API_ESTIMATE_PREFIX,
    path: API_ESTIMATE_FILE_PATH,
    params: {
      [API_ESTIMATE_PA_ID_PARAMETER]: paId,
      [API_ESTIMATE_ID_FILE_PARAMETER]: id,
    }
  });
}