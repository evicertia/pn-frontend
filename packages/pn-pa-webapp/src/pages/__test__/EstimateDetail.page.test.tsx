import {act, cleanup, fireEvent, render, screen, waitFor} from "@testing-library/react";
import * as reactRedux from "../../redux/hooks";
import {EstimateDetailPage} from "../EstimateDetail.page";
import {EstimateStatusEnum} from "../../models/UsageEstimation";
import {BrowserRouter, MemoryRouter, Route, Routes} from "react-router-dom";
import * as routes from "../../navigation/routes.const";


const mockDispatchFn = jest.fn();
const spyOnDispatch = jest.spyOn(reactRedux, "useAppDispatch");
const spyOnSelector = jest.spyOn(reactRedux, "useAppSelector");

const mockingStore = (estimateDetailStore = { }, filesReportsStore = {}, userStore= { }, errorStore= undefined) => {
  const reduxStore = {
    usageEstimateState: {
      detail: estimateDetailStore,
      error: errorStore,
    },
    fileReportsEstimateState: {
      filesReports: filesReportsStore,
      fileReportUrl: undefined
    },
    userState: {
      user: userStore
    }
  } as any

  spyOnSelector.mockImplementation((selector) => selector(reduxStore))
}

const ReceivedStatusVALIDATED = () => {
  const stateEstimateDetail = {
    paInfo: "acn21kfmw03kdxkm0394123ffds",
    status: EstimateStatusEnum.VALIDATED,
    showEdit: true,
    deadlineDate: "2023-06-15T23:59:00.000+00:00",
    referenceMonth: "LUG-2023",
    lastModifiedDate: "",
    estimate: {
      total890Notif: 0,
      totalAnalogNotif: 0,
      totalDigitalNotif: 0
    },
    billing: {
      sdiCode: "",
      splitPayment: false,
      description: "",
      mailAddress: ""
    }
  };

  const stateFilesReports = {
    paId: "026e8c72-7944-4dcd-8668-f596447fec6d",
    reportKey: "report_compressed.zip",
    reportZipKey: null,
    url: null,
    referenceMonth: "LUG-2023",
    lastModifiedDate: null,
    errorMessage: null,
    generationDate: null,
    part: null,
    status: null
  };

  mockingStore(stateEstimateDetail, stateFilesReports, stateUser);
  return (
    <MemoryRouter>
      <EstimateDetailPage />
    </MemoryRouter>
  );
};


const ReceivedRestError404 = () => {
  const stateEstimateDetail = {
    paInfo: "acn21kfmw03kdxkm0394123ffds",
    status: EstimateStatusEnum.VALIDATED,
    showEdit: null,
    deadlineDate: null,
    referenceMonth: "LUG-2023",
    lastModifiedDate: null,
    estimate: {
      total890Notif: null,
      totalAnalogNotif: null,
      totalDigitalNotif: null
    },
    billing: {
      sdiCode: null,
      splitPayment: false,
      description: null,
      mailAddress: null
    }
  };

  const stateFilesReports = {
    paId: "026e8c72-7944-4dcd-8668-f596447fec6d",
    reportKey: null,
    reportZipKey: null,
    url: null,
    referenceMonth: "LUG-2023",
    lastModifiedDate: null,
    errorMessage: null,
    generationDate: null,
    part: null,
    status: null
  };

  mockingStore(stateEstimateDetail, stateFilesReports, stateUser, 404);
  return (<EstimateDetailPage />);
};

const ReceivedRestError503 = () => {
  const stateEstimateDetail = {
    paInfo: "acn21kfmw03kdxkm0394123ffds",
    status: EstimateStatusEnum.VALIDATED,
    showEdit: null,
    deadlineDate: null,
    referenceMonth: "LUG-2023",
    lastModifiedDate: null,
    estimate: {
      total890Notif: null,
      totalAnalogNotif: null,
      totalDigitalNotif: null
    },
    billing: {
      sdiCode: null,
      splitPayment: false,
      description: null,
      mailAddress: null
    }
  };

  const stateFilesReports = {
    paId: "026e8c72-7944-4dcd-8668-f596447fec6d",
    reportKey: null,
    reportZipKey: null,
    url: null,
    referenceMonth: "LUG-2023",
    lastModifiedDate: null,
    errorMessage: null,
    generationDate: null,
    part: null,
    status: null
  };

  mockingStore(stateEstimateDetail, stateFilesReports, stateUser, 503);
  return (
    <MemoryRouter>
      <EstimateDetailPage />
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

describe("EstimateDetail.page.test", () => {
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
      expect(mockDispatchFn).toBeCalledTimes(2);
    })
  });


  it("whenReceivedRestError404", async () => {
    render(<BrowserRouter >
      <Routes>
        <Route path={"/"} element={<ReceivedRestError404/>}/>
        <Route path={routes.ESTIMATE} element={<h1 data-testid={"estimate-page"}>Estimate page route</h1>}/>
      </Routes>
    </BrowserRouter>);

    await act(async () => {
      expect(location.pathname).toEqual(routes.ESTIMATE);
      expect(screen.getByTestId("estimate-page")).toBeInTheDocument()
      expect(mockDispatchFn).toBeCalledTimes(3);
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
        expect(mockDispatchFn).toBeCalledTimes(4);
      })
    })
  });
});