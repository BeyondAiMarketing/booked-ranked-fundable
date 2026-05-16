export type BookingStatus =
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show"
  | "pending";

export type CalendarProvider = "google" | "outlook" | "none";

export type CalendarSyncStatus = "synced" | "pending" | "failed" | "unsynced";

export interface Booking {
  id: string;
  tenantId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceType: string;
  scheduledAt: number;
  durationMinutes: number;
  status: BookingStatus;
  location?: string;
  googleCalendarEventId?: string;
  outlookEventId?: string;
  calendarSyncStatus: CalendarSyncStatus;
  reminderSent24h: boolean;
  reminderSent1h: boolean;
  noShowFollowUpSent: boolean;
  notes?: string;
  estimateId?: string;
  leadId?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface CalendarSyncConfig {
  tenantId: string;
  provider: CalendarProvider;
  isConnected: boolean;
  accountEmail?: string;
  calendarId?: string;
  syncEnabled: boolean;
  lastSyncAt?: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  bookingId?: string;
}

export interface DaySchedule {
  date: string;
  slots: TimeSlot[];
}
