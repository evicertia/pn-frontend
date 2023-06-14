import {Button, Card, Grid, Stack, Typography} from "@mui/material";
import {Tag} from "@pagopa/mui-italia";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "@mui/lab";
import {appStateActions} from "@pagopa-pn/pn-commons";
import {EstimatePeriod, EstimateStatusEnum} from "../../../../models/UsageEstimation";
import {
  getDateString,
  getFormattedDateTime,
  getFormattedDateTimeAbstract,
  localeStringReferenceMonth
} from "../../../../utils/utility";
import {EstimateStatusChip} from "../statusChip";
import {GET_EDIT_ESTIMATE_PATH} from "../../../../navigation/routes.const";
import {SendEstimateDialog} from "../form/estimate/dialog/SendEstimateDialog";
import {validatedEstimate} from "../../../../redux/usageEstimation/actions";
import {useAppDispatch} from "../../../../redux/hooks";


interface ActualEstimateCardProps {
  paId: string;
  data: EstimatePeriod;
}


export function ActualEstimateCard (props:ActualEstimateCardProps) {
  const { t } = useTranslation(['estimate']);

  return <>
    <Card sx={{
      width: 1,
      padding: "1rem 2rem",
      marginBottom: "1rem",
      backgroundColor: "background.paper",
    }}>
      <Stack spacing={2}>
        <Grid container direction={"row"} justifyContent={"space-between"}>
          <Typography fontWeight={"600"} variant={"h6"}>
            {t('actual-estimate.card.label.number-notify-estimate').concat(localeStringReferenceMonth(props.data.referenceMonth))}
          </Typography>
          {
            (props.data.lastModifiedDate) && <EstimateStatusChip data={props.data.status}/>
          }
        </Grid>
        <Grid container direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"column"}>
            <Typography variant={"body2"} fontWeight={400} color={"#5C6F82"}>
              {t('actual-estimate.card.label.digital-notif-estimate')}
            </Typography>
            <Typography variant={"h5"} fontWeight={600} color={"primary"}>
              {props.data?.estimate?.totalDigitalNotif || t('actual-estimate.card.label.estimate-to-complete')}
            </Typography>
          </Stack>
          <Stack direction={"column"}>
            <Typography variant={"body2"} fontWeight={400} color={"#5C6F82"}>
              {t('actual-estimate.card.label.analog-890-notif-estimate')}
            </Typography>
            <Typography variant={"h5"} fontWeight={600} color={"primary"}>
              {props.data?.estimate?.total890Notif || t('actual-estimate.card.label.estimate-to-complete')}
            </Typography>
          </Stack>
          <Stack direction={"column"}>
            <Typography variant={"body2"} fontWeight={400} color={"#5C6F82"}>
              {t('actual-estimate.card.label.analog-notif-estimate')}
            </Typography>
            <Typography variant={"h5"} fontWeight={600} color={"primary"}>
              {props.data?.estimate?.totalAnalogNotif || t('actual-estimate.card.label.estimate-to-complete')}
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
  const {t} = useTranslation(['estimate']);

  return <Stack direction={"column"} sx={{alignSelf: "end"}} spacing={.5}>
    {
      (props.data.lastModifiedDate) && <Typography fontWeight={"400"} variant={"caption"} color={"#5C6F82"}>
        {t('actual-estimate.card.label.last-modify').concat(getDateString(props.data.lastModifiedDate))}
        </Typography>
    }
    <Tag
      color={(props.data.lastModifiedDate) ? "warning" : "default"}
      value={t('actual-estimate.card.label.editable').concat(`${getFormattedDateTime(props.data.deadlineDate)}`)}
      variant="default"
    />
  </Stack>;
};

const ButtonsGroup = (props: ActualEstimateCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['estimate']);

  if (!props.data.lastModifiedDate && props.data.status === EstimateStatusEnum.DRAFT){
    return <Button data-testid="create-button-test-id"
        variant="outlined"
                   onClick={() => {
                     navigate(GET_EDIT_ESTIMATE_PATH(props.data.referenceMonth));
                   }}>
      {t('actual-estimate.card.button.create-estimate')}
    </Button>;
  } else if (props.data.lastModifiedDate && props.data.status === EstimateStatusEnum.DRAFT) {
    return <>
      <Button variant="outlined"
              onClick={() => {
                navigate(GET_EDIT_ESTIMATE_PATH(props.data.referenceMonth));
              }}>
        {t('actual-estimate.card.button.edit-estimate')}
      </Button>

      <ButtonSendEstimate  paId={props.paId} referenceMonth={props.data.referenceMonth} deadlineDate={props.data.deadlineDate}/>
    </>;
  } else if (props.data.status === EstimateStatusEnum.VALIDATED) {
    return <Button data-testid="update-after-validation-button-test-id"
                    variant="contained"
                    onClick={() => {
                     navigate(GET_EDIT_ESTIMATE_PATH(props.data.referenceMonth));
                   }}>
      {t('actual-estimate.card.button.edit-estimate')}
    </Button>;
  }
  return null;
};

const ButtonSendEstimate = (props: {paId: string; referenceMonth: string; deadlineDate: string}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(['estimate']);
  const dispatch = useAppDispatch();

  const handlePositive = () => {
    void dispatch(validatedEstimate({
      paId: props.paId,
      referenceMonth: props.referenceMonth
    })).unwrap()
      .then(()=> {
        dispatch(appStateActions.addSuccess({
          title: t('actual-estimate.toast-message.success.title'),
          message: t('actual-estimate.toast-message.success.message')
        }));
        setOpen(false);
      })
      .catch(()=>{
        dispatch(appStateActions.addError({
          title: t('actual-estimate.toast-message.error.title'),
          message: t('actual-estimate.toast-message.error.message')
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
      {t('actual-estimate.card.button.send-estimate')}
    </LoadingButton>

    <SendEstimateDialog data-testid="dialog-test-id"
                        title={t('dialog.send-dialog-title') + " " + localeStringReferenceMonth(props.referenceMonth) + "?"}
                        message={t('dialog.send-dialog-message') + getFormattedDateTimeAbstract(props.deadlineDate, t('edit-estimate.label.date-time-format'))}
                        open={open}
                        onClickNegative={handleNegative}
                        onClickPositive={handlePositive}/>
  </>;
};