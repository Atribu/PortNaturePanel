import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Yetki yok, token eksik" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // → user ID ve rol bilgisi burada
    next();
  } catch (err) {
    return res.status(401).json({ message: "Geçersiz token" });
  }
};