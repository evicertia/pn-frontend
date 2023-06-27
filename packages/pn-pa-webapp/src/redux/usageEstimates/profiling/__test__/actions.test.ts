import {cleanup} from '@testing-library/react';
import {ProfilingApi} from "../../../../api/usageEstimates/Profiling/Profiling.api";
import {getAllProfiling, getDetailProfiling, updateProfiling, validatedProfiling} from "../actions"
import {mockAuthentication} from '../../../auth/__test__/test-utils';
import {store} from '../../../store';
import {
  ProfilingDetail,
  ProfilingPeriod,
  EstimateStatusEnum,
  FilterRequest,
  HistoryProfilings,
  StatusUpdateEnum
} from "../../../../models/UsageEstimation";


interface UsageEstimationState {
  historyProfilings: HistoryProfilings;
  detail: ProfilingDetail | undefined;
  formData: ProfilingPeriod | undefined;
  pagination: FilterRequest;
  loading: boolean;
  error: string | number | undefined;
}

const initialState: UsageEstimationState = {
  historyProfilings: {} as HistoryProfilings,
  detail: undefined,
  formData: undefined,
  pagination: {
    page: 1,
    size: 5,
  },
  loading: false,
  error: undefined
};


const profilingDetail: ProfilingDetail = {
  paInfo: {
    paId: "12345ABCDE",
    paName: "string",
    taxId: "ABDJFRIEFGJ$GIT",
    address: "string",
    fiscalCode: "string",
    ipaCode: "string",
    pec: "string",
    sdiCode: "string",},
  status: EstimateStatusEnum.DRAFT,
  showEdit: true,
  referenceYear: "2023",
  lastModifiedDate: "2023-05-22T13:36:27.000+00:00",
  deadlineDate: "2023-06-15T23:59:00.000+00:00",
  billing: null,
}


describe("profilingActionsTest", () =>{
  mockAuthentication();
  afterEach(cleanup);

  it('Initial state', () => {
    const state = store.getState().profilingState;
    expect(state).toEqual(initialState);
  });

  const result: HistoryProfilings= {
    actual: {
      status: EstimateStatusEnum.VALIDATED,
      showEdit: true,
      deadlineDate: "2023-06-15T23:59:00.000+00:00",
      referenceYear: "2023",
      lastModifiedDate :"2023-06-15T23:59:00.000+00:00",
      billing: null
    },
    history: {
      content: [
        {
          referenceYear: "2024",
          status: EstimateStatusEnum.ABSENT,
          lastModifiedDate: "2024-05-22T13:36:27.000+00:00",
          deadlineDate: "2024-06-15T23:59:00.000+00:00",
        },
        {
          referenceYear: "2023",
          status: EstimateStatusEnum.VALIDATED,
          lastModifiedDate: "2023-04-22T13:36:27.000+00:00",
          deadlineDate: "2023-05-15T23:59:00.000+00:00",
        },
        {
          referenceYear: "2022",
          status: EstimateStatusEnum.ABSENT,
          lastModifiedDate: "2022-03-22T13:36:27.000+00:00",
          deadlineDate: "2022-04-15T23:59:00.000+00:00",
        },
        {
          referenceYear: "2021",
          status: EstimateStatusEnum.VALIDATED,
          lastModifiedDate: "2021-02-22T13:36:27.000+00:00",
          deadlineDate: "2021-03-15T23:59:00.000+00:00",
        },
      ],
      number: 0,
      size: 5,
      totalElements: 4
    }
  };


  it('getAllProfiling call ', async () => {
    const apiSpy = jest.spyOn(ProfilingApi, 'getAllProfiling');
    apiSpy.mockResolvedValue(
      result
    );
    const action = await store.dispatch(getAllProfiling({ paId: "12345ABCDE", taxId: "", ipaId: "",
      page: 1, size: 5}));
    const payload = action.payload;
    expect(action.type).toBe('getAllProfiling/fulfilled');
    expect(payload).toEqual(
      result
    );
  });

  it('getDetailProfiling call ', async () => {
    const apiSpy = jest.spyOn(ProfilingApi, 'getDetailProfiling');
    apiSpy.mockResolvedValue(
      profilingDetail
    );
    const action = await store.dispatch(getDetailProfiling( { paId: "12345ABCDE",
      referenceYear: "2023"}));
    const payload = action.payload;
    expect(action.type).toBe('getDetailProfiling/fulfilled');
    expect(payload).toEqual(
      profilingDetail
    );
  });
  it('updateEstimate call ', async () => {
    const apiSpy = jest.spyOn(ProfilingApi, 'updateProfiling');
    apiSpy.mockResolvedValue(
      profilingDetail
    );
    const action = await store.dispatch(updateProfiling( { paId: "12345ABCDE",
      referenceYear: "2023", status: StatusUpdateEnum.DRAFT, body:null}));
    const payload = action.payload;
    expect(action.type).toBe('updateProfiling/fulfilled');
    expect(payload).toEqual(
      profilingDetail
    );
  });

  it('validatedEstimate call ', async () => {
    const apiSpy = jest.spyOn(ProfilingApi, 'validatedProfiling');
    apiSpy.mockResolvedValue(
      profilingDetail
    );
    const action = await store.dispatch(validatedProfiling( { paId: "12345ABCDE",
      referenceYear: "2023"}));
    const payload = action.payload;
    expect(action.type).toBe('validatedProfiling/fulfilled');
    expect(payload).toEqual(
      profilingDetail
    );
  });

});


