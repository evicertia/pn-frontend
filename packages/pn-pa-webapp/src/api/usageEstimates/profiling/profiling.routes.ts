import {compileRoute} from "@pagopa-pn/pn-commons";
import {StatusUpdateEnum} from "../../../models/UsageEstimation";

// PREFIXES
const API_PROFILING_PREFIX = 'pn-usage-estimates';

// Segments
const API_PROFILING_SEGMENT = 'profilation';
const API_PROFILINGS_SEGMENT = 'profilations';
const API_PROFILING_VALIDATED_SEGMENT = 'validated';
const API_PROFILING_DETAIL_SEGMENT = 'detail';

// Parameters
const API_PROFILING_PA_ID_PARAMETER = 'paId';
const API_PROFILING_TAX_ID_PARAMETER = 'taxId';
const API_PROFILING_IPA_ID_PARAMETER = 'ipaId';
const API_PROFILING_REFERENCE_YEAR_PARAMETER = 'referenceYear';
const API_PROFILING_PAGE_PARAMETER = 'page';
const API_PROFILING_TOT_PARAMETER = 'size';
const API_PROFILING_STATUS_PARAMETER = 'status';

// Paths
// profilings
const API_PROFILINGS_FROM_PA_ID_PATH = `${API_PROFILINGS_SEGMENT}`;

// {paId}/profiling/{referenceYear}
const API_UPDATE_PROFILING_PATH = `:${API_PROFILING_PA_ID_PARAMETER}/${API_PROFILING_SEGMENT}/:${API_PROFILING_REFERENCE_YEAR_PARAMETER}`;

// profiling/{paId}/detail/{referenceYear}
const API_PROFILING_DETAIL_PATH = `${API_PROFILING_SEGMENT}/:${API_PROFILING_PA_ID_PARAMETER}/${API_PROFILING_DETAIL_SEGMENT}/:${API_PROFILING_REFERENCE_YEAR_PARAMETER}`;

// {paId}/profiling/{referenceYear}/validated
const API_VALIDATED_PROFILING_PATH = `:${API_PROFILING_PA_ID_PARAMETER}/${API_PROFILING_SEGMENT}/:${API_PROFILING_REFERENCE_YEAR_PARAMETER}/${API_PROFILING_VALIDATED_SEGMENT}`;


export function PAGINATION_LIST_PROFILING(paId: string, taxId: string, ipaId: string, page:number, size:number){
  return compileRoute({
    prefix: API_PROFILING_PREFIX,
    path: API_PROFILINGS_FROM_PA_ID_PATH,
    query: {
      [API_PROFILING_PA_ID_PARAMETER]: paId,
      [API_PROFILING_TAX_ID_PARAMETER]: taxId,
      [API_PROFILING_IPA_ID_PARAMETER]: ipaId,
      [API_PROFILING_PAGE_PARAMETER]: page,
      [API_PROFILING_TOT_PARAMETER]: size,
    }
  });
}

export function UPDATE_PROFILING(paId: string, referenceYear: string, status: StatusUpdateEnum){
  return compileRoute({
    prefix: API_PROFILING_PREFIX,
    path: API_UPDATE_PROFILING_PATH,
    params: {
      [API_PROFILING_PA_ID_PARAMETER]: paId,
      [API_PROFILING_REFERENCE_YEAR_PARAMETER]: referenceYear,
    },
    query: {
      [API_PROFILING_STATUS_PARAMETER]: status
    }
  });
}

export function VALIDATED_PROFILING(paId: string, referenceYear: string){
  return compileRoute({
    prefix: API_PROFILING_PREFIX,
    path: API_VALIDATED_PROFILING_PATH,
    params: {
      [API_PROFILING_PA_ID_PARAMETER]: paId,
      [API_PROFILING_REFERENCE_YEAR_PARAMETER]: referenceYear,
    }
  });
}

export function DETAIL_PROFILING(paId: string, referenceYear: string){
  return compileRoute({
    prefix: API_PROFILING_PREFIX,
    path: API_PROFILING_DETAIL_PATH,
    params: {
      [API_PROFILING_PA_ID_PARAMETER]: paId,
      [API_PROFILING_REFERENCE_YEAR_PARAMETER]: referenceYear,
    }
  });
}