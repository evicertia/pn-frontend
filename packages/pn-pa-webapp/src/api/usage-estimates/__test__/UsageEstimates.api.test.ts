import MockAdapter from "axios-mock-adapter";
import {apiClient} from "../../apiClients";
import {ESTIMATE_DETAIL, ESTIMATE_PAGINATION_LIST, UPDATE_ESTIMATE, VALIDATED_ESTIMATE} from "../usageestimates.routes";
import {EstimateStatusEnum, StatusUpdateEnum} from "../../../models/UsageEstimation";
import {UsageEstimatesApi} from "../UsageEstimates.api";


const PA_ID = "1234";
const REF_MONTH = "MARZO-2023"

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
        ESTIMATE_PAGINATION_LIST(
          PA_ID,
          1,
          10
        )
      )
      .reply(200, mockHistoryEstimates);
    const res = await UsageEstimatesApi.getAllEstimate({
      paId: PA_ID,
      page: 1,
      size: 10
    })
    expect(res).toStrictEqual(mockHistoryEstimates);
  });

  it('updateEstimate', async () => {
    mock
      .onPost(
        UPDATE_ESTIMATE(
          PA_ID,
          REF_MONTH,
          StatusUpdateEnum.VALIDATED
        )
      )
      .reply(200, mockEstimatePeriod);
    const res = await UsageEstimatesApi.updateEstimate(
      PA_ID,
      REF_MONTH,
      StatusUpdateEnum.VALIDATED,
      mockEstimateBody
    )
    expect(res).toStrictEqual(mockEstimatePeriod);
  });

  it('validatedEstimate', async () => {
    mock
      .onGet(
        VALIDATED_ESTIMATE(
          PA_ID,
          REF_MONTH
        )
      )
      .reply(200, mockEstimatePeriod);
    const res = await UsageEstimatesApi.validatedEstimate(
      PA_ID,
      REF_MONTH
    )
    expect(res).toStrictEqual(mockEstimatePeriod);
  });

  it('getDetailEstimate', async () => {
    mock
      .onGet(
        ESTIMATE_DETAIL(
          PA_ID,
          REF_MONTH
        )
      )
      .reply(200, mockEstimateDetail);
    const res = await UsageEstimatesApi.getDetailEstimate(PA_ID, REF_MONTH)
    expect(res).toStrictEqual(mockEstimateDetail);
  })


})




const mockEstimatePeriod = {
  status: EstimateStatusEnum.VALIDATED,
  showEdit: true,
  deadlineDate: "2023-06-08",
  referenceMonth: REF_MONTH,
  lastModifiedDate: "2023-06-08",
  estimate: {
    totalDigitalNotif: 100,
    total890Notif: 100,
    totalAnalogNotif: 100,
  },
  billing: {
    splitPayment: true,
    description: "ABC",
    mailAddress: "mario.rossi@gmail.com"
  }
}

const mockEstimateDetail = {
  ...mockEstimatePeriod,
  paId: "PA_ID",
  paName: "COMUNE DI ....",
  taxId: "TAX_ID",
  address: "ADDRESS",
  fiscalCode: "",
  ipaCode: "ALLO-PPP",
  pec: "m.c@pec.it",
  sdiCode: "4366-LOP"
}

const mockEstimateBody =  {
  totalDigitalNotif: 100,
  total890Notif: 100,
  totalAnalogNotif: 100,
  splitPayment: true,
  description: undefined,
  mailAddress: "mario.rossi@gmail.com"
}

const mockHistoryEstimates = {
  actual: mockEstimatePeriod,
  history: {
    'number' : 0,
    size: 0,
    totalElements: 0,
    content: []
  }
}