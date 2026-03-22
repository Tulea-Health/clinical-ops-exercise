import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah.chen@acmehealth.org',
        phone: '+1-555-0101',
        company: 'Acme Health',
        notes: 'Medical Director, Infusion Services. Oversees all infusion therapy programs.',
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'Marcus',
        lastName: 'Rivera',
        email: 'marcus.rivera@acmehealth.org',
        phone: '+1-555-0102',
        company: 'Acme Health',
        notes: 'Clinical Pharmacist. Specializes in biologic and specialty medication therapies.',
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'Priya',
        lastName: 'Patel',
        email: 'priya.patel@acmehealth.org',
        phone: '+1-555-0103',
        company: 'Acme Health',
        notes: 'Patient Care Coordinator. Primary contact for new patient onboarding.',
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'James',
        lastName: 'Thompson',
        email: 'james.thompson@stmarys.health',
        phone: '+1-555-0104',
        company: "St. Mary's Health System",
        notes: 'Infusion Nurse, RN. Manages day-to-day infusion appointments and patient monitoring.',
      },
    }),
    prisma.contact.create({
      data: {
        firstName: 'Diana',
        lastName: 'Lopez',
        email: 'diana.lopez@acmehealth.org',
        phone: '+1-555-0105',
        company: 'Acme Health',
        notes: 'Program Manager. Coordinates cross-team initiatives and partner integrations.',
      },
    }),
  ]);

  // Create sample projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: 'Patient Onboarding Redesign',
        description: 'Streamlining the intake process for new infusion therapy patients. Goal: reduce time from referral to first infusion.',
        status: 'active',
        startDate: new Date('2026-01-15'),
        endDate: new Date('2026-06-30'),
      },
    }),
    prisma.project.create({
      data: {
        name: 'Medication Therapy Review Program',
        description: 'Quarterly medication reviews for all active patients to ensure therapy effectiveness and minimize adverse interactions.',
        status: 'active',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-08-15'),
      },
    }),
    prisma.project.create({
      data: {
        name: 'Partner Health System Integration',
        description: "Integrating referral and patient data workflows with St. Mary's Health System for seamless care coordination.",
        status: 'planning',
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-09-30'),
      },
    }),
  ]);

  // Add members to projects
  const projectMembers = await Promise.all([
    // Patient Onboarding Redesign team
    prisma.projectMember.create({
      data: {
        contactId: contacts[0].id, // Sarah Chen
        projectId: projects[0].id,
        role: 'medical_director',
      },
    }),
    prisma.projectMember.create({
      data: {
        contactId: contacts[2].id, // Priya Patel
        projectId: projects[0].id,
        role: 'care_coordinator',
      },
    }),
    prisma.projectMember.create({
      data: {
        contactId: contacts[3].id, // James Thompson
        projectId: projects[0].id,
        role: 'infusion_nurse',
      },
    }),
    // Medication Therapy Review Program team
    prisma.projectMember.create({
      data: {
        contactId: contacts[1].id, // Marcus Rivera
        projectId: projects[1].id,
        role: 'clinical_pharmacist',
      },
    }),
    prisma.projectMember.create({
      data: {
        contactId: contacts[0].id, // Sarah Chen
        projectId: projects[1].id,
        role: 'medical_director',
      },
    }),
    // Partner Health System Integration team
    prisma.projectMember.create({
      data: {
        contactId: contacts[4].id, // Diana Lopez
        projectId: projects[2].id,
        role: 'program_manager',
      },
    }),
    prisma.projectMember.create({
      data: {
        contactId: contacts[2].id, // Priya Patel
        projectId: projects[2].id,
        role: 'care_coordinator',
      },
    }),
  ]);

  // Create sample tasks
  const tasks = await Promise.all([
    // Patient Onboarding Redesign tasks
    prisma.task.create({
      data: {
        title: 'Design new patient intake questionnaire',
        description: 'Create comprehensive intake form covering medical history, current medications, and insurance verification',
        status: 'DONE',
        priority: 'HIGH',
        assigneeId: contacts[2].id, // Priya Patel
        projectId: projects[0].id,
        dueDate: new Date('2026-02-15'),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Build insurance pre-authorization workflow',
        description: 'Implement automated insurance verification and pre-auth tracking for infusion therapies',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assigneeId: contacts[4].id, // Diana Lopez
        projectId: projects[0].id,
        dueDate: new Date('2026-03-15'),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Create pre-infusion assessment checklist',
        description: 'Standardize the clinical assessment process nurses complete before each infusion session',
        status: 'TODO',
        priority: 'MEDIUM',
        assigneeId: contacts[3].id, // James Thompson
        projectId: projects[0].id,
        dueDate: new Date('2026-04-01'),
      },
    }),
    // Medication Therapy Review Program tasks
    prisma.task.create({
      data: {
        title: 'Schedule Q1 patient medication reviews',
        description: 'Coordinate with care teams to schedule quarterly medication therapy reviews for all active patients',
        status: 'REVIEW',
        priority: 'HIGH',
        assigneeId: contacts[1].id, // Marcus Rivera
        projectId: projects[1].id,
        dueDate: new Date('2026-03-20'),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Update drug interaction alert rules',
        description: 'Review and update clinical decision support rules for biologic and specialty medication interactions',
        status: 'TODO',
        priority: 'MEDIUM',
        assigneeId: contacts[1].id, // Marcus Rivera
        projectId: projects[1].id,
        dueDate: new Date('2026-04-15'),
      },
    }),
    // Partner Health System Integration tasks
    prisma.task.create({
      data: {
        title: 'Map referral data fields to partner format',
        description: "Document field-level mapping between our referral data and St. Mary's HL7 FHIR interface",
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        assigneeId: contacts[4].id, // Diana Lopez
        projectId: projects[2].id,
        dueDate: new Date('2026-04-01'),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Define shared patient identifier protocol',
        description: 'Establish secure patient matching and identifier reconciliation process between systems',
        status: 'TODO',
        priority: 'HIGH',
        assigneeId: contacts[0].id, // Sarah Chen
        projectId: projects[2].id,
        dueDate: new Date('2026-04-15'),
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${contacts.length} contacts`);
  console.log(`Created ${projects.length} projects`);
  console.log(`Created ${projectMembers.length} project memberships`);
  console.log(`Created ${tasks.length} tasks`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
