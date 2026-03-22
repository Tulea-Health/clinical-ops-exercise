// Shared type definitions for the clinical ops frontend

// --- API Response ---

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

// --- Enums ---

export const TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW: "REVIEW",
  DONE: "DONE",
} as const;

export type TaskStatusValue = (typeof TaskStatus)[keyof typeof TaskStatus];

export const Priority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

export type PriorityValue = (typeof Priority)[keyof typeof Priority];

// --- Domain Models ---

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatusValue;
  priority: PriorityValue;
  dueDate?: string;
  assigneeId?: number;
  projectId?: number;
  assignee?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  project?: {
    id: number;
    name: string;
    status: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatusValue;
  priority?: PriorityValue;
  dueDate?: string;
  assigneeId?: number;
  projectId?: number;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
  startDate: string;
  endDate?: string;
  members?: ProjectMember[];
  tasks?: Task[];
  _count?: {
    tasks: number;
    members: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface ProjectMember {
  id: number;
  role: string;
  contactId: number;
  projectId: number;
  joinedAt: string;
  contact: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

// --- Health Check ---

export interface HealthStats {
  contacts: number;
  tasks: number;
  projects: number;
}
