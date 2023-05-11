import {Button, Card, Grid, Stack, Typography} from "@mui/material";
import {Tag} from "@pagopa/mui-italia";
import {EstimateSearchTable} from "../../../../models/UsageEstimation";
import {getFormattedDateTime, localeStringReferenceMonth} from "../../../../utils/utility";
import {EstimateStatusChip} from "../statusChip";


interface ActualEstimateCardProps {
  data: EstimateSearchTable;
}


export function ActualEstimateCard (props:ActualEstimateCardProps) {
  console.log(props.data);
  return <>
    <Card sx={{
      width: 1,
      padding: "1rem 2rem",
      backgroundColor: "background.paper",
    }}>
      <Stack spacing={2}>
        <Grid container direction={"row"} justifyContent={"space-between"}>
          <Typography fontWeight={"600"} variant={"h6"}>
            Numero di notifiche stimate per {localeStringReferenceMonth(props.data.referenceMonth)}
          </Typography>
          <EstimateStatusChip data={props.data.status}/>
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
          <div style={{alignSelf: "end"}}>
            <Tag
              color="default"
              value={`Modificabile fino al ${getFormattedDateTime(props.data.deadlineDate)}`}
              variant="default"
            />
          </div>

          <Button variant="outlined">
            Crea Stima
          </Button>
        </Grid>
      </Stack>
    </Card>
  </>;
}