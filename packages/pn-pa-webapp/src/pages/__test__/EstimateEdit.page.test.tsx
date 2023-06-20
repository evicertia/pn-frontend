import * as React from 'react'
import * as reactRedux from "../../redux/hooks";
import {act, cleanup, fireEvent, render, screen} from "@testing-library/react";
import {EstimateEditPage} from "../EstimateEdit.page";
import {EstimatePeriod, EstimateStatusEnum} from "../../models/UsageEstimation";
import * as routes from "../../navigation/routes.const";
import {BrowserRouter, Route, Routes} from "react-router-dom";


const mockDispatchFn = jest.fn();
const spyOnDispatch = jest.spyOn(reactRedux, "useAppDispatch");
const spyOnSelector = jest.spyOn(reactRedux, "useAppSelector");

const mockingStore = (estimateDetailStore = { }, userStore= { }, errorStore= undefined) => {
  const reduxStore = {
    usageEstimateState: {
      formData: estimateDetailStore,
      error: errorStore,
    },
    userState: {
      user: userStore
    }
  } as any

  spyOnSelector.mockImplementation((selector) => selector(reduxStore))
}

const ScenarioWithStatusAndError = (props:{status: EstimateStatusEnum; showEdit:boolean, emptyField: boolean, error?: number }) => {
  const stateFormData = {
    status: props.status,
    showEdit: props.showEdit,
    deadlineDate: "2023-06-15T23:59:00.000+00:00",
    referenceMonth: "LUG-2023",
    lastModifiedDate: (!props.emptyField) ? "2023-06-1T23:59:00.000+00:00" : undefined,
    estimate: {
      total890Notif: (props.emptyField) ? null : 100,
      totalAnalogNotif: (props.emptyField) ? null : 100,
      totalDigitalNotif: (props.emptyField) ? null : 100
    },
    billing: {
      splitPayment: (props.emptyField) ? null : true,
      description: (props.emptyField) ? null : "ABCDDDDD",
      mailAddress: (props.emptyField) ? null : "C.P@gmail.com"
    }
  } as EstimatePeriod;

  mockingStore(stateFormData, stateUser, props.error);
  return (
    <BrowserRouter >
      <Routes>
        <Route path={"/"} element={<EstimateEditPage/>}/>
        <Route path={routes.ESTIMATE} element={<h1 data-testid={"estimate-page"}>Estimate page route</h1>}/>
      </Routes>
    </BrowserRouter>
  );
};

const stateUser = {
  sessionToken: "",
  name: "",
  family_name: "",
  fiscal_number: "",
  email: "",
  uid: ""
};


jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => jest.fn(),
  // useNavigate: () => mockNavigateFn
}));

jest.mock('@pagopa-pn/pn-commons', () => ({
  ...jest.requireActual('@pagopa-pn/pn-commons'),
  useIsMobile: () => false,
}));

jest.mock("../components/UsageEstimates/Estimate/form/Estimate.form",
 () => ({
   EstimateForm: (props:{detail:{}, onEstimateValidated: () => void}) => {
     // @ts-ignore
     return <button data-testid="estimate-form-mock" onClick={props.onEstimateValidated}>Salva</button>;
   },
 })
);

describe("EstimateEdit.page.test", () => {

  beforeEach(() => {
    spyOnDispatch.mockReturnValue(mockDispatchFn);
    window.history.pushState({}, '', '/');
  });

  afterEach(() => {
    cleanup()
    spyOnSelector.mockClear()
    spyOnSelector.mockReset()
    spyOnDispatch.mockClear()
    spyOnDispatch.mockReset()
  });

  it("whenReceivedStatusDRAFTAndShowEditAndNoFieldThenShowEditPage", async () => {
    render(<ScenarioWithStatusAndError status={"DRAFT"} showEdit={true} emptyField={true}/>);

    await act(async () => {
      expect(mockDispatchFn).toBeCalledTimes(1);
    })
  });

  it("whenReceivedRestError404ThenGoBackOnTableEstimate", async () => {
    render(<ScenarioWithStatusAndError status={"DRAFT"} showEdit={true} emptyField={true} error={404}/> );

    await act(async () => {
      expect(location.pathname).toEqual(routes.ESTIMATE);
      expect(screen.getByTestId("estimate-page")).toBeInTheDocument()
      expect(mockDispatchFn).toBeCalledTimes(1);
    })
  });

  it("whenReceivedShowEditFalseThenGoBackOnTableEstimate", async () => {

    render(<ScenarioWithStatusAndError status={"VALIDATED"} showEdit={false} emptyField={false}/>);

    await act(async () => {
      expect(location.pathname).toEqual(routes.ESTIMATE);
      expect(screen.getByTestId("estimate-page")).toBeInTheDocument()
      expect(mockDispatchFn).toBeCalledTimes(1);
    })
  });


  it("whenReceivedStatusABSENTThenGoBackOnTableEstimate", async () => {
    render(<ScenarioWithStatusAndError status={"ABSENT"} showEdit={false} emptyField={true}/>);
      await act(async () => {
        expect(location.pathname).toEqual(routes.ESTIMATE);
        expect(screen.getByTestId("estimate-page")).toBeInTheDocument()
        expect(mockDispatchFn).toBeCalledTimes(1);
      })
  });

  it("whenReceivedStatusABSENTAndShowEditThenGoBackOnTableEstimate", async () => {
    render(<ScenarioWithStatusAndError status={"ABSENT"} showEdit={true} emptyField={true}/>);
      await act(async () => {
        expect(location.pathname).toEqual(routes.ESTIMATE);
        expect(screen.getByTestId("estimate-page")).toBeInTheDocument()
        expect(mockDispatchFn).toBeCalledTimes(1);
      })
  });

  it("whenReceivedRestError503ThenShowRetryGetDetail", async () => {
    render(<ScenarioWithStatusAndError status={"DRAFT"} showEdit={true} emptyField={false} error={503}/>);

    const apiErrorReloadButton = screen.getByText("Ricarica");

    expect(apiErrorReloadButton).toBeInTheDocument();

    fireEvent.click(apiErrorReloadButton);
    fireEvent.blur(apiErrorReloadButton)

    expect(mockDispatchFn).toBeCalledTimes(2);
  });

  it("whenValidatedWithOKThenShowToastAndGoBackOnTableEstimate", async () => {
    render(<ScenarioWithStatusAndError status={"VALIDATED"} showEdit={true} emptyField={false} />);

    const formScreenButton = screen.getByTestId("estimate-form-mock");
    expect(formScreenButton).toBeInTheDocument();

    fireEvent.click(formScreenButton);

    await act(async () => {
      expect(mockDispatchFn).toBeCalledWith({
        type: "appState/addSuccess",
        payload: {
          title: 'edit-estimate.toast-message.success.title',
          message: 'edit-estimate.toast-message.success.message',
        }
      })
      expect(location.pathname).toEqual(routes.ESTIMATE);
      expect(screen.getByTestId("estimate-page")).toBeInTheDocument()
      expect(mockDispatchFn).toBeCalledTimes(2);
    })
  });

});