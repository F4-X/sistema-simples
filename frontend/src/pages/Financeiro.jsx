import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api.js';

const meses = Array.from({ length: 12 }, (_, i) => i + 1);
const anos = Array.from({ length: 10 }, (_, i) => i + 1);

const nomesMeses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function dinheiro(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function diaAtualParaMesSelecionado(mesSelecionado) {
  const hoje = new Date();
  const mesReal = hoje.getMonth() + 1;

  if (mesSelecionado < mesReal) return 31;
  if (mesSelecionado > mesReal) return 0;
  return hoje.getDate();
}

function agruparPorDia(lista) {
  return lista.reduce((acc, item) => {
    const dia = Number(item.dia);
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(item);
    return acc;
  }, {});
}

function FormularioLancamento({ tipo, ano, mes, aoSalvar }) {
  const [dia, setDia] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro('');

    try {
      if (!dia || !descricao || !valor) {
        setErro('Preencha dia, descrição e valor.');
        return;
      }

      setCarregando(true);

      await apiFetch('/lancamentos', {
        method: 'POST',
        body: JSON.stringify({
          tipo,
          ano,
          mes,
          dia: Number(dia),
          descricao,
          valor: Number(String(valor).replace(',', '.'))
        })
      });

      setDia('');
      setDescricao('');
      setValor('');
      aoSalvar();
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form className="form-lancamento" onSubmit={enviar}>
      <div className="linha-form">
        <label>
          Dia
          <input type="number" min="1" max="31" value={dia} onChange={(e) => setDia(e.target.value)} />
        </label>
        <label>
          Valor
          <input type="number" min="0" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} />
        </label>
      </div>

      <label>
        Descrição
        <input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder={tipo === 'gasto' ? 'Ex: Aluguel' : 'Ex: Cliente João'} />
      </label>

      {erro && <small className="erro">{erro}</small>}

      <button disabled={carregando}>{carregando ? 'Salvando...' : 'Adicionar'}</button>
    </form>
  );
}

function ColunaLancamentos({ titulo, tipo, itens, ano, mes, diaAtual, aoAtualizar }) {
  const ativos = itens.filter((item) => Number(item.dia) <= diaAtual);
  const futuros = itens.filter((item) => Number(item.dia) > diaAtual);
  const totalAtivo = ativos.reduce((soma, item) => soma + Number(item.valor), 0);
  const totalFuturo = futuros.reduce((soma, item) => soma + Number(item.valor), 0);
  const agrupados = agruparPorDia(itens);
  const dias = Object.keys(agrupados).map(Number).sort((a, b) => a - b);

  async function excluir(id) {
    const confirmar = window.confirm('Deseja excluir este lançamento?');
    if (!confirmar) return;

    await apiFetch(`/lancamentos/${id}`, { method: 'DELETE' });
    aoAtualizar();
  }

  return (
    <section className={`coluna ${tipo}`}>
      <div className="cabecalho-coluna">
        <h2>{titulo}</h2>
        <div className="totais-coluna">
          <span>Ativo: <strong>{dinheiro(totalAtivo)}</strong></span>
          <span>Futuro: <strong>{dinheiro(totalFuturo)}</strong></span>
        </div>
      </div>

      <FormularioLancamento tipo={tipo} ano={ano} mes={mes} aoSalvar={aoAtualizar} />

      <div className="lista-dias">
        {dias.length === 0 && <p className="vazio">Nenhum lançamento neste mês.</p>}

        {dias.map((dia) => (
          <div className="grupo-dia" key={dia}>
            <h3>Dia {String(dia).padStart(2, '0')}</h3>
            {agrupados[dia].map((item) => {
              const futuro = Number(item.dia) > diaAtual;
              return (
                <div className="item-lancamento" key={item.id}>
                  <div>
                    <strong>{item.descricao}</strong>
                    {futuro && <small>Futuro</small>}
                  </div>
                  <div className="item-acoes">
                    <span>{dinheiro(item.valor)}</span>
                    <button onClick={() => excluir(item.id)}>Excluir</button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Financeiro() {
  const navigate = useNavigate();
  const [ano, setAno] = useState(1);
  const [mes, setMes] = useState(1);
  const [lancamentos, setLancamentos] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  async function carregar() {
    try {
      setErro('');
      setCarregando(true);
      const data = await apiFetch(`/lancamentos?ano=${ano}&mes=${mes}`);
      setLancamentos(data);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [ano, mes]);

  function sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  }

  const diaAtual = useMemo(() => diaAtualParaMesSelecionado(mes), [mes]);
  const gastos = lancamentos.filter((item) => item.tipo === 'gasto');
  const lucros = lancamentos.filter((item) => item.tipo === 'lucro');

  const totais = useMemo(() => {
    const gastosAtivos = gastos.filter((i) => Number(i.dia) <= diaAtual).reduce((s, i) => s + Number(i.valor), 0);
    const gastosFuturos = gastos.filter((i) => Number(i.dia) > diaAtual).reduce((s, i) => s + Number(i.valor), 0);
    const lucrosAtivos = lucros.filter((i) => Number(i.dia) <= diaAtual).reduce((s, i) => s + Number(i.valor), 0);
    const lucrosFuturos = lucros.filter((i) => Number(i.dia) > diaAtual).reduce((s, i) => s + Number(i.valor), 0);

    return {
      saldoAtual: lucrosAtivos - gastosAtivos,
      saldoProjetado: lucrosAtivos + lucrosFuturos - gastosAtivos - gastosFuturos
    };
  }, [gastos, lucros, diaAtual]);

  return (
    <main className="financeiro-page">
      <header className="topo">
        <div>
          <h1>Sistema Financeiro</h1>
          <p>{usuario.nome ? `Olá, ${usuario.nome}` : 'Controle mensal de gastos e lucros'}</p>
        </div>
        <button className="sair" onClick={sair}>Sair</button>
      </header>

      <section className="controle-periodo">
        <label>
          Ano
          <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
            {anos.map((a) => <option key={a} value={a}>Ano {a}</option>)}
          </select>
        </label>

        <div className="meses">
          {meses.map((m) => (
            <button key={m} className={m === mes ? 'ativo' : ''} onClick={() => setMes(m)}>
              {m}
            </button>
          ))}
        </div>
      </section>

      <section className="resumo-geral">
        <div>
          <span>Mês selecionado</span>
          <strong>{nomesMeses[mes - 1]} / Ano {ano}</strong>
        </div>
        <div>
          <span>Saldo atual</span>
          <strong>{dinheiro(totais.saldoAtual)}</strong>
        </div>
        <div>
          <span>Saldo projetado</span>
          <strong>{dinheiro(totais.saldoProjetado)}</strong>
        </div>
      </section>

      {erro && <div className="erro bloco">{erro}</div>}
      {carregando && <p className="carregando">Carregando...</p>}

      <section className="painel-duplo">
        <ColunaLancamentos titulo="Gastos" tipo="gasto" itens={gastos} ano={ano} mes={mes} diaAtual={diaAtual} aoAtualizar={carregar} />
        <ColunaLancamentos titulo="Lucros" tipo="lucro" itens={lucros} ano={ano} mes={mes} diaAtual={diaAtual} aoAtualizar={carregar} />
      </section>
    </main>
  );
}
