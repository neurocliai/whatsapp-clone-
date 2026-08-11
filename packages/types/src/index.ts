export type UserRole = "user" | "admin" | "owner";

export type PresenceStatus = "online" | "away" | "busy" | "offline";

export interface OperoUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  orgId: string;
  department?: string;
  title?: string;
  createdAt: number;
  lastActiveAt: number;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: "starter" | "business" | "enterprise";
  createdAt: number;
}

export interface Channel {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  memberIds: string[];
  createdBy: string;
  createdAt: number;
  lastMessageAt?: number;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: number;
  editedAt?: number;
  attachments?: { name: string; url: string; type: string }[];
}

export interface Project {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  status: "planned" | "active" | "blocked" | "done";
  ownerId: string;
  memberIds: string[];
  progress: number;
  dueDate?: number;
  createdAt: number;
}

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  assigneeId?: string;
  status: "todo" | "doing" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  dueDate?: number;
  createdAt: number;
}

export interface CallSession {
  id: string;
  orgId: string;
  type: "voice" | "video" | "screen";
  hostId: string;
  participantIds: string[];
  status: "ringing" | "live" | "ended";
  startedAt: number;
  endedAt?: number;
}

export interface AnalyticsConnector {
  id: string;
  orgId: string;
  kind: "powerbi" | "snowflake" | "dataflake" | "bigdata";
  name: string;
  status: "connected" | "syncing" | "error" | "disabled";
  lastSyncAt?: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface Announcement {
  id: string;
  orgId: string;
  title: string;
  body: string;
  authorId: string;
  pinned: boolean;
  createdAt: number;
}

export interface AuditLog {
  id: string;
  orgId: string;
  actorId: string;
  action: string;
  target: string;
  createdAt: number;
  meta?: Record<string, unknown>;
}

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description: string;
}

export const OPERO_FEATURES = [
  { key: "messaging", label: "Team Messaging", description: "Channels, DMs, and threads" },
  { key: "voice", label: "Voice Calls", description: "Realtime voice meetings" },
  { key: "video", label: "Video Calls", description: "HD video collaboration" },
  { key: "screen", label: "Screen Share", description: "Live desktop sharing" },
  { key: "projects", label: "Project Management", description: "Boards, milestones, owners" },
  { key: "powerbi", label: "Power BI", description: "Embedded analytics dashboards" },
  { key: "snowflake", label: "Snowflake", description: "Warehouse query surfaces" },
  { key: "dataflake", label: "Dataflake", description: "Lakehouse sync status" },
  { key: "bigdata", label: "Big Data", description: "Pipeline health & jobs" },
  { key: "directory", label: "Org Directory", description: "People & org chart" },
  { key: "okrs", label: "Tasks & OKRs", description: "Goals and accountability" },
  { key: "calendar", label: "Meetings Calendar", description: "Schedule & join rooms" },
  { key: "ai_notes", label: "AI Meeting Notes", description: "Auto summaries & actions" },
  { key: "vault", label: "Document Vault", description: "Secure file sharing" },
  { key: "announcements", label: "Announcements", description: "Company-wide feed" },
  { key: "automation", label: "Workflow Automation", description: "Rules and triggers" },
  { key: "compliance", label: "Compliance & Audit", description: "Immutable activity logs" },
  { key: "knowledge", label: "Knowledge Base", description: "Internal wiki" },
  { key: "time", label: "Time Tracking", description: "Work logs per project" },
  { key: "presence", label: "Presence", description: "Online / busy / away" },
  { key: "rbac", label: "RBAC", description: "Fine-grained roles" },
  { key: "admin", label: "Admin Console", description: "Org & policy control" },
] as const;

export type FeatureKey = (typeof OPERO_FEATURES)[number]["key"];
