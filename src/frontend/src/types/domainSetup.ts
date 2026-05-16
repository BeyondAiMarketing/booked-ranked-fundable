export type Registrar = "godaddy" | "namecheap" | "cloudflare" | "other";
export type SiteImportStatus = "pending" | "scanning" | "done" | "skipped";

export interface ImportedContent {
  businessName: string;
  services: string[];
  contactInfo: string;
  colorScheme: string;
}

export interface DomainSetupState {
  clientId: string;
  domain: string;
  registrar: Registrar | null;
  currentStep: number; // 1-7
  dnsAdded: boolean;
  propagationPercentage: number;
  propagationComplete: boolean;
  siteImportStatus: SiteImportStatus;
  importedContent: ImportedContent | null;
  isActive: boolean;
}

export const WIZARD_STEPS = [
  {
    number: 1,
    title: "Enter Domain",
    description: "Add your client's domain name",
  },
  {
    number: 2,
    title: "Choose Registrar",
    description: "Where the domain was purchased",
  },
  {
    number: 3,
    title: "Configure DNS",
    description: "Copy the two records needed",
  },
  {
    number: 4,
    title: "Setup Walkthrough",
    description: "Step-by-step instructions",
  },
  {
    number: 5,
    title: "Check Propagation",
    description: "Verify DNS is live worldwide",
  },
  {
    number: 6,
    title: "Import Website",
    description: "Pull in existing site content",
  },
  {
    number: 7,
    title: "Activate Domain",
    description: "Launch the live site on BRF",
  },
] as const;

export const DNS_RECORDS = {
  a: {
    type: "A",
    name: "@",
    value: "76.76.21.21",
    ttl: "3600 (1 Hour)",
  },
  cname: {
    type: "CNAME",
    name: "www",
    value: "bookedrankedfunded.org",
    ttl: "3600 (1 Hour)",
  },
} as const;

export const REGISTRAR_OPTIONS: Array<{
  id: Registrar;
  label: string;
  color: string;
  hint: string;
}> = [
  {
    id: "godaddy",
    label: "GoDaddy",
    color: "#00A4A6",
    hint: "Most common registrar",
  },
  {
    id: "namecheap",
    label: "Namecheap",
    color: "#DE5B2D",
    hint: "Popular budget registrar",
  },
  {
    id: "cloudflare",
    label: "Cloudflare",
    color: "#F48024",
    hint: "DNS + CDN provider",
  },
  {
    id: "other",
    label: "Other",
    color: "#7C5CFC",
    hint: "Any other registrar",
  },
];
