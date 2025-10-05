import jwt from "jsonwebtoken";

/**
 * Zwraca payload JWT jeśli user jest adminem, inaczej null.
 */
export function requireAdmin(req) {
  try {
    const token = req.cookies.get("session")?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded?.role !== "admin") return null;
    return decoded; // { id, email, role, iat, exp }
  } catch {
    return null;
  }
}
