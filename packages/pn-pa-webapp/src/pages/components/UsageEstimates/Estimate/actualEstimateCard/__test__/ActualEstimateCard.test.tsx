import {act, cleanup, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {ActualEstimateCard} from "../ActualEstimateCard";
import {Estimate, EstimatePeriod, EstimateStatusEnum} from "../../../../../../models/UsageEstimation";
import {GET_EDIT_ESTIMATE_PATH} from "../../../../../../navigation/routes.const";
import * as reactRedux from "../../../../../../redux/hooks";
import {useAppDispatch} from "../../../../../../redux/hooks";
import {EstimateForm} from "../../form/Estimate.form";


const mockNavigateFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

const spyOnSelector = jest.spyOn(reactRedux, "useAppSelector");

const getEstimatePeriod = (status: EstimateStatusEnum, showEdit: boolean, estimate ?: Estimate) : EstimatePeriod => (
  {
    referenceMonth: "GIU-2023",
    status: status,
    lastModifiedDate: (estimate) ? "2023-06-22T12:29:00.000+00:00" : null ,
    deadlineDate: "2023-06-15T23:59:00.000+00:00",
    estimate: estimate,
    showEdit: showEdit,
    billing: {
      sdiCode: "ABCDE12345",
      splitPayment: false,
      description: "string",
      mailAddress: "test@test.com",
    }
  }
)

const buildDispatch = (reject: boolean) => {
  return jest.fn(() => ({
    unwrap: () => (reject) ? Promise.reject(): Promise.resolve(),
  }));
}

describe('ActualEstimateCardTest', () => {
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


  it('Estimate status equals DRAFT and details estimate is not present', async () => {
    const estimate = getEstimatePeriod("DRAFT", true);
    render(<ActualEstimateCard paId={"1234"} data={estimate}/>);

    expect(screen.getByTestId("labelDigitalNotif").textContent).toEqual("card.label.estimate-to-complete");
    expect(screen.getByTestId("label890Notif").textContent).toEqual("card.label.estimate-to-complete");
    expect(screen.getByTestId("labelAnalogNotif").textContent).toEqual("card.label.estimate-to-complete");

    const estimateButton = screen.getByTestId("createButtonTestId");
    fireEvent.click(estimateButton);

    await act(async () => {
      expect(mockNavigateFn).toBeCalledTimes(1)
      expect(mockNavigateFn).toBeCalledWith(GET_EDIT_ESTIMATE_PATH(estimate.referenceMonth));
    });
  });

  it('Estimate status equals DRAFT and details estimate is present', async () => {
    const detail:Estimate = {
      totalDigitalNotif: 10,
      totalAnalogNotif: 10,
      total890Notif: 10,
    }
    const estimate = getEstimatePeriod("DRAFT", true, detail);
    render(<ActualEstimateCard paId={"1234"} data={estimate}/>);

    expect(screen.getByTestId("labelDigitalNotif").textContent).toEqual(detail.totalDigitalNotif+"");
    expect(screen.getByTestId("label890Notif").textContent).toEqual(detail.total890Notif+"");
    expect(screen.getByTestId("labelAnalogNotif").textContent).toEqual(detail.totalAnalogNotif+"");

    const editDraftEstimateButton = screen.getByTestId("editDraftEstimate");
    const validateDraftEstimateButton = screen.getByTestId("loading-button-test-id");

    expect(editDraftEstimateButton).toBeInTheDocument();
    expect(validateDraftEstimateButton).toBeInTheDocument();

    fireEvent.click(editDraftEstimateButton);

    await act(async () => {
      expect(mockNavigateFn).toBeCalledTimes(1)
      expect(mockNavigateFn).toBeCalledWith(GET_EDIT_ESTIMATE_PATH(estimate.referenceMonth));
    });
  });

  it('Estimate status equals VALIDATED and showEdit is true', async () => {
    const detail:Estimate = {
      totalDigitalNotif: 10,
      totalAnalogNotif: 10,
      total890Notif: 10,
    }
    const estimate = getEstimatePeriod("VALIDATED", true, detail);
    render(<ActualEstimateCard paId={"1234"} data={estimate}/>);

    expect(screen.getByTestId("labelDigitalNotif").textContent).toEqual(detail.totalDigitalNotif+"");
    expect(screen.getByTestId("label890Notif").textContent).toEqual(detail.total890Notif+"");
    expect(screen.getByTestId("labelAnalogNotif").textContent).toEqual(detail.totalAnalogNotif+"");

    const editValidateEstimateButton = screen.getByTestId("editValidateEstimateButton");

    expect(editValidateEstimateButton).toBeInTheDocument();

    fireEvent.click(editValidateEstimateButton);

    await act(async () => {
      expect(mockNavigateFn).toBeCalledTimes(1)
      expect(mockNavigateFn).toBeCalledWith(GET_EDIT_ESTIMATE_PATH(estimate.referenceMonth));
    });
  });

  it('Estimate status equals ABSENT and showEdit is true', async () => {
    const detail:Estimate = {
      totalDigitalNotif: 10,
      totalAnalogNotif: 10,
      total890Notif: 10,
    }
    const estimate = getEstimatePeriod("ABSENT", false);
    render(<ActualEstimateCard paId={"1234"} data={estimate}/>);

    expect(screen.getByTestId("labelDigitalNotif").textContent).toEqual("card.label.estimate-to-complete");
    expect(screen.getByTestId("label890Notif").textContent).toEqual("card.label.estimate-to-complete");
    expect(screen.getByTestId("labelAnalogNotif").textContent).toEqual("card.label.estimate-to-complete");

    expect(screen.queryByTestId("editValidateEstimateButton")).not.toBeInTheDocument();
    expect(screen.queryByTestId("createButtonTestId")).not.toBeInTheDocument();
    expect(screen.queryByTestId("editDraftEstimate")).not.toBeInTheDocument();
    expect(screen.queryByTestId("loading-button-test-id")).not.toBeInTheDocument();
  });

  it('When Estimate status is Draft and details is present then clicked on SendEstimate', async () => {
    const detail:Estimate = {
      totalDigitalNotif: 10,
      totalAnalogNotif: 10,
      total890Notif: 10,
    }
    const estimate = getEstimatePeriod("DRAFT", true, detail);
    render(<ActualEstimateCard paId={"1234"} data={estimate}/>);

    const validateDraftEstimateButton = screen.getByTestId("loading-button-test-id");
    expect(validateDraftEstimateButton).toBeInTheDocument();
    expect(screen.queryByText("dialog.send-dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("dialog.abort-dialog")).not.toBeInTheDocument();

    // open the confirmDialog
    fireEvent.click(validateDraftEstimateButton)

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

  it('When Estimate status is Draft and details is present then clicked on SendEstimate and Error with request', async () => {
    const detail:Estimate = {
      totalDigitalNotif: 10,
      totalAnalogNotif: 10,
      total890Notif: 10,
    }

    mockDispatchFn = buildDispatch(true)
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);

    const estimate = getEstimatePeriod("DRAFT", true, detail);

    render(<ActualEstimateCard paId={"1234"} data={estimate}/>);

    const validateDraftEstimateButton = screen.getByTestId("loading-button-test-id");
    expect(validateDraftEstimateButton).toBeInTheDocument();

    // open the confirmDialog
    fireEvent.click(validateDraftEstimateButton)
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

  it("whenEstimateIsNotValidated", async () => {
    const detail:Estimate = {
      totalDigitalNotif: 10,
      totalAnalogNotif: 10,
      total890Notif: 10,
    }

    mockDispatchFn = buildDispatch(true)
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);

    const estimate = getEstimatePeriod("DRAFT", true, detail);

    render(<ActualEstimateCard paId={"1234"} data={estimate}/>);

    const openDialogButton = await screen.queryByTestId("loading-button-test-id");
    expect(openDialogButton).toBeInTheDocument();
    expect(openDialogButton).not.toBeDisabled();
    fireEvent.click(openDialogButton);

    const sendDialog = await screen.queryByTestId("send-dialog");
    screen.debug(sendDialog);
    const buttons = sendDialog.querySelectorAll('button');

    buttons.forEach((btn, index) => {
      if(index === 0) {
        fireEvent.click(btn);
      }
    });

    await act(async () => {
      await waitFor( () => {
        expect(sendDialog).not.toBeInTheDocument();
      })
    })
  })

});