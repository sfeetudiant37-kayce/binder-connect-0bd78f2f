// Binder domain types
export type Role = "client" | "provider";
export type Lang = "en" | "fr";
export type Availability = "immediate" | "this_week" | "flexible" | "busy";
export type Urgency = "urgent" | "this_week" | "flexible";
export type Objective =
  | "find_service"
  | "offer_service"
  | "find_job"
  | "recruit_talent"
  | "grow_brand"
  | "network";

export interface User {
  id: string;
  email: string;
  name: string;
  activeRole: Role;
  objective: Objective;
  preferences: string[];
  location: string;
  language: Lang;
  profileCompletion: number;
  createdAt: string;
}

export interface Profile {
  userId: string;
  photoUrl?: string;
  bio?: string;
  skills: string[];
  price?: number;
  availability: Availability;
  experience?: number;
  socialLinks?: { whatsapp?: string; facebook?: string; phone?: string };
  rating: number;
  reviewCount: number;
  profileCompletion: number;
  location: string;
  name: string;
  title?: string;
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  location: string;
  budget: number;
  urgency: Urgency;
  status: "open" | "in_progress" | "completed";
  createdAt: string;
}

export interface Swipe {
  id: string;
  userId: string;
  targetId: string;
  targetType: "user" | "request";
  swiperRole: Role;
  direction: "left" | "right";
  fitScore: number;
  timestamp: string;
  isSynced: boolean;
}

export interface Match {
  id: string;
  clientId: string;
  providerId: string;
  requestId?: string;
  initiatedBy: "client" | "provider" | "mutual";
  clientFitScore: number;
  providerFitScore: number;
  status:
    | "provider_interested"
    | "client_interested"
    | "mutual"
    | "contacted"
    | "completed";
  contactRevealed: boolean;
  createdAt: string;
  // Denormalized for offline UX
  otherName: string;
  otherId: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantIds: [string, string];
  otherName: string;
  otherId: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
}

export interface Review {
  id: string;
  fromUserId: string;
  toUserId: string;
  matchId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Weights {
  userId: string;
  preferences: number;
  location: number;
  price: number;
  rating: number;
  availability: number;
  profileCompleteness: number;
  experience: number;
  updatedAt: string;
}

export interface QueueItem {
  id: string;
  type: "swipe" | "message" | "match" | "review" | "profile_update";
  payload: unknown;
  status: "pending" | "synced" | "failed";
  createdAt: string;
}

export interface FitScoreBreakdown {
  preferences: number;
  location: number;
  price: number;
  rating: number;
  availability: number;
  profileCompleteness: number;
  experience: number;
  composite: number;
}
