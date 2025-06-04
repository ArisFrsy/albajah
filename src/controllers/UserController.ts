import { getUserByIdService, updateUserService } from "@/services/UserService";

export async function getUserByIdController(userId: number) {
  const result = await getUserByIdService(userId);
  return result;
}

export async function updateUserController(
  userId: number,
  newPassword: string | null,
  currentPassword: string | null,
  name: string | null = null,
  email: string | null = null
) {
  const result = await updateUserService(
    userId,
    newPassword,
    currentPassword,
    name,
    email
  );
  return result;
}
