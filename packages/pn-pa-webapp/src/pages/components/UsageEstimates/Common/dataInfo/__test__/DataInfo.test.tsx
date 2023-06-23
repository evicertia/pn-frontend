import {render, cleanup, screen} from "@testing-library/react";
import {DataInfo} from "../DataInfo";
import {usageBillingDataPA, usageEstimations, usageInfoPA, usagePeriod} from "../model/EstimateRows";
import {EstimateStatusEnum} from "../../../../../../models/UsageEstimation";
import {localeStringReferenceId} from "../../../../../../utils/utility";


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

  it("checkDataCorrectlyInsertedIntoTheRowsOfusageInfoPAtype", async () => {
    render(<ScenarioUsageInfoPA />);
    expect(screen.getByText("Comune di Milano")).toBeInTheDocument();
    expect(screen.getByText("01199250158")).toBeInTheDocument();
    expect(screen.getByText("Via Milano")).toBeInTheDocument();
  });

  it("checkDataCorrectlyInsertedIntoTheRowsOfusagePeriodtype", async () => {
    render(<ScenarioUsagePeriod />);
    expect(screen.getByText("15/06/2023, ore 23:59")).toBeInTheDocument();
    expect(screen.getByText("22/05/2023, ore 13:36")).toBeInTheDocument();
    expect(screen.getByText(localeStringReferenceId("LUG-2023"))).toBeInTheDocument();
  });

  it("checkDataCorrectlyInsertedIntoTheRowsOfusageBillingDataPAtype", async () => {
    render(<ScenarioUsageBillingDataPA />);
    expect(screen.getByText("This is a description")).toBeInTheDocument();
    expect(screen.getByText("test@test.com")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });


  it("checkDataCorrectlyInsertedIntoTheRowsOfusageEstimationsType'", async () => {
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