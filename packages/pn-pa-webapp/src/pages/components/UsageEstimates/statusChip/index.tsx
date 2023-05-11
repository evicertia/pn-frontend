import {Chip, Tooltip} from "@mui/material";
import {useTranslation} from "react-i18next";
import {EstimateStatusEnum} from "../../../../models/UsageEstimation";


export function EstimateStatusChip(props:{data:EstimateStatusEnum}) {
  const { t } = useTranslation("estimate", {keyPrefix:"status"});

  if (props.data === EstimateStatusEnum.DRAFT) {
      return <Tooltip title={t("draft-label-tooltip")}>
        <Chip color={"info"} label={t("draft-label-chip")} />
      </Tooltip>;
  }
  if (props.data === EstimateStatusEnum.VALIDATED) {
    return <Tooltip title={t("validated-label-tooltip")}>
      <Chip color={"success"} label={t("validated-label-chip")} />
    </Tooltip>;
  }
  if (props.data === EstimateStatusEnum.ABSENT) {
    return <Tooltip title={t("absent-label-tooltip")}>
      <Chip color={"error"} label={t("absent-label-chip")} />
    </Tooltip>;
  }
  return <Chip label={"-"}/>;
}