import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { projectsService } from "../services";
import type { Project, CreateProjectData } from "../types";

interface UseProjectsOptions {
  autoFetch?: boolean;
}

export function useProjects(options: UseProjectsOptions = {}) {
  const { autoFetch = true } = options;

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await projectsService.getAll();
      setProjects(response.data || []);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching projects:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProject = async (id: number | string) => {
    try {
      const response = await projectsService.getById(id);
      return response.data;
    } catch (err) {
      console.error("Error fetching project:", err);
      throw err;
    }
  };

  const createProject = async (data: CreateProjectData) => {
    const response = await projectsService.create(data);
    await fetchProjects();
    toast.success("Project created successfully");
    return response.data;
  };

  const updateProject = async (id: number | string, data: Partial<CreateProjectData>) => {
    try {
      const response = await projectsService.update(id, data);
      setProjects((prev) =>
        prev.map((project) =>
          project.id === Number(id) ? { ...project, ...data } : project
        )
      );
      toast.success("Project updated successfully");
      return response.data;
    } catch (err) {
      await fetchProjects();
      throw err;
    }
  };

  const deleteProject = async (id: number | string) => {
    try {
      await projectsService.delete(id);
      setProjects((prev) => prev.filter((project) => project.id !== Number(id)));
      toast.success("Project deleted successfully");
    } catch (err) {
      await fetchProjects();
      throw err;
    }
  };

  const addMember = async (projectId: number | string, contactId: number | string, role = "member") => {
    const response = await projectsService.addMember(projectId, contactId, role);
    toast.success("Member added successfully");
    await fetchProjects();
    return response.data;
  };

  const removeMember = async (projectId: number | string, contactId: number | string) => {
    await projectsService.removeMember(projectId, contactId);
    toast.success("Member removed successfully");
    await fetchProjects();
  };

  useEffect(() => {
    if (autoFetch) {
      fetchProjects();
    }
  }, [autoFetch, fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    refresh: fetchProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
  };
}

export default useProjects;
