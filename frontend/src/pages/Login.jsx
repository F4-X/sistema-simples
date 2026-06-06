import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api.js';

export default function Login() {
  const navigate = useNavigate();
  const [modoCadastro, setModoCadastro] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      if (modoCadastro) {
        await apiFetch('/auth/cadastro', {
          method: 'POST',
          body: JSON.stringify({ nome, email, senha })
        });
      }

      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha })
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      navigate('/');
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={enviar}>
        <h1>{modoCadastro ? 'Criar conta' : 'Entrar'}</h1>
        <p>Sistema financeiro mensal</p>

        {modoCadastro && (
          <label>
            Nome
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" />
          </label>
        )}

        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
        </label>

        <label>
          Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Sua senha" />
        </label>

        {erro && <div className="erro">{erro}</div>}

        <button disabled={carregando}>{carregando ? 'Aguarde...' : modoCadastro ? 'Cadastrar e entrar' : 'Entrar'}</button>

        <button type="button" className="link-button" onClick={() => setModoCadastro(!modoCadastro)}>
          {modoCadastro ? 'Já tenho conta' : 'Criar nova conta'}
        </button>
      </form>
    </main>
  );
}
