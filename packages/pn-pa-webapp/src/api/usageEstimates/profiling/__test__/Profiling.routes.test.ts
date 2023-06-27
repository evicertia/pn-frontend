import {
  DETAIL_PROFILING,
  PAGINATION_LIST_PROFILING,
  UPDATE_PROFILING,
  VALIDATED_PROFILING
} from "../../profiling/profiling.routes";
import {StatusUpdateEnum} from "../../../../models/UsageEstimation";

const PA_ID = "1234";
const TAX_ID = "";
const IPA_ID = "";

const REF_YEAR = "2023"

describe('ProfilingRouteTest', function () {

  it('should compile pagination profiling', function () {
    const route = PAGINATION_LIST_PROFILING(PA_ID, TAX_ID, IPA_ID, 1, 5);
    expect(route).toEqual(`/pn-usage-estimates/profilations?paId=${PA_ID}&page=${1}&size=${5}`);
  });

  it('should compile update profiling', function () {
    const route = UPDATE_PROFILING(PA_ID, REF_YEAR, StatusUpdateEnum.DRAFT);
    expect(route).toEqual(`/pn-usage-estimates/${PA_ID}/profilation/${REF_YEAR}?status=${StatusUpdateEnum.DRAFT}`);
  });

  it('should compile detail profiling', function () {
    const route = DETAIL_PROFILING(PA_ID, REF_YEAR);
    expect(route).toEqual(`/pn-usage-estimates/profilation/${PA_ID}/detail/${REF_YEAR}`);
  });

  it('should compile validate profiling', function () {
    const route = VALIDATED_PROFILING(PA_ID, REF_YEAR);
    expect(route).toEqual(`/pn-usage-estimates/${PA_ID}/profilation/${REF_YEAR}/validated`);
  });

});