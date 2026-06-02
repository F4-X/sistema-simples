const pool = require('../config/db');

async function listar(req, res) {
  try {
    const result = await pool.query('SELECT * FROM receitas WHERE user_id = $1 ORDER BY data DESC, id DESC', [req.userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar receitas' });
  }
}

async function criar(req, res) {
  const { cliente, servico, valor, data, observacao } = req.body;
  if (!cliente || !servico || !valor || !data) return res.status(400).json({ erro: 'Campos obrigatórios ausentes' });

  try {
    const result = await pool.query(
      'INSERT INTO receitas (cliente, servico, valor, data, observacao, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [cliente, servico, valor, data, observacao || '', req.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar receita' });
  }
}

async function atualizar(req, res) {
  const { id } = req.params;
  const { cliente, servico, valor, data, observacao } = req.body;

  try {
    const result = await pool.query(
      'UPDATE receitas SET cliente=$1, servico=$2, valor=$3, data=$4, observacao=$5 WHERE id=$6 AND user_id=$7 RETURNING *',
      [cliente, servico, valor, data, observacao || '', id, req.userId]
    );
    if (!result.rows[0]) return res.status(404).json({ erro: 'Receita não encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar receita' });
  }
}

async function remover(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM receitas WHERE id=$1 AND user_id=$2 RETURNING id', [id, req.userId]);
    if (!result.rows[0]) return res.status(404).json({ erro: 'Receita não encontrada' });
    res.json({ mensagem: 'Receita removida com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao remover receita' });
  }
}

module.exports = { listar, criar, atualizar, remover };
