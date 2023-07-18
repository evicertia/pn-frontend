import {
  ESTIMATE_FILES_REPORTS,
  ESTIMATE_DOWNLOAD_FILE_REPORT
} from "../FilesReports.routes";


const PA_ID = "1234";
const REF_MONTH = "GIU-2023"
const REPORT_KEY = "asdqwerty"

describe('UsageEstimatesRouteTest', function () {
  it('should compile a request for obtain list of files reports', function () {
    const route = ESTIMATE_FILES_REPORTS(PA_ID, REF_MONTH);
    expect(route).toEqual(`/pn-usage-estimates/${PA_ID}/reports/${REF_MONTH}`);
  });

  it('should compile a request for obtain a specific file report', function () {
    const route = ESTIMATE_DOWNLOAD_FILE_REPORT(PA_ID, REPORT_KEY);
    expect(route).toEqual(`/pn-usage-estimates/estimate/${PA_ID}/reports/${REPORT_KEY}?type=SOURCE`);
  });
});