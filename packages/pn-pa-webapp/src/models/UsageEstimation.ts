
export interface PaInfo {
  paId: string;
  paName: string;
  taxId: string;
  address: string;
  fiscalCode: string;
  ipaCode: string;
  pec: string;
}

export interface EstimateBodyRequest {
  totalDigitalNotif: number;
  totalPaper890Notif: number;
  totalPaperNationalNotif: number;
  totalPaperInternationalNotif: number;
  billing: {
    sdiCode: string;
    splitPayment: boolean;
    description: string;
    mailAddress: string;
  };
}

export interface EstimateDetail {
  totalDigitalNotif: number;
  totalPaper890Notif: number;
  totalPaperNationalNotif: number;
  totalPaperInternationalNotif: number;
}

export interface EstimatePeriod {
  paInfo: PaInfo;
  status: EstimateStatusEnum;
  showEdit: boolean;
  deadlineDate: string;
  referenceMonth: string;
  lastModifiedTimestamp: string;
  estimate: EstimateDetail;
  billing: BillingDetail;
}

export const EstimateStatusEnum = {
  DRAFT: 'DRAFT',
  VALIDATED: 'VALIDATED',
  ABSENT: 'ABSENT',
} as const;

export type EstimateStatusEnum = typeof EstimateStatusEnum[keyof typeof EstimateStatusEnum];

export interface EstimateSearchTable {
  referenceMonth: string;
  lastModifiedTimestamp: string;
  deadlineDate: string;
  status: EstimateStatusEnum;
}

export interface InfoDownload {
  paId?: string;
  status?: InfoDownloadStatusEnum;

}

export const InfoDownloadStatusEnum = {
  Uploading: 'UPLOADING',
  Uploaded: 'UPLOADED'
} as const;

export type InfoDownloadStatusEnum = typeof InfoDownloadStatusEnum[keyof typeof InfoDownloadStatusEnum];


export type FilterRequestEstimate = {
  paId: string;
  page: number;
  tot: number;
};

export type Filter = {
  costCode: string;
};

export type Page<T> = {
  'number' : number;
  size: number;
  totalElements: number;
  content: Array<T>;
};

export interface Profiling {
  paInfo: PaInfo;
  profiles: Array<ProfilingDetail>;

}

export interface ProfilingDetail {
  billing: BillingDetail;
  status: EstimateStatusEnum;
  deadlineDate?: string;
  referenceYear: string;
  showEdit: boolean;
}

export interface BillingDetail {
  sdiCode: string;
  splitPayment: boolean;
  description: string;
  mailAddress: string;

}

export enum StatusUpdateEnum {
  DRAFT = "DRAFT",
  VALIDATED = "VALIDATED"
}