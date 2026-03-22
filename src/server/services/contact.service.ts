import type { Prisma, Contact } from "@prisma/client";
import db from "./database.js";

class ContactService {
  async findAll(): Promise<Contact[]> {
    return db.prisma.contact.findMany();
  }

  async findById(id: number | string): Promise<Contact | null> {
    return db.prisma.contact.findUnique({
      where: { id: Number(id) },
    });
  }

  async create(data: Prisma.ContactCreateInput): Promise<Contact> {
    return db.prisma.contact.create({
      data,
    });
  }

  async update(id: number | string, data: Prisma.ContactUpdateInput): Promise<Contact> {
    return db.prisma.contact.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id: number | string): Promise<Contact> {
    return db.prisma.contact.delete({
      where: { id: Number(id) },
    });
  }
}

export default new ContactService();
