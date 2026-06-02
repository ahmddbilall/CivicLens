export type FaultSeverity = 'low' | 'medium' | 'high';
export type FaultType = 'road_damage' | 'garbage' | 'broken_light' | 'infrastructure' | 'other';
export type CaseStatus = 'pending' | 'in_progress' | 'resolved';

export interface AgentStep {
  id: string;
  name: string;
  icon: string;
  color: string;
  status: 'idle' | 'processing' | 'complete';
  result?: string;
  detail?: string;
}

export interface TimelineEvent {
  id: string;
  type: 'filed' | 'email_sent' | 'follow_up_sent' | 'resolved';
  label: string;
  date: string;
}

export interface Report {
  id: string; // MongoDB document id
  displayId?: string; // CL-XXXX format
  userId: string;
  photoUrl: string;
  faultType: FaultType;
  severity: FaultSeverity;
  description: string;
  location: {
    address: string;
    city: string;
    lat: number;
    lng: number;
  };
  authority: {
    name: string;
    department: string;
    email: string;
    phone: string;
    hours: string;
    officeName?: string;
    officeAddress?: string;
    officeLocation?: {
      lat?: number;
      lng?: number;
    };
    distanceKm?: number;
    sourceUrl?: string;
  };
  status: CaseStatus;
  createdAt: string;
  resolvedAt?: string;
  followUpAt: string; // createdAt + 7 days
  duplicateCount: number; // how many others reported same fault
  emailSent: boolean;
  socialPostPublished: boolean;
  priorReports?: Report[]; // same location, historical
  timeline: TimelineEvent[];
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  street: string;
  area: string;
  zip?: string;
  city?: string;
  avatarUrl?: string;
  preferences?: {
    pushNotifications: boolean;
    emailAlerts: boolean;
    language: string;
  };
}
