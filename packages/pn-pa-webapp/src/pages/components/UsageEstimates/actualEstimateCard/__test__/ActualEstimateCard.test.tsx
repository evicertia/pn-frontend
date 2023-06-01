import {render, cleanup, screen} from "@testing-library/react";
import { ActualEstimateCard } from "../ActualEstimateCard";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import {EstimatePeriod, EstimateStatusEnum} from "../../../../../models/UsageEstimation";
import {Provider} from "react-redux";

const draftElement :EstimatePeriod = {
    referenceMonth: "LUG-2023",
    status: EstimateStatusEnum.DRAFT,
    lastModifiedDate: "2023-05-22T13:36:27.000+00:00",
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

