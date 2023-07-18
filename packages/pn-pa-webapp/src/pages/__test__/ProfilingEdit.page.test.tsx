import * as React from 'react'
import * as reactRedux from "../../redux/hooks";
import {act, cleanup, fireEvent, render, screen} from "@testing-library/react";
import {EstimatePeriod, EstimateStatusEnum, ProfilingPeriod} from "../../models/UsageEstimation";
import * as routes from "../../navigation/routes.const";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ProfilingEditPage} from "../ProfilingEdit.page";
import {EstimateEditPage} from "../EstimateEdit.page";


const mockDispatchFn = jest.fn();
const spyOnDispatch = jest.spyOn(reactRedux, "useAppDispatch");
const spyOnSelector = jest.spyOn(reactRedux, "useAppSelector");

const mockingStore = (profilingDetailStore = { }, userStore= { }, errorStore= undefined) => {
  const reduxStore = {
    profilingState: {
      formData: profilingDetailStore,
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
    deadlineDate: (!props.emptyField) ? "2023-06-15T23:59:00.000+00:00" : undefined,
    referenceYear: (!props.emptyField) ? "2023" : undefined,
    lastModifiedDate: (!props.emptyField) ? "2023-06-1T23:59:00.000+00:00" : undefined,
    profilation: {
      splitPayment: (props.emptyField) ? null : true,
      description: (props.emptyField) ? null : "ABCDDDDD",
      mailAddress: (props.emptyField) ? null : "C.P@gmail.com"
    }
  } as ProfilingPeriod;

  mockingStore(stateFormData, stateUser, props.error);
  return (
    <BrowserRouter >
      <Routes>
        <Route path={"/"} element={<ProfilingEditPage/>}/>
        <Route path={routes.PROFILING} element={<h1 data-testid={"profiling-page"}>Profiling page route</h1>}/>
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

jest.mock("../components/UsageEstimates/Profiling/form/Profiling.form",
  () => ({
    ProfilingForm: (props:{detail:{}, onProfilingValidated: () => void}) => {
      // @ts-ignore
      return <button data-testid="profiling-form-mock" onClick={props.onProfilingValidated}>Salva</button>;
    },
  })
);

describe("ProfilingEdit.page.test", () => {

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

  it("whenReceivedRestError404ThenGoBackOnTableProfiling", async () => {
    render(<ScenarioWithStatusAndError status={"DRAFT"} showEdit={true} emptyField={true} error={404}/> );

    await act(async () => {
      expect(location.pathname).toEqual(routes.PROFILING);
      expect(screen.getByTestId("profiling-page")).toBeInTheDocument()
      expect(mockDispatchFn).toBeCalledTimes(1);
    })
  });

  it("whenReceivedShowEditFalseThenGoBackOnTableProfiling", async () => {

    render(<ScenarioWithStatusAndError status={"VALIDATED"} showEdit={false} emptyField={false}/>);

    await act(async () => {
      expect(location.pathname).toEqual(routes.PROFILING);
      expect(screen.getByTestId("profiling-page")).toBeInTheDocument()
      expect(mockDispatchFn).toBeCalledTimes(1);
    })
  });


  it("whenReceivedStatusABSENTThenGoBackOnTableProfiling", async () => {
    render(<ScenarioWithStatusAndError status={"ABSENT"} showEdit={false} emptyField={true}/>);
    await act(async () => {
      expect(location.pathname).toEqual(routes.PROFILING);
      expect(screen.getByTestId("profiling-page")).toBeInTheDocument()
      expect(mockDispatchFn).toBeCalledTimes(1);
    })
  });

  it("whenReceivedStatusABSENTAndShowEditThenGoBackOnTableProfiling", async () => {
    render(<ScenarioWithStatusAndError status={"ABSENT"} showEdit={true} emptyField={true}/>);
    await act(async () => {
      expect(location.pathname).toEqual(routes.PROFILING);
      expect(screen.getByTestId("profiling-page")).toBeInTheDocument()
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

  it("whenValidatedWithOKThenShowToastAndGoBackOnTableProfiling", async () => {
    render(<ScenarioWithStatusAndError status={"VALIDATED"} showEdit={true} emptyField={false} />);

    const formScreenButton = screen.getByTestId("profiling-form-mock");
    expect(formScreenButton).toBeInTheDocument();

    fireEvent.click(formScreenButton);

    await act(async () => {
      expect(mockDispatchFn).toBeCalledWith({
        type: "appState/addSuccess",
        payload: {
          title: 'toast-message.success.title',
          message: 'toast-message.success.message',
        }
      })
      expect(location.pathname).toEqual(routes.PROFILING);
      expect(screen.getByTestId("profiling-page")).toBeInTheDocument()
      expect(mockDispatchFn).toBeCalledTimes(2);
    })
  });

});