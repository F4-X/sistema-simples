const pool = require('../config/db');

async function resumoMensal(req, res) {
  const { mes, ano } = req.query;
  const hoje = new Date();
  const mesFiltro = Number(mes || hoje.getMonth() + 1);
  const anoFiltro = Number(ano || hoje.getFullYear());

  try {
    const receitas = await pool.query(
      'SELECT COALESCE(SUM(valor),0) AS total FROM receitas WHERE user_id=$1 AND EXTRACT(MONTH FROM data)=$2 AND EXTRACT(YEAR FROM data)=$3',
      [req.userId, mesFiltro, anoFiltro]
    );
    const despesas = await pool.query(
      'SELECT COALESCE(SUM(valor),0) AS total FROM despesas WHERE user_id=$1 AND EXTRACT(MONTH FROM data)=$2 AND EXTRACT(YEAR FROM data)=$3',
      [req.userId, mesFiltro, anoFiltro]
    );

    const totalReceitas = Number(receitas.rows[0].total);
    const totalDespesas = Number(despesas.rows[0].total);
    const resultado = totalReceitas - totalDespesas;

    res.json({ mes: mesFiltro, ano: anoFiltro, receitas: totalReceitas, despesas: totalDespesas, resultado, status: resultado >= 0 ? 'lucro' : 'divida' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao gerar resumo' });
  }
}

module.exports = { resumoMensal };
