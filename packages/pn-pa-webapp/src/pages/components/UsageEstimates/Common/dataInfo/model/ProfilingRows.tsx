import {Typography} from "@mui/material";
import { EstimateStatusChip } from "../../statusChip";
import {BillingDetail, ProfilingPeriod, PaInfo} from "../../../../../../models/UsageEstimation";
import {getFormattedDateTime, localeStringReferenceId} from "../../../../../../utils/utility";
import {RowDataInfo} from "../DataInfo";


export const profilingPeriod: Array<RowDataInfo<ProfilingPeriod>> = [
  {
    id: "reference",
    label: "profiling.detail.data-info.period-reference",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{localeStringReferenceId(data.referenceYear)}</Typography>
  },{
    id: "deadlineDate",
    label: "profiling.detail.data-info.period-deadline",
    type: "ROW",
    render: (data) =><Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.deadlineDate) ? getFormattedDateTime(data.deadlineDate, "ore") : "-"}</Typography>
  },
  {
    id: "lastModifiedDate",
    label: "profiling.detail.data-info.period-last-modified-date",    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.lastModifiedDate) ? getFormattedDateTime(data.lastModifiedDate, "ore") : "-"}</Typography>
  },
  {
    id: "status",
    label: "profiling.detail.data-info.period-status",
    type: "ROW",
    render: (data) => <EstimateStatusChip data={data.status} prefix={'profiling'}/>
  }
];

export const profilingBillingDataPA: Array<RowDataInfo<BillingDetail>> = [
  {
    id: "sdiCode",
    label: "profiling.detail.data-info.billing-sdi-code",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.sdiCode) ? data.sdiCode : "-"}</Typography>
  },
  {
    id: "splitPayment",
    label: "profiling.detail.data-info.billing-split-payment",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.splitPayment) ? "Si" : "No"}</Typography>
  },
  {
    id: "mailAddress",
    label: "profiling.detail.data-info.billing-email",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.mailAddress) ? data.mailAddress : "-"}</Typography>
  },
  {
    id: "description",
    label: "profiling.detail.data-info.billing-other-description",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{(data?.description) ? data.description : "-"}</Typography>
  },
];

export const profilingInfoPA: Array<RowDataInfo<PaInfo>> = [
  {
    id: "paName",
    label: "profiling.detail.data-info.pa-info-subject-name",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.paName}</Typography>
  },
  {
    id: "businessName",
    label: "profiling.detail.data-info.pa-info-business-name",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.address}</Typography>
  },
  {
    id: "taxId",
    label: "profiling.detail.data-info.pa-info-tax-id",
    type: "ROW",
    render: (data) => <Typography variant="body2" sx={{fontWeight: "bold"}}>{data.taxId}</Typography>
  }
];