import {PROFILING_ALL_FROM_PAID, PROFILING_UPDATE} from "../profiling.routes";
import {StatusUpdateEnum} from "../../../models/UsageEstimation";

const PA_ID = "1234";
const REF_YEAR = "2023"

describe('ProfilingRouteTest', function () {

  it('should compile update profiling route', function () {
    const route = PROFILING_UPDATE(PA_ID, REF_YEAR, StatusUpdateEnum.DRAFT);
    expect(route).toEqual(`/pn-usage-estimates/v1/${PA_ID}/billing/${REF_YEAR}?status=${StatusUpdateEnum.DRAFT}`);
  });

  it('should compile all profiling route', function () {
    const route = PROFILING_ALL_FROM_PAID(PA_ID);
    expect(route).toEqual(`/pn-usage-estimates/v1/billing/${PA_ID}/profilation`);
  });

});