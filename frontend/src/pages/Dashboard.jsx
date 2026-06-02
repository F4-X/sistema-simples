import { useEffect, useState } from 'react';
import api from '../services/api';

const moeda = (v) =>
  Number(v || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export default function Dashboard() {
  const hoje = new Date();

  const [filtro, setFiltro] = useState({
    mes: hoje.getMonth() + 1,
    ano: hoje.getFullYear(),
  });

  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(false);

  async function carregar() {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/resumo/mensal?mes=${filtro.mes}&ano=${filtro.ano}`
      );

      setResumo(data);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar resumo');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="dashboard">
      <h1>📊 Dashboard Financeiro</h1>

      <div className="filters dashboard-filters">
        <input
          type="number"
          min="1"
          max="12"
          placeholder="Mês"
          value={filtro.mes}
          onChange={(e) =>
            setFiltro({ ...filtro, mes: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Ano"
          value={filtro.ano}
          onChange={(e) =>
            setFiltro({ ...filtro, ano: e.target.value })
          }
        />

        <button onClick={carregar}>
          🔍 Buscar
        </button>
      </div>

      {loading && (
        <div className="card">
          Carregando...
        </div>
      )}

      {!loading && resumo && (
        <div className="cards">
          <div className="card">
            <span>💰 Receitas</span>
            <strong>{moeda(resumo.receitas)}</strong>
          </div>

          <div className="card">
            <span>💸 Despesas</span>
            <strong>{moeda(resumo.despesas)}</strong>
          </div>

          <div
            className={`card ${
              resumo.resultado >= 0
                ? 'positivo'
                : 'negativo'
            }`}
          >
            <span>
              {resumo.resultado >= 0 ? '📈 Lucro' : '📉 Prejuízo'}
            </span>

            <strong>
              {moeda(resumo.resultado)}
            </strong>

            <small>
              {resumo.status === 'lucro'
                ? 'Resultado Positivo'
                : 'Resultado Negativo'}
            </small>
          </div>
        </div>
      )}
    </div>
  );
}