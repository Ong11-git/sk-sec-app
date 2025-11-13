// src/user/userService.js
import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt";

/**
 * Create a new user
 * @param {Object} userData - { email, password, name, role }
 * @returns Created user (without password)
 */
export async function createUser({ email, password, name, role }) {
  if (!email || !password || !name || !role) {
    throw new Error("All fields are required");
  }

  const userRole = role || "USER";

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: userRole,
    },
  });

  // Return only safe fields (exclude password)
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}
