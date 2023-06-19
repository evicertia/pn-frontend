import {act, cleanup, render} from '@testing-library/react';
import {UsageEstimatesApi} from "../../../api/usage-estimates/UsageEstimates.api";
import {configureStore, createAsyncThunk} from '@reduxjs/toolkit';
import {ESTIMATE_ACTIONS} from "../actions"
import { getAllEstimate } from '../actions';
import { getDetailEstimate } from '../actions';
import { updateEstimate } from '../actions';
import { validatedEstimate } from '../actions';
import { GroupStatus, UserGroup } from '../../../models/user';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { store } from '../../store';
import {
    BillingDetail,
    Estimate,
    EstimateDetail,
    EstimatePeriod,
    EstimateStatusEnum,
    FilterRequest,
    HistoryEstimates, PaInfo, StatusUpdateEnum
} from "../../../models/UsageEstimation";
import {NotificationsApi} from "../../../api/notifications/Notifications.api";
import {getApiKeyUserGroups} from "../../NewApiKey/actions";
import {performThunkAction} from "@pagopa-pn/pn-commons";

interface UsageEstimationState {
    historyEstimates: HistoryEstimates;
    detail: EstimateDetail | undefined;
    formData: EstimatePeriod | undefined;
    pagination: FilterRequest;
    loading: boolean;
    error: string | number | undefined;
}

const initialState: UsageEstimationState = {
    historyEstimates: {} as HistoryEstimates,
    detail: undefined,
    formData: undefined,
    pagination: {
        page: 1,
        size: 5,
    },
    loading: false,
    error: undefined
};


const estimateDetail :EstimateDetail = {
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
    referenceMonth: "LUG-2023",
    lastModifiedDate: "2023-05-22T13:36:27.000+00:00",
    deadlineDate: "2023-06-15T23:59:00.000+00:00",
    estimate: null,
    billing: null,
}


describe("actionstest", () =>{
    mockAuthentication();
    afterEach(cleanup);

    it('Initial state', () => {
        const state = store.getState().usageEstimateState;
        expect(state).toEqual(initialState);
    });

    const result : HistoryEstimates= {
        actual: {
            status: EstimateStatusEnum.VALIDATED,
            showEdit: true,
            deadlineDate: "2023-06-15T23:59:00.000+00:00",
            referenceMonth: "LUG-2023",
            lastModifiedDate :"2023-06-15T23:59:00.000+00:00",
            estimate: null,
            billing: null
        },
        history: [
            {  referenceMonth: "GIU-2023",
                status: EstimateStatusEnum.ABSENT,
                lastModifiedDate: "2023-05-22T13:36:27.000+00:00",
                deadlineDate: "2023-06-15T23:59:00.000+00:00",
            },
            {
                referenceMonth: "MAG-2023",
                status: EstimateStatusEnum.VALIDATED,
                lastModifiedDate: "2023-04-22T13:36:27.000+00:00",
                deadlineDate: "2023-05-15T23:59:00.000+00:00",
            },
            {
                referenceMonth: "APR-2023",
                status: EstimateStatusEnum.ABSENT,
                lastModifiedDate: "2023-03-22T13:36:27.000+00:00",
                deadlineDate: "2023-04-15T23:59:00.000+00:00",
            },
            {
                referenceMonth: "MAR-2023",
                status: EstimateStatusEnum.VALIDATED,
                lastModifiedDate: "2023-02-22T13:36:27.000+00:00",
                deadlineDate: "2023-03-15T23:59:00.000+00:00",
            },
        ]
    };


    it('getAllEstimate call ', async () => {
        const apiSpy = jest.spyOn(UsageEstimatesApi, 'getAllEstimate');
        apiSpy.mockResolvedValue(
          result
        );
        const action = await store.dispatch(getAllEstimate());
        const payload = action.payload;
        expect(action.type).toBe('getAllEstimate/fulfilled');
        expect(payload).toEqual(
            result
        );
    });

    it('getDetailEstimate call ', async () => {
        const apiSpy = jest.spyOn(UsageEstimatesApi, 'getDetailEstimate');
        apiSpy.mockResolvedValue(
            estimateDetail
        );
        const action = await store.dispatch(getDetailEstimate( { paId: "12345ABCDE",
        referenceMonth: "LUG-2023"}));
        const payload = action.payload;
        expect(action.type).toBe('getDetailEstimate/fulfilled');
        expect(payload).toEqual(
            estimateDetail
        );
    });
    it('updateEstimate call ', async () => {
        const apiSpy = jest.spyOn(UsageEstimatesApi, 'updateEstimate');
        apiSpy.mockResolvedValue(
            estimateDetail
        );
        const action = await store.dispatch(updateEstimate( { paId: "12345ABCDE",
            referenceMonth: "LUG-2023", status: StatusUpdateEnum.DRAFT, body:null}));
        const payload = action.payload;
        expect(action.type).toBe('updateEstimate/fulfilled');
        expect(payload).toEqual(
            estimateDetail
        );
    });

    it('validatedEstimate call ', async () => {
        const apiSpy = jest.spyOn(UsageEstimatesApi, 'validatedEstimate');
        apiSpy.mockResolvedValue(
            estimateDetail
        );
        const action = await store.dispatch(validatedEstimate( { paId: "12345ABCDE",
            referenceMonth: "LUG-2023"}));
        const payload = action.payload;
        expect(action.type).toBe('validatedEstimate/fulfilled');
        expect(payload).toEqual(
            estimateDetail
        );
    });



});


