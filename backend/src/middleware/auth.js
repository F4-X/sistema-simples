import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ mensagem: 'Token não enviado.' });
    }

    const [, token] = header.split(' ');

    if (!token) {
      return res.status(401).json({ mensagem: 'Token inválido.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}
