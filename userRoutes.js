require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const app = require("./app");
const prisma = require("./config/prisma");

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is required. Copy .env.example to .env and set a strong secret.");
  process.exit(1);
}

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function shutdown() {
  console.log("Shutting down server...");
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
