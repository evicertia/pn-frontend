import {Typography, Stack} from "@mui/material";
import { EstimateStatusChip } from "../../statusChip";
import {
  BillingDetail,
  Estimate,
  EstimatePeriod, FileReport,
  PaInfo
} from "../../../../../../models/UsageEstimation";
import {getFormattedDateTime, localeStringReferenceId} from "../../../../../../utils/utility";
import {RowDataInfo} from "../DataInfo";
import {RowFileReport} from "../../fileReport/RowFileReport";


export const usagePeriod: Array<RowDataInfo<EstimatePeriod>> = [
  {
    id: "reference",
    label: "estimate.detail.data-info.period-reference",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{localeStringReferenceId(data.referenceMonth)}</Typography>
  },{
    id: "deadlineDate",
    label: "estimate.detail.data-info.period-deadline",
    type: "ROW",
    render: (data) =><Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.deadlineDate) ? getFormattedDateTime(data.deadlineDate, "ore") : "-"}</Typography>
  },
  {
    id: "lastModifiedDate",
    label: "estimate.detail.data-info.period-last-modified-date",    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.lastModifiedDate) ? getFormattedDateTime(data.lastModifiedDate, "ore") : "-"}</Typography>
  },
  {
    id: "status",
    label: "estimate.detail.data-info.period-status",
    type: "ROW",
    render: (data) => <EstimateStatusChip data={data.status} prefix={'estimate'}/>
  }
];

export const usageEstimations: Array<RowDataInfo<Estimate>> = [
  {
    id: "totalDigitalNotif",
    label: "estimate.detail.data-info.usage-estimate-digital-notif",
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
    label: "estimate.detail.data-info.usage-estimate-analog-notif",
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
    label: "estimate.detail.data-info.usage-estimate-analog-890-notif",
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
    label: "estimate.detail.data-info.usage-estimate-total-notif",
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
    label: "estimate.detail.data-info.usage-estimate-total-digital-notif",
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
    label: "estimate.detail.data-info.usage-estimate-total-analog-notif",
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
    label: "estimate.detail.data-info.billing-sdi-code",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.sdiCode) ? data.sdiCode : "-"}</Typography>
  },
  {
    id: "splitPayment",
    label: "estimate.detail.data-info.billing-split-payment",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.splitPayment) ? "Si" : "No"}</Typography>
  },
  {
    id: "mailAddress",
    label: "estimate.detail.data-info.billing-email",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.mailAddress) ? data.mailAddress : "-"}</Typography>
  },
  {
    id: "description",
    label: "estimate.detail.data-info.billing-other-description",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.description) ? data.description : "-"}</Typography>
  },
];

export const usageInfoPA: Array<RowDataInfo<PaInfo>> = [
  {
    id: "paName",
    label: "estimate.detail.data-info.pa-info-subject-name",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.paName}</Typography>
  },
  {
    id: "businessName",
    label: "estimate.detail.data-info.pa-info-business-name",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.address}</Typography>
  },
  {
    id: "taxId",
    label: "estimate.detail.data-info.pa-info-tax-id",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.taxId}</Typography>
  }
];

export const rowFilesReports: Array<RowDataInfo<Array<FileReport>>> = [
  {
    id: "fileReport",
    label: undefined,
    type: "LIST",
    render: (reports) => (
      <Stack direction={"column"} spacing={2} >
        {
          reports.map((report) => <RowFileReport key={report.reportKey} report={report}/>)
        }
      </Stack>
    )
  }
];