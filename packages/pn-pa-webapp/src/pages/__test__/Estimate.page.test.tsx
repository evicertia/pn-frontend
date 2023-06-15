import * as reactRedux from "../../redux/hooks";
import {cleanup, screen, render, fireEvent, act} from "@testing-library/react";
import * as React from "react";
import {EstimatePage} from "../Estimate.page";
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


jest.mock("../components/UsageEstimates/actualEstimateCard/ActualEstimateCard",
  () => ({
    ActualEstimateCard: () => {
      // @ts-ignore
      return <mock-component data-testid="actual-estimate-card" />;
    },
  })
);

jest.mock("../components/UsageEstimates/historyTable/HistoryTable",
  () => ({
    HistoryTable: () => {
      // @ts-ignore
      return <mock-component data-testid="desktop-history-table" />;
    },
  })
);

jest.mock("../components/UsageEstimates/historyTable/MobileHistoryTable",
  () => ({
    MobileHistoryTable: () => {
      // @ts-ignore
      return <mock-component data-testid="mobile-history-table" />;
    },
  })
);



describe("Estimate.page.test", () => {

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

    render(<ScenarioEstimates isMobile={true} emptyState={false}/>);

    const mobileTable = screen.getByTestId("mobile-history-table");
    expect(mobileTable).toBeInTheDocument();

    const actualCard = screen.getByTestId("actual-estimate-card");
    expect(actualCard).toBeInTheDocument();

  });

  it("whenShowPageOnDesktopDeviceThenShowDesktopHistoryTable", async () => {

    render(<ScenarioEstimates isMobile={false} emptyState={false}/>);

    const mobileTable = screen.getByTestId("desktop-history-table");
    expect(mobileTable).toBeInTheDocument();

    const actualCard = screen.getByTestId("actual-estimate-card");
    expect(actualCard).toBeInTheDocument();

  });

  it("whenStateEmptyThenNotShowActualCardAndTable", async () => {

    render(<ScenarioEstimates isMobile={false} emptyState={true}/>);

    const mobileTable = screen.queryByTestId("mobile-history-table");
    expect(mobileTable).not.toBeInTheDocument();

    const actualCard = screen.queryByTestId("actual-estimate-card");
    expect(actualCard).not.toBeInTheDocument();

  });

  it("whenChangePageThenRetrieveNewData", async () => {

    render(<ScenarioEstimates isMobile={false} emptyState={false}/>);

    const changePage = screen.getByTestId("simulate-change-page");
    expect(changePage).toBeInTheDocument();

    fireEvent.click(changePage);
    await act(async () => {

      expect(mockDispatchFn).toBeCalledTimes(2);
      expect(mockDispatchFn).toBeCalledWith({
        type: "usageEstimateSlice/setPagination",
        payload: {
          size: 10,
          page: 3
        }
      })
    });

    // const changeSize = screen.getByTestId("simulate-tracking-page-size");
    // expect(changeSize).toBeInTheDocument();
    // fireEvent.click(changeSize);
    // await act(async () => {
    //   expect(mockDispatchFn).toBeCalledTimes(3);
    //   expect(mockDispatchFn).toBeCalledWith({
    //     type: "usageEstimateSlice/setPagination",
    //     payload: {
    //       size: 10,
    //       page: 1
    //     }
    //   })
    // });

  });

});


const mockDispatchFn = jest.fn();
const spyOnDispatch = jest.spyOn(reactRedux, "useAppDispatch");
const spyOnSelector = jest.spyOn(reactRedux, "useAppSelector");
const spyOnIsMobile = jest.spyOn(hookMobile, "useIsMobile");

const mockingStore = (historyEstimates = { }, page: number, size: number) => {
  const reduxStore = {
    usageEstimateState: {
      historyEstimates: historyEstimates,
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

const ScenarioEstimates = (props: {isMobile: boolean, emptyState: boolean}) => {

  spyOnIsMobile.mockReturnValue(props.isMobile);

  const history = {
    actual: {
      status: EstimateStatusEnum.VALIDATED,
      showEdit: true,
      deadlineDate: "2023-06-08",
      referenceMonth: "MAR-2023",
      lastModifiedDate: "2023-06-08",
      estimate: {
        totalDigitalNotif: 100,
        total890Notif: 100,
        totalAnalogNotif: 100,
      },
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

  return <EstimatePage />
}

