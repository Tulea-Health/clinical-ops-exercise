import api from "./api";
import type { Project, CreateProjectData, ProjectMember } from "../types";

export const projectsService = {
  getAll: () => api.get<Project[]>("/project/list"),
  getById: (id: number | string) => api.get<Project>(`/project/${id}`),
  create: (data: CreateProjectData) => api.post<Project>("/project", data),
  update: (id: number | string, data: Partial<CreateProjectData>) =>
    api.put<Project>(`/project/${id}`, data),
  delete: (id: number | string) => api.delete<Project>(`/project/${id}`),
  addMember: (projectId: number | string, contactId: number | string, role = "member") =>
    api.post<ProjectMember>(`/project/${projectId}/members`, { contactId, role }),
  removeMember: (projectId: number | string, contactId: number | string) =>
    api.delete<null>(`/project/${projectId}/members/${contactId}`),
};

export default projectsService;
