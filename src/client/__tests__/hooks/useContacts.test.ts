import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useContacts } from "../../hooks/useContacts";
import type { Contact } from "../../types";

vi.mock("../../services", () => ({
  contactsService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { contactsService } from "../../services";

const mockedService = contactsService as unknown as {
  getAll: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe("useContacts Hook", () => {
  const mockContacts: Contact[] = [
    { id: 1, firstName: "John", lastName: "Doe", email: "john@example.com", createdAt: "", updatedAt: "" },
    { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", createdAt: "", updatedAt: "" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockedService.getAll.mockResolvedValue({ data: mockContacts });
  });

  it("fetches contacts on mount", async () => {
    const { result } = renderHook(() => useContacts());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.contacts).toEqual(mockContacts);
    expect(mockedService.getAll).toHaveBeenCalledTimes(1);
  });

  it("does not fetch when autoFetch is false", () => {
    renderHook(() => useContacts({ autoFetch: false }));
    expect(mockedService.getAll).not.toHaveBeenCalled();
  });

  it("handles fetch errors", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const error = new Error("Network error");
    mockedService.getAll.mockRejectedValue(error);

    const { result } = renderHook(() => useContacts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(error);
    expect(result.current.contacts).toEqual([]);

    consoleSpy.mockRestore();
  });

  it("deletes a contact and updates state", async () => {
    mockedService.delete.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useContacts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteContact(1);
    });

    expect(result.current.contacts).toHaveLength(1);
    expect(result.current.contacts[0].id).toBe(2);
  });
});
