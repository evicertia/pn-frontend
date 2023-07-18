import {act, cleanup, fireEvent, render, screen} from "@testing-library/react";
import * as reactRedux from "../../../../../../redux/hooks";
import {RowFileReport} from "../RowFileReport";


const mockDispatchFn = jest.fn();
const spyOnDispatch = jest.spyOn(reactRedux, "useAppDispatch");
const spyOnSelector = jest.spyOn(reactRedux, "useAppSelector");


const fileReport = {
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

const stateUser = {
  sessionToken: "",
  name: "",
  family_name: "",
  fiscal_number: "",
  email: "",
  uid: ""
};

const mockingStore = (userStore= { }) => {
  const reduxStore = {
    userState: {
      user: userStore
    }
  } as any

  spyOnSelector.mockImplementation((selector) => selector(reduxStore))
}

describe("RowFileReportTest", () => {

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

  it("When a file report is clicked for download it", async () => {
    mockingStore(stateUser);
    render(<RowFileReport report={fileReport}></RowFileReport>)

    const downloadButton = screen.getByTestId("fileReportDownloadButtonId");
    fireEvent.click(downloadButton);

    await act(async () => {
      expect(mockDispatchFn).toBeCalledTimes(1)
    });
  });
});