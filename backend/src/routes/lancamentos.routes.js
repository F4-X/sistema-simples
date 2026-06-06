import express from 'express';
import { query } from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const { ano = 1, mes = 1 } = req.query;

    const resultado = await query(
      `SELECT id, tipo, ano, mes, dia, descricao, valor, criado_em
       FROM lancamentos
       WHERE usuario_id = $1 AND ano = $2 AND mes = $3
       ORDER BY dia ASC, id ASC`,
      [req.usuario.id, Number(ano), Number(mes)]
    );

    return res.json(resultado.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro ao listar lançamentos.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { tipo, ano, mes, dia, descricao, valor } = req.body;

    if (!tipo || !ano || !mes || !dia || !descricao || valor === undefined) {
      return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
    }

    if (!['gasto', 'lucro'].includes(tipo)) {
      return res.status(400).json({ mensagem: 'Tipo inválido.' });
    }

    const resultado = await query(
      `INSERT INTO lancamentos (usuario_id, tipo, ano, mes, dia, descricao, valor)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, tipo, ano, mes, dia, descricao, valor, criado_em`,
      [req.usuario.id, tipo, Number(ano), Number(mes), Number(dia), descricao, Number(valor)]
    );

    return res.status(201).json(resultado.rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro ao criar lançamento.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const resultado = await query(
      'DELETE FROM lancamentos WHERE id = $1 AND usuario_id = $2 RETURNING id',
      [req.params.id, req.usuario.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Lançamento não encontrado.' });
    }

    return res.json({ mensagem: 'Lançamento excluído com sucesso.' });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro ao excluir lançamento.' });
  }
});

export default router;
