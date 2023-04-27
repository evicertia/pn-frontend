import {Fragment} from "react";
import {useFormik} from "formik";
import {Grid, Stack} from "@mui/material";
import * as yup from "yup";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "@mui/lab";
import {EstimatePeriod} from "../../../../../models/UsageEstimation";
import {BillForm} from "./bill/Bill.form";
import {UsageEstimateForm} from "./usage/UsageEstimate.form";
import {UsageEstimatesInitialValue} from "./props/Estimate.props";


export function EstimateForm(props: {selected: EstimatePeriod}) {
  const {t} = useTranslation(['estimate']);

  const validationSchema = yup.object({
    splitPayment: yup
      .bool()
      .oneOf([true, false], t('edit-estimate.form.split-payment'))
      .required(t('edit-estimate.form.mandatory')),
    mailAddress: yup.string()
      .email(t('edit-estimate.form.mailAddress-error'))
      .required(t('edit-estimate.form.mandatory')),
    totalDigitalNotif: yup.number()
      .required(t('edit-estimate.form.mandatory')),
    totalAnalogNotif: yup.number()
      .required(t('edit-estimate.form.mandatory')),
    total890Notif: yup.number()
      .required(t('edit-estimate.form.mandatory')),
  });
  
  const formik = useFormik({
    initialValues: UsageEstimatesInitialValue(props.selected.estimate, props.selected.billing),
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return <Fragment>
    <form onSubmit={formik.handleSubmit}>
      <UsageEstimateForm formikInstance={formik} />
      <BillForm formikInstance={formik} />
      <Grid item container direction="row" justifyContent="flex-end" >
        <Stack direction={"row"} spacing={2}>
          <LoadingButton variant={"outlined"} type="submit">{t('edit-estimate.button.save-edit')}</LoadingButton>
          <LoadingButton variant={"contained"} type="submit">{t('edit-estimate.button.abort-edit')}</LoadingButton>
        </Stack>
      </Grid>
    </form>
  </Fragment>;
}