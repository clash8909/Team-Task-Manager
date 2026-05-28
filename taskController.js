generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  MEMBER
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

model User {
  id             Int             @id @default(autoincrement())
  name           String
  email          String          @unique
  password       String
  role           Role            @default(MEMBER)
  assignedTasks  Task[]          @relation("AssignedTasks")
  createdTasks   Task[]          @relation("CreatedTasks")
  projectMembers ProjectMember[]
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}

model Project {
  id          Int             @id @default(autoincrement())
  name        String
  description String
  tasks       Task[]
  members     ProjectMember[]
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}

model ProjectMember {
  id        Int      @id @default(autoincrement())
  userId    Int
  projectId Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, projectId])
}

model Task {
  id          Int        @id @default(autoincrement())
  title       String
  description String
  dueDate     DateTime
  priority    Priority   @default(MEDIUM)
  status      TaskStatus @default(PENDING)
  projectId   Int
  assigneeId  Int
  createdById Int
  project     Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assignee    User       @relation("AssignedTasks", fields: [assigneeId], references: [id], onDelete: Cascade)
  createdBy   User       @relation("CreatedTasks", fields: [createdById], references: [id], onDelete: Cascade)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
