export type User = {
  name: string;
  phone: string;
};

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: string;
};

export type CheckIn = {
  id: string;
  destination: string;
  activity_type: string;
  notes: string;
  started_at: string;
  expected_return_at: string;
  checked_in_at: string | null;
  status: "active" | "completed" | "missed" | "cancelled";
};

const KEYS = {
  USER: "aware_user",
  SETUP_COMPLETE: "aware_setup_complete",
  CONTACTS: "aware_contacts",
  ACTIVITIES: "aware_activities",
  CHECK_INS: "aware_check_ins",
} as const;

function get<T>(key: string): T | null {
  try {
    const val = localStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : null;
  } catch {
    return null;
  }
}

function set(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  // User
  getUser: () => get<User>(KEYS.USER),
  setUser: (user: User) => set(KEYS.USER, user),
  isSetupComplete: () => localStorage.getItem(KEYS.SETUP_COMPLETE) === "1",
  setSetupComplete: () => localStorage.setItem(KEYS.SETUP_COMPLETE, "1"),
  clearAll: () => Object.values(KEYS).forEach((k) => localStorage.removeItem(k)),

  // Emergency contacts
  getContacts: (): EmergencyContact[] => get<EmergencyContact[]>(KEYS.CONTACTS) ?? [],
  setContacts: (contacts: EmergencyContact[]) => set(KEYS.CONTACTS, contacts),
  addContact: (contact: Omit<EmergencyContact, "id">) => {
    const contacts = storage.getContacts();
    contacts.push({ ...contact, id: crypto.randomUUID() });
    storage.setContacts(contacts);
  },

  // Activity preferences
  getActivities: (): string[] => get<string[]>(KEYS.ACTIVITIES) ?? [],
  setActivities: (activities: string[]) => set(KEYS.ACTIVITIES, activities),

  // Check-ins
  getCheckIns: (): CheckIn[] => get<CheckIn[]>(KEYS.CHECK_INS) ?? [],
  setCheckIns: (checkIns: CheckIn[]) => set(KEYS.CHECK_INS, checkIns),
  addCheckIn: (checkIn: Omit<CheckIn, "id">) => {
    const all = storage.getCheckIns();
    all.unshift({ ...checkIn, id: crypto.randomUUID() });
    storage.setCheckIns(all);
  },
  updateCheckIn: (id: string, updates: Partial<CheckIn>) => {
    const all = storage.getCheckIns().map((c) => (c.id === id ? { ...c, ...updates } : c));
    storage.setCheckIns(all);
  },
  getActiveCheckIn: (): CheckIn | null =>
    storage.getCheckIns().find((c) => c.status === "active") ?? null,
};
