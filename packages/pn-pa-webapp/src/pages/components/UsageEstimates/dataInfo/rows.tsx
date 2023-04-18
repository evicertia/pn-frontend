import {Typography} from "@mui/material";
import {format} from "date-fns";
import { EstimateStatusChip } from "../statusChip";
import {BillingDetail, EstimateDetail, EstimatePeriod, PaInfo} from "../../../../models/UsageEstimation";
import {RowDataInfo} from "./DataInfo";

export const usageInfoPA: Array<RowDataInfo<PaInfo>> = [
  {
    id: "paName",
    label: "label.subject-name",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.paName}</Typography>
  },
  {
    id: "businessName",
    label: "label.business-name",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.address}</Typography>
  },
  {
    id: "taxId",
    label: "label.tax-id",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.taxId}</Typography>
  },

  {
    id: "ipaCode",
    label: "label.ipa-code",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.ipaCode}</Typography>
  },
  {
    id: "sdiCode",
    label: "label.sdi-code",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.sdiCode) ? data.sdiCode : "-"}</Typography>
  },
  {
    id: "pec",
    label: "label.pec",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.pec}</Typography>
  },
];

export const usagePeriod: Array<RowDataInfo<EstimatePeriod>> = [
  {
    id: "reference",
    label: "label.reference-period",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.referenceMonth}</Typography>
  },{
    id: "deadlineDate",
    label: "label.deadline-period",
    render: (data) =><Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.deadlineDate) ? format(new Date(data.deadlineDate), "dd/MM/yyyy") : "-"}</Typography>
  },{
    id: "status",
    label: "label.status-period",
    render: (data) => <EstimateStatusChip data={data.status}/>
  },{
    id: "insertDate",
    label: "label.start-date-period",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.lastModifiedDate) ? format(new Date(data.lastModifiedDate), "dd/MM/yyyy HH:mm") : "-"}</Typography>
  },
];

export const usageBillingDataPA: Array<RowDataInfo<BillingDetail>> = [

  {
    id: "splitPayment",
    label: "label.split-payment-profiling",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.splitPayment) ? "Si" : "No"}</Typography>
  },
  {
    id: "mailAddress",
    label: "label.email-profiling",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.mailAddress) ? data.mailAddress : "-"}</Typography>
  },
  {
    id: "description",
    label: "label.other-description-profiling",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.description) ? data.description : "-"}</Typography>
  },
];

export const usageEstimations: Array<RowDataInfo<EstimateDetail>> = [
  {
    id: "totalDigitalNotif",
    label: "label.digital-notif-estimate",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.totalDigitalNotif}</Typography>
  },
  {
    id: "totalPaperNationalNotif",
    label: "label.analog-notif-estimate",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.totalAnalogNotif}</Typography>
  },
  {
    id: "totalPaperInternationalNotif",
    label: "label.analog-890-notif-estimate",
    render: (data) =><Typography variant="body2" sx={{fontWeight: "bold"}}>{data.total890Notif}</Typography>
  },
  {
    id: "totDigitalNotif",
    label: "label.total-digital-notif",
    labelWeight: "bold",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.totalDigitalNotif}</Typography>
  },
  {
    id: "totAnalogNotif",
    label: "label.total-analog-notif",
    labelWeight: "bold",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.total890Notif + data.totalAnalogNotif}</Typography>
  },
  {
    id: "totalNotif",
    label: "label.total-notif",
    labelWeight: "bold",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.total890Notif + data.totalAnalogNotif + data.totalDigitalNotif}</Typography>
  },
];