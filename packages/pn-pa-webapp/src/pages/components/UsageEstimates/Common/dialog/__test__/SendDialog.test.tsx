import {act, screen, cleanup, fireEvent, render} from "@testing-library/react";
import {useState} from "react";
import {SendDialog} from "../SendDialog";


const SendDialogCase = () => {
  const [opened, setOpened] = useState(true);
  const onClickNegativeMock = () => (setOpened(false));
  const onClickPositiveMock = jest.fn();

  return <SendDialog
    title={"Alert"}
    message={"This is an error"}
    open={opened}
    onClickNegative={onClickNegativeMock}
    onClickPositive={onClickPositiveMock}
    prefix={""}/>
};

describe("SendDialog.test", () => {

  afterEach(cleanup);

  it("whenSendDialogIsOpened", async () => {
    render(<SendDialogCase />);

    const sendDialog = screen.getByTestId('send-dialog');
    expect(sendDialog).toBeInTheDocument();
    // @ts-ignore
    fireEvent.click(sendDialog["firstChild"]);
    await act(async () => { await expect(screen.queryByTestId('sendDialog')).not.toBeInTheDocument() });
  });
});