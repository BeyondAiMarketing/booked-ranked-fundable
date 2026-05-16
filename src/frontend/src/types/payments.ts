export type EstimateStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired";

export type PaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "overdue"
  | "refunded"
  | "partial";

export interface EstimateLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export interface Estimate {
  id: string;
  tenantId: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  lineItems: EstimateLineItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  status: EstimateStatus;
  notes?: string;
  validUntil?: string;
  createdAt: number;
  updatedAt: number;
  acceptedAt?: number;
  rejectedAt?: number;
  approvalNotes?: string;
}

export interface PaymentRecord {
  id: string;
  tenantId: string;
  estimateId?: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: PaymentStatus;
  method?: "card" | "bank_transfer" | "cash" | "check" | "other";
  stripePaymentIntentId?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  paidAt?: number;
  notes?: string;
  createdAt: number;
}
