import {ChangeEvent, cloneElement} from "react";
import {act, waitFor, screen, cleanup, fireEvent, render} from "@testing-library/react";
import {BillForm} from "../Bill.form";
import {EstimateFormProps, validationSchemaBilling} from "../../../formik/Formik.config";
import {FormikErrors, FormikState, FormikValues, useFormik} from "formik";
import {useTranslation} from "react-i18next";
import * as yup from "yup";


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

const BillFormEmptyValue = () => {
  const {t} = useTranslation(['estimate']);
  const initBilling = {
    splitPayment: false,
    mailAddress: "",
    description: ""
  }
  return scenaries(<BillForm formikInstance={initialFormik({})}/>, initBilling, yup.object({...validationSchemaBilling(t)}));
};

const BillFormNotEmptyValue = () => {
  const {t} = useTranslation(['estimate']);
  const initBilling = {
    splitPayment: true,
    mailAddress: "test@test.com",
    description: "Lorem"
  }
  return scenaries(<BillForm formikInstance={initialFormik({})}/>, initBilling, yup.object({...validationSchemaBilling(t)}));
};

const BillFormFields = (data : {email?: string, descr?: string}) => {
  const {t} = useTranslation(['estimate']);
  const initBilling = {
    splitPayment: false,
    mailAddress: data.email || "",
    description: data.descr || ""
  }
  return scenaries(<BillForm formikInstance={initialFormik({})}/>, initBilling, yup.object({...validationSchemaBilling(t)}));
};

describe("Bill.form.test", () => {

  afterEach(cleanup);

  it('whenFormFieldsNotContainsValues', async () => {
    render(<BillFormEmptyValue />);

    const billRadio = await screen.queryByTestId("bill-radio");
    expect(billRadio).toBeInTheDocument();
    const checkedRadio = billRadio.querySelector("input[name='radio-buttons-group']:checked");
    expect(checkedRadio.getAttribute("value")).toEqual("N");

    const billTextEmail = await screen.queryByTestId("bill-textfield-email-address");
    expect(billTextEmail).toBeInTheDocument();
    const inputEmailElement = billTextEmail.querySelector('#mailAddress');
    expect(inputEmailElement.getAttribute("value")).toEqual("");

    const billTextDescr = await screen.queryByTestId("bill-textfield-description");
    expect(billTextDescr).toBeInTheDocument();
    const inputDescrElement = billTextDescr.querySelector('#description');
    expect(inputDescrElement.getAttribute("value")).toEqual("");
  })

  it('whenFormFieldsContainsValues', async () => {
    render(<BillFormNotEmptyValue />);

    const billRadio = await screen.queryByTestId("bill-radio");
    expect(billRadio).toBeInTheDocument();
    screen.debug(billRadio.querySelector("input[name='radio-buttons-group']:checked"));
    const checkedRadio = billRadio.querySelector("input[name='radio-buttons-group']:checked");
    expect(checkedRadio.getAttribute("value")).toEqual("Y");

    const billTextEmail = await screen.queryByTestId("bill-textfield-email-address");
    expect(billTextEmail).toBeInTheDocument();
    const inputEmailElement = billTextEmail.querySelector('#mailAddress');
    expect(inputEmailElement.getAttribute("value")).toEqual("test@test.com");

    const billTextDescr = await screen.queryByTestId("bill-textfield-description");
    expect(billTextDescr).toBeInTheDocument();
    const inputDescrElement = billTextDescr.querySelector('#description');
    expect(inputDescrElement.getAttribute("value")).toEqual("Lorem");
  })

  it("whenTextIsInsertedIntoField", async () => {
    render(<BillFormFields />);
    const [billTextEmail, billTextDescr] = screen.getAllByRole("textbox");

    await act(async () => {
      fireEvent.input(billTextEmail, { target : {value : "test@test.com"} });
      await waitFor(() => {
        screen.debug(billTextEmail);
        expect(billTextEmail.getAttribute("value")).toEqual("test@test.com");
      })
    });

    await act(async () => {
      fireEvent.input(billTextDescr, { target : {value : "Lorem ipsum"} });
      await waitFor(() => {
        screen.debug(billTextDescr);
        expect(billTextDescr.getAttribute("value")).toEqual("Lorem ipsum");
      })
    });
  });

  // it("whenRadioValueIsChanged", async () => {
  //   render(<BillFormFields />);
  //
  //   const billRadio = await screen.queryByTestId("bill-radio");
  //   expect(billRadio).toBeInTheDocument();
  //   const inputRadio = billRadio.querySelector("input[value='Y']");
  //   expect(inputRadio.checked).toEqual(false);
  //   // screen.debug(inputRadio);
  //
  //   await act(async () => {
  //     fireEvent.change(inputRadio, { target : {checked: true} });
  //     fireEvent.blur(inputRadio)
  //
  //     // inputRadio.setAttribute("checked", "");
  //     await waitFor(() => {
  //       screen.debug(inputRadio);
  //       // expect(inputRadio.getAttribute("checked")).toEqual("");
  //     })
  //   });
  //
  // });
})