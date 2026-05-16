import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Info,
  Loader2,
  MessageSquare,
  Phone,
  PhoneForwarded,
  PhoneIncoming,
  PhoneMissed,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { TenantEntry } from "../context/AppContext";
import { useApp } from "../context/AppContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

function generateMockNumber(areaCode: string): string {
  const prefix = Math.floor(Math.random() * 900) + 100;
  const line = Math.floor(Math.random() * 9000) + 1000;
  return `(${areaCode.slice(0, 3)}) ${prefix}-${line}`;
}

export function PhoneStatusBadge({ tenant }: { tenant: TenantEntry }) {
  const status = tenant.phoneNumberStatus ?? "not_assigned";
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
        <span className="text-xs text-emerald-400 font-medium">
          {tenant.assignedPhoneNumber ?? "Active"}
        </span>
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-xs text-amber-400 font-medium">Pending</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-2 h-2 rounded-full bg-slate-500" />
      <span className="text-xs text-slate-200 font-medium">No number</span>
    </span>
  );
}

interface PhoneNumberManagerProps {
  tenant: TenantEntry;
  index: number;
}

export function PhoneNumberManager({ tenant, index }: PhoneNumberManagerProps) {
  const { updateTenantPhone, missedCallSmsConfigs, updateMissedCallSmsConfig } =
    useApp();
  const [expanded, setExpanded] = useState(false);
  const [areaCode, setAreaCode] = useState("");
  const [portingNumber, setPortingNumber] = useState("");
  const [forwardingFrom, setForwardingFrom] = useState("");
  const [provisioning, setProvisioning] = useState(false);

  const status = tenant.phoneNumberStatus ?? "not_assigned";
  const ctbConfig = missedCallSmsConfigs[tenant.id];
  const ctbEnabled = ctbConfig?.enabled ?? false;

  const handleProvisionNew = async () => {
    if (!areaCode.trim() || areaCode.replace(/\D/g, "").length < 3) {
      toast.error("Enter a valid 3-digit area code");
      return;
    }
    setProvisioning(true);
    updateTenantPhone(tenant.id, {
      phoneNumberStatus: "pending",
      phoneNumberType: "new",
      areaCode: areaCode.replace(/\D/g, "").slice(0, 3),
    });
    toast.info("Provisioning number\u2026");
    await new Promise((r) => setTimeout(r, 3000));
    const newNumber = generateMockNumber(areaCode.replace(/\D/g, ""));
    updateTenantPhone(tenant.id, {
      assignedPhoneNumber: newNumber,
      phoneNumberStatus: "active",
      phoneNumberType: "new",
      areaCode: areaCode.replace(/\D/g, "").slice(0, 3),
    });
    setProvisioning(false);
    setAreaCode("");
    toast.success(`Number provisioned: ${newNumber}`);
  };

  const handlePortRequest = () => {
    if (!portingNumber.trim()) {
      toast.error("Enter the number you want to port");
      return;
    }
    updateTenantPhone(tenant.id, {
      phoneNumberStatus: "pending",
      phoneNumberType: "port",
      portingNumber: portingNumber,
    });
    toast.info(
      "Port request submitted \u2014 typically 2\u20135 business days",
    );
    setPortingNumber("");
  };

  const handleForwarding = () => {
    if (!forwardingFrom.trim()) {
      toast.error("Enter the number to forward from");
      return;
    }
    const twilioNum = generateMockNumber("858");
    updateTenantPhone(tenant.id, {
      assignedPhoneNumber: twilioNum,
      phoneNumberStatus: "active",
      phoneNumberType: "forward",
      forwardingFromNumber: forwardingFrom,
    });
    toast.success(
      `Forwarding set up. Forward ${forwardingFrom} \u2192 ${twilioNum}`,
    );
    setForwardingFrom("");
  };

  const handleCtbToggle = () => {
    const newEnabled = !ctbEnabled;
    updateMissedCallSmsConfig(tenant.id, {
      ...(ctbConfig ?? {
        messageTemplate:
          "Hey! Sorry we missed your call at {businessName}. We'd love to help — reply here or call us back anytime.",
        niches: {},
        autoCreateLead: true,
        leadSource: "Missed Call",
      }),
      enabled: newEnabled,
    });
    toast.success(
      newEnabled
        ? "Call Text Back enabled for this client"
        : "Call Text Back disabled for this client",
    );
  };

  return (
    <div
      data-ocid={`phone.manager.panel.${index}`}
      className="border-t border-white/5"
    >
      {/* Summary row */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3 flex-wrap">
          <Phone size={13} className="text-slate-200" />
          <PhoneStatusBadge tenant={tenant} />

          {/* Call Text Back status badge + quick toggle */}
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                ctbEnabled
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-gray-800 text-gray-500 border-gray-700"
              }`}
              data-ocid={`phone.ctb_badge.${index}`}
            >
              <MessageSquare size={10} />
              CTB {ctbEnabled ? "On" : "Off"}
            </span>
            <button
              type="button"
              onClick={handleCtbToggle}
              aria-label={
                ctbEnabled ? "Disable Call Text Back" : "Enable Call Text Back"
              }
              className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                ctbEnabled ? "bg-purple-600" : "bg-gray-700"
              }`}
              data-ocid={`phone.ctb_toggle.${index}`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${
                  ctbEnabled ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={12} className="text-slate-600 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="max-w-[220px] text-xs leading-relaxed"
              >
                This number is used for all SMS communications for this client,
                including review requests and automated follow-ups.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          data-ocid={`phone.manage.button.${index}`}
          size="sm"
          variant="ghost"
          onClick={() => setExpanded((v) => !v)}
          className="h-7 px-2 text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
        >
          Manage Number
          {expanded ? (
            <ChevronUp size={12} className="ml-1" />
          ) : (
            <ChevronDown size={12} className="ml-1" />
          )}
        </Button>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div
          data-ocid={`phone.panel.${index}`}
          className="mx-4 mb-4 rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden"
        >
          {/* Current status header */}
          {status !== "not_assigned" && (
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
              {status === "active" ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-400">
                      Active Number
                    </p>
                    <p className="text-sm font-mono font-bold text-white">
                      {tenant.assignedPhoneNumber}
                    </p>
                    {tenant.phoneNumberType === "forward" &&
                      tenant.forwardingFromNumber && (
                        <p className="text-xs text-slate-200 mt-0.5">
                          Forwarding from: {tenant.forwardingFromNumber}
                        </p>
                      )}
                    {tenant.phoneNumberType === "port" && (
                      <p className="text-xs text-slate-200 mt-0.5">
                        Ported number
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Clock size={14} className="text-amber-400" />
                  <div>
                    <p className="text-xs font-semibold text-amber-400">
                      Pending
                    </p>
                    {tenant.phoneNumberType === "port" ? (
                      <p className="text-xs text-slate-200">
                        Porting {tenant.portingNumber} \u2014 typically 2\u20135
                        business days
                      </p>
                    ) : (
                      <p className="text-xs text-slate-200">
                        Number provisioning in progress\u2026
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          <Tabs defaultValue="new" className="p-4">
            <TabsList
              className="w-full bg-white/5 border border-white/10 h-8 p-0.5"
              data-ocid={`phone.tabs.${index}`}
            >
              <TabsTrigger
                value="new"
                className="flex-1 h-7 text-xs data-[state=active]:bg-violet-600 data-[state=active]:text-white"
                data-ocid={`phone.new.tab.${index}`}
              >
                <PhoneIncoming size={11} className="mr-1" />
                New Number
              </TabsTrigger>
              <TabsTrigger
                value="port"
                className="flex-1 h-7 text-xs data-[state=active]:bg-violet-600 data-[state=active]:text-white"
                data-ocid={`phone.port.tab.${index}`}
              >
                <PhoneMissed size={11} className="mr-1" />
                Port Number
              </TabsTrigger>
              <TabsTrigger
                value="forward"
                className="flex-1 h-7 text-xs data-[state=active]:bg-violet-600 data-[state=active]:text-white"
                data-ocid={`phone.forward.tab.${index}`}
              >
                <PhoneForwarded size={11} className="mr-1" />
                Forwarding
              </TabsTrigger>
            </TabsList>

            {/* New Local Number */}
            <TabsContent value="new" className="mt-3 space-y-3">
              <div>
                <Label className="text-xs text-slate-200 mb-1.5 block">
                  Area Code
                </Label>
                <div className="flex gap-2">
                  <Input
                    data-ocid={`phone.areacode.input.${index}`}
                    value={areaCode}
                    onChange={(e) =>
                      setAreaCode(e.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                    placeholder="e.g. 619"
                    maxLength={3}
                    className="w-24 bg-white/5 border-white/10 text-white placeholder:text-slate-600 font-mono text-sm h-8"
                  />
                  <Button
                    data-ocid={`phone.provision.button.${index}`}
                    size="sm"
                    onClick={handleProvisionNew}
                    disabled={provisioning}
                    className="h-8 bg-violet-600 hover:bg-violet-700 text-white text-xs px-3"
                  >
                    {provisioning ? (
                      <>
                        <Loader2 size={12} className="mr-1.5 animate-spin" />
                        Provisioning\u2026
                      </>
                    ) : (
                      "Provision Number"
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-600 mt-1.5">
                  A new local number matching the area code will be provisioned
                  via Twilio (~$1/mo).
                </p>
              </div>
              {provisioning && (
                <div
                  data-ocid={`phone.provision.loading_state.${index}`}
                  className="flex items-center gap-2 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-2"
                >
                  <Loader2 size={12} className="text-violet-400 animate-spin" />
                  <span className="text-xs text-violet-300">
                    Searching available numbers in {areaCode} area\u2026
                  </span>
                </div>
              )}
            </TabsContent>

            {/* Port Existing */}
            <TabsContent value="port" className="mt-3 space-y-3">
              <div>
                <Label className="text-xs text-slate-200 mb-1.5 block">
                  Current Business Number to Port
                </Label>
                <div className="flex gap-2">
                  <Input
                    data-ocid={`phone.port.input.${index}`}
                    value={portingNumber}
                    onChange={(e) => setPortingNumber(e.target.value)}
                    placeholder="(619) 555-0100"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 font-mono text-sm h-8"
                  />
                  <Button
                    data-ocid={`phone.portrequest.button.${index}`}
                    size="sm"
                    onClick={handlePortRequest}
                    className="h-8 bg-violet-600 hover:bg-violet-700 text-white text-xs px-3 whitespace-nowrap"
                  >
                    Start Port Request
                  </Button>
                </div>
                <p className="text-xs text-slate-600 mt-1.5">
                  Porting transfers their existing number to Twilio. Client
                  keeps their number \u2014 takes 2\u20135 business days.
                </p>
              </div>
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
                <p className="text-xs text-amber-300/80">
                  \u26a0\ufe0f The client\u2019s carrier must authorize the
                  port. They\u2019ll receive a confirmation call or letter.
                </p>
              </div>
            </TabsContent>

            {/* Call Forwarding */}
            <TabsContent value="forward" className="mt-3 space-y-3">
              <div>
                <Label className="text-xs text-slate-200 mb-1.5 block">
                  Client\u2019s Real Business Number
                </Label>
                <div className="flex gap-2">
                  <Input
                    data-ocid={`phone.forwarding.input.${index}`}
                    value={forwardingFrom}
                    onChange={(e) => setForwardingFrom(e.target.value)}
                    placeholder="(760) 555-0100"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 font-mono text-sm h-8"
                  />
                  <Button
                    data-ocid={`phone.setforwarding.button.${index}`}
                    size="sm"
                    onClick={handleForwarding}
                    className="h-8 bg-violet-600 hover:bg-violet-700 text-white text-xs px-3 whitespace-nowrap"
                  >
                    Set Up Forwarding
                  </Button>
                </div>
                <p className="text-xs text-slate-600 mt-1.5">
                  No porting needed. Client forwards their real number to the
                  Twilio number we assign. Setup takes 5 minutes.
                </p>
              </div>
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
                <p className="text-xs text-emerald-300/80">
                  \u2713 Fastest setup. Client\u2019s real number stays
                  unchanged \u2014 all calls route through the platform.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
