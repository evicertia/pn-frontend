import {Button, Card, Grid, Stack, Typography} from "@mui/material";
import {Tag} from "@pagopa/mui-italia";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "@mui/lab";
import {appStateActions} from "@pagopa-pn/pn-commons";
import {EstimatePeriod, EstimateStatusEnum} from "../../../../../models/UsageEstimation";
import {
  getDateString,
  getFormattedDateTime,
  getFormattedDateTimeAbstract,
  localeStringReferenceId
} from "../../../../../utils/utility";
import {EstimateStatusChip} from "../../Common/statusChip";
import {GET_EDIT_ESTIMATE_PATH} from "../../../../../navigation/routes.const";
import {SendDialog} from "../../Common/dialog/SendDialog";
import {validatedEstimate} from "../../../../../redux/usageEstimates/estimate/actions";
import {useAppDispatch} from "../../../../../redux/hooks";


interface ActualEstimateCardProps {
  paId: string;
  data: EstimatePeriod;
}

export function ActualEstimateCard (props:ActualEstimateCardProps) {
  const {t} = useTranslation(['estimate'], {keyPrefix: "estimate.actual"});

  return <>
    <Card sx={{
      width: 1,
      padding: "1rem 2rem",
      marginBottom: "1rem",
      backgroundColor: "background.paper",
    }}>
      <Stack spacing={2}>
        <Grid container direction={"row"} justifyContent={"space-between"}>
          <Typography fontWeight={"600"} variant={"h4"}>
            {t('card.label.number-notify-estimate').concat(localeStringReferenceId(props.data.referenceMonth))}
          </Typography>
          {
            (props.data.lastModifiedDate) && <EstimateStatusChip data={props.data.status} prefix={'estimate'}/>
          }
        </Grid>
        <Grid container direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"column"}>
            <Typography variant={"body2"} fontWeight={400} color={"#5C6F82"}>
              {t('card.label.digital-notif-estimate')}
            </Typography>
            <Typography variant={"h5"} fontWeight={600} data-testid="labelDigitalNotif" color={"primary"}>
              {props.data?.estimate?.totalDigitalNotif || t('card.label.estimate-to-complete')}
            </Typography>
          </Stack>
          <Stack direction={"column"}>
            <Typography variant={"body2"} fontWeight={400} color={"#5C6F82"}>
              {t('card.label.analog-890-notif-estimate')}
            </Typography>
            <Typography variant={"h5"} fontWeight={600} data-testid="label890Notif" color={"primary"}>
              {props.data?.estimate?.total890Notif || t('card.label.estimate-to-complete')}
            </Typography>
          </Stack>
          <Stack direction={"column"}>
            <Typography variant={"body2"} fontWeight={400} color={"#5C6F82"}>
              {t('card.label.analog-notif-estimate')}
            </Typography>
            <Typography variant={"h5"} fontWeight={600} data-testid="labelAnalogNotif" color={"primary"}>
              {props.data?.estimate?.totalAnalogNotif || t('card.label.estimate-to-complete')}
            </Typography>
          </Stack>
        </Grid>
        <Grid container direction={"row"} justifyContent={"space-between"}>
          <TagEditDate data-testid={"testIdTagEditDate"} data={props.data}/>
          <Stack direction={"row"} sx={{alignSelf: "end"}} spacing={.5}>
            <ButtonsGroup paId={props.paId} data={props.data}/>
          </Stack>
        </Grid>
      </Stack>
    </Card>
  </>;
}

const TagEditDate = (props: {data: EstimatePeriod}) => {
  const {t} = useTranslation(['estimate'], {keyPrefix: "estimate.actual"});

  return <Stack direction={"column"} sx={{alignSelf: "end"}} spacing={.5}>
    {
      (props.data.lastModifiedDate) && <Typography fontWeight={"400"} variant={"caption"} color={"#5C6F82"}>
        {t('card.label.last-modify').concat(getDateString(props.data.lastModifiedDate))}
        </Typography>
    }
    <Tag
      color={(props.data.lastModifiedDate) ? "warning" : "default"}
      value={t('card.label.editable').concat(`${getFormattedDateTime(props.data.deadlineDate)}`)}
      variant="default"
    />
  </Stack>;
};

const ButtonsGroup = (props: ActualEstimateCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['estimate'], {keyPrefix: "estimate.actual"});

  if (!props.data.lastModifiedDate && props.data.status === EstimateStatusEnum.DRAFT){
    return <Button data-testid="createButtonTestId"
                   variant="outlined"
                   onClick={() => {
                     navigate(GET_EDIT_ESTIMATE_PATH(props.data.referenceMonth));
                   }}>
      {t('card.button.create-estimate')}
    </Button>;
  } else if (props.data.lastModifiedDate && props.data.status === EstimateStatusEnum.DRAFT) {
    return <>
      <Button variant="outlined"
              data-testid="editDraftEstimate"
              onClick={() => {
                navigate(GET_EDIT_ESTIMATE_PATH(props.data.referenceMonth));
              }}>
        {t('card.button.edit-estimate')}
      </Button>

      <ButtonSendEstimate paId={props.paId} referenceMonth={props.data.referenceMonth} deadlineDate={props.data.deadlineDate}/>
    </>;
  } else if (props.data.status === EstimateStatusEnum.VALIDATED) {
    return <Button data-testid="editValidateEstimateButton"
                    variant="contained"
                    onClick={() => {
                     navigate(GET_EDIT_ESTIMATE_PATH(props.data.referenceMonth));
                    }}>
      {t('card.button.edit-estimate')}
    </Button>;
  }
  return null;
};

const ButtonSendEstimate = (props: {paId: string; referenceMonth: string; deadlineDate: string}) => {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation(['estimate'], {keyPrefix: "estimate"});
  const dispatch = useAppDispatch();

  const handlePositive = () => {
    void dispatch(validatedEstimate({
      paId: props.paId,
      referenceMonth: props.referenceMonth
    }))
      .unwrap()
      .then(()=> {
        dispatch(appStateActions.addSuccess({
          title: t('actual.toast-message.success.title'),
          message: t('actual.toast-message.success.message')
        }));
        setOpen(false);
      })
      .catch(()=>{
        dispatch(appStateActions.addError({
          title: t('actual.toast-message.error.title'),
          message: t('actual.toast-message.error.message')
        }));
        setOpen(false);
      });
  };

  const handleNegative = () => {
    setOpen(false);
  };

  const onSendClick = () => {
    setOpen(true);
  };

  return <>
    <LoadingButton data-testid="loading-button-test-id"
                   variant={"contained"}
                   type="button"
                   onClick={()=> onSendClick()}>
      {t('actual.card.button.send-estimate')}
    </LoadingButton>

    <SendDialog data-testid="dialog-send-estimate-test-id"
                title={t('dialog.send-dialog-title') + " " + localeStringReferenceId(props.referenceMonth) + "?"}
                message={t('dialog.send-dialog-message') + getFormattedDateTimeAbstract(props.deadlineDate, t('edit.label.date-time-format'))}
                open={open}
                onClickNegative={handleNegative}
                onClickPositive={handlePositive}
                prefix={'estimate'}/>
  </>;
};