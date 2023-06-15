import {render, cleanup, screen, fireEvent, act, getByText, waitFor} from "@testing-library/react";
import { ActualEstimateCard } from "../ActualEstimateCard";
import {BrowserRouter, MemoryRouter, Route, Routes, useNavigate} from "react-router-dom";
import { createStore } from "redux";
import {EstimatePeriod, EstimateStatusEnum} from "../../../../../models/UsageEstimation";
import {Provider} from "react-redux";
import {GET_DETAIL_ESTIMATE_PATH, GET_EDIT_ESTIMATE_PATH} from "../../../../../navigation/routes.const";
import * as reactRedux from "../../../../../redux/hooks";
import { useAppDispatch } from '../../../../../redux/hooks';
import { validatedEstimate } from '../../../../../redux/usageEstimation/actions';
import {appStateActions} from "@pagopa-pn/pn-commons";
import {SendEstimateDialog} from "../../form/estimate/dialog/SendEstimateDialog";

const firstEstimate :EstimatePeriod = {
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


const draftEstimate :EstimatePeriod = {
    referenceMonth: "GIU-2023",
    status: EstimateStatusEnum.DRAFT,
    lastModifiedDate: "2023-04-22T13:36:27.000+00:00",
    deadlineDate: "2023-05-15T23:59:00.000+00:00",
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


const sentEstimate :EstimatePeriod = {
    referenceMonth: "GIU-2023",
    status: EstimateStatusEnum.DRAFT,
    lastModifiedDate: "2023-05-22T13:36:27.000+00:00",
    deadlineDate: "2023-06-15T23:59:00.000+00:00",
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


const sentValidatedEstimate :EstimatePeriod = {
    referenceMonth: "GIU-2023",
    status: EstimateStatusEnum.VALIDATED,
    lastModifiedDate: "2023-05-22T13:36:27.000+00:00",
    deadlineDate: "2023-06-15T23:59:00.000+00:00",
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


const emptyEstimate :EstimatePeriod = {
    referenceMonth: "GIU-2023",
    status: null,
    lastModifiedDate: null,
    deadlineDate: null,
    estimate: {
        totalDigitalNotif: null,
        total890Notif: null,
        totalAnalogNotif: null,
    },
    showEdit: false,
    billing: {
        sdiCode: "ABCDE12345",
        splitPayment: false,
        description: "string",
        mailAddress: "test@test.com",

    },

};


const propsDraftEstimate ={
    paId:"123456789",
    data: draftEstimate,
};

const propsValidateElement ={
    paId:"123456789",
    data: sentEstimate,
};

const propsFirstEstimate ={
    paId:"123456789",
    data: firstEstimate,
};

const propsAfterValidationElement ={
    paId: null,
    data: sentValidatedEstimate,
};

const propsNullElement ={
    paId: null,
    data: emptyEstimate,
};



describe('ActualEstimateCardFunctionalities', () => {
    beforeEach(() => {
        window.history.pushState({}, '', '/');
    });
    afterEach(cleanup);



    it('Create estimate button behaviour when lastModifiedDate is null and status is DRAFT', async () => {
        render(<BrowserRouter>
            <Routes>
                <Route path={"/"} element={<ActualEstimateCard {...propsFirstEstimate}/>}/>
                <Route path={GET_EDIT_ESTIMATE_PATH(propsFirstEstimate.data.referenceMonth)}
                       element={<h1 data-testid={"estimate-edit-page"}>Estimate page route</h1>}/>
            </Routes>
        </BrowserRouter>);
        const estimateButton = screen.getByTestId("create-button-test-id");
        fireEvent.click(estimateButton);
        await act(async () => {
            await waitFor(() => {
                expect(location.pathname).toEqual(GET_EDIT_ESTIMATE_PATH(propsFirstEstimate.data.referenceMonth));
                expect(screen.getByTestId("estimate-edit-page")).toBeInTheDocument()
            })

        })
    });


    it('renders create estimate button when lastModifiedDate is not null and status is DRAFT', async () => {
        const mockNavigateFn = jest.fn();
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useNavigate: () => mockNavigateFn,
        }));
        const mockDispatchFn = jest.fn();
        const spyOnDispatch = jest.spyOn(reactRedux, "useAppDispatch");
        spyOnDispatch.mockReturnValue(mockDispatchFn);
        render(<BrowserRouter>
            <Routes>
                <Route path={"/"} element={<ActualEstimateCard {...propsDraftEstimate}/>}/>
                <Route path={GET_EDIT_ESTIMATE_PATH(propsDraftEstimate.data.referenceMonth)}
                       element={<h1 data-testid={"estimate-edit-page"}>Estimate page route</h1>}/>
            </Routes>
        </BrowserRouter>);
        const estimateButton = screen.getByText("actual-estimate.card.button.edit-estimate");
        fireEvent.click(estimateButton);
        await act(async () => {
            await waitFor(() => {
                expect(location.pathname).toEqual(GET_EDIT_ESTIMATE_PATH(propsDraftEstimate.data.referenceMonth));
                expect(screen.getByTestId("estimate-edit-page")).toBeInTheDocument()
            })
        })
    });


    it('edit estimate button and send estimate button when status is DRAFT', async () => {

        const mockDispatchFn = jest.fn();
        const spyOnDispatch = jest.spyOn(reactRedux, "useAppDispatch");
        spyOnDispatch.mockReturnValue(mockDispatchFn);

        const {getByText} = render(<BrowserRouter>
            <Routes>
                <Route path={"/"} element={<ActualEstimateCard {...propsDraftEstimate}/>}/>
            </Routes>
        </BrowserRouter>);

        const sendEstimateButton = screen.getByText("actual-estimate.card.button.send-estimate");
        fireEvent.click(sendEstimateButton);
        await act(async () => {
            await waitFor(() => {
                expect(screen.getByTestId("send-estimate-dialog")).toBeInTheDocument()
            })
        })

    });


    it('edit estimate button when status is VALIDATED', async () => {
        const mockDispatchFn = jest.fn();
        const spyOnDispatch = jest.spyOn(reactRedux, "useAppDispatch");
        spyOnDispatch.mockReturnValue(mockDispatchFn);

        const {getByText} = render(<BrowserRouter>
            <Routes>
                <Route path={"/"} element={<ActualEstimateCard {...propsValidateElement}/>}/>
                <Route path={GET_EDIT_ESTIMATE_PATH(propsValidateElement.data.referenceMonth)}
                       element={<h1 data-testid={"estimate-edit-page"}>Estimate page route</h1>}/>
            </Routes>
        </BrowserRouter>);

        const editEstimateButton = screen.getByText("actual-estimate.card.button.edit-estimate");
        fireEvent.click(editEstimateButton);
        await act(async () => {
            await waitFor(() => {
                expect(location.pathname).toEqual(GET_EDIT_ESTIMATE_PATH(propsValidateElement.data.referenceMonth));
                expect(screen.getByTestId("estimate-edit-page")).toBeInTheDocument()
            })
        })
    });

});

describe("ActualEstimateCardRender", () => {
        const mockStore = createStore(() => propsDraftEstimate, propsDraftEstimate);

        afterEach(cleanup);

        it("renders the card with correct data - DRAFT", async () => {
            render(
                <Provider store={mockStore}>
                    <MemoryRouter>
                        <ActualEstimateCard {...propsDraftEstimate} />
                    </MemoryRouter>
                </Provider>
            );

            expect(screen.getByText("5")).toBeInTheDocument();
            expect(screen.getByText("10")).toBeInTheDocument();
            expect(screen.getByText("15")).toBeInTheDocument();

        });

    it("render Validated element", async () => {
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <ActualEstimateCard {...propsAfterValidationElement} />
                </MemoryRouter>
            </Provider>
        );
        expect(screen.getByText("12")).toBeInTheDocument();
        expect(screen.getByText("1330")).toBeInTheDocument();
        expect(screen.getByText("125")).toBeInTheDocument();

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

    it("renders the card with no value ", async () => {
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <ActualEstimateCard {...propsNullElement} />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getAllByText("actual-estimate.card.label.estimate-to-complete").at(0)).toBeInTheDocument();

    });


    it("renders the card with correct data - First estimation", async () => {
            render(
                <Provider store={mockStore}>
                    <MemoryRouter>
                        <ActualEstimateCard {...propsFirstEstimate} />
                    </MemoryRouter>
                </Provider>
            );
            expect((screen.queryByTestId("testIdTagEditDate"))).not.toBeInTheDocument();

        });

        it('renders edit estimate button when status is VALIDATED', async() => {

            const mockDispatchFn = jest.fn();
            const spyOnDispatch = jest.spyOn(reactRedux, "useAppDispatch");
            spyOnDispatch.mockReturnValue(mockDispatchFn);


            const {getByText} = render(<BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<ActualEstimateCard {...propsAfterValidationElement}/>}/>
                    <Route path={GET_EDIT_ESTIMATE_PATH(propsAfterValidationElement.data.referenceMonth)}
                           element={<h1 data-testid={"estimate-detail-page"}>Detail Estimate page route</h1>}/>
                </Routes>
            </BrowserRouter>);
            const editEstimateButton = screen.getByTestId('update-after-validation-button-test-id');
            fireEvent.click(editEstimateButton);
            await act(async () => {
                await waitFor(() => {
                    expect(location.pathname).toEqual(GET_EDIT_ESTIMATE_PATH(propsAfterValidationElement.data.referenceMonth));
                    expect(screen.getByTestId("estimate-detail-page")).toBeInTheDocument()
                })
            })
          });

        it('handles positive action correctly 1', async () => {
            const mockDispatch = jest.fn();
            const mockExternalDispatchResolve = jest.fn().mockImplementation(() => Promise.resolve(mockDispatch) );
            const mockExternalDispatchRejected = jest.fn().mockImplementation(() => Promise.reject(mockDispatch) );
            const mockNavigateFn = jest.fn();
            const screen= render(
                <Provider store={mockStore}>
                    <MemoryRouter>
                        <ActualEstimateCard {...propsDraftEstimate} />
                    </MemoryRouter>
                </Provider>
            );

            await act(async () => {
                //const sendEstimateButton = screen.getByTestId('loading-button-test-id');

                const sendEstimateButton = screen.getByTestId('loading-button-test-id');

                fireEvent.click(sendEstimateButton);

                await act(async () => {
                    screen.debug();


                });
            });
        });

        /*
    it('handles negative action correctly', () => {
            const mockDispatch = jest.fn();
            const mockDispatchPromise = Promise.resolve();
            const mockUnwrap = jest.fn().mockReturnValue(mockDispatchPromise);
            const mockAddSuccess = jest.spyOn(appStateActions, 'addSuccess');
            const mockSetOpen = jest.fn();
            const mockNavigateFn = jest.fn();
            const mockExternalDispatchResolve = jest.fn().mockImplementation(() => Promise.resolve(mockDispatch) );
            const mockExternalDispatchRejected = jest.fn().mockImplementation(() => Promise.reject(mockDispatch) );

            const {getByText} = render(<BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<ActualEstimateCard {...propsDraftEstimate}/>}/>
                </Routes>
            </BrowserRouter>);

            const negativeButton = screen.getByText('actual-estimate.card.button.send-estimate');
            fireEvent.click(negativeButton);

           // expect(mockSetOpen).toHaveBeenCalledWith(0);
        });



    it('handles positive action correctly', async () => {
        const mockDispatch = jest.fn();
        const mockDispatchPromise = Promise.resolve();
        const mockUnwrap = jest.fn().mockReturnValue(mockDispatchPromise);
        const mockAddSuccess = jest.spyOn(appStateActions, 'addSuccess');
        const mockSetOpen = jest.fn();
        const mockNavigateFn = jest.fn();
        const mockExternalDispatchResolve = jest.fn().mockImplementation(() => Promise.resolve(mockDispatch) );
        const mockExternalDispatchRejected = jest.fn().mockImplementation(() => Promise.reject(mockDispatch) );

        const screen= render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <ActualEstimateCard {...propsDraftEstimate} />
                </MemoryRouter>
            </Provider>
        );
        await act(async () => {
            const sendEstimateButton = screen.getByTestId('loading-button-test-id');
            fireEvent.click(sendEstimateButton);

            // Simulate positive action
            await act(async () => {
                const positiveButton : SendEstimateDialog=
                    screen.getByTestId('dialog-send-estimate-test-id');
                fireEvent.click(positiveButton.onclickPositive);

                await mockDispatchPromise; // Wait for the dispatch to resolve

                expect(mockDispatch).toHaveBeenCalledWith(
                    validatedEstimate({
                        paId: propsDraftEstimate.paId,
                        referenceMonth: propsDraftEstimate.data.referenceMonth
                    })
                );
                expect(mockUnwrap).toHaveBeenCalled();
                expect(mockAddSuccess).toHaveBeenCalledWith({
                    title: 'Success Title',
                    message: 'Success Message'
                });
                expect(mockSetOpen).toHaveBeenCalledWith(false);
            });
        });
    });

    */
});





