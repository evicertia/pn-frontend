import {Button, Card, Grid, Stack, Typography} from "@mui/material";
import {Tag} from "@pagopa/mui-italia";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "@mui/lab";
import {appStateActions} from "@pagopa-pn/pn-commons";
import {EstimateStatusEnum, ProfilingPeriod} from "../../../../../models/UsageEstimation";
import {
  getDateString,
  getFormattedDateTime,
  getFormattedDateTimeAbstract,
  localeStringReferenceId
} from "../../../../../utils/utility";
import {EstimateStatusChip} from "../../Common/statusChip";
import {SendDialog} from "../../Common/dialog/SendDialog";
import {useAppDispatch} from "../../../../../redux/hooks";
import {GET_EDIT_PROFILING_PATH} from "../../../../../navigation/routes.const";
import { validatedProfiling } from "../../../../../redux/usageEstimates/profiling/actions";


interface ActualProfilingCardProps {
  paId: string;
  data: ProfilingPeriod;
}


export function ActualProfilingCard (props:ActualProfilingCardProps) {
  const {t} = useTranslation(['estimate'], {keyPrefix: "profiling.actual"});

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
            {t('card.label.profiling-year').concat(localeStringReferenceId(props.data.referenceYear))}
          </Typography>
          {
            (props.data.lastModifiedDate) && <EstimateStatusChip data={props.data.status} prefix={'profiling'}/>
          }
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


const TagEditDate = (props: {data: ProfilingPeriod}) => {
  const {t} = useTranslation(['estimate'], {keyPrefix: "profiling.actual"});

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

const ButtonsGroup = (props: ActualProfilingCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['estimate'], {keyPrefix: "profiling.actual"});

  if (!props.data.lastModifiedDate && props.data.status === EstimateStatusEnum.DRAFT){
    return <Button data-testid="create-button-test-id"
                   variant="outlined"
                   onClick={() => {
                     navigate(GET_EDIT_PROFILING_PATH(props.data.referenceYear));
                   }}>
      {t('card.button.create-profiling')}
    </Button>;
  } else if (props.data.lastModifiedDate && props.data.status === EstimateStatusEnum.DRAFT) {
    return <>
      <Button variant="outlined"
              onClick={() => {
                navigate(GET_EDIT_PROFILING_PATH(props.data.referenceYear));
              }}>
        {t('card.button.edit-profiling')}
      </Button>

      <ButtonSendProfiling data-testid="send-estimate-button-draft-test-id"  paId={props.paId} referenceYear={props.data.referenceYear} deadlineDate={props.data.deadlineDate}/>
    </>;
  } else if (props.data.status === EstimateStatusEnum.VALIDATED) {
    return <Button data-testid="update-after-validation-button-test-id"
                   variant="contained"
                   onClick={() => {
                     navigate(GET_EDIT_PROFILING_PATH(props.data.referenceYear));
                   }}>
      {t('card.button.edit-profiling')}
    </Button>;
  }
  return null;
};

const ButtonSendProfiling = (props: {paId: string; referenceYear: string; deadlineDate: string}) => {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation(['estimate'], {keyPrefix: "profiling"});
  const dispatch = useAppDispatch();

  const handlePositive = () => {
    void dispatch(validatedProfiling({
      paId: props.paId,
      referenceYear: props.referenceYear
    })).unwrap()
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
      {t('actual.card.button.send-profiling')}
    </LoadingButton>

    <SendDialog data-testid="dialog-send-profiling-test-id"
                title={t('dialog.send-dialog-title') + " " + localeStringReferenceId(props.referenceYear) + "?"}
                message={t('dialog.send-dialog-message') + getFormattedDateTimeAbstract(props.deadlineDate, t('edit.label.date-time-format'))}
                open={open}
                onClickNegative={handleNegative}
                onClickPositive={handlePositive}
                prefix={'profiling'}/>
  </>;
};