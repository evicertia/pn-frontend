import {Fragment, useState} from "react";
import {useFormik} from "formik";
import {Grid, Stack} from "@mui/material";
import * as yup from "yup";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "@mui/lab";
import {EstimatePeriod, StatusUpdateEnum} from "../../../../../models/UsageEstimation";
import {updateEstimate} from "../../../../../redux/usageEstimation/actions";
import {useAppDispatch, useAppSelector} from "../../../../../redux/hooks";
import {RootState} from "../../../../../redux/store";
import {BillForm} from "./bill/Bill.form";
import {UsageEstimateForm} from "./usage/UsageEstimate.form";
import {UsageEstimatesInitialValue} from "./props/Estimate.props";


interface EstimateFormProps {
  selected: EstimatePeriod;
  onEstimateValidated?: () => void;
}

export function EstimateForm(props: EstimateFormProps) {
  const {t} = useTranslation(['estimate']);
  const dispatch = useAppDispatch();
  const [btnType, setBtnType] = useState(StatusUpdateEnum.DRAFT);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);

  const validationSchema = yup.object({
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
      const estimateBodyRequest = {
        totalDigitalNotif: values.totalDigitalNotif,
        total890Notif: values.total890Notif,
        totalAnalogNotif: values.totalAnalogNotif,
        splitPayment: values.splitPayment,
        description: values.description,
        mailAddress: values.mailAddress
      };

      void dispatch(updateEstimate({paId: loggedUser.organization.id, referenceMonth: props.selected.referenceMonth,
        status: btnType, body: estimateBodyRequest}))
        .unwrap()
        .then(()=> {
          if(btnType === StatusUpdateEnum.VALIDATED) {
            props.onEstimateValidated?.();
          }
      });
    },
  });

  return <Fragment>
    <form onSubmit={formik.handleSubmit}>
      <UsageEstimateForm formikInstance={formik} />
      <BillForm formikInstance={formik} />
      <Grid item container direction="row" justifyContent="flex-end" >
        <Stack direction={"row"} spacing={2}>
          {(props.selected.status === StatusUpdateEnum.DRAFT)
            ?
              <LoadingButton variant={"outlined"} type="submit" onClick={()=>setBtnType(StatusUpdateEnum.DRAFT)}>{t('edit-estimate.button.save-edit')}</LoadingButton>
            :
              null
          }
          <LoadingButton variant={"contained"} type="submit" onClick={()=>setBtnType(StatusUpdateEnum.VALIDATED)}>{t('edit-estimate.button.abort-edit')}</LoadingButton>
        </Stack>
      </Grid>
    </form>
  </Fragment>;
}