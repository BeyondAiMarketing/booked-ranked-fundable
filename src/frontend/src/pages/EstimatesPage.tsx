import {
  AlertTriangle,
  Bell,
  CheckCircle,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Send,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { DEMO_ESTIMATES, DEMO_PAYMENT_RECORDS } from "../data/paymentsData";
import type {
  Estimate,
  EstimateLineItem,
  EstimateStatus,
  PaymentRecord,
  PaymentStatus,
} from "../types/payments";

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

function relativeTime(ts: number | string): string {
  const now = Date.now();
  const msAgo = now - (typeof ts === "number" ? ts : new Date(ts).getTime());
  const mins = Math.floor(msAgo / 60000);
  const hrs = Math.floor(msAgo / 3600000);
  const days = Math.floor(msAgo / 86400000);
  if (mins < 2) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  return new Date(typeof ts === "number" ? ts : ts).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" },
  );
}

function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false;
  return new Date(dueDate).getTime() < Date.now();
}

// ── Status configs ────────────────────────────────────────────────────────────

const ESTIMATE_STATUS: Record<EstimateStatus, { label: string; cls: string }> =
  {
    draft: { label: "Draft", cls: "status-draft" },
    sent: { label: "Sent", cls: "status-pending" },
    accepted: { label: "Accepted", cls: "status-paid" },
    rejected: { label: "Rejected", cls: "badge-rose" },
    expired: { label: "Expired", cls: "badge-amber" },
  };

const PAYMENT_STATUS: Record<PaymentStatus, { label: string; cls: string }> = {
  unpaid: { label: "Unpaid", cls: "status-draft" },
  pending: { label: "Pending", cls: "status-pending" },
  paid: { label: "Paid", cls: "status-paid" },
  overdue: { label: "Overdue", cls: "badge-rose" },
  refunded: { label: "Refunded", cls: "badge-blue" },
  partial: { label: "Partial", cls: "badge-amber" },
};

const METHOD_LABELS: Record<string, string> = {
  card: "Credit Card",
  bank_transfer: "Bank Transfer",
  cash: "Cash",
  check: "Check",
  other: "Other",
};

// ── Review Request Prompt ─────────────────────────────────────────────────────

function ReviewRequestBanner({
  customerName,
  onSend,
  onDismiss,
}: {
  customerName: string;
  onSend: () => void;
  onDismiss: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 p-4 rounded-xl border"
      style={{
        background:
          "oklch(0.62 0.18 155 / 8%) linear-gradient(135deg, oklch(0.62 0.18 155 / 6%) 0%, transparent 100%)",
        borderColor: "oklch(0.62 0.18 155 / 30%)",
      }}
      data-ocid="review_request.banner"
    >
      <div className="p-2 rounded-lg bg-emerald-500/10 shrink-0">
        <Star size={16} className="text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">
          Job completed for {customerName}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Would you like to send a review request to this customer?
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onSend}
          data-ocid="review_request.primary_button"
          className="px-3 py-1.5 rounded-lg text-xs font-medium status-paid hover:opacity-90 transition-opacity"
        >
          Send Request
        </button>
        <button
          type="button"
          onClick={onDismiss}
          data-ocid="review_request.close_button"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Line Item Builder ─────────────────────────────────────────────────────────

function LineItemRow({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: EstimateLineItem;
  index: number;
  onChange: (
    id: string,
    field: keyof EstimateLineItem,
    value: string | number,
  ) => void;
  onRemove: (id: string) => void;
}) {
  const lineTotal = item.quantity * item.unitPrice * (1 + item.taxRate);

  return (
    <div
      className="grid gap-2 p-3 rounded-lg bg-background/60 border border-border/50"
      data-ocid={`create_estimate.line_item.${index + 1}`}
    >
      <div className="flex items-start gap-2">
        <input
          className="flex-1 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 min-w-0"
          placeholder="Description of service or product"
          value={item.description}
          data-ocid={`create_estimate.description_input.${index + 1}`}
          onChange={(e) => onChange(item.id, "description", e.target.value)}
        />
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          data-ocid={`create_estimate.remove_line_button.${index + 1}`}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
          aria-label="Remove line item"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label
            htmlFor={`qty-${item.id}`}
            className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block"
          >
            Qty
          </label>
          <input
            id={`qty-${item.id}`}
            type="number"
            min={1}
            className="w-full px-2 py-1.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            value={item.quantity}
            data-ocid={`create_estimate.qty_input.${index + 1}`}
            onChange={(e) =>
              onChange(item.id, "quantity", Number(e.target.value))
            }
          />
        </div>
        <div>
          <label
            htmlFor={`price-${item.id}`}
            className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block"
          >
            Unit Price
          </label>
          <input
            id={`price-${item.id}`}
            type="number"
            min={0}
            step={0.01}
            className="w-full px-2 py-1.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            value={item.unitPrice}
            data-ocid={`create_estimate.price_input.${index + 1}`}
            onChange={(e) =>
              onChange(item.id, "unitPrice", Number(e.target.value))
            }
          />
        </div>
        <div>
          <label
            htmlFor={`tax-${item.id}`}
            className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block"
          >
            Tax %
          </label>
          <input
            id={`tax-${item.id}`}
            type="number"
            min={0}
            max={100}
            step={0.1}
            className="w-full px-2 py-1.5 rounded-lg bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            value={(item.taxRate * 100).toFixed(1)}
            data-ocid={`create_estimate.tax_input.${index + 1}`}
            onChange={(e) =>
              onChange(item.id, "taxRate", Number(e.target.value) / 100)
            }
          />
        </div>
      </div>
      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">
          Line total:{" "}
          <span className="text-foreground font-medium">{fmt(lineTotal)}</span>
        </span>
      </div>
    </div>
  );
}

// ── Create Estimate Modal ─────────────────────────────────────────────────────

function CreateEstimateModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (draft: boolean) => void;
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
  );
  const [lineItems, setLineItems] = useState<EstimateLineItem[]>([
    { id: "new-li-1", description: "", quantity: 1, unitPrice: 0, taxRate: 0 },
  ]);

  const subtotal = lineItems.reduce(
    (s, li) => s + li.quantity * li.unitPrice,
    0,
  );
  const taxTotal = lineItems.reduce(
    (s, li) => s + li.quantity * li.unitPrice * li.taxRate,
    0,
  );
  const total = subtotal + taxTotal;

  const changeItem = (
    id: string,
    field: keyof EstimateLineItem,
    value: string | number,
  ) => {
    setLineItems((prev) =>
      prev.map((li) => (li.id === id ? { ...li, [field]: value } : li)),
    );
  };

  const addItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: `new-li-${Date.now()}`,
        description: "",
        quantity: 1,
        unitPrice: 0,
        taxRate: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setLineItems((prev) => prev.filter((li) => li.id !== id));
  };

  // Close on Escape
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="presentation"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Enter") onClose();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
        data-ocid="create_estimate.close_button"
      />

      {/* Panel */}
      <div
        ref={modalRef}
        className="relative z-10 w-full sm:max-w-xl bg-card border border-border rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] shadow-2xl"
        data-ocid="create_estimate.dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-sm font-bold text-foreground">New Estimate</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Build your line items below
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="create_estimate.cancel_button"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {/* Customer info */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Customer
            </p>
            <input
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="Customer name"
              value={customerName}
              data-ocid="create_estimate.customer_name_input"
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                className="px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                placeholder="Email address"
                type="email"
                value={customerEmail}
                data-ocid="create_estimate.email_input"
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
              <input
                className="px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                placeholder="Phone (optional)"
                value={customerPhone}
                data-ocid="create_estimate.phone_input"
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Line items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Line Items
              </p>
              <button
                type="button"
                onClick={addItem}
                data-ocid="create_estimate.add_line_button"
                className="flex items-center gap-1 text-xs payment-action-btn px-2.5 py-1 rounded-lg"
              >
                <Plus size={11} />
                Add line
              </button>
            </div>
            <div className="space-y-2">
              {lineItems.map((li, idx) => (
                <LineItemRow
                  key={li.id}
                  item={li}
                  index={idx}
                  onChange={changeItem}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="rounded-xl bg-background/50 border border-border/40 p-4 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="text-foreground">{fmt(taxTotal)}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-border/50 pt-2 mt-2">
              <span className="text-foreground">Total</span>
              <span className="text-primary">{fmt(total)}</span>
            </div>
          </div>

          {/* Notes & valid until */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Details
            </p>
            <textarea
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
              placeholder="Notes or terms for the customer…"
              rows={3}
              value={notes}
              data-ocid="create_estimate.notes_textarea"
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <label
                htmlFor="est-valid-until"
                className="text-xs text-muted-foreground whitespace-nowrap"
              >
                Valid until
              </label>
              <input
                id="est-valid-until"
                type="date"
                className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                value={validUntil}
                data-ocid="create_estimate.valid_until_input"
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-border shrink-0">
          <button
            type="button"
            onClick={onClose}
            data-ocid="create_estimate.cancel_button"
            className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onSave(true)}
              data-ocid="create_estimate.save_draft_button"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => onSave(false)}
              data-ocid="create_estimate.submit_button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Send size={13} />
              Send Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Convert to Invoice Modal ──────────────────────────────────────────────────

function ConvertToInvoiceModal({
  estimate,
  onClose,
  onConvert,
}: {
  estimate: Estimate;
  onClose: () => void;
  onConvert: (dueDate: string, paymentTerms: string) => void;
}) {
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  );
  const [paymentTerms, setPaymentTerms] = useState("Net 30");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Enter") onClose();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close dialog"
      />
      <div
        className="relative z-10 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl"
        data-ocid="convert_invoice.dialog"
        aria-modal="true"
        aria-label="Convert to invoice"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-bold text-foreground">
              Convert to Invoice
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {estimate.customerName} · {fmt(estimate.total)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="convert_invoice.close_button"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label
              htmlFor="inv-due-date"
              className="text-xs text-muted-foreground block mb-1.5"
            >
              Payment due date
            </label>
            <input
              id="inv-due-date"
              type="date"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              value={dueDate}
              data-ocid="convert_invoice.due_date_input"
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="inv-terms"
              className="text-xs text-muted-foreground block mb-1.5"
            >
              Payment terms
            </label>
            <select
              id="inv-terms"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              value={paymentTerms}
              data-ocid="convert_invoice.terms_select"
              onChange={(e) => setPaymentTerms(e.target.value)}
            >
              {["Due on receipt", "Net 7", "Net 15", "Net 30", "Net 60"].map(
                (t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            data-ocid="convert_invoice.cancel_button"
            className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConvert(dueDate, paymentTerms)}
            data-ocid="convert_invoice.confirm_button"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Estimate Detail Panel ─────────────────────────────────────────────────────

function EstimateDetailPanel({
  estimate,
  onClose,
  onConvert,
}: {
  estimate: Estimate;
  onClose: () => void;
  onConvert: () => void;
}) {
  const conf = ESTIMATE_STATUS[estimate.status];

  const timeline = [
    { label: "Created", time: estimate.createdAt, icon: FileText },
    estimate.status !== "draft"
      ? { label: "Sent", time: estimate.updatedAt, icon: Send }
      : null,
    estimate.acceptedAt
      ? { label: "Accepted", time: estimate.acceptedAt, icon: CheckCircle }
      : null,
    estimate.rejectedAt
      ? { label: "Rejected", time: estimate.rejectedAt, icon: X }
      : null,
  ].filter(Boolean) as {
    label: string;
    time: number;
    icon: React.FC<{ size?: number; className?: string }>;
  }[];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Enter") onClose();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close panel"
      />
      <div
        className="relative z-10 w-full sm:w-[420px] h-full sm:h-[90vh] bg-card border-l border-border flex flex-col shadow-2xl overflow-hidden rounded-t-2xl sm:rounded-l-2xl sm:rounded-r-none"
        data-ocid="estimate_detail.panel"
        aria-modal="true"
        aria-label="Estimate details"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${conf.cls}`}
            >
              {conf.label}
            </span>
            <span className="text-xs text-muted-foreground">
              #{estimate.id}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="estimate_detail.close_button"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
          {/* Customer */}
          <div>
            <p className="text-lg font-bold text-foreground">
              {estimate.customerName}
            </p>
            <p className="text-xs text-muted-foreground">
              {estimate.customerEmail}
            </p>
            {estimate.customerPhone && (
              <p className="text-xs text-muted-foreground">
                {estimate.customerPhone}
              </p>
            )}
          </div>

          {/* Line items */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Line Items
            </p>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left px-3 py-2 text-muted-foreground font-medium">
                      Description
                    </th>
                    <th className="text-right px-3 py-2 text-muted-foreground font-medium">
                      Qty
                    </th>
                    <th className="text-right px-3 py-2 text-muted-foreground font-medium">
                      Unit
                    </th>
                    <th className="text-right px-3 py-2 text-muted-foreground font-medium">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {estimate.lineItems.map((li, idx) => (
                    <tr
                      key={li.id}
                      className="border-t border-border/50"
                      data-ocid={`estimate_detail.line_item.${idx + 1}`}
                    >
                      <td className="px-3 py-2 text-foreground">
                        {li.description}
                        {li.taxRate > 0 && (
                          <span className="ml-1 text-muted-foreground">
                            ({(li.taxRate * 100).toFixed(0)}% tax)
                          </span>
                        )}
                      </td>
                      <td className="text-right px-3 py-2 text-muted-foreground">
                        {li.quantity}
                      </td>
                      <td className="text-right px-3 py-2 text-muted-foreground">
                        {fmt(li.unitPrice)}
                      </td>
                      <td className="text-right px-3 py-2 text-foreground font-medium">
                        {fmt(li.quantity * li.unitPrice * (1 + li.taxRate))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Totals summary */}
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">
                  {fmt(estimate.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">
                  {fmt(estimate.taxTotal)}
                </span>
              </div>
              <div className="flex justify-between font-bold border-t border-border/50 pt-1.5 mt-1.5">
                <span className="text-foreground">Total</span>
                <span className="text-primary">{fmt(estimate.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {estimate.notes && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Notes
              </p>
              <p className="text-sm text-muted-foreground bg-muted/20 rounded-lg px-3 py-2 italic">
                {estimate.notes}
              </p>
            </div>
          )}

          {/* Approval notes */}
          {estimate.approvalNotes && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Client Notes
              </p>
              <p className="text-sm text-muted-foreground bg-muted/20 rounded-lg px-3 py-2">
                {estimate.approvalNotes}
              </p>
            </div>
          )}

          {/* Status timeline */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Timeline
            </p>
            <div className="space-y-2">
              {timeline.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    className="flex items-center gap-3"
                    data-ocid={`estimate_detail.timeline.${step.label.toLowerCase()}`}
                  >
                    <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
                      <Icon size={12} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        {step.label}
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {relativeTime(step.time)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Validity */}
          {estimate.validUntil && (
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Clock size={12} />
              Valid until{" "}
              {new Date(estimate.validUntil).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-border shrink-0 space-y-2">
          <button
            type="button"
            data-ocid="estimate_detail.download_button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors"
          >
            <Download size={14} />
            Export PDF
          </button>
          {estimate.status === "accepted" && (
            <button
              type="button"
              onClick={onConvert}
              data-ocid="estimate_detail.convert_button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ChevronRight size={14} />
              Convert to Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Invoice Detail Panel ──────────────────────────────────────────────────────

function InvoiceDetailPanel({
  payment,
  onClose,
  onMarkPaid,
}: {
  payment: PaymentRecord;
  onClose: () => void;
  onMarkPaid: () => void;
}) {
  const conf = PAYMENT_STATUS[payment.status];
  const overdue = isOverdue(payment.dueDate) && payment.status !== "paid";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Enter") onClose();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close panel"
      />
      <div
        className="relative z-10 w-full sm:w-[420px] h-full sm:h-[90vh] bg-card border-l border-border flex flex-col shadow-2xl overflow-hidden rounded-t-2xl sm:rounded-l-2xl sm:rounded-r-none"
        data-ocid="invoice_detail.panel"
        aria-modal="true"
        aria-label="Invoice details"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${conf.cls}`}
            >
              {conf.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {payment.invoiceNumber}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="invoice_detail.close_button"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
          {/* Overdue alert */}
          {overdue && (
            <div
              className="flex items-center gap-3 p-3 rounded-xl badge-rose"
              data-ocid="invoice_detail.overdue_alert"
            >
              <AlertTriangle size={14} className="text-rose-400 shrink-0" />
              <p className="text-xs font-medium text-rose-300">
                This invoice is overdue. Due{" "}
                {new Date(payment.dueDate!).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
                .
              </p>
            </div>
          )}

          {/* Customer */}
          <div>
            <p className="text-lg font-bold text-foreground">
              {payment.customerName}
            </p>
            <p className="text-xs text-muted-foreground">
              {payment.customerEmail}
            </p>
          </div>

          {/* Amount */}
          <div className="rounded-xl bg-muted/20 border border-border/50 p-4 text-center">
            <p className="text-2xl font-bold text-foreground">
              {fmt(payment.amount)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Invoice total</p>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Invoice date</span>
              <span className="text-foreground">{payment.invoiceDate}</span>
            </div>
            {payment.dueDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due date</span>
                <span
                  className={
                    overdue ? "text-rose-400 font-medium" : "text-foreground"
                  }
                >
                  {payment.dueDate}
                </span>
              </div>
            )}
            {payment.method && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment method</span>
                <span className="text-foreground">
                  {METHOD_LABELS[payment.method] ?? payment.method}
                </span>
              </div>
            )}
            {payment.paidAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid</span>
                <span className="text-emerald-400">
                  {relativeTime(payment.paidAt)}
                </span>
              </div>
            )}
          </div>

          {payment.notes && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Notes
              </p>
              <p className="text-sm text-muted-foreground bg-muted/20 rounded-lg px-3 py-2">
                {payment.notes}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-border shrink-0 space-y-2">
          {payment.status !== "paid" && (
            <>
              <button
                type="button"
                data-ocid="invoice_detail.stripe_button"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium payment-action-btn"
              >
                <ExternalLink size={14} />
                Open Stripe Checkout
              </button>
              <button
                type="button"
                onClick={onMarkPaid}
                data-ocid="invoice_detail.mark_paid_button"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <CheckCircle size={14} />
                Mark as Paid
              </button>
            </>
          )}
          {payment.status === "paid" && (
            <button
              type="button"
              data-ocid="invoice_detail.download_button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              <Download size={14} />
              Download Receipt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Overdue Banner ────────────────────────────────────────────────────────────

function OverdueBanner({ count, total }: { count: number; total: number }) {
  if (count === 0) return null;
  return (
    <div
      className="flex items-center gap-3 p-3.5 rounded-xl badge-rose"
      data-ocid="invoices.overdue_banner"
    >
      <AlertTriangle size={15} className="text-rose-400 shrink-0" />
      <p className="text-sm font-medium text-rose-300">
        {count} overdue invoice{count !== 1 ? "s" : ""} totaling{" "}
        <span className="font-bold">{fmt(total)}</span> — follow up to protect
        your cash flow.
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type Tab = "estimates" | "invoices" | "history";

export default function EstimatesPage() {
  const { currentTenantId } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("estimates");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(
    null,
  );
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentRecord | null>(
    null,
  );
  const [convertTarget, setConvertTarget] = useState<Estimate | null>(null);
  const [reviewPrompt, setReviewPrompt] = useState<{
    customerName: string;
  } | null>(null);
  const [reviewSent, setReviewSent] = useState(false);
  const [localPayments, setLocalPayments] =
    useState<PaymentRecord[]>(DEMO_PAYMENT_RECORDS);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const estimates = DEMO_ESTIMATES.filter(
    (e) => e.tenantId === currentTenantId,
  );
  const payments = localPayments.filter((p) => p.tenantId === currentTenantId);

  const paidPayments = payments.filter((p) => p.status === "paid");
  const pendingPayments = payments.filter(
    (p) => p.status === "pending" || p.status === "partial",
  );
  const overduePayments = payments.filter((p) => p.status === "overdue");

  const totalRevenue = paidPayments.reduce((s, p) => s + p.amount, 0);
  const pendingRevenue = pendingPayments.reduce((s, p) => s + p.amount, 0);
  const overdueRevenue = overduePayments.reduce((s, p) => s + p.amount, 0);

  // Close action menus on outside click
  useEffect(() => {
    if (!actionMenuId) return;
    const handler = () => setActionMenuId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [actionMenuId]);

  const handleMarkPaid = (paymentId: string) => {
    setLocalPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? { ...p, status: "paid" as PaymentStatus, paidAt: Date.now() }
          : p,
      ),
    );
    if (selectedInvoice?.id === paymentId) {
      setSelectedInvoice((prev) =>
        prev ? { ...prev, status: "paid", paidAt: Date.now() } : null,
      );
    }
    // Trigger review request prompt
    const payment = payments.find((p) => p.id === paymentId);
    if (payment) {
      setReviewPrompt({ customerName: payment.customerName });
      setReviewSent(false);
    }
  };

  const sendReviewRequest = () => {
    setReviewSent(true);
    window.setTimeout(() => setReviewPrompt(null), 2000);
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: "estimates", label: "Estimates" },
    { id: "invoices", label: "Invoices" },
    { id: "history", label: "Payment History" },
  ];

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Estimates &amp; Invoices
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quotes, invoices, and payment tracking for all customers
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          data-ocid="estimates.add_button"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          <Plus size={14} />
          New Estimate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Collected",
            value: totalRevenue,
            icon: CheckCircle,
            iconClass: "text-emerald-400",
            id: "estimates.collected_card",
          },
          {
            label: "Pending",
            value: pendingRevenue,
            icon: Clock,
            iconClass: "text-amber-400",
            id: "estimates.pending_card",
          },
          {
            label: "Overdue",
            value: overdueRevenue,
            icon: AlertTriangle,
            iconClass: "text-rose-400",
            id: "estimates.overdue_card",
          },
        ].map(({ label, value, icon: Icon, iconClass, id }) => (
          <div key={label} className="card-dark rounded-xl p-4" data-ocid={id}>
            <div className="flex items-center gap-2 mb-1.5">
              <Icon size={14} className={iconClass} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{fmt(value)}</p>
          </div>
        ))}
      </div>

      {/* Overdue banner */}
      <OverdueBanner count={overduePayments.length} total={overdueRevenue} />

      {/* Review request prompt */}
      {reviewPrompt && (
        <ReviewRequestBanner
          customerName={reviewPrompt.customerName}
          onSend={sendReviewRequest}
          onDismiss={() => setReviewPrompt(null)}
        />
      )}
      {reviewSent && (
        <div
          className="flex items-center gap-2 p-3 rounded-xl status-paid text-sm"
          data-ocid="review_request.success_state"
        >
          <CheckCircle size={14} />
          Review request sent to {reviewPrompt?.customerName ?? "customer"}!
        </div>
      )}

      {/* Tabs */}
      <div
        className="flex gap-1 bg-card/60 rounded-lg p-1 w-fit max-w-full overflow-x-auto"
        role="tablist"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            data-ocid={`estimates.${tab.id}.tab`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Estimates Tab ────────────────────────────────────────────────────── */}
      {activeTab === "estimates" && (
        <div className="space-y-3" data-ocid="estimates.list">
          {estimates.length === 0 ? (
            <div
              className="card-dark rounded-xl p-12 text-center"
              data-ocid="estimates.empty_state"
            >
              <FileText
                size={40}
                className="mx-auto text-muted-foreground opacity-40 mb-3"
              />
              <p className="text-sm font-semibold text-foreground">
                No estimates yet
              </p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Create your first estimate to get started.
              </p>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                data-ocid="estimates.empty_add_button"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus size={14} />
                New Estimate
              </button>
            </div>
          ) : (
            estimates.map((est, idx) => {
              const conf = ESTIMATE_STATUS[est.status];
              return (
                <div
                  key={est.id}
                  data-ocid={`estimates.item.${idx + 1}`}
                  className="payment-card rounded-xl p-4 cursor-pointer"
                  onClick={() => setSelectedEstimate(est)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setSelectedEstimate(est);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-semibold text-foreground">
                          {est.customerName}
                        </p>
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${conf.cls}`}
                        >
                          {conf.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {est.lineItems.length} item
                        {est.lineItems.length !== 1 ? "s" : ""}
                        {est.notes && (
                          <span className="ml-2 italic opacity-70 truncate">
                            {est.notes}
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {relativeTime(est.createdAt)}
                        {est.validUntil && (
                          <span
                            className={
                              isOverdue(est.validUntil)
                                ? " · Valid until expired"
                                : ` · Valid until ${est.validUntil}`
                            }
                          />
                        )}
                      </p>
                    </div>
                    <div
                      className="flex flex-col items-end gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <p className="text-base font-bold text-foreground">
                        {fmt(est.total)}
                      </p>
                      <div className="flex items-center gap-1.5">
                        {est.status === "draft" && (
                          <button
                            type="button"
                            data-ocid={`estimates.send_button.${idx + 1}`}
                            className="payment-action-btn text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
                          >
                            <Send size={11} />
                            Send
                          </button>
                        )}
                        {est.status === "accepted" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConvertTarget(est);
                            }}
                            data-ocid={`estimates.convert_button.${idx + 1}`}
                            className="payment-action-btn text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
                          >
                            <ChevronRight size={11} />
                            Invoice
                          </button>
                        )}
                        <button
                          type="button"
                          data-ocid={`estimates.view_button.${idx + 1}`}
                          className="text-xs px-3 py-1.5 rounded-lg bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEstimate(est);
                          }}
                        >
                          View
                        </button>
                        {/* More actions menu */}
                        <div className="relative">
                          <button
                            type="button"
                            data-ocid={`estimates.more_button.${idx + 1}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenuId(
                                actionMenuId === est.id ? null : est.id,
                              );
                            }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                            aria-label="More actions"
                          >
                            <MoreHorizontal size={14} />
                          </button>
                          {actionMenuId === est.id && (
                            <div
                              className="absolute right-0 top-full mt-1 w-36 bg-popover border border-border rounded-xl shadow-xl z-20 py-1"
                              data-ocid={`estimates.dropdown_menu.${idx + 1}`}
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted/50 transition-colors"
                              >
                                <Copy size={12} />
                                Duplicate
                              </button>
                              <button
                                type="button"
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted/50 transition-colors"
                              >
                                <Download size={12} />
                                Export PDF
                              </button>
                              <button
                                type="button"
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 size={12} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Invoices Tab ─────────────────────────────────────────────────────── */}
      {activeTab === "invoices" && (
        <div className="space-y-3" data-ocid="invoices.list">
          {payments.length === 0 ? (
            <div
              className="card-dark rounded-xl p-12 text-center"
              data-ocid="invoices.empty_state"
            >
              <DollarSign
                size={40}
                className="mx-auto text-muted-foreground opacity-40 mb-3"
              />
              <p className="text-sm font-semibold text-foreground">
                No invoices yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Convert an accepted estimate to create your first invoice.
              </p>
            </div>
          ) : (
            payments.map((pay, idx) => {
              const conf = PAYMENT_STATUS[pay.status];
              const overdue = isOverdue(pay.dueDate) && pay.status !== "paid";
              return (
                <div
                  key={pay.id}
                  data-ocid={`invoices.item.${idx + 1}`}
                  className={`payment-card rounded-xl p-4 cursor-pointer ${overdue ? "border-rose-500/30" : ""}`}
                  onClick={() => setSelectedInvoice(pay)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setSelectedInvoice(pay);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-semibold text-foreground">
                          {pay.customerName}
                        </p>
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${conf.cls}`}
                        >
                          {conf.label}
                        </span>
                        {overdue && (
                          <span className="text-[10px] font-medium text-rose-400 flex items-center gap-1">
                            <AlertTriangle size={10} />
                            Overdue
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {pay.invoiceNumber}
                        {pay.dueDate && (
                          <span
                            className={
                              overdue
                                ? ` · Due ${pay.dueDate} (overdue)`
                                : ` · Due ${pay.dueDate}`
                            }
                          />
                        )}
                      </p>
                      {pay.notes && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate italic">
                          {pay.notes}
                        </p>
                      )}
                    </div>
                    <div
                      className="flex flex-col items-end gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <p className="text-base font-bold text-foreground">
                        {fmt(pay.amount)}
                      </p>
                      <div className="flex items-center gap-1.5">
                        {pay.status !== "paid" && (
                          <>
                            <button
                              type="button"
                              data-ocid={`invoices.remind_button.${idx + 1}`}
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1"
                            >
                              <Bell size={10} />
                              Remind
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkPaid(pay.id);
                              }}
                              data-ocid={`invoices.mark_paid_button.${idx + 1}`}
                              className="payment-action-btn text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
                            >
                              <CheckCircle size={11} />
                              Paid
                            </button>
                          </>
                        )}
                        {pay.status !== "paid" && (
                          <button
                            type="button"
                            data-ocid={`invoices.stripe_button.${idx + 1}`}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                            aria-label="Stripe checkout link"
                          >
                            <CreditCard size={13} />
                          </button>
                        )}
                        {pay.status === "paid" && (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                            <CheckCircle size={10} />
                            {pay.paidAt ? relativeTime(pay.paidAt) : "Paid"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Payment History Tab ──────────────────────────────────────────────── */}
      {activeTab === "history" && (
        <div className="space-y-3" data-ocid="payment_history.list">
          {payments.length === 0 ? (
            <div
              className="card-dark rounded-xl p-12 text-center"
              data-ocid="payment_history.empty_state"
            >
              <RefreshCw
                size={40}
                className="mx-auto text-muted-foreground opacity-40 mb-3"
              />
              <p className="text-sm font-semibold text-foreground">
                No payment history yet
              </p>
            </div>
          ) : (
            [...payments]
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((pay, idx) => {
                const conf = PAYMENT_STATUS[pay.status];
                return (
                  <div
                    key={pay.id}
                    data-ocid={`payment_history.item.${idx + 1}`}
                    className="payment-card rounded-xl px-4 py-3 flex items-center gap-3"
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        pay.status === "paid"
                          ? "bg-emerald-500/10"
                          : pay.status === "overdue"
                            ? "bg-rose-500/10"
                            : "bg-amber-500/10"
                      }`}
                    >
                      {pay.status === "paid" ? (
                        <CheckCircle size={14} className="text-emerald-400" />
                      ) : pay.status === "overdue" ? (
                        <AlertTriangle size={14} className="text-rose-400" />
                      ) : (
                        <Clock size={14} className="text-amber-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {pay.customerName}
                        </p>
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${conf.cls} shrink-0`}
                        >
                          {conf.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {pay.invoiceNumber}
                        {pay.method &&
                          ` · ${METHOD_LABELS[pay.method] ?? pay.method}`}
                        {" · "}
                        {relativeTime(pay.createdAt)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-foreground">
                        {fmt(pay.amount)}
                      </p>
                      {pay.paidAt && (
                        <p className="text-[10px] text-emerald-400 mt-0.5">
                          Paid {relativeTime(pay.paidAt)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
          )}

          {/* Summary footer */}
          {payments.length > 0 && (
            <div className="card-dark rounded-xl p-4">
              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <p className="text-muted-foreground mb-1">Total collected</p>
                  <p className="font-bold text-emerald-400">
                    {fmt(totalRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Pending</p>
                  <p className="font-bold text-amber-400">
                    {fmt(pendingRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Overdue</p>
                  <p className="font-bold text-rose-400">
                    {fmt(overdueRevenue)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Modals & Panels ───────────────────────────────────────────────────── */}
      {showCreateModal && (
        <CreateEstimateModal
          onClose={() => setShowCreateModal(false)}
          onSave={(draft) => {
            setShowCreateModal(false);
            // In a real app, would call actor.createEstimate(...)
            console.log("Saved as", draft ? "draft" : "sent");
          }}
        />
      )}

      {selectedEstimate && !convertTarget && (
        <EstimateDetailPanel
          estimate={selectedEstimate}
          onClose={() => setSelectedEstimate(null)}
          onConvert={() => {
            setConvertTarget(selectedEstimate);
            setSelectedEstimate(null);
          }}
        />
      )}

      {selectedInvoice && (
        <InvoiceDetailPanel
          payment={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onMarkPaid={() => {
            handleMarkPaid(selectedInvoice.id);
            setSelectedInvoice(null);
          }}
        />
      )}

      {convertTarget && (
        <ConvertToInvoiceModal
          estimate={convertTarget}
          onClose={() => setConvertTarget(null)}
          onConvert={(dueDate, terms) => {
            console.log("Converting to invoice", { dueDate, terms });
            setConvertTarget(null);
          }}
        />
      )}
    </div>
  );
}
