import {act, cleanup, fireEvent, render, screen, waitFor} from "@testing-library/react";
import * as reactRedux from "../../redux/hooks";
import {ProfilingDetailPage} from "../ProfilingDetail.page";
import {EstimateStatusEnum} from "../../models/UsageEstimation";
import {BrowserRouter, MemoryRouter, Route, Routes} from "react-router-dom";
import * as routes from "../../navigation/routes.const";


const mockDispatchFn = jest.fn();
const spyOnDispatch = jest.spyOn(reactRedux, "useAppDispatch");
const spyOnSelector = jest.spyOn(reactRedux, "useAppSelector");

const mockingStore = (profilingDetailStore = { }, userStore= { }, errorStore= undefined) => {
  const reduxStore = {
    profilingState: {
      detail: profilingDetailStore,
      error: errorStore,
    },
    userState: {
      user: userStore
    }
  } as any

  spyOnSelector.mockImplementation((selector) => selector(reduxStore))
}

const ReceivedStatusVALIDATED = () => {
  const stateProfilingDetail = {
    paInfo: "acn21kfmw03kdxkm0394123ffds",
    status: EstimateStatusEnum.VALIDATED,
    showEdit: true,
    deadlineDate: "2023-06-15T23:59:00.000+00:00",
    referenceYear: "2023",
    lastModifiedDate: "",
    billing: {
      sdiCode: "",
      splitPayment: false,
      description: "",
      mailAddress: ""
    }
  };

  mockingStore(stateProfilingDetail, stateUser);
  return (
    <MemoryRouter>
      <ProfilingDetailPage />
    </MemoryRouter>
  );
};


const ReceivedRestError404 = () => {
  const stateProfilingDetail = {
    paInfo: "acn21kfmw03kdxkm0394123ffds",
    status: EstimateStatusEnum.VALIDATED,
    showEdit: null,
    deadlineDate: null,
    referenceYear: "2023",
    lastModifiedDate: null,
    billing: {
      sdiCode: null,
      splitPayment: false,
      description: null,
      mailAddress: null
    }
  };

  mockingStore(stateProfilingDetail, stateUser, 404);
  return (<ProfilingDetailPage />);
};

const ReceivedRestError503 = () => {
  const stateProfilingDetail = {
    paInfo: "acn21kfmw03kdxkm0394123ffds",
    status: EstimateStatusEnum.VALIDATED,
    showEdit: null,
    deadlineDate: null,
    referenceYear: "2023",
    lastModifiedDate: null,
    billing: {
      sdiCode: null,
      splitPayment: false,
      description: null,
      mailAddress: null
    }
  };

  mockingStore(stateProfilingDetail, stateUser, 503);
  return (
    <MemoryRouter>
      <ProfilingDetailPage />
    </MemoryRouter>
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

jest.mock('@pagopa-pn/pn-commons', () => ({
  useIsMobile: () => jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => jest.fn(),
  // useNavigate: () => mockNavigateFn
}));

jest.mock('@pagopa-pn/pn-commons', () => ({
  ...jest.requireActual('@pagopa-pn/pn-commons')
}));

describe("ProfilingDetail.page.test", () => {
  beforeEach(() => {
    spyOnDispatch.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    cleanup()
    spyOnSelector.mockClear()
    spyOnSelector.mockReset()
    spyOnDispatch.mockClear()
    spyOnDispatch.mockReset()
  });


  it("whenReceivedStatusVALIDATED", async () => {
    render(<ReceivedStatusVALIDATED/>);

    await act(async () => {
      expect(mockDispatchFn).toBeCalledTimes(1);
    })
  });


  it("whenReceivedRestError404", async () => {
    render(<BrowserRouter >
      <Routes>
        <Route path={"/"} element={<ReceivedRestError404/>}/>
        <Route path={routes.PROFILING} element={<h1 data-testid={"profiling-page"}>Profiling page route</h1>}/>
      </Routes>
    </BrowserRouter>);

    await act(async () => {
      expect(location.pathname).toEqual(routes.PROFILING);
      expect(screen.getByTestId("profiling-page")).toBeInTheDocument()
      expect(mockDispatchFn).toBeCalledTimes(2);
    })
  });

  it("whenReceivedRestError503", async () => {
    render(<ReceivedRestError503 />);

    await act(async () => {
      const apiErrorReloadButton = screen.getByText("Ricarica");
      expect(apiErrorReloadButton).toBeInTheDocument();

      fireEvent.click(apiErrorReloadButton);
      fireEvent.blur(apiErrorReloadButton)

      await waitFor(async () => {
        expect(mockDispatchFn).toBeCalledTimes(2);
      })
    })
  });
});