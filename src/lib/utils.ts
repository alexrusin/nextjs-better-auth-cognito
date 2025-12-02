export function can(user: User, action: string) {
  if (action === "create_task") {
    return user.role === "admin";
  }
  return true;
}
