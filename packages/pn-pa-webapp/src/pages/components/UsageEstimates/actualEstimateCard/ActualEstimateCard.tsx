import {Button, Card, Grid, Stack, Typography} from "@mui/material";
import {Tag} from "@pagopa/mui-italia";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {LoadingButton} from "@mui/lab";
import {appStateActions} from "@pagopa-pn/pn-commons";
import {EstimatePeriod, EstimateStatusEnum} from "../../../../models/UsageEstimation";
import {getDateString, getFormattedDateTime, localeStringReferenceMonth} from "../../../../utils/utility";
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
  const navigate = useNavigate();



  const TagEditDate = () => (
    <Stack direction={"column"} sx={{alignSelf: "end"}} spacing={.5}>
      {
        (props.data.lastModifiedDate) && <Typography fontWeight={"400"} variant={"caption"} color={"#5C6F82"}>
              Ultima modifica {getDateString(props.data.lastModifiedDate)}
          </Typography>
      }
      <Tag
        color={(props.data.lastModifiedDate) ? "warning" : "default"}
        value={`Modificabile fino al ${getFormattedDateTime(props.data.deadlineDate)}`}
        variant="default"
      />
    </Stack>
  );

  const ButtonsGroup = () => {
    if (!props.data.lastModifiedDate && props.data.status === EstimateStatusEnum.DRAFT){
      return <Button variant="outlined"
                     onClick={() => {
                       navigate(GET_EDIT_ESTIMATE_PATH(props.data.referenceMonth));
                     }}>
        Crea stima
      </Button>;
    } else if (props.data.lastModifiedDate && props.data.status === EstimateStatusEnum.DRAFT) {
      return <>
        <Button variant="outlined"
                onClick={() => {
                  navigate(GET_EDIT_ESTIMATE_PATH(props.data.referenceMonth));
                }}>
          Modifica
        </Button>

        <ButtonSendEstimate paId={props.paId} referenceMonth={props.data.referenceMonth}/>
      </>;
    } else if (props.data.status === EstimateStatusEnum.VALIDATED) {
      return <Button variant="contained"
                     onClick={() => {
                       navigate(GET_EDIT_ESTIMATE_PATH(props.data.referenceMonth));
                     }}>
        Aggiorna stima
      </Button>;
    }
    return null;
  };


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
            Numero di notifiche stimate per {localeStringReferenceMonth(props.data.referenceMonth)}
          </Typography>
          {
            (props.data.lastModifiedDate) && <EstimateStatusChip data={props.data.status}/>
          }
        </Grid>
        <Grid container direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"column"}>
            <Typography variant={"body2"} fontWeight={400} color={"#5C6F82"}>
              Digitali
            </Typography>
            <Typography variant={"h5"} fontWeight={600} color={"primary"}>
              {props.data?.estimate?.totalDigitalNotif || "Da inserire"}
            </Typography>
          </Stack>
          <Stack direction={"column"}>
            <Typography variant={"body2"} fontWeight={400} color={"#5C6F82"}>
              Analogiche con 890
            </Typography>
            <Typography variant={"h5"} fontWeight={600} color={"primary"}>
              {props.data?.estimate?.total890Notif || "Da inserire"}
            </Typography>
          </Stack>
          <Stack direction={"column"}>
            <Typography variant={"body2"} fontWeight={400} color={"#5C6F82"}>
              Analogiche con raccomandata
            </Typography>
            <Typography variant={"h5"} fontWeight={600} color={"primary"}>
              {props.data?.estimate?.totalAnalogNotif || "Da inserire"}
            </Typography>
          </Stack>
        </Grid>
        <Grid container direction={"row"} justifyContent={"space-between"}>
          <TagEditDate />
          <Stack direction={"row"} sx={{alignSelf: "end"}} spacing={.5}>
            <ButtonsGroup />
          </Stack>
        </Grid>
      </Stack>
    </Card>
  </>;
}


const ButtonSendEstimate = (props: {paId: string; referenceMonth: string}) => {
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
          title: "Stima inviata correttamente",
          message: "Stima inviata correttamente"
        }));
        setOpen(false);
      })
      .catch(()=>{
        dispatch(appStateActions.addError({
          title: "Si è verificato un errore. Riprova.",
          message: "Si è verificato un errore. Riprova.",
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
    <LoadingButton variant={"contained"}
                   type="button"
                   onClick={()=> onSendClick()}>
      {t('edit-estimate.button.send-edit')}
    </LoadingButton>

    <SendEstimateDialog title={t('edit-estimate.label.send-dialog-title') + " " + localeStringReferenceMonth(props.referenceMonth) + "?"}
                        message={t('edit-estimate.label.send-dialog-message')}
                        open={open}
                        onClickNegative={handleNegative}
                        onClickPositive={handlePositive}/>
  </>;
};

