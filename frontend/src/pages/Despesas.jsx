import { useEffect, useState } from 'react';
import api from '../services/api';

const inicial = { descricao: '', categoria: '', valor: '', data: '', observacao: '' };
const moeda = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Despesas() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(inicial);
  const [editId, setEditId] = useState(null);

  async function carregar() {
    const { data } = await api.get('/despesas');
    setLista(data);
  }

  useEffect(() => { carregar(); }, []);

  async function salvar(e) {
    e.preventDefault();
    if (editId) await api.put(`/despesas/${editId}`, form);
    else await api.post('/despesas', form);
    setForm(inicial);
    setEditId(null);
    carregar();
  }

  function editar(item) {
    setEditId(item.id);
    setForm({ descricao: item.descricao, categoria: item.categoria, valor: item.valor, data: item.data?.slice(0,10), observacao: item.observacao || '' });
  }

  async function excluir(id) {
    if (!confirm('Excluir despesa?')) return;
    await api.delete(`/despesas/${id}`);
    carregar();
  }

  return (
    <div>
      <h1>Despesas</h1>
      <form onSubmit={salvar} className="form-grid card">
        <input placeholder="Descrição" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
        <input placeholder="Categoria" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} />
        <input placeholder="Valor" type="number" step="0.01" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
        <input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} />
        <input placeholder="Observação" value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
        <button>{editId ? 'Atualizar' : 'Adicionar'}</button>
      </form>
      <table>
        <thead><tr><th>Descrição</th><th>Categoria</th><th>Valor</th><th>Data</th><th>Ações</th></tr></thead>
        <tbody>{lista.map(item => <tr key={item.id}><td>{item.descricao}</td><td>{item.categoria}</td><td>{moeda(item.valor)}</td><td>{item.data?.slice(0,10)}</td><td><button onClick={() => editar(item)}>Editar</button><button className="danger" onClick={() => excluir(item.id)}>Excluir</button></td></tr>)}</tbody>
      </table>
    </div>
  );
}
