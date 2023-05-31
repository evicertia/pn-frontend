import {cleanup, screen, render} from "@testing-library/react";
import {EstimateStatusChip} from "../index";
import {EstimateStatusEnum} from "../../../../../models/UsageEstimation";


describe("StatusChip.test", () => {
  afterEach(cleanup);

  it("whenChipsColorCorrespondWithEstimateDRAFTstatus", async function () {
    const estimateStatus = {
      data: EstimateStatusEnum.DRAFT
    };
    render(<EstimateStatusChip data={estimateStatus.data} />);
    const chipInfo = screen.getByTestId("chip-info");
    expect(chipInfo).toBeInTheDocument();
    expect(chipInfo).toHaveStyle('background-color: #0288d1');
  });

  it("whenChipsColorCorrespondWithEstimateVALIDATEDstatus", async function () {
    const estimateStatus = {
      data: EstimateStatusEnum.VALIDATED
    };
    render(<EstimateStatusChip data={estimateStatus.data} />);
    const chipInfo = screen.getByTestId("chip-success");
    expect(chipInfo).toBeInTheDocument();
    expect(chipInfo).toHaveStyle('background-color: #2e7d32');
  });

  it("whenChipsColorCorrespondWithEstimateABSENTstatus", async function () {
    const estimateStatus = {
      data: EstimateStatusEnum.ABSENT
    };
    render(<EstimateStatusChip data={estimateStatus.data} />);
    const chipInfo = screen.getByTestId("chip-error");
    expect(chipInfo).toBeInTheDocument();
    expect(chipInfo).toHaveStyle('background-color: #d32f2f');
  });

  it("whenChipsColorCorrespondWithNoEstimateStatus", async function () {
    const estimateStatus = {
      data: undefined
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    render(<EstimateStatusChip data={estimateStatus.data} />);
    const chipInfo = screen.getByTestId("chip-empty");
    expect(chipInfo).toBeInTheDocument();
  });
});