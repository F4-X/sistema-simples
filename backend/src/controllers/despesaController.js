const pool = require('../config/db');

async function listar(req, res) {
  try {
    const result = await pool.query('SELECT * FROM despesas WHERE user_id = $1 ORDER BY data DESC, id DESC', [req.userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar despesas' });
  }
}

async function criar(req, res) {
  const { descricao, categoria, valor, data, observacao } = req.body;
  if (!descricao || !categoria || !valor || !data) return res.status(400).json({ erro: 'Campos obrigatórios ausentes' });

  try {
    const result = await pool.query(
      'INSERT INTO despesas (descricao, categoria, valor, data, observacao, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [descricao, categoria, valor, data, observacao || '', req.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar despesa' });
  }
}

async function atualizar(req, res) {
  const { id } = req.params;
  const { descricao, categoria, valor, data, observacao } = req.body;

  try {
    const result = await pool.query(
      'UPDATE despesas SET descricao=$1, categoria=$2, valor=$3, data=$4, observacao=$5 WHERE id=$6 AND user_id=$7 RETURNING *',
      [descricao, categoria, valor, data, observacao || '', id, req.userId]
    );
    if (!result.rows[0]) return res.status(404).json({ erro: 'Despesa não encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar despesa' });
  }
}

async function remover(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM despesas WHERE id=$1 AND user_id=$2 RETURNING id', [id, req.userId]);
    if (!result.rows[0]) return res.status(404).json({ erro: 'Despesa não encontrada' });
    res.json({ mensagem: 'Despesa removida com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao remover despesa' });
  }
}

module.exports = { listar, criar, atualizar, remover };
