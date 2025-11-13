import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

export async function seedAdmin() {
  try {
    const existingAdmin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

    if (existingAdmin) {
      console.log("Admin user already exists:", ADMIN_EMAIL);
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const admin = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: "Super Admin",
        role: "ADMIN", // must match the enum in Prisma
      },
    });

    console.log("✅ Admin user created:", admin.email);
  } catch (err) {
    console.error("❌ Error creating admin user:", err);
  }
}
