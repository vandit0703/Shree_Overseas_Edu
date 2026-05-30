import { Router } from "express";

const router = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "Tejas_Sharma";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Shree@15edu";

const STAFF_USERNAME = process.env.STAFF_USERNAME ?? "Staff";
const STAFF_PASSWORD = process.env.STAFF_PASSWORD ?? "Shree@5staff";

// Simple in-memory token store (sufficient for development use)
const validTokens = new Map<string, { role: "admin" | "staff"; username: string }>();

function generateToken() {
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2) +
    Date.now().toString(36)
  );
}

export function requireAuth(
  req: Parameters<Router>[0],
  res: Parameters<Router>[1],
  next: Parameters<Router>[2]
) {
  const adminToken =
    (req.headers["x-admin-token"] as string | undefined) ??
    (req.cookies?.adminToken as string | undefined);
  
  const staffToken =
    (req.headers["x-staff-token"] as string | undefined) ??
    (req.cookies?.staffToken as string | undefined);

  const token = adminToken || staffToken;
  
  if (token && validTokens.has(token)) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

router.post("/login", (req, res) => {
  const { username, password, role } = req.body ?? {};
  
  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  // Admin login
  if (role === "admin" || !role) {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = generateToken();
      validTokens.set(token, { role: "admin", username });
      res.json({ token, username });
      return;
    }
  }

  // Staff login
  if (role === "staff") {
    if (username === STAFF_USERNAME && password === STAFF_PASSWORD) {
      const token = generateToken();
      validTokens.set(token, { role: "staff", username });
      res.json({ token, username });
      return;
    }
  }

  res.status(401).json({ error: "Invalid credentials" });
});

router.post("/logout", (req, res) => {
  const adminToken =
    (req.headers["x-admin-token"] as string | undefined) ??
    (req.cookies?.adminToken as string | undefined);
  
  const staffToken =
    (req.headers["x-staff-token"] as string | undefined) ??
    (req.cookies?.staffToken as string | undefined);

  const token = adminToken || staffToken;
  
  if (token) validTokens.delete(token);
  res.json({ success: true });
});

router.get("/me", (req, res) => {
  const adminToken =
    (req.headers["x-admin-token"] as string | undefined) ??
    (req.cookies?.adminToken as string | undefined);
  
  const staffToken =
    (req.headers["x-staff-token"] as string | undefined) ??
    (req.cookies?.staffToken as string | undefined);

  const token = adminToken || staffToken;
  
  if (token && validTokens.has(token)) {
    const tokenData = validTokens.get(token)!;
    res.json({ authenticated: true, username: tokenData.username, role: tokenData.role });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

export default router;
