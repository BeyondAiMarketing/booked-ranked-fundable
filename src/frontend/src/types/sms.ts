export type SMSDirection = "inbound" | "outbound";
export type SMSStatus = "sent" | "delivered" | "failed" | "received";

export interface SMSThread {
  id: string;
  tenantId: string;
  prospectPhone: string;
  prospectName: string;
  linkedLeadId?: string;
  archived: boolean;
  createdAt: number;
  lastMessageAt: number;
  unreadCount: number;
}

export interface SMSMessage {
  id: string;
  threadId: string;
  tenantId: string;
  direction: SMSDirection;
  sender: string;
  text: string;
  sentAt: number;
  readAt?: number;
  status: SMSStatus;
}

export type SMSThreadWithMessages = SMSThread & { messages: SMSMessage[] };
