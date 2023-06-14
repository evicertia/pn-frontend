import {cleanup} from "@testing-library/react";
import {UsageEstimatesInitialValue} from "../Formik.config";

describe("Formik.config.test", () => {

  afterEach(cleanup);

  it("whenFormikInitialValuesAreCorrectlyInitialized", async function () {
    const initEstimate = {
      totalDigitalNotif: 5,
      totalAnalogNotif: 8,
      total890Notif: 10
    }
    const initBilling = {
      sdiCode: "a1s2d3f4f5g6g6",
      splitPayment: true,
      mailAddress: "test@test.com",
      description: "Lorem"
    }

    const formikInitialValue = UsageEstimatesInitialValue(initEstimate, initBilling);

    expect(formikInitialValue.totalDigitalNotif).toEqual(initEstimate.totalDigitalNotif);
    expect(formikInitialValue.totalAnalogNotif).toEqual(initEstimate.totalAnalogNotif);
    expect(formikInitialValue.total890Notif).toEqual(initEstimate.total890Notif);
    expect(formikInitialValue.sdiCode).toEqual(initBilling.sdiCode);
    expect(formikInitialValue.splitPayment).toEqual(initBilling.splitPayment);
    expect(formikInitialValue.mailAddress).toEqual(initBilling.mailAddress);
    expect(formikInitialValue.description).toEqual(initBilling.description);
  });


});