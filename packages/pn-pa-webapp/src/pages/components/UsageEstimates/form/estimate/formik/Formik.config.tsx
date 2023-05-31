import {FormikErrors, FormikState, FormikTouched, FormikValues} from "formik";
import {ChangeEvent} from "react";
import * as yup from "yup";
import {BillingDetail, Estimate} from "../../../../../../models/UsageEstimation";


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
      value: boolean,
      shouldValidate?: boolean | undefined
    ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    resetForm: (nextState?: Partial<FormikState<FormikValues>> | undefined) => void;
    touched: FormikTouched<FormikValues>;
    errors: FormikErrors<FormikValues>;
  };
};

export const UsageEstimatesInitialValue = (estimate?: Estimate, billing?: BillingDetail): FormikValues => {

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

export const validationSchemaUsageEstimate = (t: any) => ({
  totalDigitalNotif: yup.number()
    .required(t('edit-estimate.form.mandatory')),
  totalAnalogNotif: yup.number()
    .required(t('edit-estimate.form.mandatory')),
  total890Notif: yup.number()
    .required(t('edit-estimate.form.mandatory'))
});

export const validationSchemaBilling = (t: any) => ({
  mailAddress: yup.string()
    .email(t('edit-estimate.form.mailAddress-error'))
    .required(t('edit-estimate.form.mandatory'))
});