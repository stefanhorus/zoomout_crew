import bcrypt from "bcrypt";

export interface AdminUser {
  username: string;
  passwordHash: string;
}

// Utilizatori admin cu parole hash-uite
export const adminUsers: AdminUser[] = [
  {
    username: "stefanhorus@zoomoutcrew.com",
    passwordHash: "$2b$10$RJRIkmSy/j/eXfbwOy3uYuSr9sU4dY6SNRKxXx6c.ir7iFGhRmFYi",
  },
  {
    username: "alisanastasia@zoomoutcrew.com",
    passwordHash: "$2b$10$WRiKuqyn1QQGQ7oSF2Wn2ewJVMzOo1Bu/EGH04qYTTcAPQ8zqpUti",
  },
];

/**
 * Verifică credențialele admin trimise în header-ele x-admin-username / x-admin-password
 */
export async function isAdminRequest(request: Request): Promise<boolean> {
  const username = request.headers.get("x-admin-username");
  const password = request.headers.get("x-admin-password");
  if (!username || !password) {
    return false;
  }
  return verifyAdminCredentials(username, password);
}

/**
 * Verifică dacă username-ul și parola sunt corecte
 */
export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const user = adminUsers.find((u) => u.username === username);
  if (!user) {
    return false;
  }

  return await bcrypt.compare(password, user.passwordHash);
}

/**
 * Verifică dacă un username există
 */
export function userExists(username: string): boolean {
  return adminUsers.some((u) => u.username === username);
}

