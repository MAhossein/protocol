import {$Enums, PrismaClient} from "@prisma/client";
import { hash } from "bcrypt";
import Role = $Enums.Role;

const prisma = new PrismaClient();
async function main() {
  let user1 = {
    email: "joel.kuehl@unibe.ch",
    active: true,
    name: "Joel Kuehl",
    password: await hash("ciao", 10),
    role: Role.ADMIN,
    organisation: {
      create: {
        organisationName: "Intern",
        organisationEmail: "admin@risklick.com",
      },
    },
  };
  const userJoel = await prisma.user.upsert({
    where: { email: "joel.kuehl@unibe.ch" },
    update: user1,
    create: user1,
  });
  console.log(userJoel);
  let user2 = {
    email: "test@risklick.com",
    name: "Test User",
    password: await hash("test", 10),
    organisation: {
      create: {
        organisationName: "Test Org",
        organisationEmail: "test-org@risklick.com",
      },
    },
  };
  const testUser = await prisma.user.upsert({
    where: { email: "test@risklick.com" },
    update: user2,
    create: user2,
  });
  console.log({ testUser });

  const testProject = await prisma.project.create({
    data: {
      name: "project 1",
      description:
        "Dolore consectetur voluptate eiusmod irure officia excepteur aute aliquip officia quis et commodo deserunt.",
      studyType: "interventional",
      userId: testUser.id,
      disabled: false,
    },
  });

  console.log(testProject);
  const testProject2 = await prisma.project.create({
    data: {
      name: "project 2",
      description:
        "Dolore consectetur voluptate eiusmod irure officia excepteur aute aliquip officia quis et commodo deserunt.",
      studyType: "interventional",
      userId: userJoel.id,
      disabled: false,
    },
  });

  console.log(testProject2);
  const testProject3 = await prisma.project.create({
    data: {
      name: "project 3",
      description:
        "Dolore consectetur voluptate eiusmod irure officia excepteur aute aliquip officia quis et commodo deserunt.",
      studyType: "interventional",
      userId: userJoel.id,
      disabled: false,
    },
  });
  console.log(testProject3);

  const projectsAccess = await prisma.projectAccess.createMany({
    data: [
      { projectId: testProject.id, userId: testUser.id },
      { projectId: testProject2.id, userId: userJoel.id },
      { projectId: testProject3.id, userId: userJoel.id },
    ],
  });
  console.log(projectsAccess);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
