import * as React from 'react'
import * as reactRedux from "../../redux/hooks";
import {act, cleanup, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {EstimateEditPage} from "../EstimateEdit.page";
import {EstimateStatusEnum} from "../../models/UsageEstimation";
import {MemoryRouter} from "react-router-dom";
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

const ReceivedStatusDRAFT = () => {
  const stateEstimateDetail = {
    status: EstimateStatusEnum.DRAFT,
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

  mockingStore(stateEstimateDetail, stateUser);
  return (
    <MemoryRouter>
      <EstimateEditPage />
    </MemoryRouter>
  );
};


const ReceivedShowEditFalse = () => {
  const stateEstimateDetail = {
    status: EstimateStatusEnum.DRAFT,
    showEdit: false,
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

  mockingStore(stateEstimateDetail, stateUser);
  return (<EstimateEditPage />);
};

const ReceivedRestError404 = () => {
  const stateEstimateDetail = {
    status: EstimateStatusEnum.DRAFT,
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

  mockingStore(stateEstimateDetail, stateUser, 404);
  return (<EstimateEditPage />);
};

const ReceivedStatusVALIDATED = () => {
  const stateEstimateDetail = {
    status: EstimateStatusEnum.VALIDATED,
    showEdit: true,
    deadlineDate: "2023-06-15T23:59:00.000+00:00",
    referenceMonth: "LUG-2023",
    lastModifiedDate: "2023-06-10T06:00:00.000+00:00",
    estimate: {
      total890Notif: 5,
      totalAnalogNotif: 5,
      totalDigitalNotif: 10
    },
    billing: {
      sdiCode: "3kdxkm039",
      splitPayment: false,
      description: "Lorem ipsum",
      mailAddress: "test@test.com"
    }
  };

  mockingStore(stateEstimateDetail, stateUser);
  return (<EstimateEditPage />);
};

const ReceivedStatusABSENT = () => {
  const stateEstimateDetail = {
    status: EstimateStatusEnum.ABSENT,
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

  mockingStore(stateEstimateDetail, stateUser);
  return (<EstimateEditPage />);
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

  mockingStore(stateEstimateDetail, stateUser, 503);
  return (
    <MemoryRouter>
      <EstimateEditPage />
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

// jest.mock("../components/UsageEstimates/form/Estimate.form",
//   () => ({
//     EstimateForm: () => {
//       // @ts-ignore
//       return <mock-table data-testid="estimate-form-mock" />;
//     },
//   })
// );

describe("EstimateEdit.page.test", () => {
  // Implementation
  // const setStateMocked = jest.fn()
  // const useStateMock: any = (useState: any) => [useState, setStateMocked]
  // jest.spyOn(React, 'useState').mockImplementation(useStateMock)
  // const [selectedMock, setSelectedMock] = useStateMock([routes.ESTIMATE])

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

  it("whenReceivedStatusDRAFT", async () => {
    render(<ReceivedStatusDRAFT/>);

    await act(async () => {
      expect(mockDispatchFn).toBeCalledTimes(1);
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
      expect(mockDispatchFn).toBeCalledTimes(1);
    })
  });

  // it("whenReceivedShowEditFalse", async () => {
  //   render(<BrowserRouter >
  //     <Routes>
  //       <Route path={"/"} element={<ReceivedShowEditFalse/>}/>
  //       <Route path={routes.ESTIMATE} element={<h1 data-testid={"estimate-page"}>Estimate page route</h1>}/>
  //     </Routes>
  //   </BrowserRouter>);
  //
  //   await act(async () => {
  //     expect(location.pathname).toEqual(routes.ESTIMATE);
  //     expect(screen.getByTestId("estimate-page")).toBeInTheDocument()
  //     expect(mockDispatchFn).toBeCalledTimes(1);
  //   })
  // });

  // it("whenReceivedStatusVALIDATED", async () => {
  //   render(<BrowserRouter >
  //     <Routes>
  //       <Route path={"/"} element={<ReceivedStatusVALIDATED/>}/>
  //       <Route path={routes.ESTIMATE} element={<h1 data-testid={"estimate-page"}>Estimate page route</h1>}/>
  //     </Routes>
  //   </BrowserRouter>);
  //
  //   await act(async () => {
  //     expect(location.pathname).toEqual(routes.ESTIMATE);
  //     expect(screen.getByTestId("estimate-page")).toBeInTheDocument()
  //     expect(mockDispatchFn).toBeCalledTimes(1);
  //   })
  // });

  // it("whenReceivedStatusABSENT", async () => {
  //   render(<BrowserRouter >
  //     <Routes>
  //       <Route path={"/"} element={<ReceivedStatusABSENT/>}/>
  //       <Route path={routes.ESTIMATE} element={<h1 data-testid={"estimate-page"}>Estimate page route</h1>}/>
  //     </Routes>
  //   </BrowserRouter>);
  //
  //   await act(async () => {
  //     expect(location.pathname).toEqual(routes.ESTIMATE);
  //     expect(screen.getByTestId("estimate-page")).toBeInTheDocument()
  //     expect(mockDispatchFn).toBeCalledTimes(1);
  //   })
  // });

  // it("whenReceivedRestError503", async () => {
  //   render(<ReceivedRestError503 />);
  //
  //   await act(async () => {
  //     const apiErrorReloadButton = screen.getByText("Ricarica");
  //     expect(apiErrorReloadButton).toBeInTheDocument();
  //
  //     fireEvent.click(apiErrorReloadButton);
  //     fireEvent.blur(apiErrorReloadButton)
  //
  //     await waitFor(async () => {
  //       expect(mockDispatchFn).toBeCalledTimes(2);
  //     })
  //   })
  // });
});