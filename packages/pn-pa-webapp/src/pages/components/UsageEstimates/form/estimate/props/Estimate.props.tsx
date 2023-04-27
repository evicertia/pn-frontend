import {FormikErrors, FormikState, FormikTouched, FormikValues} from "formik";
import {ChangeEvent} from "react";
import {BillingDetail, EstimateDetail} from "../../../../../../models/UsageEstimation";


export type EstimateFormProps = {
  formikInstance: {
    values: FormikValues;
    setFieldTouched: (
      field: string,
      touched?: boolean,
      shouldValidate?: boolean | undefined
    ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
    handleChange: (e: ChangeEvent<any>) => void;
    resetForm: (nextState?: Partial<FormikState<FormikValues>> | undefined) => void;
    touched: FormikTouched<FormikValues>;
    errors: FormikErrors<FormikValues>;
  };
};

export const UsageEstimatesInitialValue = (estimate?: EstimateDetail, billing?: BillingDetail): FormikValues => {
  const initEstimate = (estimate) ? estimate : {
    totalDigitalNotif: 0,
    totalAnalogNotif: 0,
    total890Notif: 0
  };
  const initBilling = (billing) ? billing : {
    splitPayment: false,
    mailAddress: "",
    description: ""
  };
  return {...initEstimate, ...initBilling};
};