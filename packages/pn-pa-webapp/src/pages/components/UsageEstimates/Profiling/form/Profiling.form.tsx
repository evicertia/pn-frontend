import {Fragment, useState} from "react";
import {useFormik} from "formik";
import {Grid, Stack} from "@mui/material";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "@mui/lab";
import * as yup from "yup";
import {ProfilingPeriod, EstimateStatusEnum, StatusUpdateEnum} from "../../../../../models/UsageEstimation";
import {updateProfiling} from "../../../../../redux/usageEstimates/profiling/actions";
import {useAppDispatch, useAppSelector} from "../../../../../redux/hooks";
import {RootState} from "../../../../../redux/store";
import {getFormattedDateTimeAbstract, localeStringReferenceId} from "../../../../../utils/utility";
import {SendDialog } from "../../Common/dialog/SendDialog";
import {BillForm } from "../../Common/form/bill/Bill.form";
import {ProfilingInitialValue, validationSchemaBilling} from "../../Common/formik/Formik.config";


interface ProfilingFormProps {
  detail: ProfilingPeriod;
  onProfilingValidated?: () => void;
}

export function ProfilingForm(props: ProfilingFormProps) {
  const {t} = useTranslation(['estimate'], {keyPrefix: "profiling.edit"});
  const dispatch = useAppDispatch();
  const [btnType, setBtnType] = useState(StatusUpdateEnum.DRAFT);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const validationSchema = yup.object({...validationSchemaBilling(t)});

  const formik = useFormik({
    initialValues: ProfilingInitialValue(props.detail.billing),
    validationSchema,
    onSubmit: (values) => {
      const estimateBodyRequest = {
        splitPayment: values.splitPayment,
        description: (!values.description || values.description === null) ? "" : values.description,
        mailAddress: values.mailAddress
      };

      void dispatch(updateProfiling({paId: loggedUser.organization.id, referenceYear: props.detail.referenceYear, status: btnType, body: estimateBodyRequest}))
        .unwrap()
        .then(()=> {
          if(btnType === StatusUpdateEnum.VALIDATED) {
            props.onProfilingValidated?.();
          }
        });
    },
  });

  return <Fragment>
    <form onSubmit={formik.handleSubmit}>
      <BillForm formikInstance={formik} data-testid={"bill-form"}/>
      <Grid item container direction="row" justifyContent="flex-end" >
        <Stack direction={"row"} spacing={2}>
          {(props.detail.status === StatusUpdateEnum.DRAFT)
            ?
            <LoadingButton variant={"outlined"} type="submit" onClick={() => setBtnType(StatusUpdateEnum.DRAFT)} data-testid={"btn-save-profiling"}>{t('button.save-edit')}</LoadingButton>
            :
            null
          }
          <ButtonSendProfiling refYear={props.detail.referenceYear} deadlineDate={props.detail.deadlineDate} estimateStatus={props.detail.status} setBtnType={setBtnType} submit={formik.handleSubmit}/>
        </Stack>
      </Grid>
    </form>
  </Fragment>;
}


interface ButtonProps {
  refYear: string;
  deadlineDate: string;
  estimateStatus: EstimateStatusEnum;
  setBtnType: (event: StatusUpdateEnum) => void;
  submit: () => void;
}

const ButtonSendProfiling = (props: ButtonProps) => {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation(['estimate'], {keyPrefix: "profiling"});

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

    <SendDialog title={t('dialog.send-dialog-title') + " " + localeStringReferenceId(props.refYear) + "?"}
                        message={t('dialog.send-dialog-message')  + getFormattedDateTimeAbstract(props.deadlineDate, t('edit.label.date-time-format'))}
                        open={open}
                        onClickNegative={handleNegative}
                        onClickPositive={handlePositive}
                        prefix={'profiling'}/>
  </>;
};