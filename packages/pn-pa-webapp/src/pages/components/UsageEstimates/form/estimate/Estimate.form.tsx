import {Fragment, useState} from "react";
import {useFormik,
  // useFormikContext
} from "formik";
import {Grid, Stack} from "@mui/material";
// import { useNavigate} from "react-router-dom";
import * as yup from "yup";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "@mui/lab";
// import * as routes from "../../../../../navigation/routes.const";
import {EstimatePeriod, EstimateStatusEnum, StatusUpdateEnum} from "../../../../../models/UsageEstimation";
import {updateEstimate} from "../../../../../redux/usageEstimation/actions";
import {useAppDispatch, useAppSelector} from "../../../../../redux/hooks";
import {RootState} from "../../../../../redux/store";
import {localeStringReferenceMonth} from "../../../../../utils/utility";
import {BillForm} from "./bill/Bill.form";
import {UsageEstimateForm} from "./usage/UsageEstimate.form";
import {UsageEstimatesInitialValue} from "./props/Estimate.props";
import {SendEstimateDialog} from "./dialog/SendEstimateDialog";



interface EstimateFormProps {
  detail: EstimatePeriod;
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
    initialValues: UsageEstimatesInitialValue(props.detail.estimate, props.detail.billing),
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      const estimateBodyRequest = {
        totalDigitalNotif: values.totalDigitalNotif,
        total890Notif: values.total890Notif,
        totalAnalogNotif: values.totalAnalogNotif,
        splitPayment: values.splitPayment,
        description: (!values.description || values.description === null) ? "" : values.description,
        mailAddress: values.mailAddress
      };

      void dispatch(updateEstimate({paId: loggedUser.organization.id, referenceMonth: props.detail.referenceMonth,
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
          {(props.detail.status === StatusUpdateEnum.DRAFT)
            ?
              <LoadingButton variant={"outlined"} type="submit" onClick={() => setBtnType(StatusUpdateEnum.DRAFT)}>{t('edit-estimate.button.save-edit')}</LoadingButton>
            :
              null
          }
          <ButtonSendEstimate refMonth={props.detail.referenceMonth} estimateStatus={props.detail.status} setBtnType={setBtnType} submit={formik.handleSubmit}/>
        </Stack>
      </Grid>
    </form>
  </Fragment>;
}


interface ButtonProps {
  refMonth: string;
  estimateStatus: EstimateStatusEnum;
  setBtnType: (event: StatusUpdateEnum) => void;
  submit: () => void;
}

const ButtonSendEstimate = (props: ButtonProps) => {
  const [open, setOpen] = useState(false);
  // const navigate = useNavigate();
  const { t } = useTranslation(['estimate']);
  // const { submitForm } = useFormikContext();

  const getButtonTitle = () => {
    if(props.estimateStatus === StatusUpdateEnum.DRAFT) {
      return t('edit-estimate.button.send-edit');
    } else {
      return t('edit-estimate.button.update-edit');
    }
  };

  const handlePositive = () => {
    props.setBtnType(StatusUpdateEnum.VALIDATED);
    // void submitForm();
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
                   onClick={()=> onSendClick()}>
      {getButtonTitle()}
    </LoadingButton>

    <SendEstimateDialog title={t('edit-estimate.label.send-dialog-title') + " " + localeStringReferenceMonth(props.refMonth) + "?"}
                 message={t('edit-estimate.label.send-dialog-message')}
                 open={open}
                 onClickNegative={handleNegative}
                 onClickPositive={handlePositive}/>
  </>;
};