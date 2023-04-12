import {Chip} from "@mui/material";
import {EstimateStatusEnum} from "../../../../models/UsageEstimation";


export function EstimateStatusChip(props:{data:EstimateStatusEnum}) {

  if (props.data === EstimateStatusEnum.Created) {
      return (<Chip color={"warning"} label={"IN AGGIORNAMENTO"}/>);
  }
  if (props.data === EstimateStatusEnum.Validated) {
    return <Chip color={"success"} label={"CONSOLIDATO"}/>;
  }
  if (props.data === EstimateStatusEnum.InProgress) {
    return <Chip color={"primary"} label={"IN CORSO"}/>;
  }
  if (props.data === EstimateStatusEnum.Ended) {
    return <Chip color={"error"} label={"ASSENTE"}/>;
  }
  return <Chip label={"-"}/>;
}