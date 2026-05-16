import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useCreateSubscriber,
  useUpdateSubscriber,
} from "@/hooks/useNewsletter";
import type {
  NewsletterSubscriber,
  SubscriberStatus,
} from "@/types/newsletter";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  editing: NewsletterSubscriber | null;
  tenantId: string;
}

type CustomField = { key: string; value: string; uid: string };

export default function SubscriberDrawer({
  open,
  onClose,
  editing,
  tenantId,
}: Props) {
  const create = useCreateSubscriber();
  const update = useUpdateSubscriber();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");
  const [status, setStatus] = useState<SubscriberStatus>("active");
  const [customFields, setCustomFields] = useState<CustomField[]>([
    { key: "", value: "", uid: "cf-0" },
  ]);

  useEffect(() => {
    if (editing) {
      setEmail(editing.email);
      setPhone(editing.phone ?? "");
      setBusinessName(editing.businessName ?? "");
      setTagsRaw(editing.tags.join(", "));
      setStatus(editing.status);
      const cf = Object.entries(editing.customFields).map(
        ([key, value], i) => ({ key, value, uid: `cf-${i}-${key}` }),
      );
      setCustomFields(
        cf.length > 0 ? cf : [{ key: "", value: "", uid: "cf-0" }],
      );
    } else {
      setEmail("");
      setPhone("");
      setBusinessName("");
      setTagsRaw("");
      setStatus("active");
      setCustomFields([{ key: "", value: "", uid: "cf-0" }]);
    }
  }, [editing]);

  function addCustomField() {
    setCustomFields((prev) => [
      ...prev,
      { key: "", value: "", uid: `cf-${Date.now()}` },
    ]);
  }

  function removeCustomField(i: number) {
    setCustomFields((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateCustomField(i: number, field: "key" | "value", val: string) {
    setCustomFields((prev) =>
      prev.map((cf, idx) => (idx === i ? { ...cf, [field]: val } : cf)),
    );
  }

  function buildRecord(): Record<string, string> {
    return Object.fromEntries(
      customFields
        .filter((cf) => cf.key.trim())
        .map((cf) => [cf.key.trim(), cf.value.trim()]),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editing) {
      update.mutate({
        id: editing.id,
        tenantId,
        updates: {
          email,
          phone,
          businessName,
          tags,
          status,
          customFields: buildRecord(),
        },
      });
    } else {
      create.mutate({
        tenantId,
        email,
        phone,
        businessName,
        tags,
        status,
        customFields: buildRecord(),
      });
    }
    onClose();
  }

  const isPending = create.isPending || update.isPending;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        data-ocid={editing ? "subscribers.edit.sheet" : "subscribers.add.sheet"}
        className="w-[420px] sm:w-[480px] bg-card border-l border-border overflow-y-auto"
      >
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-base font-bold text-foreground">
            {editing ? "Edit Subscriber" : "Add Subscriber"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              data-ocid="subscribers.email.input"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@businessname.com"
              className="bg-muted/40 border-border text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Phone
            </Label>
            <Input
              data-ocid="subscribers.phone.input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 000-0000"
              className="bg-muted/40 border-border text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Business Name
            </Label>
            <Input
              data-ocid="subscribers.business.input"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Acme Plumbing Co."
              className="bg-muted/40 border-border text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Tags{" "}
              <span className="text-muted-foreground/50 font-normal">
                (comma-separated)
              </span>
            </Label>
            <Input
              data-ocid="subscribers.tags.input"
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              placeholder="plumbing, local-service, high-value"
              className="bg-muted/40 border-border text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as SubscriberStatus)}
            >
              <SelectTrigger
                data-ocid="subscribers.status_edit.select"
                className="bg-muted/40 border-border text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                <SelectItem value="bounced">Bounced</SelectItem>
                <SelectItem value="complained">Complained</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Fields */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Custom Fields
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                data-ocid="subscribers.add_custom_field.button"
                className="h-6 text-xs text-primary hover:text-primary"
                onClick={addCustomField}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add field
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {customFields.map((cf, i) => (
                <div key={cf.uid} className="flex items-center gap-2">
                  <Input
                    value={cf.key}
                    onChange={(e) =>
                      updateCustomField(i, "key", e.target.value)
                    }
                    placeholder="Key"
                    className="bg-muted/40 border-border text-xs flex-1"
                  />
                  <Input
                    value={cf.value}
                    onChange={(e) =>
                      updateCustomField(i, "value", e.target.value)
                    }
                    placeholder="Value"
                    className="bg-muted/40 border-border text-xs flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                    onClick={() => removeCustomField(i)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-border mt-2">
            <Button
              data-ocid="subscribers.cancel_button"
              type="button"
              variant="outline"
              className="flex-1 border-border"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              data-ocid="subscribers.submit_button"
              type="submit"
              disabled={isPending}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isPending
                ? "Saving…"
                : editing
                  ? "Save Changes"
                  : "Add Subscriber"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
