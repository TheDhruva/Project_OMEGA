export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
export type ServiceType = 'Waterproofing' | 'Heatproofing';
export type PaymentMethod = 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
export type CustomerType = 'Residential' | 'Commercial' | 'Industrial';
export type AttendanceStatus = 'Present' | 'Absent' | 'Half-Day';
export type UserRole = 'admin' | 'laborer';
export type InvoiceStatus = 'Draft' | 'Sent' | 'Partial' | 'Paid' | 'Overdue';
export type SupplierStatus = 'Active' | 'Cleared' | 'Inactive';
export type PhotoTag = 'Before' | 'Surface Prep' | 'Primer Application' | 'Membrane Laying' | 'Final Seal' | 'Inspection';

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  note?: string;
  referenceId?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: CustomerType;
  address: string;
  city: string;
  notes?: string;
  createdAt: string;
}

export interface ProjectMaterialUsage {
  id: string;
  materialId: string;
  materialName: string;
  quantityUsed: number;
  unit: string;
  cost: number;
  note?: string;
}

export interface Project {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  siteAddress: string;
  city: string;
  serviceType: ServiceType[];
  areaSqFt: number;
  ratePerSqFt: number;
  totalCost: number;
  paidTillNow: number;
  amountReceivable: number;
  paymentHistory: PaymentRecord[];
  materials: ProjectMaterialUsage[];
  assignedLaborerIds: string[];
  status: ProjectStatus;
  startDate: string;
  expectedEndDate: string;
  completedDate?: string;
  notes?: string;
  createdAt: string;
}

export interface Laborer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  trade: string; // e.g. "Master Waterproofer", "Thermal Specialist", "Mason", "Technician"
  defaultDailyWage: number;
  address?: string;
  isActive: boolean;
  manualTotalPaid?: number | null;
  manualLeftToPay?: number | null;
}

export interface AttendanceRecord {
  id: string;
  projectId: string;
  projectName?: string;
  laborerId: string;
  laborerName?: string;
  date: string; // YYYY-MM-DD
  present: boolean;
  status: AttendanceStatus;
  wageForDay: number;
  advancePaidToday: number;
  note?: string;
}

export interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  paymentHistory: PaymentRecord[];
  totalPurchased: number;
  totalPaid: number;
  balance: number;
  status: SupplierStatus;
}

export interface MaterialItem {
  id: string;
  supplierId: string;
  supplierName: string;
  name: string;
  unit: string; // Bags, Rolls, Buckets (20L), Liters
  quantityPurchased: number;
  quantityAvailable: number;
  purchaseDate: string;
  pricePerUnit: number;
  totalCost: number;
  amountPaid: number;
  balance: number;
  paidCompletely: boolean;
  paidCompletelyDate?: string;
  linkedProjectId?: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  projectName: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number; // percentage, e.g. 18 or 10
  tax: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  paymentHistory: PaymentRecord[];
  status: InvoiceStatus;
  notes?: string;
}

export interface SiteImage {
  id: string;
  projectId: string;
  projectName: string;
  uploadedByRole: UserRole;
  uploadedByName: string;
  uploadedById?: string;
  url: string;
  caption: string;
  tag: PhotoTag;
  uploadedAt: string;
  deleteAfter: string; // ISO date (retention period)
  deletionWarningShown: boolean;
  markedForDeletion: boolean;
}

export interface ContractorSettings {
  companyName: string;
  contractorLicense: string;
  phone: string;
  email: string;
  taxId: string;
  address: string;
  currencySymbol: string;
  defaultTaxRate: number;
  imageRetentionDays: number;
}
