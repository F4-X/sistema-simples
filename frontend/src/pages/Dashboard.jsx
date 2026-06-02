import { useEffect, useState } from 'react';
import api from '../services/api';

const moeda = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Dashboard() {
  const hoje = new Date();
  const [filtro, setFiltro] = useState({ mes: hoje.getMonth() + 1, ano: hoje.getFullYear() });
  const [resumo, setResumo] = useState(null);

  async function carregar() {
    const { data } = await api.get(`/resumo/mensal?mes=${filtro.mes}&ano=${filtro.ano}`);
    setResumo(data);
  }

  useEffect(() => { carregar(); }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="filters">
        <input type="number" min="1" max="12" value={filtro.mes} onChange={e => setFiltro({ ...filtro, mes: e.target.value })} />
        <input type="number" value={filtro.ano} onChange={e => setFiltro({ ...filtro, ano: e.target.value })} />
        <button onClick={carregar}>Buscar</button>
      </div>
      {resumo && (
        <div className="cards">
          <div className="card"><span>Receitas</span><strong>{moeda(resumo.receitas)}</strong></div>
          <div className="card"><span>Despesas</span><strong>{moeda(resumo.despesas)}</strong></div>
          <div className={`card ${resumo.resultado >= 0 ? 'positivo' : 'negativo'}`}><span>Resultado</span><strong>{moeda(resumo.resultado)}</strong><small>{resumo.status === 'lucro' ? 'Lucro' : 'Dívida/Prejuízo'}</small></div>
        </div>
      )}
    </div>
  );
}
