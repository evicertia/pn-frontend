
export interface Estimate {
  paId: string;
  paName: string;
  taxId: string;
  address: string;
  fiscalCode: string;
  ipaCode: string;
  sdiCode: string;
  splitPayment: boolean;
  description: string;
  pec: string;
  mailAddress: string;
  status: EstimateStatusEnum;
  deadlineDate: string;
  referenceMonth: string;
  totalDigitalNotif: number;
  totalPaper890Notif: number;
  totalPaperNationalNotif: number;
  totalPaperInternationalNotif: number;
  lastModifiedTimestamp: string;
}

export const EstimateStatusEnum = {
  Created: 'CREATED',
  Validated: 'VALIDATED',
  InProgress: 'IN_PROGRESS',
  Ended: 'ENDED'
} as const;

export type EstimateStatusEnum = typeof EstimateStatusEnum[keyof typeof EstimateStatusEnum];

export interface EstimateSearchTable {
  referenceMonth?: string;
  lastModifiedTimestamp?: string;
  status?: EstimateStatusEnum;
  checkPDND?: boolean;
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

export interface BillingTimeline {
  sdiCode: string;
  splitPayment: boolean;
  description: string;
  mailAddress: string;
  deadlineDate: string;
  referenceYear: string;
  lastModifiedTimestamp: string;
  onboardingDate: string;
  status: EstimateStatusEnum;
}

export interface BillingDetail {
  paId: string;
  paName: string;
  taxId: string;
  address: string;
  fiscalCode: string;
  ipaCode: string;
  pec: string;
  sdiCode: string;
  splitPayment: boolean;
  description: string;
  mailAddress: string;
  deadlineDate: string;
  referenceYear: string;
  lastModifiedTimestamp: string;
  onboardingDate: string;
  status: EstimateStatusEnum;
}