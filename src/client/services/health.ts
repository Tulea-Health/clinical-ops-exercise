import api from "./api";

export const healthService = {
  check: () => api.get<{ status: string }>("/health"),
  checkDatabase: async (): Promise<boolean> => {
    try {
      await api.get("/health");
      await api.get("/contact/list");
      return true;
    } catch {
      return false;
    }
  },
};

export default healthService;
