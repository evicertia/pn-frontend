import {compileRoute} from "@pagopa-pn/pn-commons";
import {StatusUpdateEnum} from "../../../models/UsageEstimation";


// PREFIXES
const API_ESTIMATE_PREFIX = 'pn-usage-estimates';

// Segments
const API_ESTIMATE_SEGMENT = 'estimate';
const API_ESTIMATES_SEGMENT = 'estimates';
const API_ESTIMATES_VALIDATED_SEGMENT = 'validated';
const API_ESTIMATE_DETAIL_SEGMENT = 'detail';

// Parameters
const API_ESTIMATE_PA_ID_PARAMETER = 'paId';
const API_ESTIMATE_REFERENCE_MONTH_PARAMETER = 'referenceMonth';
const API_ESTIMATE_PAGE_PARAMETER = 'page';
const API_ESTIMATE_TOT_PARAMETER = 'size';
const API_ESTIMATE_STATUS_PARAMETER = 'status';

// Paths
// estimates
const API_ESTIMATES_FROM_PA_ID_PATH = `${API_ESTIMATES_SEGMENT}`;

// {paId}/estimate/{referenceMonth}
const API_UPDATE_ESTIMATES_PATH = `:${API_ESTIMATE_PA_ID_PARAMETER}/${API_ESTIMATE_SEGMENT}/:${API_ESTIMATE_REFERENCE_MONTH_PARAMETER}`;

// {paId}/estimate/{referenceMonth}/validated
const API_VALIDATED_ESTIMATES_PATH = `:${API_ESTIMATE_PA_ID_PARAMETER}/${API_ESTIMATE_SEGMENT}/:${API_ESTIMATE_REFERENCE_MONTH_PARAMETER}/${API_ESTIMATES_VALIDATED_SEGMENT}`;

// estimate/{paId}/detail/{referenceMonth}
const API_ESTIMATE_DETAIL_PATH = `${API_ESTIMATE_SEGMENT}/:${API_ESTIMATE_PA_ID_PARAMETER}/${API_ESTIMATE_DETAIL_SEGMENT}/:${API_ESTIMATE_REFERENCE_MONTH_PARAMETER}`;


export function ESTIMATE_PAGINATION_LIST(paId: string, page:number, size:number){
  return compileRoute({
    prefix: API_ESTIMATE_PREFIX,
    path: API_ESTIMATES_FROM_PA_ID_PATH,
    query: {
      [API_ESTIMATE_PA_ID_PARAMETER]: paId,
      [API_ESTIMATE_PAGE_PARAMETER]: page,
      [API_ESTIMATE_TOT_PARAMETER]: size,
    }
  });
}

export function ESTIMATE_UPDATE(paId: string, referenceMonth: string, status: StatusUpdateEnum){
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

export function ESTIMATE_VALIDATED(paId: string, referenceMonth: string){
  return compileRoute({
    prefix: API_ESTIMATE_PREFIX,
    path: API_VALIDATED_ESTIMATES_PATH,
    params: {
      [API_ESTIMATE_PA_ID_PARAMETER]: paId,
      [API_ESTIMATE_REFERENCE_MONTH_PARAMETER]: referenceMonth,
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