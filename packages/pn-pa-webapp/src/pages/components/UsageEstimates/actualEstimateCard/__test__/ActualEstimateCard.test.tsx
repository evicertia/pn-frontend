import {render, cleanup, screen, fireEvent, act, getByText, waitFor} from "@testing-library/react";
import { ActualEstimateCard } from "../ActualEstimateCard";
import {BrowserRouter, MemoryRouter, Route, Routes, useNavigate} from "react-router-dom";
import { createStore } from "redux";
import {EstimatePeriod, EstimateStatusEnum} from "../../../../../models/UsageEstimation";
import {Provider} from "react-redux";
import {GET_EDIT_ESTIMATE_PATH} from "../../../../../navigation/routes.const";
import routes from "../../../../../navigation/routes";

import * as reactRedux from "../../../../../redux/hooks";


const mockNavigateFn = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigateFn,
}));

describe('ActualEstimateCard', () => {
    const mockDispatchFn = jest.fn();
    const spyOnDispatch = jest.spyOn(reactRedux, "useAppDispatch");





    beforeEach(() => {
        spyOnDispatch.mockReturnValue(mockDispatchFn);
    });

    afterEach(() => {
        cleanup();
    });


    it('renders create estimate button when lastModifiedDate is null and status is DRAFT', async () => {
        const props = {
            paId: 'paId1234567',
            data: {...draftElement
            },
        };

        render(<BrowserRouter >
            <Routes>
                <Route path={"/"} element={ <ActualEstimateCard {...props}/>} />
                <Route path={GET_EDIT_ESTIMATE_PATH(draftElement.referenceMonth)} element={<h1 data-testid={"estimate-edit-page"}>Estimate page route</h1>}/>
            </Routes>
        </BrowserRouter>);


        const estimateButton = screen.getByTestId("create-button-test-id");
        fireEvent.click(estimateButton);


        await act(async () => {
            await waitFor( () => {
                // expect(location.pathname).toEqual(GET_EDIT_ESTIMATE_PATH(draftElement.referenceMonth));
                //expect(screen.getByTestId("estimate-edit-page")).toBeInTheDocument()
                expect(mockDispatchFn).toBeCalledTimes(0);
                expect(mockNavigateFn).toBeCalledTimes(1);
            })

        })
    });

    it('edit estimate button and send estimate button when status is DRAFT', () => {
        const props = {
            paId: 'paId',
            data: {
                lastModifiedDate: '2023-05-22T13:36:27.000+00:00',
                status: EstimateStatusEnum.DRAFT,
                referenceMonth: 'GIU-2023',
            },
        };

        const { getByText } = render(
            <ActualEstimateCard {...props}  />
        );

        const editEstimateButton = getByText('Modifica stima');
        fireEvent.click(editEstimateButton);

        expect(navigateMock).toHaveBeenCalledWith(
            GET_EDIT_ESTIMATE_PATH(props.data.referenceMonth)
        );

        const sendEstimateButton = getByText('Invia stima');
        fireEvent.click(sendEstimateButton);

        //

    });

    it('edit estimate button when status is VALIDATED', () => {
        const props = {
            paId: 'paId',
            data: {
                lastModifiedDate: null,
                status: EstimateStatusEnum.VALIDATED,
                referenceMonth: 'GIU-2023',
            },
        };

        const { getByText } = render(
            <ActualEstimateCard {...props} navigate={navigateMock} t={tMock} />
        );

        const editEstimateButton = getByText('Modifica stima');
        fireEvent.click(editEstimateButton);

        expect(navigateMock).toHaveBeenCalledWith(
            GET_EDIT_ESTIMATE_PATH(props.data.referenceMonth)
        );
    });

    it('renders null when none of the conditions are met', () => {
        const props = {
            paId: 'paId1234567',
            data: {
                lastModifiedDate: '2023-05-22T13:36:27.000+00:00',
                status: EstimateStatusEnum.DRAFT,
                referenceMonth: 'GIU-2023',
            },
        };

        const { container } = render(
            <ActualEstimateCard {...props} navigate={navigateMock} t={tMock} />
        );

        expect(container.firstChild).toBeNull();
    });
});



const draftElement :EstimatePeriod = {
    referenceMonth: "LUG-2023",
    status: EstimateStatusEnum.DRAFT,
    lastModifiedDate: null,
    deadlineDate: "2023-06-15T23:59:00.000+00:00",
    estimate: {
        totalDigitalNotif: 5,
        total890Notif: 10,
        totalAnalogNotif: 15,
    },
    showEdit: false,
    billing: {
        sdiCode: "ABCDE12345",
        splitPayment: false,
        description: "string",
        mailAddress: "test@test.com",

    },

};

const validatedElement :EstimatePeriod = {
    referenceMonth: "GIU-2023",
    status: EstimateStatusEnum.DRAFT,
    lastModifiedDate: "2023-04-22T13:36:27.000+00:00",
    deadlineDate: "2023-05-15T23:59:00.000+00:00",
    estimate: {
        totalDigitalNotif: 12,
        total890Notif: 1330,
        totalAnalogNotif: 125,
    },
    showEdit: false,
    billing: {
        sdiCode: "ABCDE12345",
        splitPayment: false,
        description: "string",
        mailAddress: "test@test.com",

    },

};

const firstEstimate :EstimatePeriod = {
    referenceMonth: "GIU-2023",
    status: EstimateStatusEnum.DRAFT,
    lastModifiedDate: "2023-05-22T13:36:27.000+00:00",
    deadlineDate: "2023-06-15T23:59:00.000+00:00",
    estimate: {
        totalDigitalNotif: 0,
        total890Notif: 0,
        totalAnalogNotif: 0,
    },
    showEdit: false,
    billing: {
        sdiCode: "ABCDE12345",
        splitPayment: false,
        description: "string",
        mailAddress: "test@test.com",

    },

};

const propsDraftElement ={
    paId:"123456789",
    data: draftElement,
};

const propsValidateElement ={
    paId:"123456789",
    data: validatedElement,
};

const propsFirstElement ={
    paId:"123456789",
    data: firstEstimate,
};


const mockStore = createStore(()=> propsDraftElement, propsDraftElement);
describe("ActualEstimateCard", () => {
    afterEach(cleanup);
    it("renders the card with correct data - DRAFT", async () => {
        render(
            <Provider store={mockStore}>
                    <MemoryRouter>
                        <ActualEstimateCard {...propsDraftElement} />
                    </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();
        expect(screen.getByText("15")).toBeInTheDocument();

    });

    it("renders the card with correct data - VALIDATED", async () => {
         render(
               <Provider store={mockStore}>
                    <MemoryRouter>
                        <ActualEstimateCard {...propsValidateElement} />
                    </MemoryRouter>
                </Provider>
         );

         expect(screen.getByText("12")).toBeInTheDocument();
         expect(screen.getByText("1330")).toBeInTheDocument();
         expect(screen.getByText("125")).toBeInTheDocument();

    });

    it("renders the card with correct data - First estimation", async () => {
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <ActualEstimateCard {...propsFirstElement} />
                </MemoryRouter>
            </Provider>
        );
        expect( (screen.queryByTestId("testIdTagEditDate"))).not.toBeInTheDocument();

    });

});

