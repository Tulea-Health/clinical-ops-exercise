import type { Prisma } from "@prisma/client";
import db from "./database.js";

interface PrismaError extends Error {
  code?: string;
}

export const findAll = async (filters: Prisma.ProjectWhereInput = {}) => {
  return await db.prisma.project.findMany({
    where: filters,
    include: {
      members: {
        include: {
          contact: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      tasks: {
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
        },
      },
      _count: {
        select: {
          tasks: true,
          members: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findById = async (id: number) => {
  return await db.prisma.project.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          contact: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      tasks: {
        include: {
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
      },
    },
  });
};

export const create = async (data: Prisma.ProjectCreateInput) => {
  return await db.prisma.project.create({
    data,
    include: {
      members: {
        include: {
          contact: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          tasks: true,
          members: true,
        },
      },
    },
  });
};

export const update = async (id: number, data: Prisma.ProjectUpdateInput) => {
  try {
    return await db.prisma.project.update({
      where: { id },
      data,
      include: {
        members: {
          include: {
            contact: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            members: true,
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
    await db.prisma.$transaction([
      db.prisma.task.deleteMany({ where: { projectId: id } }),
      db.prisma.projectMember.deleteMany({ where: { projectId: id } }),
      db.prisma.project.delete({ where: { id } }),
    ]);
    return true;
  } catch (error) {
    if ((error as PrismaError).code === "P2025") {
      return false;
    }
    throw error;
  }
};

export const addMember = async (
  projectId: number,
  memberData: { contactId: number; role?: string },
) => {
  return await db.prisma.projectMember.create({
    data: {
      projectId,
      ...memberData,
    },
    include: {
      contact: {
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
        },
      },
    },
  });
};

export const getMembers = async (projectId: number) => {
  return await db.prisma.projectMember.findMany({
    where: { projectId },
    include: {
      contact: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          company: true,
        },
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });
};

export const removeMember = async (
  projectId: number,
  contactId: number,
): Promise<boolean> => {
  try {
    await db.prisma.projectMember.delete({
      where: {
        contactId_projectId: {
          contactId,
          projectId,
        },
      },
    });
    return true;
  } catch (error) {
    if ((error as PrismaError).code === "P2025") {
      return false;
    }
    throw error;
  }
};

export const getProjectStats = async (projectId: number) => {
  const stats = await db.prisma.project.findUnique({
    where: { id: projectId },
    select: {
      _count: {
        select: {
          tasks: true,
          members: true,
        },
      },
      tasks: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!stats) return null;

  const tasksByStatus: Record<string, number> = stats.tasks.reduce(
    (acc: Record<string, number>, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    {},
  );

  return {
    totalTasks: stats._count.tasks,
    totalMembers: stats._count.members,
    tasksByStatus,
  };
};
