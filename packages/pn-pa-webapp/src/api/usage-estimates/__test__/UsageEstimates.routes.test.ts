import {
  ESTIMATE_DETAIL,
  ESTIMATE_FILE_DETAIL,
  ESTIMATE_FILES,
  ESTIMATE_PAGINATION_LIST,
  UPDATE_ESTIMATE, VALIDATED_ESTIMATE
} from "../usageestimates.routes";
import {StatusUpdateEnum} from "../../../models/UsageEstimation";

const PA_ID = "1234";
const REF_MONTH = "MARZO-2023"

describe('UsageEstimatesTest', function () {


  it('should compile pagination estimates', function () {
    const route = ESTIMATE_PAGINATION_LIST(PA_ID, 1, 5);
    expect(route).toEqual(`/pn-usage-estimates/estimates?paId=${PA_ID}&page=${1}&size=${5}`);
  });

  it('should compile update estimates', function () {
    const route = UPDATE_ESTIMATE(PA_ID, REF_MONTH, StatusUpdateEnum.DRAFT);
    expect(route).toEqual(`/pn-usage-estimates/${PA_ID}/estimate/${REF_MONTH}?status=${StatusUpdateEnum.DRAFT}`);
  });

  it('should compile detail estimates', function () {
    const route = ESTIMATE_DETAIL(PA_ID, REF_MONTH);
    expect(route).toEqual(`/pn-usage-estimates/estimate/${PA_ID}/detail/${REF_MONTH}`);
  });

  it('should compile validate estimates', function () {
    const route = VALIDATED_ESTIMATE(PA_ID, REF_MONTH);
    expect(route).toEqual(`/pn-usage-estimates/${PA_ID}/estimate/${REF_MONTH}/validated`);
  });

  it('should compile estimate files', function () {
    const route = ESTIMATE_FILES(PA_ID, REF_MONTH);
    expect(route).toEqual(`/pn-usage-estimates/estimate/${PA_ID}/files/${REF_MONTH}`);
  });

  it('should compile estimate file detail', function () {
    const route = ESTIMATE_FILE_DETAIL(PA_ID, "12300");
    expect(route).toEqual(`/pn-usage-estimates/estimate/${PA_ID}/file/12300`);
  });


});