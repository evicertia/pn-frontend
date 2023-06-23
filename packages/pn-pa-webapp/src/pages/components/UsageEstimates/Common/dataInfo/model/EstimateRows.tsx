import {Typography} from "@mui/material";
import { EstimateStatusChip } from "../../statusChip";
import {BillingDetail, Estimate, EstimatePeriod, PaInfo} from "../../../../../../models/UsageEstimation";
import {getFormattedDateTime, localeStringReferenceId} from "../../../../../../utils/utility";
import {RowDataInfo} from "../DataInfo";


export const usagePeriod: Array<RowDataInfo<EstimatePeriod>> = [
  {
    id: "reference",
    label: "detail-estimate.data-info.period-reference",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{localeStringReferenceId(data.referenceMonth)}</Typography>
  },{
    id: "deadlineDate",
    label: "detail-estimate.data-info.period-deadline",
    type: "ROW",
    render: (data) =><Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.deadlineDate) ? getFormattedDateTime(data.deadlineDate, "ore") : "-"}</Typography>
  },
  {
    id: "lastModifiedDate",
    label: "detail-estimate.data-info.period-last-modified-date",    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.lastModifiedDate) ? getFormattedDateTime(data.lastModifiedDate, "ore") : "-"}</Typography>
  },
  {
    id: "status",
    label: "detail-estimate.data-info.period-status",
    type: "ROW",
    render: (data) => <EstimateStatusChip data={data.status} prefix={'estimate'}/>
  }
];

export const usageEstimations: Array<RowDataInfo<Estimate>> = [
  {
    id: "totalDigitalNotif",
    label: "detail-estimate.data-info.usage-estimate-digital-notif",
    type: "ROW",
    render: (data) => (
      <Typography variant="body2"
                  textAlign={"end"}
                  sx={{fontWeight: "bold"}}>
        {data.totalDigitalNotif || "-"}
      </Typography>
    )
  },
  {
    id: "totalPaperNationalNotif",
    label: "detail-estimate.data-info.usage-estimate-analog-notif",
    type: "ROW",
    render: (data) => (
      <Typography variant="body2"
                  textAlign={"end"}
                  sx={{fontWeight: "bold"}}>
        {data.totalAnalogNotif || "-"}
      </Typography>
    )
  },
  {
    id: "totalPaperInternationalNotif",
    label: "detail-estimate.data-info.usage-estimate-analog-890-notif",
    type: "ROW",
    render: (data) =>(
      <Typography variant="body2"
                  textAlign={"end"}
                  sx={{fontWeight: "bold"}}>
        {data.total890Notif || "-"}
      </Typography>
    )
  },
  {
    id: "divider-total",
    label: undefined,
    type: "DIVIDER",
  },
  {
    id: "totalNotif",
    label: "detail-estimate.data-info.usage-estimate-total-notif",
    type: "ROW",
    labelWeight: "bold",
    labelVariant: "subtitle1",
    render: (data) => (
      <Typography variant="subtitle1"
                  textAlign={"end"}
                  sx={{fontWeight: "bold"}}>
        {
          (data.total890Notif && data.totalAnalogNotif && data.totalDigitalNotif) ?
            data.total890Notif + data.totalAnalogNotif + data.totalDigitalNotif
            : "-"
        }
      </Typography>
    )
  },
  {
    id: "totDigitalNotif",
    label: "detail-estimate.data-info.usage-estimate-total-digital-notif",
    type: "ROW",
    labelWeight: "600",
    render: (data) => (
      <Typography variant="body2"
                  textAlign={"end"}
                  sx={{fontWeight: "600"}}>
        {data.totalDigitalNotif || "-"}
      </Typography>
    )
  },
  {
    id: "totAnalogNotif",
    label: "detail-estimate.data-info.usage-estimate-total-analog-notif",
    type: "ROW",
    labelWeight: "600",
    render: (data) => (
      <Typography variant="body2"
                  textAlign={"end"}
                  sx={{fontWeight: "600"}}>
        {(data.total890Notif && data.totalAnalogNotif) ? data.total890Notif + data.totalAnalogNotif : "-"}
      </Typography>
    )
  },
];

export const usageBillingDataPA: Array<RowDataInfo<BillingDetail>> = [
  {
    id: "sdiCode",
    label: "detail-estimate.data-info.billing-sdi-code",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.sdiCode) ? data.sdiCode : "-"}</Typography>
  },
  {
    id: "splitPayment",
    label: "detail-estimate.data-info.billing-split-payment",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.splitPayment) ? "Si" : "No"}</Typography>
  },
  {
    id: "mailAddress",
    label: "detail-estimate.data-info.billing-email",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.mailAddress) ? data.mailAddress : "-"}</Typography>
  },
  {
    id: "description",
    label: "detail-estimate.data-info.billing-other-description",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.description) ? data.description : "-"}</Typography>
  },
];

export const usageInfoPA: Array<RowDataInfo<PaInfo>> = [
  {
    id: "paName",
    label: "detail-estimate.data-info.pa-info-subject-name",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.paName}</Typography>
  },
  {
    id: "businessName",
    label: "detail-estimate.data-info.pa-info-business-name",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.address}</Typography>
  },
  {
    id: "taxId",
    label: "detail-estimate.data-info.pa-info-tax-id",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.taxId}</Typography>
  }
];