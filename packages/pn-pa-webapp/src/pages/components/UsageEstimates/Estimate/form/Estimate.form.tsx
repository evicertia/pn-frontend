import {Fragment, useState} from "react";
import {useFormik} from "formik";
import {Grid, Stack} from "@mui/material";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "@mui/lab";
import * as yup from "yup";
import {EstimatePeriod, EstimateStatusEnum, StatusUpdateEnum} from "../../../../../models/UsageEstimation";
import {updateEstimate} from "../../../../../redux/usageEstimates/estimate/actions";
import {useAppDispatch, useAppSelector} from "../../../../../redux/hooks";
import {RootState} from "../../../../../redux/store";
import {getFormattedDateTimeAbstract, localeStringReferenceId} from "../../../../../utils/utility";
import {BillForm} from "../../Common/form/bill/Bill.form";
import {UsageEstimateForm} from "./usage/UsageEstimate.form";
import {
  EstimateInitialValue,
  validationSchemaBilling,
  validationSchemaEstimate
} from "../../Common/formik/Formik.config";
import {SendDialog} from "../../Common/dialog/SendDialog";


interface EstimateFormProps {
  detail: EstimatePeriod;
  onEstimateValidated?: () => void;
}

export function EstimateForm(props: EstimateFormProps) {
  const {t} = useTranslation(['estimate'], {keyPrefix: "estimate.edit"});
  const dispatch = useAppDispatch();
  const [btnType, setBtnType] = useState(StatusUpdateEnum.DRAFT);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const validationSchema = yup.object({...validationSchemaEstimate(t), ...validationSchemaBilling(t)});
  
  const formik = useFormik({
    initialValues: EstimateInitialValue(props.detail.estimate, props.detail.billing),
    validationSchema,
    onSubmit: (values) => {
      const estimateBodyRequest = {
        totalDigitalNotif: values.totalDigitalNotif,
        total890Notif: values.total890Notif,
        totalAnalogNotif: values.totalAnalogNotif,
        splitPayment: values.splitPayment,
        description: (!values.description || values.description === null) ? "" : values.description,
        mailAddress: values.mailAddress
      };

      void dispatch(updateEstimate({paId: loggedUser.organization.id, referenceMonth: props.detail.referenceMonth, status: btnType, body: estimateBodyRequest}))
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
      <BillForm formikInstance={formik} data-testid={"bill-form"}/>
      <Grid item container direction="row" justifyContent="flex-end" >
        <Stack direction={"row"} spacing={2}>
          {(props.detail.status === StatusUpdateEnum.DRAFT)
            ?
              <LoadingButton variant={"outlined"} type="submit" onClick={() => setBtnType(StatusUpdateEnum.DRAFT)} data-testid={"btn-save-estimate"}>{t('button.save-edit')}</LoadingButton>
            :
              null
          }
          <ButtonSendEstimate refMonth={props.detail.referenceMonth} deadlineDate={props.detail.deadlineDate} estimateStatus={props.detail.status} setBtnType={setBtnType} submit={formik.handleSubmit}/>
        </Stack>
      </Grid>
    </form>
  </Fragment>;
}


interface ButtonProps {
  refMonth: string;
  deadlineDate: string;
  estimateStatus: EstimateStatusEnum;
  setBtnType: (event: StatusUpdateEnum) => void;
  submit: () => void;
}

const ButtonSendEstimate = (props: ButtonProps) => {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation(['estimate'], {keyPrefix: "estimate"});

  const getButtonTitle = () => {
    if(props.estimateStatus === StatusUpdateEnum.DRAFT) {
      return t('edit.button.send-edit');
    } else {
      return t('edit.button.edit');
    }
  };

  const handlePositive = () => {
    props.setBtnType(StatusUpdateEnum.VALIDATED);
    props.submit();
    setOpen(false);
  };

  const handleNegative = () => {
    setOpen(false);
  };

  const onSendClick = () => {
    setOpen(true);
  };

  return <>
    <LoadingButton variant={"contained"}
                   type="button"
                   data-testid={"btn-open-dialog"}
                   onClick={()=> onSendClick()}>
      {getButtonTitle()}
    </LoadingButton>

    <SendDialog title={t('dialog.send-dialog-title') + " " + localeStringReferenceId(props.refMonth) + "?"}
                message={t('dialog.send-dialog-message')  + getFormattedDateTimeAbstract(props.deadlineDate, t('edit.label.date-time-format'))}
                open={open}
                onClickNegative={handleNegative}
                onClickPositive={handlePositive}
                prefix={'estimate'}/>
  </>;
};