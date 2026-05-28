const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const memberPassword = await bcrypt.hash("Member123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN"
    }
  });

  const member = await prisma.user.upsert({
    where: { email: "member@example.com" },
    update: {},
    create: {
      name: "Member User",
      email: "member@example.com",
      password: memberPassword,
      role: "MEMBER"
    }
  });

  const project = await prisma.project.create({
    data: {
      name: "Website Launch",
      description: "Plan, build, and launch the public website.",
      members: {
        create: [{ userId: admin.id }, { userId: member.id }]
      },
      tasks: {
        create: [
          {
            title: "Prepare launch checklist",
            description: "Confirm analytics, SEO, and deployment readiness.",
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            priority: "HIGH",
            status: "IN_PROGRESS",
            assigneeId: member.id,
            createdById: admin.id
          }
        ]
      }
    }
  });

  console.log(`Seeded ${admin.email}, ${member.email}, and project ${project.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
