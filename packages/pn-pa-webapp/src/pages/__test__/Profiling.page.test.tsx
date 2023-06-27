import * as reactRedux from "../../redux/hooks";
import {cleanup, screen, render, fireEvent, act} from "@testing-library/react";
import * as React from "react";
import {ProfilingPage} from "../Profiling.page";
import {EstimateStatusEnum} from "../../models/UsageEstimation";
import * as hookMobile from "@pagopa-pn/pn-commons/src/hooks/useIsMobile";

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

jest.mock('@pagopa-pn/pn-commons/src/components/ApiError/ApiErrorWrapper', () => (
  (props: {children}) => {
    return <div>{props.children}</div>
  }
));

jest.mock('@pagopa-pn/pn-commons/src/components/Pagination/CustomPagination', () => (
  (props: {onPageRequest, eventTrackingCallbackPageSize}) => {
    return <div>
      <button onClick={() => props.onPageRequest({size: 10, page:2})}
              data-testid={"simulate-change-page"}>
        ChangePage
      </button>
      <button onClick={() => props.eventTrackingCallbackPageSize(10)}
              data-testid={"simulate-tracking-page-size"}>
        HandelTrackingCallback
      </button>
    </div>
  }
));

jest.mock("../components/UsageEstimates/Profiling/actualProfilingCard/ActualProfilingCard",
  () => ({
    ActualProfilingCard: () => {
      // @ts-ignore
      return <mock-component data-testid="actual-profiling-card" />;
    },
  })
);

jest.mock("../components/UsageEstimates/Profiling/historyTable/ProfilingHistoryTable",
  () => ({
    ProfilingHistoryTable: () => {
      // @ts-ignore
      return <mock-component data-testid="desktop-history-table" />;
    },
  })
);

jest.mock("../components/UsageEstimates/Profiling/historyTable/ProfilingMobileHistoryTable",
  () => ({
    ProfilingMobileHistoryTable: () => {
      // @ts-ignore
      return <mock-component data-testid="mobile-history-table" />;
    },
  })
);



describe("Profiling.page.test", () => {

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


  it("whenShowPageOnMobileDeviceThenShowMobileHistoryTable", async () => {
    render(<ScenarioProfilings isMobile={true} emptyState={false}/>);

    const mobileTable = screen.getByTestId("mobile-history-table");
    expect(mobileTable).toBeInTheDocument();

    const actualCard = screen.getByTestId("actual-profiling-card");
    expect(actualCard).toBeInTheDocument();
  });

  it("whenShowPageOnDesktopDeviceThenShowDesktopHistoryTable", async () => {
    render(<ScenarioProfilings isMobile={false} emptyState={false}/>);

    const mobileTable = screen.getByTestId("desktop-history-table");
    expect(mobileTable).toBeInTheDocument();

    const actualCard = screen.getByTestId("actual-profiling-card");
    expect(actualCard).toBeInTheDocument();
  });

  it("whenStateEmptyThenNotShowActualCardAndTable", async () => {
    render(<ScenarioProfilings isMobile={false} emptyState={true}/>);

    const mobileTable = screen.queryByTestId("mobile-history-table");
    expect(mobileTable).not.toBeInTheDocument();

    const actualCard = screen.queryByTestId("actual-profiling-card");
    expect(actualCard).not.toBeInTheDocument();
  });

  it("whenChangePageThenRetrieveNewData", async () => {
    render(<ScenarioProfilings isMobile={false} emptyState={false}/>);

    const changePage = screen.getByTestId("simulate-change-page");
    expect(changePage).toBeInTheDocument();

    fireEvent.click(changePage);
    await act(async () => {
      expect(mockDispatchFn).toBeCalledTimes(2);
      expect(mockDispatchFn).toBeCalledWith({
        type: "profilingSlice/setPagination",
        payload: {
          size: 10,
          page: 3
        }
      })
    });
  });
});

const mockDispatchFn = jest.fn();
const spyOnDispatch = jest.spyOn(reactRedux, "useAppDispatch");
const spyOnSelector = jest.spyOn(reactRedux, "useAppSelector");
const spyOnIsMobile = jest.spyOn(hookMobile, "useIsMobile");

const mockingStore = (historyProfilings = { }, page: number, size: number) => {
  const reduxStore = {
    profilingState: {
      historyProfilings: historyProfilings,
      pagination: {
        page: page,
        size: size,
      }
    },
    userState: {
      user: {
        organization: {
          id: "PA_ID_1234"
        },
        sessionToken: "",
        name: "",
        family_name: "",
        fiscal_number: "",
        email: "",
        uid: ""
      }
    }
  } as any

  spyOnSelector.mockImplementation((selector) => selector(reduxStore))
}

const ScenarioProfilings = (props: {isMobile: boolean, emptyState: boolean}) => {
  spyOnIsMobile.mockReturnValue(props.isMobile);

  const history = {
    actual: {
      status: EstimateStatusEnum.VALIDATED,
      showEdit: true,
      deadlineDate: "2023-06-08",
      referenceYear: "2023",
      lastModifiedDate: "2023-06-08",
      billing: {
        splitPayment: true,
        description: "ABC",
        mailAddress: "mario.rossi@gmail.com"
      }
    },
    history: {
      'number' : 0,
      size: 0,
      totalElements: 0,
      content: []
    }
  }

  mockingStore((props.emptyState) ? {} : history, 1, 10);

  return <ProfilingPage />
}