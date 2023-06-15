import {act, render} from '@testing-library/react';
import {getAllEstimate} from "../actions"
import {UsageEstimatesApi} from "../../../api/usage-estimates/UsageEstimates.api";
describe("actions.test", () => {
    it('makes the correct API call', async () => {
        const mockGetAllEstimate = jest.spyOn(UsageEstimatesApi, 'getAllEstimate');
        const mockDispatch = jest.fn();

        // Configura eventuali parametri necessari
        const params = {
            // ...
        };


        await act(async () => {
            // Esegui le azioni necessarie per attivare la chiamata API
            // ...

            expect(mockGetAllEstimate).toHaveBeenCalledWith(params);
        });
    });


}


