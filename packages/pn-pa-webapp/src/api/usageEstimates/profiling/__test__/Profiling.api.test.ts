import MockAdapter from "axios-mock-adapter";
import {apiClient} from "../../../apiClients";
import {
  DETAIL_PROFILING,
  PAGINATION_LIST_PROFILING,
  UPDATE_PROFILING,
  VALIDATED_PROFILING
} from "../../profiling/profiling.routes";
import {EstimateStatusEnum, StatusUpdateEnum} from "../../../../models/UsageEstimation";
import {ProfilingApi} from "../Profiling.api";


const PA_ID = "1234";
const TAX_ID = "";
const IPA_ID = "";
const REF_YEAR = "2023"


const mockProfilingPeriod = {
  status: EstimateStatusEnum.VALIDATED,
  showEdit: true,
  deadlineDate: "2023-06-08",
  referenceYear: REF_YEAR,
  lastModifiedDate: "2023-06-08",
  billing: {
    splitPayment: true,
    description: "ABC",
    mailAddress: "mario.rossi@gmail.com"
  }
}

const mockProfilingDetail = {
  ...mockProfilingPeriod,
  paId: "PA_ID",
  paName: "COMUNE DI ....",
  taxId: "TAX_ID",
  address: "ADDRESS",
  fiscalCode: "",
  ipaCode: "ALLO-PPP",
  pec: "m.c@pec.it",
  sdiCode: "4366-LOP"
}

const mockProfilingBody =  {
  splitPayment: true,
  description: undefined,
  mailAddress: "mario.rossi@gmail.com"
}

const mockHistoryProfilings = {
  actual: mockProfilingPeriod,
  history: {
    'number' : 0,
    size: 0,
    totalElements: 0,
    content: []
  }
}

describe('Usage Estimate api tests', () => {
  let mock = null;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  })

  afterEach(()=>{
    mock.reset();
    mock.restore();
  })

  it('getAllEstimate', async () => {
    mock
      .onGet(
        PAGINATION_LIST_PROFILING(
          PA_ID,
          TAX_ID,
          IPA_ID,
          1,
          10
        )
      )
      .reply(200, mockHistoryProfilings);
    const res = await ProfilingApi.getAllProfiling({
      paId: PA_ID,
      taxId: TAX_ID,
      ipaId: IPA_ID,
      page: 1,
      size: 10
    })
    expect(res).toStrictEqual(mockHistoryProfilings);
  });

  it('updateEstimate', async () => {
    mock
      .onPost(
        UPDATE_PROFILING(
          PA_ID,
          REF_YEAR,
          StatusUpdateEnum.VALIDATED
        )
      )
      .reply(200, mockProfilingPeriod);
    const res = await ProfilingApi.updateProfiling(
      PA_ID,
      REF_YEAR,
      StatusUpdateEnum.VALIDATED,
      mockProfilingBody
    )
    expect(res).toStrictEqual(mockProfilingPeriod);
  });

  it('validatedEstimate', async () => {
    mock
      .onGet(
        VALIDATED_PROFILING(
          PA_ID,
          REF_YEAR
        )
      )
      .reply(200, mockProfilingPeriod);
    const res = await ProfilingApi.validatedProfiling(
      PA_ID,
      REF_YEAR
    )
    expect(res).toStrictEqual(mockProfilingPeriod);
  });

  it('getDetailEstimate', async () => {
    mock
      .onGet(
        DETAIL_PROFILING(
          PA_ID,
          REF_YEAR
        )
      )
      .reply(200, mockProfilingDetail);
    const res = await ProfilingApi.getDetailProfiling(PA_ID, REF_YEAR)
    expect(res).toStrictEqual(mockProfilingDetail);
  })
})
