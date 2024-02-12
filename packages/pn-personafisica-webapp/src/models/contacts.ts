export enum LegalChannelType {
  PEC = 'PEC',
  EVINOTICE = 'EVINOTICE',
}

export enum CourtesyChannelType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IOMSG = 'APPIO',
}

export enum IOAllowedValues {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export interface DigitalAddress {
  addressType: string;
  recipientId: string;
  senderId: string;
  senderName?: string;
  channelType: LegalChannelType | CourtesyChannelType;
  value: string;
  requestId?: string;
  pecValid?: boolean;
  eviNoticeValid?: boolean;
  codeValid?: boolean;
}

export interface DigitalAddresses {
  legal: Array<DigitalAddress>;
  courtesy: Array<DigitalAddress>;
}
