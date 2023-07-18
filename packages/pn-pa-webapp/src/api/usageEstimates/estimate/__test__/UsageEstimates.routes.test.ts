import {
  ESTIMATE_DETAIL,
  ESTIMATE_PAGINATION_LIST,
  ESTIMATE_UPDATE, ESTIMATE_VALIDATED
} from "../UsageEstimates.routes";
import {StatusUpdateEnum} from "../../../../models/UsageEstimation";

const PA_ID = "1234";
const REF_MONTH = "MAR-2023"

describe('UsageEstimatesRouteTest', function () {
  it('should compile pagination estimates', function () {
    const route = ESTIMATE_PAGINATION_LIST(PA_ID, 1, 5);
    expect(route).toEqual(`/pn-usage-estimates/estimates?paId=${PA_ID}&page=${1}&size=${5}`);
  });

  it('should compile update estimates', function () {
    const route = ESTIMATE_UPDATE(PA_ID, REF_MONTH, StatusUpdateEnum.DRAFT);
    expect(route).toEqual(`/pn-usage-estimates/${PA_ID}/estimate/${REF_MONTH}?status=${StatusUpdateEnum.DRAFT}`);
  });

  it('should compile detail estimates', function () {
    const route = ESTIMATE_DETAIL(PA_ID, REF_MONTH);
    expect(route).toEqual(`/pn-usage-estimates/estimate/${PA_ID}/detail/${REF_MONTH}`);
  });

  it('should compile validate estimates', function () {
    const route = ESTIMATE_VALIDATED(PA_ID, REF_MONTH);
    expect(route).toEqual(`/pn-usage-estimates/${PA_ID}/estimate/${REF_MONTH}/validated`);
  });

});