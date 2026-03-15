import type { Prisma, TaskStatus } from "@prisma/client";
import db from "./database.js";

interface PrismaError extends Error {
  code?: string;
}

export const findAll = async (filters: Prisma.TaskWhereInput = {}) => {
  return await db.prisma.task.findMany({
    where: filters,
    include: {
      assignee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
    },
    orderBy: [
      { priority: "desc" },
      { dueDate: "asc" },
      { createdAt: "desc" },
    ],
  });
};

export const findById = async (id: number) => {
  return await db.prisma.task.findUnique({
    where: { id },
    include: {
      assignee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
        },
      },
    },
  });
};

export const create = async (data: Prisma.TaskUncheckedCreateInput) => {
  return await db.prisma.task.create({
    data,
    include: {
      assignee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
    },
  });
};

export const update = async (id: number, data: Prisma.TaskUncheckedUpdateInput) => {
  try {
    return await db.prisma.task.update({
      where: { id },
      data,
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });
  } catch (error) {
    if ((error as PrismaError).code === "P2025") {
      return null;
    }
    throw error;
  }
};

export const remove = async (id: number): Promise<boolean> => {
  try {
    await db.prisma.task.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    if ((error as PrismaError).code === "P2025") {
      return false;
    }
    throw error;
  }
};

export const updateStatus = async (id: number, status: TaskStatus) => {
  try {
    return await db.prisma.task.update({
      where: { id },
      data: { status },
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });
  } catch (error) {
    if ((error as PrismaError).code === "P2025") {
      return null;
    }
    throw error;
  }
};

export const findByProject = async (projectId: number) => {
  return await db.prisma.task.findMany({
    where: { projectId },
    include: {
      assignee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
  });
};

export const findByAssignee = async (assigneeId: number) => {
  return await db.prisma.task.findMany({
    where: { assigneeId },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
    },
    orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
  });
};
