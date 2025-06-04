import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { User } from "@/models/User";
import { use } from "react";
import bcrypt from "bcryptjs";

export async function getUserByIdService(userId: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      message: "User fetched successfully",
      data: user,
    };
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return {
      success: false,
      message: "Failed to fetch user by ID",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// update user information
export async function updateUserService(
  userId: number,
  newPassword: string | null,
  currentPassword: string | null,
  name: string | null = null,
  email: string | null = null
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    let updatedData: Prisma.userUpdateInput = {
      name: name ?? user.name,
      email: email ?? user.email,
    };

    if (newPassword) {
      if (!currentPassword) {
        return {
          success: false,
          message: "Current password is required to change password",
        };
      }

      const validPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!validPassword) {
        return {
          success: false,
          message: "Current password is incorrect",
        };
      }

      updatedData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    return {
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      message: "Failed to update user",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
