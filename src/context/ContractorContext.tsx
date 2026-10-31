import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
  UserRole,
  PhotoTag,
} from '../types';
import {
  StorageService,
  INITIAL_CUSTOMERS,
  INITIAL_PROJECTS,
  INITIAL_LABORERS,
  INITIAL_SUPPLIERS,
  INITIAL_MATERIALS,
  INITIAL_INVOICES,
  INITIAL_SITE_IMAGES,
  generateInitialAttendance,
  DEFAULT_SETTINGS,
} from '../services/storage';

interface ContractorContextType {
  // Settings & Role
  settings: ContractorSettings;
  updateSettings: (newSettings: Partial<ContractorSettings>) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeLaborerId: string;
  setActiveLaborerId: (id: string) => void;
  activeLaborer: Laborer | undefined;

  // Customers
  customers: Customer[];
  addCustomer: (data: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => { success: boolean; message?: string };
  getCustomerReceivable: (customerId: string) => number;

  // Projects
  projects: Project[];
  addProject: (data: Omit<Project, 'id' | 'paidTillNow' | 'amountReceivable' | 'paymentHistory' | 'materials' | 'createdAt'>) => Project;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => { success: boolean; message?: string };
  addProjectPayment: (projectId: string, payment: Omit<PaymentRecord, 'id'>) => void;
  assignLaborerToProject: (projectId: string, laborerId: string) => void;

  // Laborers & Attendance
  laborers: Laborer[];
  addLaborer: (data: Omit<Laborer, 'id'>) => Laborer;
  updateLaborer: (id: string, data: Partial<Laborer>) => void;
  attendance: AttendanceRecord[];
  recordAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  getAttendanceForDate: (dateStr: string) => AttendanceRecord[];
  getLaborerEarnings: (laborerId: string) => {
    totalDaysWorked: number;
    totalEarned: number;
    totalAdvances: number;
    balanceDue: number;
  };

  // Suppliers & Materials
  suppliers: Supplier[];
  materials: MaterialItem[];
  addSupplier: (data: Omit<Supplier, 'id' | 'totalPurchased' | 'totalPaid' | 'balance' | 'status' | 'paymentHistory'>) => {
    supplier: Supplier;
    mergedWithExisting?: boolean;
  };
  updateSupplier: (id: string, data: Partial<Supplier>) => void;
  addSupplierPayment: (supplierId: string, payment: Omit<PaymentRecord, 'id'>) => void;
  addMaterialItem: (data: Omit<MaterialItem, 'id' | 'totalCost' | 'balance' | 'paidCompletely' | 'supplierName'>) => MaterialItem;

  // Invoices
  invoices: Invoice[];
  createInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'subtotal' | 'tax' | 'totalAmount' | 'amountPaid' | 'balance' | 'paymentHistory'>) => Invoice;
  addInvoicePayment: (invoiceId: string, payment: Omit<PaymentRecord, 'id'>) => void;

  // Site Images
  siteImages: SiteImage[];
  uploadSiteImage: (data: {
    projectId: string;
    caption: string;
    tag: PhotoTag;
    fileOrUrl: string;
    uploaderName?: string;
    uploaderRole?: UserRole;
  }) => SiteImage;
  deleteSiteImage: (id: string) => void;
  expiringImages: SiteImage[];

  // Global actions
  resetAllData: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;

  // Metrics
  metrics: {
    activeProjectsCount: number;
    totalRevenueCollected: number;
    consolidatedCustomerReceivables: number;
    supplierDues: number;
    pendingLaborPayments: number;
  };
}

const ContractorContext = createContext<ContractorContextType | undefined>(undefined);

export const ContractorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ContractorSettings>(() => StorageService.getSettings());
  const [activeRole, setActiveRoleState] = useState<UserRole>(() => StorageService.getActiveRole());
  const [activeLaborerId, setActiveLaborerIdState] = useState<string>(() => StorageService.getActiveLaborerId());

  const [customers, setCustomers] = useState<Customer[]>(() => StorageService.getCustomers());
  const [projects, setProjects] = useState<Project[]>(() => StorageService.getProjects());
  const [laborers, setLaborers] = useState<Laborer[]>(() => StorageService.getLaborers());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => StorageService.getAttendance());
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => StorageService.getSuppliers());
  const [materials, setMaterials] = useState<MaterialItem[]>(() => StorageService.getMaterials());
  const [invoices, setInvoices] = useState<Invoice[]>(() => StorageService.getInvoices());
  const [siteImages, setSiteImages] = useState<SiteImage[]>(() => StorageService.getSiteImages());

  // Save changes to localStorage
  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    StorageService.saveCustomers(customers);
  }, [customers]);

  useEffect(() => {
    StorageService.saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    StorageService.saveLaborers(laborers);
  }, [laborers]);

  useEffect(() => {
    StorageService.saveAttendance(attendance);
  }, [attendance]);

  useEffect(() => {
    StorageService.saveSuppliers(suppliers);
  }, [suppliers]);

  useEffect(() => {
    StorageService.saveMaterials(materials);
  }, [materials]);

  useEffect(() => {
    StorageService.saveInvoices(invoices);
  }, [invoices]);

  useEffect(() => {
    StorageService.saveSiteImages(siteImages);
  }, [siteImages]);

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    StorageService.setActiveRole(role);
  };

  const setActiveLaborerId = (id: string) => {
    setActiveLaborerIdState(id);
    StorageService.setActiveLaborerId(id);
  };

  const activeLaborer = useMemo(() => {
    return laborers.find((l) => l.id === activeLaborerId) || laborers[0];
  }, [laborers, activeLaborerId]);

  const updateSettings = (newSettings: Partial<ContractorSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Customers
  const getCustomerReceivable = (customerId: string) => {
    return projects
      .filter((p) => p.customerId === customerId)
      .reduce((sum, p) => sum + (p.amountReceivable || 0), 0);
  };

  const addCustomer = (data: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const newCust: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const deleteCustomer = (id: string): { success: boolean; message?: string } => {
    const totalDue = getCustomerReceivable(id);
    if (totalDue > 0) {
      return {
        success: false,
        message: `Deletion Blocked: This customer has an outstanding balance of ${settings.currencySymbol}${totalDue.toLocaleString()} across active projects. Outstanding accounts cannot be deleted to maintain financial integrity.`,
      };
    }
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    return { success: true };
  };

  // Projects
  const addProject = (
    data: Omit<Project, 'id' | 'paidTillNow' | 'amountReceivable' | 'paymentHistory' | 'materials' | 'createdAt'>
  ): Project => {
    const totalCost = data.areaSqFt * (data.ratePerSqFt || 0) || data.totalCost || 0;
    const newProj: Project = {
      ...data,
      totalCost,
      id: `proj-${Date.now()}`,
      paidTillNow: 0,
      amountReceivable: totalCost,
      paymentHistory: [],
      materials: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects((prev) => [newProj, ...prev]);
    return newProj;
  };

  const updateProject = (id: string, data: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...data };
        const totalPaid = updated.paidTillNow || 0;
        updated.amountReceivable = Math.max(0, updated.totalCost - totalPaid);
        if (updated.status === 'Completed' && !updated.completedDate) {
          updated.completedDate = new Date().toISOString().split('T')[0];
        }
        return updated;
      })
    );
  };

  const deleteProject = (id: string): { success: boolean; message?: string } => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return { success: false, message: 'Project not found' };
    if (proj.amountReceivable > 0) {
      return {
        success: false,
        message: `Deletion Blocked: Project "${proj.title}" has an outstanding receivable balance of ${settings.currencySymbol}${proj.amountReceivable.toLocaleString()}. Collect all receivables before closing or deleting the record.`,
      };
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
    return { success: true };
  };

  const addProjectPayment = (projectId: string, payment: Omit<PaymentRecord, 'id'>) => {
    const newPayment: PaymentRecord = {
      ...payment,
      id: `pay-${Date.now()}`,
    };
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newPaid = (p.paidTillNow || 0) + payment.amount;
        const newReceivable = Math.max(0, p.totalCost - newPaid);
        const newHistory = [newPayment, ...(p.paymentHistory || [])];
        return {
          ...p,
          paidTillNow: newPaid,
          amountReceivable: newReceivable,
          paymentHistory: newHistory,
        };
      })
    );
  };

  const assignLaborerToProject = (projectId: string, laborerId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        if (p.assignedLaborerIds.includes(laborerId)) return p;
        return {
          ...p,
          assignedLaborerIds: [...p.assignedLaborerIds, laborerId],
        };
      })
    );
  };

  // Laborers & Attendance
  const addLaborer = (data: Omit<Laborer, 'id'>): Laborer => {
    const newLab: Laborer = {
      ...data,
      id: `lab-${Date.now()}`,
    };
    setLaborers((prev) => [...prev, newLab]);
    return newLab;
  };

  const updateLaborer = (id: string, data: Partial<Laborer>) => {
    setLaborers((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
  };

  const recordAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    const laborer = laborers.find((l) => l.id === record.laborerId);
    const wage = record.wageForDay !== undefined ? record.wageForDay : laborer?.defaultDailyWage || 0;
    const finalWage = record.present ? (record.status === 'Half-Day' ? wage / 2 : wage) : 0;

    setAttendance((prev) => {
      // Check existing record for same laborer, date, and project
      const index = prev.findIndex(
        (r) => r.laborerId === record.laborerId && r.date === record.date && r.projectId === record.projectId
      );
      const newRecord: AttendanceRecord = {
        ...record,
        id: index >= 0 ? prev[index].id : `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        wageForDay: finalWage,
      };

      if (index >= 0) {
        const copy = [...prev];
        copy[index] = newRecord;
        return copy;
      }
      return [newRecord, ...prev];
    });
  };

  const getAttendanceForDate = (dateStr: string) => {
    return attendance.filter((a) => a.date === dateStr);
  };

  const getLaborerEarnings = (laborerId: string) => {
    const records = attendance.filter((a) => a.laborerId === laborerId);
    const totalDaysWorked = records.filter((a) => a.present).length;
    const totalEarned = records.reduce((sum, r) => sum + (r.wageForDay || 0), 0);
    const totalAdvances = records.reduce((sum, r) => sum + (r.advancePaidToday || 0), 0);
    const balanceDue = Math.max(0, totalEarned - totalAdvances);
    return { totalDaysWorked, totalEarned, totalAdvances, balanceDue };
  };

  // Suppliers & Materials
  const addSupplier = (
    data: Omit<Supplier, 'id' | 'totalPurchased' | 'totalPaid' | 'balance' | 'status' | 'paymentHistory'>
  ) => {
    // Smart duplicate check by phone number (FieldBook core requirement!)
    const existing = suppliers.find(
      (s) => s.phone && data.phone && s.phone.replace(/\D/g, '') === data.phone.replace(/\D/g, '')
    );

    if (existing) {
      // Merge with existing
      const updated: Supplier = {
        ...existing,
        companyName: existing.companyName || data.companyName,
        contactPerson: data.contactPerson || existing.contactPerson,
        email: data.email || existing.email,
        address: data.address || existing.address,
      };
      setSuppliers((prev) => prev.map((s) => (s.id === existing.id ? updated : s)));
      return { supplier: updated, mergedWithExisting: true };
    }

    const newSupplier: Supplier = {
      ...data,
      id: `sup-${Date.now()}`,
      totalPurchased: 0,
      totalPaid: 0,
      balance: 0,
      status: 'Active',
      paymentHistory: [],
    };
    setSuppliers((prev) => [newSupplier, ...prev]);
    return { supplier: newSupplier, mergedWithExisting: false };
  };

  const updateSupplier = (id: string, data: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const addSupplierPayment = (supplierId: string, payment: Omit<PaymentRecord, 'id'>) => {
    const newPayment: PaymentRecord = {
      ...payment,
      id: `spay-${Date.now()}`,
    };
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id !== supplierId) return s;
        const totalPaid = s.totalPaid + payment.amount;
        const balance = Math.max(0, s.totalPurchased - totalPaid);
        const status = balance === 0 && s.totalPurchased > 0 ? 'Cleared' : 'Active';
        return {
          ...s,
          totalPaid,
          balance,
          status,
          paymentHistory: [newPayment, ...s.paymentHistory],
        };
      })
    );
  };

  const addMaterialItem = (
    data: Omit<MaterialItem, 'id' | 'totalCost' | 'balance' | 'paidCompletely' | 'supplierName'>
  ): MaterialItem => {
    const supplier = suppliers.find((s) => s.id === data.supplierId);
    const totalCost = data.pricePerUnit * data.quantityPurchased;
    const balance = Math.max(0, totalCost - (data.amountPaid || 0));
    const paidCompletely = balance === 0;

    const newItem: MaterialItem = {
      ...data,
      id: `mat-${Date.now()}`,
      supplierName: supplier?.companyName || 'Unknown Supplier',
      totalCost,
      balance,
      paidCompletely,
      paidCompletelyDate: paidCompletely ? new Date().toISOString().split('T')[0] : undefined,
    };

    setMaterials((prev) => [newItem, ...prev]);

    // Update supplier totalPurchased and balance
    if (supplier) {
      setSuppliers((prev) =>
        prev.map((s) => {
          if (s.id !== supplier.id) return s;
          const newTotalPurchased = s.totalPurchased + totalCost;
          const newTotalPaid = s.totalPaid + (data.amountPaid || 0);
          const newBalance = Math.max(0, newTotalPurchased - newTotalPaid);
          return {
            ...s,
            totalPurchased: newTotalPurchased,
            totalPaid: newTotalPaid,
            balance: newBalance,
            status: newBalance === 0 ? 'Cleared' : 'Active',
          };
        })
      );
    }

    // Link material to project if specified
    if (data.linkedProjectId) {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== data.linkedProjectId) return p;
          return {
            ...p,
            materials: [
              ...p.materials,
              {
                id: `pmat-${Date.now()}`,
                materialId: newItem.id,
                materialName: newItem.name,
                quantityUsed: data.quantityPurchased,
                unit: data.unit,
                cost: totalCost,
              },
            ],
          };
        })
      );
    }

    return newItem;
  };

  // Invoices
  const createInvoice = (
    data: Omit<Invoice, 'id' | 'invoiceNumber' | 'subtotal' | 'tax' | 'totalAmount' | 'amountPaid' | 'balance' | 'paymentHistory'>
  ): Invoice => {
    const subtotal = data.lineItems.reduce((acc, item) => acc + item.total, 0);
    const tax = Number(((subtotal * data.taxRate) / 100).toFixed(2));
    const totalAmount = subtotal + tax;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoices.length + 101).padStart(3, '0')}`;

    const newInvoice: Invoice = {
      ...data,
      id: `inv-${Date.now()}`,
      invoiceNumber,
      subtotal,
      tax,
      totalAmount,
      amountPaid: 0,
      balance: totalAmount,
      status: 'Sent',
      paymentHistory: [],
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  const addInvoicePayment = (invoiceId: string, payment: Omit<PaymentRecord, 'id'>) => {
    const newPayment: PaymentRecord = {
      ...payment,
      id: `ipay-${Date.now()}`,
    };

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const newPaid = inv.amountPaid + payment.amount;
        const newBalance = Math.max(0, inv.totalAmount - newPaid);
        const status = newBalance === 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Sent';
        return {
          ...inv,
          amountPaid: newPaid,
          balance: newBalance,
          status,
          paymentHistory: [newPayment, ...inv.paymentHistory],
        };
      })
    );
  };

  // Site Images
  const uploadSiteImage = (data: {
    projectId: string;
    caption: string;
    tag: PhotoTag;
    fileOrUrl: string;
    uploaderName?: string;
    uploaderRole?: UserRole;
  }): SiteImage => {
    const project = projects.find((p) => p.id === data.projectId);
    const now = new Date();
    const deleteAfter = new Date(now.getTime() + settings.imageRetentionDays * 86400000).toISOString();

    const newImg: SiteImage = {
      id: `img-${Date.now()}`,
      projectId: data.projectId,
      projectName: project?.title || 'Job Site',
      uploadedByRole: data.uploaderRole || activeRole,
      uploadedByName:
        data.uploaderName || (activeRole === 'admin' ? 'Field Supervisor' : activeLaborer?.name || 'Site Crew'),
      uploadedById: activeRole === 'laborer' ? activeLaborerId : undefined,
      url: data.fileOrUrl,
      caption: data.caption,
      tag: data.tag,
      uploadedAt: now.toISOString(),
      deleteAfter,
      deletionWarningShown: false,
      markedForDeletion: false,
    };

    setSiteImages((prev) => [newImg, ...prev]);
    return newImg;
  };

  const deleteSiteImage = (id: string) => {
    setSiteImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Computed: images scheduled for deletion within 7 days
  const expiringImages = useMemo(() => {
    const nowMs = Date.now();
    const sevenDaysMs = 7 * 86400000;
    return siteImages.filter((img) => {
      const expiryMs = new Date(img.deleteAfter).getTime();
      return expiryMs - nowMs <= sevenDaysMs && expiryMs - nowMs > 0;
    });
  }, [siteImages]);

  // Global actions
  const resetAllData = () => {
    StorageService.resetToDefault();
    setSettings(DEFAULT_SETTINGS);
    setCustomers(INITIAL_CUSTOMERS);
    setProjects(INITIAL_PROJECTS);
    setLaborers(INITIAL_LABORERS);
    setAttendance(generateInitialAttendance());
    setSuppliers(INITIAL_SUPPLIERS);
    setMaterials(INITIAL_MATERIALS);
    setInvoices(INITIAL_INVOICES);
    setSiteImages(INITIAL_SITE_IMAGES);
    setActiveRoleState('admin');
  };

  const exportDataJson = () => {
    const backup = {
      settings,
      customers,
      projects,
      laborers,
      attendance,
      suppliers,
      materials,
      invoices,
      siteImages,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.customers && data.projects) {
        if (data.settings) setSettings(data.settings);
        if (data.customers) setCustomers(data.customers);
        if (data.projects) setProjects(data.projects);
        if (data.laborers) setLaborers(data.laborers);
        if (data.attendance) setAttendance(data.attendance);
        if (data.suppliers) setSuppliers(data.suppliers);
        if (data.materials) setMaterials(data.materials);
        if (data.invoices) setInvoices(data.invoices);
        if (data.siteImages) setSiteImages(data.siteImages);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Central Financial Metrics
  const metrics = useMemo(() => {
    const activeProjectsCount = projects.filter((p) => p.status === 'In Progress').length;
    const totalRevenueCollected = projects.reduce((sum, p) => sum + (p.paidTillNow || 0), 0);
    const consolidatedCustomerReceivables = projects.reduce((sum, p) => sum + (p.amountReceivable || 0), 0);
    const supplierDues = suppliers.reduce((sum, s) => sum + (s.balance || 0), 0);

    // Calculate pending labor payments across all attendance
    const totalLaborEarned = attendance.reduce((sum, a) => sum + (a.wageForDay || 0), 0);
    const totalLaborAdvances = attendance.reduce((sum, a) => sum + (a.advancePaidToday || 0), 0);
    const pendingLaborPayments = Math.max(0, totalLaborEarned - totalLaborAdvances);

    return {
      activeProjectsCount,
      totalRevenueCollected,
      consolidatedCustomerReceivables,
      supplierDues,
      pendingLaborPayments,
    };
  }, [projects, suppliers, attendance]);

  return (
    <ContractorContext.Provider
      value={{
        settings,
        updateSettings,
        activeRole,
        setActiveRole,
        activeLaborerId,
        setActiveLaborerId,
        activeLaborer,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerReceivable,
        projects,
        addProject,
        updateProject,
        deleteProject,
        addProjectPayment,
        assignLaborerToProject,
        laborers,
        addLaborer,
        updateLaborer,
        attendance,
        recordAttendance,
        getAttendanceForDate,
        getLaborerEarnings,
        suppliers,
        materials,
        addSupplier,
        updateSupplier,
        addSupplierPayment,
        addMaterialItem,
        invoices,
        createInvoice,
        addInvoicePayment,
        siteImages,
        uploadSiteImage,
        deleteSiteImage,
        expiringImages,
        resetAllData,
        exportDataJson,
        importDataJson,
        metrics,
      }}
    >
      {children}
    </ContractorContext.Provider>
  );
};

export const useContractor = () => {
  const context = useContext(ContractorContext);
  if (!context) {
    throw new Error('useContractor must be used within a ContractorProvider');
  }
  return context;
};
