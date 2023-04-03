import {
  ESTIMATE_DETAIL,
  ESTIMATE_FILE_DETAIL,
  ESTIMATE_FILES,
  ESTIMATE_PAGINATION_LIST
} from "../usageestimates.routes";

const PA_ID = "1234";
const REF_MONTH = "MARZO-2023"

describe('UsageEstimatesTest', function () {


  it('should compile pagination estimates', function () {
    const route = ESTIMATE_PAGINATION_LIST(PA_ID, 1, 10);
    expect(route).toEqual(`/pn-usage-estimates/v1/estimates?paId=${PA_ID}&page=${1}&tot=${10}`);
  });

  it('should compile detail estimates', function () {
    const route = ESTIMATE_DETAIL(PA_ID, REF_MONTH);
    expect(route).toEqual(`/pn-usage-estimates/v1/estimate/${PA_ID}/detail/${REF_MONTH}`);
  });


  it('should compile estimate files', function () {
    const route = ESTIMATE_FILES(PA_ID, REF_MONTH);
    expect(route).toEqual(`/pn-usage-estimates/v1/estimate/${PA_ID}/files/${REF_MONTH}`);
  });

  it('should compile estimate file detail', function () {
    const route = ESTIMATE_FILE_DETAIL(PA_ID, "12300");
    expect(route).toEqual(`/pn-usage-estimates/v1/estimate/${PA_ID}/file/12300`);
  });


});