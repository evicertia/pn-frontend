import {act, screen, cleanup, render, fireEvent, waitFor} from "@testing-library/react";
import {FormikErrors, FormikState, FormikValues, useFormik} from "formik";
import {EstimateFormProps, validationSchemaUsageEstimate} from "../../formik/Formik.config";
import {ChangeEvent, cloneElement} from "react";
import {UsageEstimateForm} from "../UsageEstimate.form";
import * as yup from "yup";
import {useTranslation} from "react-i18next";


const scenaries = (toRender: JSX.Element, initialValues?: FormikValues, validationSchema?: any) => {
  const formik = useFormik({
    initialValues: initialValues || {},
    validationSchema,
    onSubmit: (values) => {
      jest.fn();
    },
    // errors: errors ? yupToFormErrors(errors) : {} as FormikErrors<FormikValues>,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {cloneElement(toRender, {formikInstance: formik} as EstimateFormProps)}
    </form>
  );
};

const initialFormik = (initialValues: FormikValues) => {
  const element: EstimateFormProps = {
    formikInstance: {
      errors: {} as FormikErrors<FormikValues>,
      handleChange: function (event: ChangeEvent<HTMLInputElement>) {
        jest.fn();
      },
      resetForm: function (nextState: Partial<FormikState<FormikValues>> | undefined) {
        jest.fn();
      },
      setFieldTouched: function (field: string, value: boolean, shouldValidate: boolean | undefined) {
        jest.fn();
      },
      setFieldValue: function (field: string, value: boolean, shouldValidate: boolean | undefined) {
        jest.fn();
      },
      touched: {} as FormikErrors<FormikValues>,
      values: {...initialValues} as FormikValues,
    }
  } as EstimateFormProps;
  return element.formikInstance;
};


const UsageEstimateFormEmptyValueCase = () => {
  const {t} = useTranslation(['estimate']);
  const initEstimate = {
    totalDigitalNotif: 0,
    totalAnalogNotif: 0,
    total890Notif: 0
  }
  return scenaries(<UsageEstimateForm formikInstance={initialFormik({})}/>, initEstimate, yup.object({...validationSchemaUsageEstimate(t)}));

};

const UsageEstimateFormNotEmptyValueCase = () => {
  const {t} = useTranslation(['estimate']);
  const initEstimate = {
    totalDigitalNotif: 5,
    totalAnalogNotif: 8,
    total890Notif: 10
  }
  return scenaries(<UsageEstimateForm formikInstance={initialFormik({})}/>, initEstimate, yup.object({...validationSchemaUsageEstimate(t)}));
};

const UsageEstimateFormTypingFields = () => {
  const {t} = useTranslation(['estimate']);
  const initEstimate = {
    totalDigitalNotif: 0,
    totalAnalogNotif: 0,
    total890Notif: 0
  }
  return scenaries(<UsageEstimateForm formikInstance={initialFormik({})}/>, initEstimate, yup.object({...validationSchemaUsageEstimate(t)}));
};

describe("UsageEstimate.form.test", () => {
  afterEach(cleanup);

  it('whenFormFieldsNotContainsValues', async function () {

    render(<UsageEstimateFormEmptyValueCase />);

    const usageDigital = await screen.queryByTestId("usage-textfield-digital");
    expect(usageDigital).toBeInTheDocument();
    const inputUsageDigital = usageDigital.querySelector('#totalDigitalNotif');
    await expect(inputUsageDigital.getAttribute("value")).toEqual("0");
    console.debug(inputUsageDigital)

    const  usageAnalogR = await screen.queryByTestId("usage-textfield-analog-notif");
    expect(usageAnalogR).toBeInTheDocument();
    const inputAnalogR = usageAnalogR.querySelector('#totalAnalogNotif');
    await expect(inputAnalogR.getAttribute("value")).toEqual("0");
    console.debug(inputAnalogR)

    const usageAnalog890 = await screen.queryByTestId("usage-textfield-analog-890");
    expect(usageAnalog890).toBeInTheDocument();
    const inputAnalog890 = usageAnalog890.querySelector('#total890Notif');
    await expect(inputAnalog890.getAttribute("value")).toEqual("0");
    console.debug(inputAnalog890)
  })

  it('whenFormFieldsContainsValues', async function () {
    render(<UsageEstimateFormNotEmptyValueCase />);

    const usageDigital = await screen.queryByTestId("usage-textfield-digital");
    expect(usageDigital).toBeInTheDocument();
    const inputUsageDigital = usageDigital.querySelector('#totalDigitalNotif');
    await expect(inputUsageDigital.getAttribute("value")).toEqual("5");
    console.debug(inputUsageDigital)

    const  usageAnalogR = await screen.queryByTestId("usage-textfield-analog-notif");
    expect(usageAnalogR).toBeInTheDocument();
    const inputAnalogR = usageAnalogR.querySelector('#totalAnalogNotif');
    await expect(inputAnalogR.getAttribute("value")).toEqual("8");
    console.debug(inputAnalogR)

    const usageAnalog890 = await screen.queryByTestId("usage-textfield-analog-890");
    expect(usageAnalog890).toBeInTheDocument();
    const inputAnalog890 = usageAnalog890.querySelector('#total890Notif');
    await expect(inputAnalog890.getAttribute("value")).toEqual("10");
    console.debug(inputAnalog890)
  })

  it("whenTextIsInsertedIntoField", async () => {
    render(<UsageEstimateFormTypingFields />);

    const usageTotalDigital = await screen.queryByTestId("usage-textfield-digital");
    const inputTotalDigital = usageTotalDigital.querySelector('#totalDigitalNotif');
    await act(async () => {
      fireEvent.input(inputTotalDigital, { target : {value : "10"} });
      await waitFor(async () => {
        expect(inputTotalDigital.getAttribute("value")).toEqual("10");
      })
    });

    const usageAnalog = await screen.queryByTestId("usage-textfield-analog-notif");
    const inputTotalAnalog = usageAnalog.querySelector('#totalAnalogNotif');
    await act(async () => {
      fireEvent.input(inputTotalAnalog, { target : {value : "20"} });
      await waitFor(async () => {
        expect(inputTotalAnalog.getAttribute("value")).toEqual("20");
      })
    });

    const usage890 = await screen.queryByTestId("usage-textfield-analog-890");
    const input890 = usage890.querySelector('#total890Notif');
    await act(async () => {
      fireEvent.input(input890, { target : {value : "30"} });
      await waitFor(async () => {
        expect(input890.getAttribute("value")).toEqual("30");
      })
    });
  });

});