import {Typography} from "@mui/material";
import {format} from "date-fns";
import { EstimateStatusChip } from "../statusChip";
import {BillingDetail, EstimateDetail, EstimatePeriod, PaInfo} from "../../../../models/UsageEstimation";
import {RowDataInfo} from "./DataInfo";

export const usageInfoPA: Array<RowDataInfo<PaInfo>> = [
  {
    id: "paName",
    label: "label.subject-name",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.paName}</Typography>
  },
  {
    id: "businessName",
    label: "label.business-name",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.address}</Typography>
  },
  {
    id: "taxId",
    label: "label.tax-id",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.taxId}</Typography>
  },

  {
    id: "ipaCode",
    label: "label.ipa-code",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.ipaCode}</Typography>
  },
  {
    id: "sdiCode",
    label: "label.sdi-code",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.sdiCode) ? data.sdiCode : "-"}</Typography>
  },
  {
    id: "pec",
    label: "label.pec",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.pec}</Typography>
  },
];

export const usagePeriod: Array<RowDataInfo<EstimatePeriod>> = [
  {
    id: "reference",
    label: "label.reference-period",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.referenceMonth}</Typography>
  },{
    id: "deadlineDate",
    label: "label.deadline-period",
    type: "ROW",
    render: (data) =><Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.deadlineDate) ? format(new Date(data.deadlineDate), "dd/MM/yyyy") : "-"}</Typography>
  },{
    id: "status",
    label: "label.status-period",
    type: "ROW",
    render: (data) => <EstimateStatusChip data={data.status}/>
  },{
    id: "insertDate",
    label: "label.start-date-period",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.lastModifiedDate) ? format(new Date(data.lastModifiedDate), "dd/MM/yyyy HH:mm") : "-"}</Typography>
  },
];

export const usageBillingDataPA: Array<RowDataInfo<BillingDetail>> = [

  {
    id: "splitPayment",
    label: "label.split-payment-profiling",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.splitPayment) ? "Si" : "No"}</Typography>
  },
  {
    id: "mailAddress",
    label: "label.email-profiling",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.mailAddress) ? data.mailAddress : "-"}</Typography>
  },
  {
    id: "description",
    label: "label.other-description-profiling",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.description) ? data.description : "-"}</Typography>
  },
];

export const usageEstimations: Array<RowDataInfo<EstimateDetail>> = [
  {
    id: "totalDigitalNotif",
    label: "label.digital-notif-estimate",
    type: "ROW",
    render: (data) => <Typography variant="body2" textAlign={"end"} sx={{fontWeight: "bold"}}>{data.totalDigitalNotif}</Typography>
  },
  {
    id: "totalPaperNationalNotif",
    label: "label.analog-notif-estimate",
    type: "ROW",
    render: (data) => <Typography variant="body2" textAlign={"end"} sx={{fontWeight: "bold"}}>{data.totalAnalogNotif}</Typography>
  },
  {
    id: "totalPaperInternationalNotif",
    label: "label.analog-890-notif-estimate",
    type: "ROW",
    render: (data) =><Typography variant="body2"  textAlign={"end"} sx={{fontWeight: "bold"}}>{data.total890Notif}</Typography>
  },
  {
    id: "divider-total",
    label: undefined,
    type: "DIVIDER",
  },
  {
    id: "totalNotif",
    label: "label.total-notif",
    type: "ROW",
    labelWeight: "bold",
    labelVariant: "subtitle1",
    render: (data) => <Typography variant="subtitle1" textAlign={"end"} sx={{fontWeight: "bold"}}>{data.total890Notif + data.totalAnalogNotif + data.totalDigitalNotif}</Typography>
  },
  {
    id: "totDigitalNotif",
    label: "label.total-digital-notif",
    type: "ROW",
    labelWeight: "600",
    render: (data) => <Typography variant="body2" textAlign={"end"} sx={{fontWeight: "600"}}>{data.totalDigitalNotif}</Typography>
  },
  {
    id: "totAnalogNotif",
    label: "label.total-analog-notif",
    type: "ROW",
    labelWeight: "600",
    render: (data) => <Typography variant="body2" textAlign={"end"} sx={{fontWeight: "600"}}>{data.total890Notif + data.totalAnalogNotif}</Typography>
  },

];