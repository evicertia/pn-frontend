import {act, screen, cleanup, fireEvent, render} from "@testing-library/react";
import {useState} from "react";
import {SendEstimateDialog} from "../SendEstimateDialog";


const SendEstimateDialogCase = () => {
  const [opened, setOpened] = useState(true);
  const onClickNegativeMock = () => (setOpened(false));
  const onClickPositiveMock = jest.fn();

  return <SendEstimateDialog
    title={"Alert"}
    message={"This is an error"}
    open={opened}
    onClickNegative={onClickNegativeMock}
    onClickPositive={onClickPositiveMock}/>
};

describe("SendEstimateDialog.test", () => {

  afterEach(cleanup);

  it("whenSendEstimateDialogIsOpened", async () => {
    render(<SendEstimateDialogCase />);

    const sendEstimateDialog = screen.getByTestId('send-estimate-dialog');
    expect(sendEstimateDialog).toBeInTheDocument();
    // @ts-ignore
    fireEvent.click(sendEstimateDialog["firstChild"]);
    await act(async () => { await expect(screen.queryByTestId('sendEstimateDialog')).not.toBeInTheDocument() });
  });
});