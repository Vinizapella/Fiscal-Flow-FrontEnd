// script.js

let itens = [];

document.addEventListener('DOMContentLoaded', () => {
  atualizarLista();

  document.getElementById('btnAdicionar').addEventListener('click', adicionarItem);

  document.getElementById('btnVerLista').addEventListener('click', atualizarLista);

  document.getElementById('btnEnviar').addEventListener('click', enviarParaBackend);

  document.getElementById('itemForm').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      adicionarItem();
    }
  });
});

function adicionarItem() {
  const descricao = document.getElementById('descricao').value.trim();
  const categoria = document.getElementById('categoria').value;
  const valorStr = document.getElementById('valor').value;

  if (!descricao || !categoria || !valorStr || parseFloat(valorStr) <= 0) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  const valor = parseFloat(valorStr);
  itens.push({ descricao, categoria, valor });

  atualizarLista();
  limparFormulario();
}

function atualizarLista() {
  const tbody = document.getElementById('tabelaItens');
  tbody.innerHTML = '';

  if (itens.length === 0) {
    document.getElementById('mensagemVazia').style.display = 'block';
    return;
  }

  document.getElementById('mensagemVazia').style.display = 'none';

  itens.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-800/70 transition-colors';
    tr.innerHTML = `
      <td class="px-6 py-5 whitespace-nowrap text-sm text-slate-200">${item.descricao}</td>
      <td class="px-6 py-5 whitespace-nowrap text-sm text-slate-200">${item.categoria}</td>
      <td class="px-6 py-5 whitespace-nowrap text-sm text-right text-slate-100 font-medium">
        ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function limparFormulario() {
  document.getElementById('descricao').value = '';
  document.getElementById('categoria').value = '';
  document.getElementById('valor').value = '';
}

async function enviarParaBackend() {
  if (itens.length === 0) {
    alert('Adicione pelo menos um item!');
    return;
  }

  const payload = { itens };

  try {
    const response = await fetch('http://localhost:8080/api/processar-nota', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);

    const data = await response.json();

    document.getElementById('resultadoBackend').classList.remove('hidden');
    document.getElementById('conteudoResultado').textContent = JSON.stringify(data, null, 2);

    alert('Enviado com sucesso! Veja o retorno abaixo.');
  } catch (error) {
    console.error(error);
    document.getElementById('resultadoBackend').classList.remove('hidden');
    document.getElementById('conteudoResultado').textContent = `Erro: ${error.message}\nVerifique se o backend está rodando.`;
    alert('Erro ao enviar.');
  }
}