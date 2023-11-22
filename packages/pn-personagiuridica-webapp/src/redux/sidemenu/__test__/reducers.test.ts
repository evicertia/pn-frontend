import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { getApiClient } from '../../../api/apiClients';
import {
  ACCEPT_DELEGATION,
  COUNT_DELEGATORS,
  REJECT_DELEGATION,
} from '../../../api/delegations/delegations.routes';
import { DelegationStatus } from '../../../models/Deleghe';
import { acceptDelegation, rejectDelegation } from '../../delegation/actions';
import { getStore } from '../../store';
import { getSidemenuInformation } from '../actions';
import { closeDomicileBanner } from '../reducers';

const initialState = {
  pendingDelegators: 0,
  defaultAddresses: [],
  domicileBannerOpened: true,
};

describe('Sidemenu redux state tests', () => {
  let mock: MockAdapter;
  mockAuthentication();

  beforeAll(() => {
    mock = new MockAdapter(getApiClient());
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('Initial state', () => {
    const state = getStore().getState().generalInfoState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to close domicile banner', () => {
    const action = getStore().dispatch(closeDomicileBanner());
    expect(action.type).toBe('generalInfoSlice/closeDomicileBanner');
    const state = getStore().getState().generalInfoState;
    expect(state).toEqual({ ...initialState, domicileBannerOpened: false });
  });

  it('Should load delegators count', async () => {
    mock.onGet(COUNT_DELEGATORS(DelegationStatus.PENDING)).reply(200, { value: 2 });
    const action = await getStore().dispatch(getSidemenuInformation());
    const state = getStore().getState().generalInfoState;
    expect(action.type).toBe('getSidemenuInformation/fulfilled');
    expect(state.pendingDelegators).toBe(2);
  });

  it('Should update state after accepting a delegation', async () => {
    mock.onPatch(ACCEPT_DELEGATION('1dc53e54-1368-4c2d-8583-2f1d672350d8')).reply(204);
    mock.onGet(COUNT_DELEGATORS(DelegationStatus.PENDING)).reply(200, { value: 2 });
    await getStore().dispatch(getSidemenuInformation());
    const action = await getStore().dispatch(
      acceptDelegation({ id: '1dc53e54-1368-4c2d-8583-2f1d672350d8', code: '12345', groups: [] })
    );
    const state = getStore().getState().generalInfoState;
    expect(action.type).toBe('acceptDelegation/fulfilled');
    expect(state.pendingDelegators).toBe(1);
  });

  it('Should update state after rejecting a pending delegation', async () => {
    mock.onPatch(REJECT_DELEGATION('1dc53e54-1368-4c2d-8583-2f1d672350d8')).reply(204);
    mock.onGet(COUNT_DELEGATORS(DelegationStatus.PENDING)).reply(200, { value: 2 });
    await getStore().dispatch(getSidemenuInformation());
    const action = await getStore().dispatch(rejectDelegation('1dc53e54-1368-4c2d-8583-2f1d672350d8'));
    const state = getStore().getState().generalInfoState;
    expect(action.type).toBe('rejectDelegation/fulfilled');
    expect(state.pendingDelegators).toBe(1);
  });
});
