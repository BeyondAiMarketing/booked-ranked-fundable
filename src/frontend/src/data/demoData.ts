export const TENANTS = [
  {
    id: "tenant-oceanside",
    name: "Oceanside Clean & Restore",
    phone: "(760) 555-0101",
    website: "oceansideclean.com",
    address: "123 Pacific Ave, Oceanside, CA 92054",
    type: "Restoration",
  },
  {
    id: "tenant-plumbing",
    name: "North County Plumbing Pros",
    phone: "(760) 555-0202",
    website: "ncplumbingpros.com",
    address: "456 El Camino Real, Vista, CA 92084",
    type: "Plumbing",
  },
  {
    id: "tenant-medspa",
    name: "Radiance Med Spa",
    phone: "(619) 555-0303",
    website: "radiancemedspa.com",
    address: "789 Coast Blvd, La Jolla, CA 92037",
    type: "Med Spa",
  },
  {
    id: "tenant-demo",
    name: "Demo Business",
    phone: "(555) 555-0000",
    website: "yourbusiness.com",
    address: "Your City, CA",
    type: "Demo",
  },
];

export const LEADS: Record<string, Lead[]> = {
  "tenant-oceanside": [
    {
      id: "l1",
      tenantId: "tenant-oceanside",
      name: "Maria Gonzalez",
      phone: "(760) 555-1001",
      email: "maria@email.com",
      source: "Google",
      status: "new",
      createdAt: Date.now() - 86400000,
    },
    {
      id: "l2",
      tenantId: "tenant-oceanside",
      name: "James Chen",
      phone: "(760) 555-1002",
      email: "james@email.com",
      source: "Referral",
      status: "contacted",
      createdAt: Date.now() - 172800000,
    },
    {
      id: "l3",
      tenantId: "tenant-oceanside",
      name: "Sarah Williams",
      phone: "(760) 555-1003",
      email: "sarah@email.com",
      source: "Website",
      status: "qualified",
      createdAt: Date.now() - 259200000,
    },
    {
      id: "l4",
      tenantId: "tenant-oceanside",
      name: "Robert Davis",
      phone: "(760) 555-1004",
      email: "robert@email.com",
      source: "Facebook",
      status: "closed",
      createdAt: Date.now() - 345600000,
    },
    {
      id: "l5",
      tenantId: "tenant-oceanside",
      name: "Linda Martinez",
      phone: "(760) 555-1005",
      email: "linda@email.com",
      source: "Google",
      status: "new",
      createdAt: Date.now() - 432000000,
    },
    {
      id: "l6",
      tenantId: "tenant-oceanside",
      name: "Michael Brown",
      phone: "(760) 555-1006",
      email: "mike@email.com",
      source: "Yelp",
      status: "contacted",
      createdAt: Date.now() - 518400000,
    },
  ],
  "tenant-plumbing": [
    {
      id: "p1",
      tenantId: "tenant-plumbing",
      name: "Karen Thompson",
      phone: "(760) 555-2001",
      email: "karen@email.com",
      source: "Google",
      status: "new",
      createdAt: Date.now() - 86400000,
    },
    {
      id: "p2",
      tenantId: "tenant-plumbing",
      name: "David Lee",
      phone: "(760) 555-2002",
      email: "david@email.com",
      source: "Website",
      status: "qualified",
      createdAt: Date.now() - 172800000,
    },
    {
      id: "p3",
      tenantId: "tenant-plumbing",
      name: "Jennifer White",
      phone: "(760) 555-2003",
      email: "jen@email.com",
      source: "Referral",
      status: "closed",
      createdAt: Date.now() - 259200000,
    },
    {
      id: "p4",
      tenantId: "tenant-plumbing",
      name: "Thomas Harris",
      phone: "(760) 555-2004",
      email: "thomas@email.com",
      source: "Facebook",
      status: "contacted",
      createdAt: Date.now() - 345600000,
    },
    {
      id: "p5",
      tenantId: "tenant-plumbing",
      name: "Patricia Clark",
      phone: "(760) 555-2005",
      email: "pat@email.com",
      source: "Google",
      status: "new",
      createdAt: Date.now() - 432000000,
    },
    {
      id: "p6",
      tenantId: "tenant-plumbing",
      name: "Christopher Lewis",
      phone: "(760) 555-2006",
      email: "chris@email.com",
      source: "Yelp",
      status: "contacted",
      createdAt: Date.now() - 518400000,
    },
  ],
  "tenant-medspa": [
    {
      id: "ms1",
      tenantId: "tenant-medspa",
      name: "Ashley Monroe",
      phone: "(619) 555-3001",
      email: "ashley@email.com",
      source: "Instagram",
      status: "new",
      createdAt: Date.now() - 86400000,
    },
    {
      id: "ms2",
      tenantId: "tenant-medspa",
      name: "Brittany Nguyen",
      phone: "(619) 555-3002",
      email: "brittany@email.com",
      source: "Google",
      status: "qualified",
      createdAt: Date.now() - 172800000,
    },
    {
      id: "ms3",
      tenantId: "tenant-medspa",
      name: "Cynthia Park",
      phone: "(619) 555-3003",
      email: "cynthia@email.com",
      source: "Referral",
      status: "contacted",
      createdAt: Date.now() - 259200000,
    },
    {
      id: "ms4",
      tenantId: "tenant-medspa",
      name: "Diana Ruiz",
      phone: "(619) 555-3004",
      email: "diana@email.com",
      source: "Website",
      status: "closed",
      createdAt: Date.now() - 345600000,
    },
    {
      id: "ms5",
      tenantId: "tenant-medspa",
      name: "Elena Torres",
      phone: "(619) 555-3005",
      email: "elena@email.com",
      source: "Google",
      status: "new",
      createdAt: Date.now() - 432000000,
    },
  ],
  "tenant-demo": [
    {
      id: "d1",
      tenantId: "tenant-demo",
      name: "Alex Johnson",
      phone: "(555) 555-1001",
      email: "alex@email.com",
      source: "Google",
      status: "new",
      createdAt: Date.now() - 86400000,
    },
    {
      id: "d2",
      tenantId: "tenant-demo",
      name: "Sam Rivera",
      phone: "(555) 555-1002",
      email: "sam@email.com",
      source: "Website",
      status: "contacted",
      createdAt: Date.now() - 172800000,
    },
    {
      id: "d3",
      tenantId: "tenant-demo",
      name: "Jordan Kim",
      phone: "(555) 555-1003",
      email: "jordan@email.com",
      source: "Referral",
      status: "qualified",
      createdAt: Date.now() - 259200000,
    },
    {
      id: "d4",
      tenantId: "tenant-demo",
      name: "Taylor Brooks",
      phone: "(555) 555-1004",
      email: "taylor@email.com",
      source: "Facebook",
      status: "new",
      createdAt: Date.now() - 345600000,
    },
    {
      id: "d5",
      tenantId: "tenant-demo",
      name: "Morgan Davis",
      phone: "(555) 555-1005",
      email: "morgan@email.com",
      source: "Google",
      status: "contacted",
      createdAt: Date.now() - 432000000,
    },
    {
      id: "d6",
      tenantId: "tenant-demo",
      name: "Casey Wilson",
      phone: "(555) 555-1006",
      email: "casey@email.com",
      source: "Yelp",
      status: "new",
      createdAt: Date.now() - 518400000,
    },
    {
      id: "d7",
      tenantId: "tenant-demo",
      name: "Riley Martinez",
      phone: "(555) 555-1007",
      email: "riley@email.com",
      source: "Google",
      status: "qualified",
      createdAt: Date.now() - 604800000,
    },
  ],
};

export interface Lead {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "closed";
  createdAt: number;
}

export interface Review {
  id: string;
  tenantId: string;
  author: string;
  rating: number;
  comment: string;
  platform: "Google" | "Yelp" | "Facebook";
  date: string;
}

export const REVIEWS: Record<string, Review[]> = {
  "tenant-oceanside": [
    {
      id: "r1",
      tenantId: "tenant-oceanside",
      author: "Susan P.",
      rating: 5,
      comment:
        "Absolutely fantastic service! They restored our floors after flooding and they look brand new.",
      platform: "Google",
      date: "2026-03-10",
    },
    {
      id: "r2",
      tenantId: "tenant-oceanside",
      author: "Mark T.",
      rating: 5,
      comment:
        "Fast response, professional crew, and excellent results. Highly recommend!",
      platform: "Google",
      date: "2026-03-05",
    },
    {
      id: "r3",
      tenantId: "tenant-oceanside",
      author: "Amy L.",
      rating: 4,
      comment:
        "Great work overall. Minor scheduling hiccup but the results were worth it.",
      platform: "Yelp",
      date: "2026-02-28",
    },
    {
      id: "r4",
      tenantId: "tenant-oceanside",
      author: "Carlos M.",
      rating: 5,
      comment:
        "Used them twice now. Always professional and thorough. My go-to restoration company.",
      platform: "Google",
      date: "2026-02-15",
    },
    {
      id: "r5",
      tenantId: "tenant-oceanside",
      author: "Diana H.",
      rating: 4,
      comment:
        "Solid work on our mold remediation. Explained every step of the process.",
      platform: "Facebook",
      date: "2026-02-01",
    },
  ],
  "tenant-plumbing": [
    {
      id: "rp1",
      tenantId: "tenant-plumbing",
      author: "Kevin R.",
      rating: 5,
      comment:
        "Fixed our burst pipe at 10pm on a Sunday. Lifesavers! Fair price too.",
      platform: "Google",
      date: "2026-03-12",
    },
    {
      id: "rp2",
      tenantId: "tenant-plumbing",
      author: "Nancy S.",
      rating: 4,
      comment: "Good plumbers. Arrived on time and fixed the issue quickly.",
      platform: "Yelp",
      date: "2026-03-01",
    },
    {
      id: "rp3",
      tenantId: "tenant-plumbing",
      author: "Greg O.",
      rating: 4,
      comment: "Professional team. Got the water heater replaced same day.",
      platform: "Google",
      date: "2026-02-20",
    },
    {
      id: "rp4",
      tenantId: "tenant-plumbing",
      author: "Tina B.",
      rating: 5,
      comment: "Best plumbers in North County. Always reliable and honest.",
      platform: "Facebook",
      date: "2026-02-10",
    },
    {
      id: "rp5",
      tenantId: "tenant-plumbing",
      author: "Frank A.",
      rating: 3,
      comment:
        "Work was good but had to follow up a few times to get scheduled.",
      platform: "Yelp",
      date: "2026-01-25",
    },
  ],
  "tenant-medspa": [
    {
      id: "rm1",
      tenantId: "tenant-medspa",
      author: "Jessica L.",
      rating: 5,
      comment:
        "Absolutely love this place! The botox results are so natural and the staff is wonderful.",
      platform: "Google",
      date: "2026-03-11",
    },
    {
      id: "rm2",
      tenantId: "tenant-medspa",
      author: "Michelle K.",
      rating: 5,
      comment:
        "Best med spa in La Jolla. The hydrafacial changed my skin completely.",
      platform: "Google",
      date: "2026-03-05",
    },
    {
      id: "rm3",
      tenantId: "tenant-medspa",
      author: "Rachel S.",
      rating: 4,
      comment:
        "Great experience overall. Pricing is fair and results speak for themselves.",
      platform: "Yelp",
      date: "2026-02-20",
    },
  ],
  "tenant-demo": [
    {
      id: "rd1",
      tenantId: "tenant-demo",
      author: "Happy Customer A.",
      rating: 5,
      comment:
        "Outstanding service — professional, fast, and great results. Highly recommend!",
      platform: "Google",
      date: "2026-03-10",
    },
    {
      id: "rd2",
      tenantId: "tenant-demo",
      author: "Satisfied Client B.",
      rating: 5,
      comment: "Best in the area. Will definitely use again and refer friends.",
      platform: "Google",
      date: "2026-03-05",
    },
    {
      id: "rd3",
      tenantId: "tenant-demo",
      author: "Loyal Customer C.",
      rating: 4,
      comment: "Very professional and thorough. Minor wait time but worth it.",
      platform: "Yelp",
      date: "2026-02-28",
    },
  ],
};

export interface AuditData {
  tenantId: string;
  total: number;
  gmb: number;
  citations: number;
  website: number;
  backlinks: number;
  recommendations: { text: string; priority: "High" | "Medium" | "Low" }[];
}

export const AUDIT_SCORES: Record<string, AuditData> = {
  "tenant-oceanside": {
    tenantId: "tenant-oceanside",
    total: 68,
    gmb: 65,
    citations: 70,
    website: 72,
    backlinks: 55,
    recommendations: [
      {
        text: "Add 10 more photos to your Google Business Profile",
        priority: "High",
      },
      {
        text: "Fix 3 citation inconsistencies on Yelp and YellowPages",
        priority: "High",
      },
      {
        text: "Improve page load speed — currently 4.2s (target <2s)",
        priority: "Medium",
      },
      {
        text: "Build 5 more local backlinks from chamber of commerce and sponsors",
        priority: "Medium",
      },
      {
        text: "Respond to all Google reviews within 24 hours",
        priority: "Low",
      },
    ],
  },
  "tenant-plumbing": {
    tenantId: "tenant-plumbing",
    total: 72,
    gmb: 75,
    citations: 78,
    website: 68,
    backlinks: 67,
    recommendations: [
      {
        text: "Update website with service area pages for each city",
        priority: "High",
      },
      {
        text: "Add schema markup for local business to website",
        priority: "High",
      },
      {
        text: "Post weekly updates to Google Business Profile",
        priority: "Medium",
      },
      {
        text: "Get listed on 5 more plumbing-specific directories",
        priority: "Medium",
      },
      {
        text: "Add FAQ section to website targeting common search terms",
        priority: "Low",
      },
    ],
  },
  "tenant-medspa": {
    tenantId: "tenant-medspa",
    total: 74,
    gmb: 78,
    citations: 72,
    website: 80,
    backlinks: 60,
    recommendations: [
      {
        text: "Add before/after photos to Google Business Profile",
        priority: "High",
      },
      {
        text: "Create service-specific landing pages for each treatment",
        priority: "High",
      },
      {
        text: "Build citations on health and beauty directories",
        priority: "Medium",
      },
      {
        text: "Enable online booking directly from Google listing",
        priority: "Medium",
      },
      {
        text: "Respond to all reviews within 24 hours with personal responses",
        priority: "Low",
      },
    ],
  },
  "tenant-demo": {
    tenantId: "tenant-demo",
    total: 64,
    gmb: 60,
    citations: 65,
    website: 70,
    backlinks: 55,
    recommendations: [
      {
        text: "Complete your Google Business Profile — missing key info",
        priority: "High",
      },
      {
        text: "Fix citation inconsistencies across major directories",
        priority: "High",
      },
      {
        text: "Improve page load speed — currently 4.8s (target <2s)",
        priority: "Medium",
      },
      {
        text: "Build local backlinks from industry associations",
        priority: "Medium",
      },
      { text: "Add structured data markup to your website", priority: "Low" },
    ],
  },
};

export interface FundabilityItem {
  id: string;
  tenantId: string;
  category: string;
  item: string;
  completed: boolean;
}

export const FUNDABILITY_SCORES: Record<string, number> = {
  "tenant-oceanside": 55,
  "tenant-plumbing": 71,
  "tenant-medspa": 63,
  "tenant-demo": 48,
};

export const FUNDABILITY_ITEMS: Record<string, FundabilityItem[]> = {
  "tenant-oceanside": [
    {
      id: "f1",
      tenantId: "tenant-oceanside",
      category: "Business Foundation",
      item: "LLC or Corp registered",
      completed: true,
    },
    {
      id: "f2",
      tenantId: "tenant-oceanside",
      category: "Business Foundation",
      item: "EIN obtained from IRS",
      completed: true,
    },
    {
      id: "f3",
      tenantId: "tenant-oceanside",
      category: "Business Foundation",
      item: "Business address (not PO Box)",
      completed: true,
    },
    {
      id: "f4",
      tenantId: "tenant-oceanside",
      category: "Banking & Credit",
      item: "Dedicated business checking account",
      completed: true,
    },
    {
      id: "f5",
      tenantId: "tenant-oceanside",
      category: "Banking & Credit",
      item: "Business credit card",
      completed: false,
    },
    {
      id: "f6",
      tenantId: "tenant-oceanside",
      category: "Banking & Credit",
      item: "D-U-N-S Number (Dun & Bradstreet)",
      completed: false,
    },
    {
      id: "f7",
      tenantId: "tenant-oceanside",
      category: "Online Presence",
      item: "Professional website",
      completed: true,
    },
    {
      id: "f8",
      tenantId: "tenant-oceanside",
      category: "Online Presence",
      item: "Google Business Profile verified",
      completed: false,
    },
    {
      id: "f9",
      tenantId: "tenant-oceanside",
      category: "Documents",
      item: "2 years business tax returns",
      completed: false,
    },
    {
      id: "f10",
      tenantId: "tenant-oceanside",
      category: "Documents",
      item: "Business licenses current",
      completed: true,
    },
  ],
  "tenant-plumbing": [
    {
      id: "fp1",
      tenantId: "tenant-plumbing",
      category: "Business Foundation",
      item: "LLC or Corp registered",
      completed: true,
    },
    {
      id: "fp2",
      tenantId: "tenant-plumbing",
      category: "Business Foundation",
      item: "EIN obtained from IRS",
      completed: true,
    },
    {
      id: "fp3",
      tenantId: "tenant-plumbing",
      category: "Business Foundation",
      item: "Business address (not PO Box)",
      completed: true,
    },
    {
      id: "fp4",
      tenantId: "tenant-plumbing",
      category: "Banking & Credit",
      item: "Dedicated business checking account",
      completed: true,
    },
    {
      id: "fp5",
      tenantId: "tenant-plumbing",
      category: "Banking & Credit",
      item: "Business credit card",
      completed: true,
    },
    {
      id: "fp6",
      tenantId: "tenant-plumbing",
      category: "Banking & Credit",
      item: "D-U-N-S Number (Dun & Bradstreet)",
      completed: false,
    },
    {
      id: "fp7",
      tenantId: "tenant-plumbing",
      category: "Online Presence",
      item: "Professional website",
      completed: true,
    },
    {
      id: "fp8",
      tenantId: "tenant-plumbing",
      category: "Online Presence",
      item: "Google Business Profile verified",
      completed: true,
    },
    {
      id: "fp9",
      tenantId: "tenant-plumbing",
      category: "Documents",
      item: "2 years business tax returns",
      completed: true,
    },
    {
      id: "fp10",
      tenantId: "tenant-plumbing",
      category: "Documents",
      item: "Business licenses current",
      completed: false,
    },
  ],
  "tenant-medspa": [
    {
      id: "fm1",
      tenantId: "tenant-medspa",
      category: "Business Foundation",
      item: "LLC or Corp registered",
      completed: true,
    },
    {
      id: "fm2",
      tenantId: "tenant-medspa",
      category: "Business Foundation",
      item: "EIN obtained from IRS",
      completed: true,
    },
    {
      id: "fm3",
      tenantId: "tenant-medspa",
      category: "Business Foundation",
      item: "Business address (not PO Box)",
      completed: true,
    },
    {
      id: "fm4",
      tenantId: "tenant-medspa",
      category: "Banking & Credit",
      item: "Dedicated business checking account",
      completed: true,
    },
    {
      id: "fm5",
      tenantId: "tenant-medspa",
      category: "Banking & Credit",
      item: "Business credit card",
      completed: false,
    },
    {
      id: "fm6",
      tenantId: "tenant-medspa",
      category: "Banking & Credit",
      item: "D-U-N-S Number (Dun & Bradstreet)",
      completed: false,
    },
    {
      id: "fm7",
      tenantId: "tenant-medspa",
      category: "Online Presence",
      item: "Professional website",
      completed: true,
    },
    {
      id: "fm8",
      tenantId: "tenant-medspa",
      category: "Online Presence",
      item: "Google Business Profile verified",
      completed: true,
    },
    {
      id: "fm9",
      tenantId: "tenant-medspa",
      category: "Documents",
      item: "2 years business tax returns",
      completed: false,
    },
    {
      id: "fm10",
      tenantId: "tenant-medspa",
      category: "Documents",
      item: "Business licenses current",
      completed: true,
    },
  ],
  "tenant-demo": [
    {
      id: "fd1",
      tenantId: "tenant-demo",
      category: "Business Foundation",
      item: "LLC or Corp registered",
      completed: true,
    },
    {
      id: "fd2",
      tenantId: "tenant-demo",
      category: "Business Foundation",
      item: "EIN obtained from IRS",
      completed: false,
    },
    {
      id: "fd3",
      tenantId: "tenant-demo",
      category: "Business Foundation",
      item: "Business address (not PO Box)",
      completed: true,
    },
    {
      id: "fd4",
      tenantId: "tenant-demo",
      category: "Banking & Credit",
      item: "Dedicated business checking account",
      completed: true,
    },
    {
      id: "fd5",
      tenantId: "tenant-demo",
      category: "Banking & Credit",
      item: "Business credit card",
      completed: false,
    },
    {
      id: "fd6",
      tenantId: "tenant-demo",
      category: "Banking & Credit",
      item: "D-U-N-S Number (Dun & Bradstreet)",
      completed: false,
    },
    {
      id: "fd7",
      tenantId: "tenant-demo",
      category: "Online Presence",
      item: "Professional website",
      completed: true,
    },
    {
      id: "fd8",
      tenantId: "tenant-demo",
      category: "Online Presence",
      item: "Google Business Profile verified",
      completed: false,
    },
    {
      id: "fd9",
      tenantId: "tenant-demo",
      category: "Documents",
      item: "2 years business tax returns",
      completed: false,
    },
    {
      id: "fd10",
      tenantId: "tenant-demo",
      category: "Documents",
      item: "Business licenses current",
      completed: true,
    },
  ],
};

export const MONTHLY_DATA = [
  { month: "Oct", leads: 6, reviews: 2 },
  { month: "Nov", leads: 8, reviews: 3 },
  { month: "Dec", leads: 5, reviews: 1 },
  { month: "Jan", leads: 9, reviews: 4 },
  { month: "Feb", leads: 11, reviews: 3 },
  { month: "Mar", leads: 12, reviews: 5 },
];
