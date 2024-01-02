import MockAdapter from 'axios-mock-adapter';

import {
  createDelegationDuplicatedErrorResponse,
  createDelegationGenericErrorResponse,
  createDelegationPayload,
  createDelegationResponse,
  createDelegationSelectedPayload,
} from '../../../__mocks__/CreateDelegation.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import { getApiClient } from '../../../api/apiClients';
import { CREATE_DELEGATION } from '../../../api/delegations/delegations.routes';
import { GET_ALL_ACTIVATED_PARTIES } from '../../../api/external-registries/external-registries-routes';
import { getStore } from '../../store';
import { createDelegation, createDelegationMapper, getAllEntities } from '../actions';
import { resetNewDelegation } from '../reducers';

const initialState = {
  created: false,
  error: false,
  entities: [],
};

describe('delegation redux state tests', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(getApiClient());
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('checks the initial state', () => {
    const state = getStore().getState().newDelegationState;
    expect(state).toEqual(initialState);
  });

  it('creates a new delegation with all organizations', async () => {
    mock
      .onPost(CREATE_DELEGATION(), createDelegationMapper(createDelegationPayload))
      .reply(200, createDelegationResponse);
    const action = await getStore().dispatch(createDelegation(createDelegationPayload));
    expect(action.type).toBe('createDelegation/fulfilled');
    expect(action.payload).toEqual(createDelegationResponse);
  });

  it('creates a new delegation with a single organization', async () => {
    mock
      .onPost(CREATE_DELEGATION(), createDelegationMapper(createDelegationSelectedPayload))
      .reply(200, createDelegationResponse);
    const action = await getStore().dispatch(createDelegation(createDelegationSelectedPayload));
    expect(action.type).toBe('createDelegation/fulfilled');
    expect(action.payload).toEqual(createDelegationResponse);
  });

  it("can't create a new delegation", async () => {
    mock
      .onPost(CREATE_DELEGATION(), createDelegationMapper(createDelegationPayload))
      .reply(401, createDelegationGenericErrorResponse);
    const action = await getStore().dispatch(createDelegation(createDelegationPayload));
    expect(action.type).toBe('createDelegation/rejected');
    expect((action.payload as any).response.data).toEqual(createDelegationGenericErrorResponse);
  });

  it("can't create a new delegation (duplicated)", async () => {
    mock
      .onPost(CREATE_DELEGATION(), createDelegationMapper(createDelegationPayload))
      .reply(400, createDelegationDuplicatedErrorResponse);
    const action = await getStore().dispatch(createDelegation(createDelegationPayload));
    expect(action.type).toBe('createDelegation/rejected');
    expect((action.payload as any).response.data).toEqual(createDelegationDuplicatedErrorResponse);
  });

  it('fecth parties list', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES()).reply(200, parties);
    const action = await getStore().dispatch(getAllEntities(null));
    expect(action.type).toBe('getAllEntities/fulfilled');
    expect(action.payload).toEqual(parties);
  });

  it('resets the newDelegation state', () => {
    const action = getStore().dispatch(resetNewDelegation());
    const state = getStore().getState().newDelegationState;
    expect(action.type).toBe('newDelegationSlice/resetNewDelegation');
    expect(state.created).toBeFalsy();
    expect(state.error).toBeFalsy();
  });
});
