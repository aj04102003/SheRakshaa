
// Fix: Defining the missing EmergencyContact and UserSettings interfaces to resolve import errors in component files.
export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

export interface UserSettings {
  name: string;
  userPhone: string;
  contacts: EmergencyContact[];
}
