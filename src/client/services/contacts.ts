import api from "./api";
import type { Contact, CreateContactData } from "../types";

export const contactsService = {
  getAll: () => api.get<Contact[]>("/contact/list"),
  getById: (id: number | string) => api.get<Contact>(`/contact/${id}`),
  create: (data: CreateContactData) => api.post<Contact>("/contact", data),
  update: (id: number | string, data: Partial<CreateContactData>) =>
    api.put<Contact>(`/contact/${id}`, data),
  delete: (id: number | string) => api.delete<Contact>(`/contact/${id}`),
};

export default contactsService;
