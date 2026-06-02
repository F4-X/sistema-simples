import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Cadastro() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    try {
      await api.post('/auth/cadastro', form);
      navigate('/login');
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao cadastrar');
    }
  }

  return (
    <div className="auth">
      <form onSubmit={enviar} className="card auth-card">
        <h1>Criar conta</h1>
        {erro && <p className="error">{erro}</p>}
        <input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Senha" type="password" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} />
        <button>Cadastrar</button>
        <Link to="/login">Já tenho conta</Link>
      </form>
    </div>
  );
}
