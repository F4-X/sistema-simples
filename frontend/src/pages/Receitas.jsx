import { useEffect, useState } from 'react';
import api from '../services/api';

const inicial = { cliente: '', servico: '', valor: '', data: '', observacao: '' };
const moeda = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Receitas() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(inicial);
  const [editId, setEditId] = useState(null);

  async function carregar() {
    const { data } = await api.get('/receitas');
    setLista(data);
  }

  useEffect(() => { carregar(); }, []);

  async function salvar(e) {
    e.preventDefault();
    if (editId) await api.put(`/receitas/${editId}`, form);
    else await api.post('/receitas', form);
    setForm(inicial);
    setEditId(null);
    carregar();
  }

  function editar(item) {
    setEditId(item.id);
    setForm({ cliente: item.cliente, servico: item.servico, valor: item.valor, data: item.data?.slice(0,10), observacao: item.observacao || '' });
  }

  async function excluir(id) {
    if (!confirm('Excluir receita?')) return;
    await api.delete(`/receitas/${id}`);
    carregar();
  }

  return (
    <div>
      <h1>Clientes / Receitas</h1>
      <form onSubmit={salvar} className="form-grid card">
        <input placeholder="Cliente" value={form.cliente} onChange={e => setForm({ ...form, cliente: e.target.value })} />
        <input placeholder="Serviço" value={form.servico} onChange={e => setForm({ ...form, servico: e.target.value })} />
        <input placeholder="Valor" type="number" step="0.01" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
        <input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} />
        <input placeholder="Observação" value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
        <button>{editId ? 'Atualizar' : 'Adicionar'}</button>
      </form>
      <table>
        <thead><tr><th>Cliente</th><th>Serviço</th><th>Valor</th><th>Data</th><th>Ações</th></tr></thead>
        <tbody>{lista.map(item => <tr key={item.id}><td>{item.cliente}</td><td>{item.servico}</td><td>{moeda(item.valor)}</td><td>{item.data?.slice(0,10)}</td><td><button onClick={() => editar(item)}>Editar</button><button className="danger" onClick={() => excluir(item.id)}>Excluir</button></td></tr>)}</tbody>
      </table>
    </div>
  );
}
