import {EstimateDetail} from "../../../../models/UsageEstimation";


interface ActualEstimateCardProps {
  data: EstimateDetail;
}


export function ActualEstimateCard (props:ActualEstimateCardProps) {
  console.log(props.data);
  return null;
}