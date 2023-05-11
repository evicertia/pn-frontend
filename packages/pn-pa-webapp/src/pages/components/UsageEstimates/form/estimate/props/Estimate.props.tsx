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

  const initEstimate = {
    totalDigitalNotif: estimate?.totalDigitalNotif ? estimate?.totalDigitalNotif : 0,
    totalAnalogNotif: estimate?.totalAnalogNotif ? estimate?.totalAnalogNotif : 0,
    total890Notif: estimate?.total890Notif ? estimate?.total890Notif : 0,
  };

  const initBilling = {
    splitPayment: billing?.splitPayment ? billing?.splitPayment : false,
    mailAddress: billing?.mailAddress ? billing?.mailAddress : "",
    description: billing?.description ? billing?.description : "",
  };

  return {...initEstimate, ...initBilling};
};