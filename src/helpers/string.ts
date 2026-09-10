/**
 * Generates initials from a full name (up to 2 characters).
 * Example: "Super Admin" -> "SA", "John" -> "J", "" -> "SA"
 */
export const getInitials = (name?: string | null, fallback: string = 'SA'): string => {
  if (!name || typeof name !== 'string') {
    return fallback;
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return fallback;
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
