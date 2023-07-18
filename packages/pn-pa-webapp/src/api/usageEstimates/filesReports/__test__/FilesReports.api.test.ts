import MockAdapter from "axios-mock-adapter";
import {apiClient} from "../../../apiClients";
import {
  ESTIMATE_FILES_REPORTS,
  ESTIMATE_DOWNLOAD_FILE_REPORT
} from "../FilesReports.routes";
import {FilesReportsApi} from "../FilesReports.api";


const PA_ID = "1234";
const REF_MONTH = "GIU-2023"
const REPORT_KEY = "asdqwerty"

describe('Files Reports api tests', () => {
  let mock = null;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  })

  afterEach(()=>{
    mock.reset();
    mock.restore();
  })

  it('getAllReportsFile', async () => {
    mock
      .onGet(
        ESTIMATE_FILES_REPORTS(PA_ID, REF_MONTH)
      )
      .reply(200, mockFilesReports);
    const res = await FilesReportsApi.getAllReportsFile(PA_ID, REF_MONTH)
    expect(res).toStrictEqual(mockFilesReports);
  });

  it('getReportFile', async () => {
    mock
      .onGet(
        ESTIMATE_DOWNLOAD_FILE_REPORT(PA_ID, REPORT_KEY)
      )
      .reply(200, mockFileReport);
    const res = await FilesReportsApi.getReportFile(PA_ID, REPORT_KEY)
    expect(res).toStrictEqual(mockFileReport);
  });
})

const mockFilesReports = [
  {
    paId: "026e8c72-7944-4dcd-8668-f596447fec6d",
    reportKey: "report_compressed.zip",
    reportZipKey: null,
    url: null,
    referenceMonth: "GIU-2023",
    lastModifiedDate: null,
    errorMessage: null,
    generationDate: null,
    part: null,
    status: null
  },
  {
    paId: "026e8c72-7944-4dcd-8668-f596447fec6d",
    reportKey: "report_compressed-1.zip",
    reportZipKey: null,
    url: null,
    referenceMonth: "GIU-2023",
    lastModifiedDate: null,
    errorMessage: null,
    generationDate: null,
    part: null,
    status: null
  }
];

const mockFileReport = {
  paId: "026e8c72-7944-4dcd-8668-f596447fec6d",
  reportKey: "report_compressed.zip",
  reportZipKey: null,
  url: "https://pn-platform-usage-estimates-s-estimateusagebucket-oraglfzcvjjw.s3.eu-south-1.amazonaws.com/paid_026e8c72-7944-4dcd-8668-f596447fec6d/month_GIU-2023/last/report_compressed.zip?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LXNvdXRoLTEiRjBEAiA0mh%2FrFqu1pGZuopYEd4a1Zy1uV762l2sFJ46JFAJXcwIgQzS9%2BQfWvWDdHwAQxAfAE%2FRv7N%2FPgbX3q%2FfOXF36PR0q%2FgMIEhAAGgw4MzAxOTIyNDY1NTMiDB2ZcmQaLcE8x9tXfCrbA8HyIv7Ibw%2Bz0OXzLV4PgUb2J%2BuLvu%2BD%2FbQt2TeALrymS2lLpnJOHCV8tcxIv5hVcdOFDHUjjblyUHFh2ZvJDkJUeOPi%2B6N9U5kmmyUHKJN81X6EP2rQIrWM%2B%2BIcarw1C5piNWebG2QluXLFKDr%2BjuhiLKR%2FmPOpP9kZzoj8NWjN9rWQck8MCH8XTChgM1igkW7pz5AwAA24f6WXPyY651fYX5gVXK8TOIjiiHKhPdlgq%2FvSUwXkZqtZn3ksaSaBVs4IhZUAIpbGRUqMRe2kiAnva57JMKekdTEVlcju9mZt0wIV9iy1S2T%2B86n%2Bv0kbHrQUfQ2JHXCStwm1wvGKlYxvsBbzXbvBk5URrwj6pTOyC4wtOWdubwFnO8wskhL5R20ooviNfpadorHXC7wIZCgMyL7vrolTUjjA5Wc8TuZgNXwNQ2kzImm%2BhnlolijNysiNA9rpyz9gshzzg0LM9BTyopTg9UYTTm9meO5or%2FlualGwnMSrStGBT4b2RKegSmNNHTMGv1GhNCBgJLyx%2ByVaChjKSTFu%2F0WV%2FmSeCx76bX6ArXnl4sGiJuqb2FXyi0zztZCvZTBL%2FRa%2BMrV7hkXuV3AHSBYtiGkg0HWLb4rMsYv1dTNAd2nUHGQwpqbEpQY6pgHQ7xxNfOeVwy7umcxdpwDeuBH2Q9Rp49TCLkHZgAuCm5J8oDTane9sDZRPfi4lq335r92tx9RKBAffiHry5NquIfRBIry%2BvwBnirT2WJ7wpLicr6ku6TIxsa%2BR6ENFU4nIMHtfiAdFcjsINbCCHGXqlwRKV4jrzOqzqsYmfwu50nJqq4ZyDxqlBQTUxQYECEOnzpO4pUIOnLgAegA2uC3LSJYQEqKA&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230714T095833Z&X-Amz-SignedHeaders=host&X-Amz-Expires=359999&X-Amz-Credential=ASIA4CS2QL4M6PNE6I55%2F20230714%2Feu-south-1%2Fs3%2Faws4_request&X-Amz-Signature=6bace415029e380f03a967260c039f94cf800680dced30c164fb79ea3bd0efd3",
  referenceMonth: null,
  lastModifiedDate: null,
  errorMessage: null,
  generationDate: null,
  part: null,
  status: "READY"
};