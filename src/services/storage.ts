import {
  Customer,
  Project,
  Laborer,
  AttendanceRecord,
  Supplier,
  MaterialItem,
  Invoice,
  SiteImage,
  ContractorSettings,
  PaymentRecord,
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'fieldbook_settings_v1',
  CUSTOMERS: 'fieldbook_customers_v1',
  PROJECTS: 'fieldbook_projects_v1',
  LABORERS: 'fieldbook_laborers_v1',
  ATTENDANCE: 'fieldbook_attendance_v1',
  SUPPLIERS: 'fieldbook_suppliers_v1',
  MATERIALS: 'fieldbook_materials_v1',
  INVOICES: 'fieldbook_invoices_v1',
  SITE_IMAGES: 'fieldbook_images_v1',
  CURRENT_USER_ROLE: 'fieldbook_active_role_v1',
  ACTIVE_LABORER_ID: 'fieldbook_active_laborer_id_v1',
};

export const DEFAULT_SETTINGS: ContractorSettings = {
  companyName: 'ShieldPro Waterproofing & Thermal Systems',
  contractorLicense: 'LIC-WP-89241',
  phone: '+1 (555) 742-9901',
  email: 'operations@shieldprocontractors.com',
  taxId: 'TX-44029188',
  address: '4200 Industrial Parkway, Suite 104, Metro Area',
  currencySymbol: '$',
  defaultTaxRate: 8.5,
  imageRetentionDays: 90,
};

// SVG data URI generator for resilient, architectural construction graphics
const createConstructionSiteSvg = (title: string, subtitle: string, color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <g transform="translate(100, 140)">
      <rect x="0" y="0" width="600" height="280" rx="12" fill="rgba(30, 41, 59, 0.7)" stroke="${color}" stroke-width="2"/>
      <path d="M 40 220 L 160 100 L 260 170 L 400 60 L 560 190" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="6,4"/>
      <circle cx="160" cy="100" r="7" fill="${color}"/>
      <circle cx="260" cy="170" r="7" fill="${color}"/>
      <circle cx="400" cy="60" r="7" fill="${color}"/>
      <circle cx="560" cy="190" r="7" fill="${color}"/>
      <rect x="40" y="235" width="520" height="15" rx="4" fill="${color}" opacity="0.3"/>
    </g>
    <text x="400" y="470" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="24" font-weight="bold" text-anchor="middle">${title}</text>
    <text x="400" y="505" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="16" text-anchor="middle">${subtitle}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Sterling Heights Realty Corp',
    phone: '+1 (555) 234-8901',
    email: 'facilities@sterlingheights.com',
    type: 'Commercial',
    address: '880 Grand Boulevard',
    city: 'Metro City',
    notes: 'Premium commercial client. Requires safety compliance badge on entry.',
    createdAt: '2026-08-15',
  },
  {
    id: 'cust-2',
    name: 'Dr. Evelyn Martinez',
    phone: '+1 (555) 872-3310',
    email: 'emartinez.clinic@gmail.com',
    type: 'Residential',
    address: '142 Whispering Pines Way',
    city: 'West Hills',
    notes: 'Heatproofing needed for 2nd floor flat roof and master suite terrace.',
    createdAt: '2026-09-02',
  },
  {
    id: 'cust-3',
    name: 'Apex Industrial Logistics LLC',
    phone: '+1 (555) 612-4099',
    email: 'warehouse.ops@apexlogistic.com',
    type: 'Industrial',
    address: '400 Port Access Highway, Dock B',
    city: 'South Port',
    notes: 'Severe rainwater seepage in basement storage area and loading ramps.',
    createdAt: '2026-09-18',
  },
  {
    id: 'cust-4',
    name: 'Beacon Hill Community HOA',
    phone: '+1 (555) 991-7243',
    email: 'board@beaconhillhoa.org',
    type: 'Residential',
    address: '12 Club House Lane',
    city: 'North Ridge',
    notes: 'Clubhouse swimming pool waterproof re-grouting and terrace sealer.',
    createdAt: '2026-10-01',
  },
];

export const INITIAL_LABORERS: Laborer[] = [
  {
    id: 'lab-1',
    name: 'Carlos Rivera',
    email: 'carlos.rivera@fieldbook.internal',
    phone: '+1 (555) 301-8841',
    role: 'laborer',
    trade: 'Master Waterproofer',
    defaultDailyWage: 85,
    address: '124 Elm St, Metro City',
    isActive: true,
  },
  {
    id: 'lab-2',
    name: 'Mateo Santos',
    email: 'mateo.santos@fieldbook.internal',
    phone: '+1 (555) 412-9902',
    role: 'laborer',
    trade: 'Thermal Coating Specialist',
    defaultDailyWage: 75,
    address: '48 Oak Ridge Dr, West Hills',
    isActive: true,
  },
  {
    id: 'lab-3',
    name: 'Darius Vance',
    phone: '+1 (555) 554-1123',
    role: 'laborer',
    trade: 'Mason & Surface Prep',
    defaultDailyWage: 65,
    address: '910 Riverbank Ave, Metro City',
    isActive: true,
  },
  {
    id: 'lab-4',
    name: 'Arjun Patel',
    phone: '+1 (555) 782-3490',
    role: 'laborer',
    trade: 'Site Technician & Applicator',
    defaultDailyWage: 70,
    address: '33 Maple Rd, North Ridge',
    isActive: true,
  },
  {
    id: 'lab-5',
    name: 'Lucas Morales',
    phone: '+1 (555) 902-1488',
    role: 'laborer',
    trade: 'General Site Helper',
    defaultDailyWage: 50,
    address: '77 Pine Street, Metro City',
    isActive: true,
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    customerId: 'cust-1',
    customerName: 'Sterling Heights Realty Corp',
    title: 'Sterling Commercial Tower Terrace Waterproofing',
    siteAddress: '880 Grand Boulevard, Roof Deck Level 18',
    city: 'Metro City',
    serviceType: ['Waterproofing'],
    areaSqFt: 4800,
    ratePerSqFt: 3.5,
    totalCost: 16800,
    paidTillNow: 11000,
    amountReceivable: 5800,
    status: 'In Progress',
    startDate: '2026-10-05',
    expectedEndDate: '2026-11-10',
    notes: 'Applying multi-coat elastomeric polyurethane with fiber mesh reinforcement over parapet walls.',
    paymentHistory: [
      {
        id: 'pay-1',
        amount: 6000,
        date: '2026-10-05',
        method: 'Bank Transfer',
        note: 'Project advance deposit (35%)',
        referenceId: 'TXN-9021-BOA',
      },
      {
        id: 'pay-2',
        amount: 5000,
        date: '2026-10-22',
        method: 'Bank Transfer',
        note: 'Milestone 2 - Primer & 1st coat completed',
        referenceId: 'TXN-9340-BOA',
      },
    ],
    materials: [
      {
        id: 'pmat-1',
        materialId: 'mat-1',
        materialName: 'Polyurethane Elastomeric Coating (20L Drum)',
        quantityUsed: 14,
        unit: 'Drums',
        cost: 3220,
        note: 'First & intermediate coats applied on main deck',
      },
      {
        id: 'pmat-2',
        materialId: 'mat-2',
        materialName: 'Aliphatic PU UV-Resistant Topcoat (20L)',
        quantityUsed: 6,
        unit: 'Drums',
        cost: 1620,
        note: 'Parapet coping seal',
      },
    ],
    assignedLaborerIds: ['lab-1', 'lab-3', 'lab-4'],
    createdAt: '2026-10-04',
  },
  {
    id: 'proj-2',
    customerId: 'cust-2',
    customerName: 'Dr. Evelyn Martinez',
    title: 'Villa Martinez Solar Reflective Heatproofing',
    siteAddress: '142 Whispering Pines Way',
    city: 'West Hills',
    serviceType: ['Heatproofing'],
    areaSqFt: 2200,
    ratePerSqFt: 2.8,
    totalCost: 6160,
    paidTillNow: 4000,
    amountReceivable: 2160,
    status: 'In Progress',
    startDate: '2026-10-18',
    expectedEndDate: '2026-11-02',
    notes: 'High SRI (>105) nano-ceramic heat reflective coating to reduce top-floor temperatures.',
    paymentHistory: [
      {
        id: 'pay-3',
        amount: 4000,
        date: '2026-10-18',
        method: 'UPI',
        note: 'Mobilization advance',
        referenceId: 'UPI-778219440',
      },
    ],
    materials: [
      {
        id: 'pmat-3',
        materialId: 'mat-3',
        materialName: 'High-SRI Nano-Ceramic Thermal Barrier (20L)',
        quantityUsed: 8,
        unit: 'Buckets',
        cost: 1760,
        note: 'Cross-hatch coat application complete',
      },
    ],
    assignedLaborerIds: ['lab-2', 'lab-5'],
    createdAt: '2026-10-16',
  },
  {
    id: 'proj-3',
    customerId: 'cust-3',
    customerName: 'Apex Industrial Logistics LLC',
    title: 'Basement Loading Dock Bitumen Membrane Damp-Proofing',
    siteAddress: '400 Port Access Highway, Dock B',
    city: 'South Port',
    serviceType: ['Waterproofing'],
    areaSqFt: 7500,
    ratePerSqFt: 4.2,
    totalCost: 31500,
    paidTillNow: 31500,
    amountReceivable: 0,
    status: 'Completed',
    startDate: '2026-09-10',
    expectedEndDate: '2026-10-14',
    completedDate: '2026-10-12',
    notes: 'Torch-applied 4mm APP membrane with geotextile protection and perimeter drain injection.',
    paymentHistory: [
      {
        id: 'pay-4',
        amount: 15000,
        date: '2026-09-10',
        method: 'Cheque',
        note: 'Initial deposit cheque #4401',
        referenceId: 'CHQ-4401',
      },
      {
        id: 'pay-5',
        amount: 16500,
        date: '2026-10-14',
        method: 'Bank Transfer',
        note: 'Final balance settlement upon water flood test clearance',
        referenceId: 'TXN-9821-WFC',
      },
    ],
    materials: [
      {
        id: 'pmat-4',
        materialId: 'mat-4',
        materialName: 'APP Modified 4mm Bituminous Membrane Rolls (10m)',
        quantityUsed: 78,
        unit: 'Rolls',
        cost: 7020,
      },
    ],
    assignedLaborerIds: ['lab-1', 'lab-3', 'lab-4', 'lab-5'],
    createdAt: '2026-09-08',
  },
  {
    id: 'proj-4',
    customerId: 'cust-4',
    customerName: 'Beacon Hill Community HOA',
    title: 'Clubhouse Terrace & Pool Perimeter Dual Barrier',
    siteAddress: '12 Club House Lane',
    city: 'North Ridge',
    serviceType: ['Waterproofing', 'Heatproofing'],
    areaSqFt: 3100,
    ratePerSqFt: 4.8,
    totalCost: 14880,
    paidTillNow: 0,
    amountReceivable: 14880,
    status: 'Not Started',
    startDate: '2026-11-04',
    expectedEndDate: '2026-11-25',
    notes: 'Scheduled for mobilization first week of November. Customer awaiting HOA board sign-off.',
    paymentHistory: [],
    materials: [],
    assignedLaborerIds: ['lab-1', 'lab-2'],
    createdAt: '2026-10-25',
  },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    companyName: 'ChemSeal Polymers & Admixtures',
    contactPerson: 'David Chen',
    phone: '+1 (555) 789-2234',
    email: 'orders@chemsealpolymers.com',
    address: '109 Chemical Way, Industrial Zone 4',
    totalPurchased: 8400,
    totalPaid: 6000,
    balance: 2400,
    status: 'Active',
    paymentHistory: [
      {
        id: 'spay-1',
        amount: 6000,
        date: '2026-10-10',
        method: 'Bank Transfer',
        note: 'Payment towards Invoice CS-981',
      },
    ],
  },
  {
    id: 'sup-2',
    companyName: 'Atlas Membrane & Bitumen Depot',
    contactPerson: 'Frank Kovacs',
    phone: '+1 (555) 345-6712',
    email: 'sales@atlasmembrane.com',
    address: '88 Rail Depot Rd, East Terminal',
    totalPurchased: 7020,
    totalPaid: 7020,
    balance: 0,
    status: 'Cleared',
    paymentHistory: [
      {
        id: 'spay-2',
        amount: 7020,
        date: '2026-09-28',
        method: 'Cheque',
        note: 'Complete settlement for 78 APP Rolls',
      },
    ],
  },
  {
    id: 'sup-3',
    companyName: 'ThermalShield Advanced Coatings',
    contactPerson: 'Elena Rostova',
    phone: '+1 (555) 662-8119',
    email: 'support@thermalshieldcoatings.com',
    address: '32 Science Park Blvd',
    totalPurchased: 3500,
    totalPaid: 2000,
    balance: 1500,
    status: 'Active',
    paymentHistory: [
      {
        id: 'spay-3',
        amount: 2000,
        date: '2026-10-15',
        method: 'Bank Transfer',
        note: 'Advance for Nano-Ceramic supply',
      },
    ],
  },
];

export const INITIAL_MATERIALS: MaterialItem[] = [
  {
    id: 'mat-1',
    supplierId: 'sup-1',
    supplierName: 'ChemSeal Polymers & Admixtures',
    name: 'Polyurethane Elastomeric Coating (20L Drum)',
    unit: 'Drums',
    quantityPurchased: 20,
    quantityAvailable: 6,
    purchaseDate: '2026-10-02',
    pricePerUnit: 230,
    totalCost: 4600,
    amountPaid: 3000,
    balance: 1600,
    paidCompletely: false,
    linkedProjectId: 'proj-1',
  },
  {
    id: 'mat-2',
    supplierId: 'sup-1',
    supplierName: 'ChemSeal Polymers & Admixtures',
    name: 'Aliphatic PU UV-Resistant Topcoat (20L)',
    unit: 'Drums',
    quantityPurchased: 10,
    quantityAvailable: 4,
    purchaseDate: '2026-10-08',
    pricePerUnit: 270,
    totalCost: 2700,
    amountPaid: 2000,
    balance: 700,
    paidCompletely: false,
    linkedProjectId: 'proj-1',
  },
  {
    id: 'mat-3',
    supplierId: 'sup-3',
    supplierName: 'ThermalShield Advanced Coatings',
    name: 'High-SRI Nano-Ceramic Thermal Barrier (20L)',
    unit: 'Buckets',
    quantityPurchased: 12,
    quantityAvailable: 4,
    purchaseDate: '2026-10-14',
    pricePerUnit: 220,
    totalCost: 2640,
    amountPaid: 1500,
    balance: 1140,
    paidCompletely: false,
    linkedProjectId: 'proj-2',
  },
  {
    id: 'mat-4',
    supplierId: 'sup-2',
    supplierName: 'Atlas Membrane & Bitumen Depot',
    name: 'APP Modified 4mm Bituminous Membrane Rolls (10m)',
    unit: 'Rolls',
    quantityPurchased: 78,
    quantityAvailable: 0,
    purchaseDate: '2026-09-12',
    pricePerUnit: 90,
    totalCost: 7020,
    amountPaid: 7020,
    balance: 0,
    paidCompletely: true,
    paidCompletelyDate: '2026-09-28',
    linkedProjectId: 'proj-3',
  },
];

// Generates attendance records for today and recent days
export const generateInitialAttendance = (): AttendanceRecord[] => {
  const today = '2026-10-31';
  const yesterday = '2026-10-30';
  const dayBefore = '2026-10-29';

  return [
    // Today
    {
      id: 'att-1',
      projectId: 'proj-1',
      projectName: 'Sterling Commercial Tower Terrace Waterproofing',
      laborerId: 'lab-1',
      laborerName: 'Carlos Rivera',
      date: today,
      present: true,
      status: 'Present',
      wageForDay: 85,
      advancePaidToday: 20,
      note: 'Supervising elastomeric roll coats',
    },
    {
      id: 'att-2',
      projectId: 'proj-1',
      projectName: 'Sterling Commercial Tower Terrace Waterproofing',
      laborerId: 'lab-3',
      laborerName: 'Darius Vance',
      date: today,
      present: true,
      status: 'Present',
      wageForDay: 65,
      advancePaidToday: 0,
      note: 'Parapet surface mortar grinding',
    },
    {
      id: 'att-3',
      projectId: 'proj-2',
      projectName: 'Villa Martinez Solar Reflective Heatproofing',
      laborerId: 'lab-2',
      laborerName: 'Mateo Santos',
      date: today,
      present: true,
      status: 'Present',
      wageForDay: 75,
      advancePaidToday: 15,
      note: 'Applying 2nd nano-ceramic heat layer',
    },
    {
      id: 'att-4',
      projectId: 'proj-2',
      projectName: 'Villa Martinez Solar Reflective Heatproofing',
      laborerId: 'lab-5',
      laborerName: 'Lucas Morales',
      date: today,
      present: true,
      status: 'Present',
      wageForDay: 50,
      advancePaidToday: 0,
      note: 'Material mixing & roller prep',
    },
    {
      id: 'att-5',
      projectId: 'proj-1',
      projectName: 'Sterling Commercial Tower Terrace Waterproofing',
      laborerId: 'lab-4',
      laborerName: 'Arjun Patel',
      date: today,
      present: false,
      status: 'Absent',
      wageForDay: 0,
      advancePaidToday: 0,
      note: 'Family emergency reported by phone',
    },

    // Yesterday
    {
      id: 'att-6',
      projectId: 'proj-1',
      projectName: 'Sterling Commercial Tower Terrace Waterproofing',
      laborerId: 'lab-1',
      laborerName: 'Carlos Rivera',
      date: yesterday,
      present: true,
      status: 'Present',
      wageForDay: 85,
      advancePaidToday: 0,
    },
    {
      id: 'att-7',
      projectId: 'proj-1',
      projectName: 'Sterling Commercial Tower Terrace Waterproofing',
      laborerId: 'lab-3',
      laborerName: 'Darius Vance',
      date: yesterday,
      present: true,
      status: 'Present',
      wageForDay: 65,
      advancePaidToday: 0,
    },
    {
      id: 'att-8',
      projectId: 'proj-2',
      projectName: 'Villa Martinez Solar Reflective Heatproofing',
      laborerId: 'lab-2',
      laborerName: 'Mateo Santos',
      date: yesterday,
      present: true,
      status: 'Present',
      wageForDay: 75,
      advancePaidToday: 0,
    },
    {
      id: 'att-9',
      projectId: 'proj-2',
      projectName: 'Villa Martinez Solar Reflective Heatproofing',
      laborerId: 'lab-5',
      laborerName: 'Lucas Morales',
      date: yesterday,
      present: true,
      status: 'Present',
      wageForDay: 50,
      advancePaidToday: 0,
    },
    {
      id: 'att-10',
      projectId: 'proj-1',
      projectName: 'Sterling Commercial Tower Terrace Waterproofing',
      laborerId: 'lab-4',
      laborerName: 'Arjun Patel',
      date: yesterday,
      present: true,
      status: 'Present',
      wageForDay: 70,
      advancePaidToday: 0,
    },

    // Day Before
    {
      id: 'att-11',
      projectId: 'proj-1',
      projectName: 'Sterling Commercial Tower Terrace Waterproofing',
      laborerId: 'lab-1',
      laborerName: 'Carlos Rivera',
      date: dayBefore,
      present: true,
      status: 'Present',
      wageForDay: 85,
      advancePaidToday: 0,
    },
    {
      id: 'att-12',
      projectId: 'proj-2',
      projectName: 'Villa Martinez Solar Reflective Heatproofing',
      laborerId: 'lab-2',
      laborerName: 'Mateo Santos',
      date: dayBefore,
      present: true,
      status: 'Present',
      wageForDay: 75,
      advancePaidToday: 0,
    },
  ];
};

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-088',
    projectId: 'proj-1',
    projectName: 'Sterling Commercial Tower Terrace Waterproofing',
    customerId: 'cust-1',
    customerName: 'Sterling Heights Realty Corp',
    customerPhone: '+1 (555) 234-8901',
    customerAddress: '880 Grand Boulevard, Metro City',
    issueDate: '2026-10-06',
    dueDate: '2026-11-06',
    lineItems: [
      {
        id: 'li-1',
        description: 'Polyurethane Elastomeric Waterproofing System (Area: 4,800 sq ft)',
        quantity: 4800,
        unitPrice: 3.5,
        total: 16800,
      },
    ],
    subtotal: 16800,
    taxRate: 8.5,
    tax: 1428,
    totalAmount: 18228,
    amountPaid: 11000,
    balance: 7228,
    status: 'Partial',
    paymentHistory: [
      {
        id: 'p-1',
        amount: 6000,
        date: '2026-10-05',
        method: 'Bank Transfer',
        note: 'Advance deposit',
      },
      {
        id: 'p-2',
        amount: 5000,
        date: '2026-10-22',
        method: 'Bank Transfer',
        note: 'Milestone 2',
      },
    ],
    notes: 'Warranty: 7-Year comprehensive waterproofing defect warranty issued upon final balance clearance.',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-092',
    projectId: 'proj-2',
    projectName: 'Villa Martinez Solar Reflective Heatproofing',
    customerId: 'cust-2',
    customerName: 'Dr. Evelyn Martinez',
    customerPhone: '+1 (555) 872-3310',
    customerAddress: '142 Whispering Pines Way, West Hills',
    issueDate: '2026-10-18',
    dueDate: '2026-11-18',
    lineItems: [
      {
        id: 'li-2',
        description: 'Nano-Ceramic Thermal Insulation Barrier (Area: 2,200 sq ft)',
        quantity: 2200,
        unitPrice: 2.8,
        total: 6160,
      },
    ],
    subtotal: 6160,
    taxRate: 8.5,
    tax: 523.6,
    totalAmount: 6683.6,
    amountPaid: 4000,
    balance: 2683.6,
    status: 'Partial',
    paymentHistory: [
      {
        id: 'p-3',
        amount: 4000,
        date: '2026-10-18',
        method: 'UPI',
        note: 'Mobilization advance',
      },
    ],
    notes: 'Includes surface pressure wash, primer coat, and dual ceramic cross-hatch finish.',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-074',
    projectId: 'proj-3',
    projectName: 'Basement Loading Dock Bitumen Membrane Damp-Proofing',
    customerId: 'cust-3',
    customerName: 'Apex Industrial Logistics LLC',
    customerPhone: '+1 (555) 612-4099',
    customerAddress: '400 Port Access Highway, Dock B, South Port',
    issueDate: '2026-09-12',
    dueDate: '2026-10-12',
    lineItems: [
      {
        id: 'li-3',
        description: 'APP 4mm Heavy-Duty Bituminous Damp-Proofing (7,500 sq ft)',
        quantity: 7500,
        unitPrice: 4.2,
        total: 31500,
      },
    ],
    subtotal: 31500,
    taxRate: 8.5,
    tax: 2677.5,
    totalAmount: 34177.5,
    amountPaid: 34177.5,
    balance: 0,
    status: 'Paid',
    paymentHistory: [
      {
        id: 'p-4',
        amount: 15000,
        date: '2026-09-10',
        method: 'Cheque',
        note: 'Initial deposit',
      },
      {
        id: 'p-5',
        amount: 19177.5,
        date: '2026-10-14',
        method: 'Bank Transfer',
        note: 'Final settlement with tax',
      },
    ],
    notes: 'Account fully settled and signed off with 10-year subterranean warranty.',
  },
];

export const INITIAL_SITE_IMAGES: SiteImage[] = [
  {
    id: 'img-1',
    projectId: 'proj-1',
    projectName: 'Sterling Commercial Tower Terrace Waterproofing',
    uploadedByRole: 'laborer',
    uploadedByName: 'Carlos Rivera',
    uploadedById: 'lab-1',
    url: createConstructionSiteSvg('Sterling Tower Rooftop', 'Elastomeric Membrane Application · Deck Section B', '#0284c7'),
    caption: 'Intermediate coats applied smoothly with fiber mesh reinforcement at all wall junctions.',
    tag: 'Membrane Laying',
    uploadedAt: '2026-10-24T14:32:00Z',
    deleteAfter: '2026-11-04T00:00:00Z', // Close to retention (demonstrates warning alert!)
    deletionWarningShown: false,
    markedForDeletion: false,
  },
  {
    id: 'img-2',
    projectId: 'proj-1',
    projectName: 'Sterling Commercial Tower Terrace Waterproofing',
    uploadedByRole: 'admin',
    uploadedByName: 'Field Supervisor',
    url: createConstructionSiteSvg('Sterling Tower Parapet Detail', 'Surface Grinding & Primer Coat Verified', '#38bdf8'),
    caption: 'Pre-application parapet inspection. Surface free of cracks, moisture meter reading 4.1%.',
    tag: 'Primer Application',
    uploadedAt: '2026-10-12T10:15:00Z',
    deleteAfter: '2027-01-10T00:00:00Z',
    deletionWarningShown: false,
    markedForDeletion: false,
  },
  {
    id: 'img-3',
    projectId: 'proj-2',
    projectName: 'Villa Martinez Solar Reflective Heatproofing',
    uploadedByRole: 'laborer',
    uploadedByName: 'Mateo Santos',
    uploadedById: 'lab-2',
    url: createConstructionSiteSvg('Villa Martinez Roof Deck', 'Nano-Ceramic Thermal Barrier Coat 1', '#f59e0b'),
    caption: 'First layer of high-SRI reflective coating applied evenly over the terrace slab.',
    tag: 'Final Seal',
    uploadedAt: '2026-10-28T16:45:00Z',
    deleteAfter: '2027-01-26T00:00:00Z',
    deletionWarningShown: false,
    markedForDeletion: false,
  },
  {
    id: 'img-4',
    projectId: 'proj-3',
    projectName: 'Basement Loading Dock Bitumen Membrane Damp-Proofing',
    uploadedByRole: 'admin',
    uploadedByName: 'Field Supervisor',
    url: createConstructionSiteSvg('Apex Logistics Basement', 'Torch-Applied 4mm Bitumen Membrane Passed Flood Test', '#10b981'),
    caption: '24-hour flood ponding test completed with zero dampness or leakage.',
    tag: 'Inspection',
    uploadedAt: '2026-10-11T09:30:00Z',
    deleteAfter: '2026-11-02T00:00:00Z', // Scheduled for deletion in < 3 days (triggers alert!)
    deletionWarningShown: false,
    markedForDeletion: false,
  },
];

// Helper to load or initialize storage
export const getStored = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
};

export const setStored = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
};

export class StorageService {
  static getSettings(): ContractorSettings {
    return getStored(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  static saveSettings(settings: ContractorSettings): void {
    setStored(STORAGE_KEYS.SETTINGS, settings);
  }

  static getCustomers(): Customer[] {
    return getStored(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  }

  static saveCustomers(customers: Customer[]): void {
    setStored(STORAGE_KEYS.CUSTOMERS, customers);
  }

  static getProjects(): Project[] {
    return getStored(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  }

  static saveProjects(projects: Project[]): void {
    setStored(STORAGE_KEYS.PROJECTS, projects);
  }

  static getLaborers(): Laborer[] {
    return getStored(STORAGE_KEYS.LABORERS, INITIAL_LABORERS);
  }

  static saveLaborers(laborers: Laborer[]): void {
    setStored(STORAGE_KEYS.LABORERS, laborers);
  }

  static getAttendance(): AttendanceRecord[] {
    return getStored(STORAGE_KEYS.ATTENDANCE, generateInitialAttendance());
  }

  static saveAttendance(records: AttendanceRecord[]): void {
    setStored(STORAGE_KEYS.ATTENDANCE, records);
  }

  static getSuppliers(): Supplier[] {
    return getStored(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  }

  static saveSuppliers(suppliers: Supplier[]): void {
    setStored(STORAGE_KEYS.SUPPLIERS, suppliers);
  }

  static getMaterials(): MaterialItem[] {
    return getStored(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
  }

  static saveMaterials(materials: MaterialItem[]): void {
    setStored(STORAGE_KEYS.MATERIALS, materials);
  }

  static getInvoices(): Invoice[] {
    return getStored(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
  }

  static saveInvoices(invoices: Invoice[]): void {
    setStored(STORAGE_KEYS.INVOICES, invoices);
  }

  static getSiteImages(): SiteImage[] {
    return getStored(STORAGE_KEYS.SITE_IMAGES, INITIAL_SITE_IMAGES);
  }

  static saveSiteImages(images: SiteImage[]): void {
    setStored(STORAGE_KEYS.SITE_IMAGES, images);
  }

  static getActiveRole(): 'admin' | 'laborer' {
    return getStored(STORAGE_KEYS.CURRENT_USER_ROLE, 'admin');
  }

  static setActiveRole(role: 'admin' | 'laborer'): void {
    setStored(STORAGE_KEYS.CURRENT_USER_ROLE, role);
  }

  static getActiveLaborerId(): string {
    return getStored(STORAGE_KEYS.ACTIVE_LABORER_ID, 'lab-1');
  }

  static setActiveLaborerId(id: string): void {
    setStored(STORAGE_KEYS.ACTIVE_LABORER_ID, id);
  }

  static resetToDefault(): void {
    localStorage.clear();
  }
}
