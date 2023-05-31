import {render, cleanup, screen} from "@testing-library/react";
import {DataInfo} from "../DataInfo";
import {usageBillingDataPA, usageEstimations, usageInfoPA, usagePeriod} from "../rows";
import {BillingDetail, Estimate, EstimateStatusEnum} from "../../../../../models/UsageEstimation";
import {getFormattedDateTime, localeStringReferenceMonth} from "../../../../../utils/utility";


const ScenarioUsageInfoPA = () => {
  const paInfoDetail = {
    paInfo: {
      paId: "026e8c72-7944-4dcd-8668-f596447fec6d",
      paName: "Comune di Milano",
      taxId: "01199250158",
      address: "Via Milano",
      fiscalCode: "0123456789",
      ipaCode: "asf359ljro3912",
      pec: "milano@pec.it",
      sdiCode: "c3rfl93qw903v"
    }
  };
  return (<DataInfo title={""} data={paInfoDetail.paInfo} rows={usageInfoPA}/>);
};

const ScenarioUsagePeriod = () => {
  const estimateDetail = {
    status: EstimateStatusEnum.DRAFT,
    showEdit: true,
    deadlineDate: "2023-06-15T23:59:00.000+00:00",
    referenceMonth: "LUG-2023",
    lastModifiedDate: "2023-05-22T13:36:27.000+00:00",
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
  return (<DataInfo title={""} data={estimateDetail} rows={usagePeriod}/>);
};

const ScenarioUsageBillingDataPA = () => {

  const billingDetail = {
    splitPayment: false,
    description: "This is a description",
    mailAddress: "test@test.com"
  };
  return (<DataInfo title={""} data={billingDetail} rows={usageBillingDataPA}/>);
};

const ScenarioUsageEstimations = () => {
  const estimateDetail = {
    totalDigitalNotif: 5,
    totalAnalogNotif: 10,
    total890Notif: 10,
  };
  return (<DataInfo title={""} data={estimateDetail} rows={usageEstimations}/>);
};

describe("whenDataArePassedToDataInfo", () => {
  afterEach(cleanup);

  it("check data correctly inserted into the rows of 'usageInfoPA' type", async () => {
    render(<ScenarioUsageInfoPA />);
    expect(screen.getByText("Comune di Milano")).toBeInTheDocument();
    expect(screen.getByText("01199250158")).toBeInTheDocument();
    expect(screen.getByText("Via Milano")).toBeInTheDocument();
    expect(screen.getByText("asf359ljro3912")).toBeInTheDocument();
    expect(screen.getByText("milano@pec.it")).toBeInTheDocument();
    expect(screen.getByText("c3rfl93qw903v")).toBeInTheDocument();
  });

  it("check data correctly inserted into the rows of 'usagePeriod' type", async () => {
    render(<ScenarioUsagePeriod />);
    expect(screen.getByText(getFormattedDateTime("2023-06-15T23:59:00.000+00:00"))).toBeInTheDocument();
    expect(screen.getByText(getFormattedDateTime("2023-05-22T13:36:27.000+00:00"))).toBeInTheDocument();
    expect(screen.getByText(localeStringReferenceMonth("LUG-2023"))).toBeInTheDocument();
  });

  it("check data correctly inserted into the rows of 'usageBillingDataPA' type", async () => {
    render(<ScenarioUsageBillingDataPA />);
    expect(screen.getByText("This is a description")).toBeInTheDocument();
    expect(screen.getByText("test@test.com")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });


  it("check data correctly inserted into the rows of 'usageEstimations' type", async () => {
    render(<ScenarioUsageEstimations />);
    const [totalDigitalNotif, toDigitalWay] = screen.getAllByText('5');
    const [totalAnalogNotif, total890Notif] = screen.getAllByText('10');

    expect(totalDigitalNotif).toBeInTheDocument();
    expect(totalAnalogNotif).toBeInTheDocument();
    expect(total890Notif).toBeInTheDocument();

    const toAnalogicWay = screen.getByText('20');
    const totalEstimateNotif = screen.getByText('25');

    expect(toDigitalWay).toBeInTheDocument();
    expect(toAnalogicWay).toBeInTheDocument();
    expect(totalEstimateNotif).toBeInTheDocument();
  });
});