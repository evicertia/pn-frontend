import {act, cleanup, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {ActualProfilingCard} from "../ActualProfilingCard";
import {BillingDetail, EstimateStatusEnum, ProfilingPeriod} from "../../../../../../models/UsageEstimation";
import {GET_EDIT_PROFILING_PATH} from "../../../../../../navigation/routes.const";
import * as reactRedux from "../../../../../../redux/hooks";
import {useAppDispatch} from "../../../../../../redux/hooks";


const mockNavigateFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

const spyOnSelector = jest.spyOn(reactRedux, "useAppSelector");

describe('ActualProfilingCardTest', () => {
  let mockDispatchFn: jest.Mock;
  const useDispatchSpy = jest.spyOn(reactRedux, 'useAppDispatch');

  afterEach(() => {
    cleanup()
    spyOnSelector.mockClear()
    spyOnSelector.mockReset()
  });

  beforeEach(() => {
    mockDispatchFn = buildDispatch(false)
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
  });


  it('Profiling status equals DRAFT and details profiling are not present', async () => {
    const profiling = getProfilingPeriod("DRAFT", true);
    render(<ActualProfilingCard paId={"1234"} data={profiling}/>);

    await act(async () => {
      expect(screen.getByTestId("testIdTagEditDate")).toBeInTheDocument();
      expect(screen.getByTestId("testIdTagEditDate")).toHaveStyle('background-color: #EEEEEE');
    });

    const profilingButton = screen.getByTestId("create-button-test-id");
    fireEvent.click(profilingButton);

    await act(async () => {
      expect(mockNavigateFn).toBeCalledTimes(1)
      expect(mockNavigateFn).toBeCalledWith(GET_EDIT_PROFILING_PATH(profiling.referenceYear));
    });
  });

  it('Profiling status equals DRAFT and details profiling is present', async () => {
    const bill: BillingDetail = {
      sdiCode: "ABCDE12345",
      splitPayment: false,
      description: "string",
      mailAddress: "test@test.com",
    }

    const profiling = getProfilingPeriod("DRAFT", true, bill);
    render(<ActualProfilingCard paId={"1234"} data={profiling}/>);

    const chipInfo = screen.getByTestId("chip-info");

    await act(async () => {
      expect(screen.getByTestId("testIdTagEditDate")).toBeInTheDocument();
      expect(screen.getByTestId("testIdTagEditDate")).toHaveStyle('background-color: #FFCB46');

      expect(chipInfo).toBeInTheDocument();
      expect(chipInfo).toHaveStyle('background-color: #0288d1');
    });

    const editDraftProfilingButton = screen.getByTestId("edit-draft-state-button");
    const validateDraftProfilingButton = screen.getByTestId("loading-button-test-id");

    expect(editDraftProfilingButton).toBeInTheDocument();
    expect(validateDraftProfilingButton).toBeInTheDocument();

    fireEvent.click(editDraftProfilingButton);

    await act(async () => {
      expect(mockNavigateFn).toBeCalledTimes(1)
      expect(mockNavigateFn).toBeCalledWith(GET_EDIT_PROFILING_PATH(profiling.referenceYear));
    });
  });

  it('Profiling status equals VALIDATED and showEdit is true', async () => {
    const bill: BillingDetail = {
      sdiCode: "ABCDE12345",
      splitPayment: false,
      description: "description",
      mailAddress: "test@test.com",
    }

    const profiling = getProfilingPeriod("VALIDATED", true, bill);
    render(<ActualProfilingCard paId={"1234"} data={profiling}/>);

    const chipInfo = screen.getByTestId("chip-success");
    await act(async () => {
      expect(screen.getByTestId("testIdTagEditDate")).toBeInTheDocument();
      expect(screen.getByTestId("testIdTagEditDate")).toHaveStyle('background-color: #FFCB46');

      expect(chipInfo).toBeInTheDocument();
      expect(chipInfo).toHaveStyle('background-color: #2e7d32');
    });

    const editValidateProfilingButton = screen.getByTestId("edit-validated-state-button");

    expect(editValidateProfilingButton).toBeInTheDocument();

    fireEvent.click(editValidateProfilingButton);

    await act(async () => {
      expect(mockNavigateFn).toBeCalledTimes(1)
      expect(mockNavigateFn).toBeCalledWith(GET_EDIT_PROFILING_PATH(profiling.referenceYear));
    });
  });

  it('Profiling status equals ABSENT and showEdit is true', async () => {
    const profiling = getProfilingPeriod("ABSENT", false);
    render(<ActualProfilingCard paId={"1234"} data={profiling}/>);

    expect(screen.queryByTestId("edit-validated-state-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("create-button-test-id")).not.toBeInTheDocument();
    expect(screen.queryByTestId("edit-draft-state-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("loading-button-test-id")).not.toBeInTheDocument();
  });

  it('When Profiling status is Draft and details is present then clicked on SendProfiling', async () => {
    const bill: BillingDetail = {
      sdiCode: "ABCDE12345",
      splitPayment: false,
      description: "string",
      mailAddress: "test@test.com",
    }

    const profiling = getProfilingPeriod("DRAFT", true, bill);
    render(<ActualProfilingCard paId={"1234"} data={profiling}/>);

    const validateDraftProfilingButton = screen.getByTestId("loading-button-test-id");
    expect(validateDraftProfilingButton).toBeInTheDocument();
    expect(screen.queryByText("dialog.send-dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("dialog.abort-dialog")).not.toBeInTheDocument();

    // open the confirmDialog
    fireEvent.click(validateDraftProfilingButton)

    let buttonSend  = screen.getByText("dialog.send-dialog");
    let buttonAbort = screen.getByText("dialog.abort-dialog");

    expect(buttonAbort).toBeInTheDocument();
    expect(buttonSend).toBeInTheDocument();

    fireEvent.click(buttonSend);

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(2);
      expect(mockDispatchFn).toBeCalledWith({
        payload: {
          message: "actual.toast-message.success.message",
          title: "actual.toast-message.success.title",
        },
        type: "appState/addSuccess"
      })
    })
  })

  it('When Profiling status is Draft and details is present then clicked on SendProfiling and Error with request', async () => {
    const bill: BillingDetail = {
      sdiCode: "ABCDE12345",
      splitPayment: false,
      description: "string",
      mailAddress: "test@test.com",
    }

    mockDispatchFn = buildDispatch(true)
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);

    const profiling = getProfilingPeriod("DRAFT", true, bill);

    render(<ActualProfilingCard paId={"1234"} data={profiling}/>);

    const validateDraftProfilingButton = screen.getByTestId("loading-button-test-id");
    expect(validateDraftProfilingButton).toBeInTheDocument();

    // open the confirmDialog
    fireEvent.click(validateDraftProfilingButton)
    let buttonSend  = screen.getByText("dialog.send-dialog");

    fireEvent.click(buttonSend);

    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(2);
      expect(mockDispatchFn).toBeCalledWith({
        payload: {
          message: "actual.toast-message.error.message",
          title: "actual.toast-message.error.title",
        },
        type: "appState/addError"
      })
    })
  })

});


const buildDispatch = (reject: boolean) => {
  return jest.fn(() => ({
    unwrap: () => (reject) ? Promise.reject(): Promise.resolve(),
  }));
}


const getProfilingPeriod = (status: EstimateStatusEnum, showEdit: boolean, profilation ?: BillingDetail) : ProfilingPeriod => (
  {
    referenceYear: "2024",
    status: status,
    lastModifiedDate: (profilation) ? "2023-06-22T12:29:00.000+00:00" : null ,
    deadlineDate: "2023-10-31T23:59:00.000+00:00",
    showEdit: showEdit,
    profilation: profilation
  }
)