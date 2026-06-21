const API_URL = 'https://6a306dc7a7f8866418d605f8.mockapi.io/materias';

const inputNome       = document.getElementById('input-nome');
const inputQuantidade = document.getElementById('input-quantidade');
const btnCadastrar    = document.getElementById('btn-cadastrar');
const lista           = document.getElementById('lista-materiais');
const inputBusca      = document.getElementById('input-busca');
const totalItensEl    = document.getElementById('total-itens');
const inputRetirada   = document.getElementById('input-retirada');

// Limite a partir do qual o estoque é considerado crítico (Sprint 3)
const LIMITE_ESTOQUE_CRITICO = 10;

// Guarda a última lista vinda da API para a busca funcionar
// sem precisar refazer a requisição a cada letra digitada
let materiaisCache = [];

// ==========================================
// [0,5 pt] REQUISITO OBRIGATÓRIO: VALIDAÇÃO
// ==========================================
function validarRetirada(estoqueAtual, quantidadeRetirada) {
    // Bloqueia se o valor for menor ou igual a zero, ou não for um número
    if (quantidadeRetirada <= 0 || isNaN(quantidadeRetirada)) {
        return false;
    }
    // Bloqueia se tentar tirar mais do que tem no estoque
    if (quantidadeRetirada > estoqueAtual) {
        return false;
    }
    return true;
}

// Busca os dados na API e guarda em cache antes de renderizar
async function carregarMateriais() {
    try {
        const res = await fetch(API_URL);

        if (!res.ok) throw new Error('Erro ao buscar materiais na API');

        materiaisCache = await res.json();

        const termo = inputBusca.value.trim().toLowerCase();
        const dadosParaExibir = termo === ''
            ? materiaisCache
            : materiaisCache.filter(item => item.nome.toLowerCase().includes(termo));

        renderTabela(dadosParaExibir);

    } catch (err) {
        console.error('Erro ao carregar:', err);
        lista.innerHTML = `<tr><td colspan="3">Não foi possível carregar os materiais. Verifique sua conexão e tente novamente.</td></tr>`;
        totalItensEl.textContent = '--';
    }
}

// ==========================================
// [0,5 pt] REQUISITO: DASHBOARD (#total-itens e .estoque-critico)
// ==========================================
function renderTabela(dados) {
    lista.innerHTML = '';

    dados.forEach(item => {
        const tr = document.createElement('tr');
        const quantidadeAtual = Number(item.quantidade);

        // Alerta visual obrigatório: estoque abaixo do limite crítico
        if (quantidadeAtual < LIMITE_ESTOQUE_CRITICO) {
            tr.classList.add('estoque-critico');
        }

        tr.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.quantidade}</td>
            <td>
                <button class="btn-baixar" data-id="${item.id}" data-quantidade="${quantidadeAtual}">Baixar</button>
                <button class="btn-excluir" data-id="${item.id}">Excluir</button>
            </td>
        `;
        lista.appendChild(tr);
    });

    // Dashboard: total de itens correspondente ao que está sendo exibido
    // (considera o filtro de busca ativo, se houver)
    totalItensEl.textContent = dados.length;
}

// ==========================================
// [0,5 pt] REQUISITO: BARRA DE PESQUISA (#input-busca)
// ==========================================
inputBusca.addEventListener('input', () => {
    const termo = inputBusca.value.trim().toLowerCase();

    const filtrados = termo === ''
        ? materiaisCache
        : materiaisCache.filter(item => item.nome.toLowerCase().includes(termo));

    renderTabela(filtrados);
});

// ==========================================
// Delegação de eventos para os botões da tabela
// ==========================================
lista.addEventListener('click', (event) => {
    const btnBaixar = event.target.closest('.btn-baixar');
    if (btnBaixar) {
        const id = btnBaixar.dataset.id;
        const estoqueAtual = Number(btnBaixar.dataset.quantidade);
        baixarEstoque(id, estoqueAtual);
        return;
    }

    const btnExcluir = event.target.closest('.btn-excluir');
    if (btnExcluir) {
        excluirMaterial(btnExcluir.dataset.id);
    }
});

// ==========================================
// [1,0 pt] REQUISITO: CONEXÃO PUT (BAIXAR)
// ==========================================
async function baixarEstoque(id, estoqueAtual) {
    const quantidadeRetirada = Number(inputRetirada.value);

    // Executa a função lógica obrigatória do enunciado
    if (!validarRetirada(estoqueAtual, quantidadeRetirada)) {
        alert('Quantidade de retirada inválida (Não pode ser negativa, zero ou maior que o estoque atual).');
        return;
    }

    const novaQuantidade = estoqueAtual - quantidadeRetirada;

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantidade: novaQuantidade })
        });

        if (!res.ok) throw new Error('Erro ao atualizar estoque na API');

        inputRetirada.value = '';
        await carregarMateriais(); // Recarrega a tabela atualizada

    } catch (err) {
        console.error('Erro ao baixar estoque:', err);
        alert('Erro ao dar baixa no estoque.');
    }
}

// ==========================================
// [0,5 pt] REQUISITO: CONEXÃO DELETE (EXCLUIR)
// ==========================================
async function excluirMaterial(id) {
    if (!confirm('Tem certeza que deseja excluir este material?')) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error('Erro ao deletar na API');

        await carregarMateriais(); // Recarrega a tabela atualizada

    } catch (err) {
        console.error('Erro ao excluir:', err);
        alert('Erro ao excluir o material.');
    }
}

// Mantendo o comportamento da Sprint 1 para o cadastro
btnCadastrar.addEventListener('click', async () => {
    const nome       = inputNome.value.trim();
    const quantidade = Number(inputQuantidade.value.trim());

    // Bloqueia nome vazio, valor não numérico, zero ou negativo
    if (!nome || inputQuantidade.value.trim() === '' || isNaN(quantidade) || quantidade <= 0) {
        alert('Preencha o nome e uma quantidade numérica maior que zero.');
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, quantidade })
        });

        if (!res.ok) throw new Error('Erro na API');

        inputNome.value       = '';
        inputQuantidade.value = '';
        await carregarMateriais();

    } catch (err) {
        console.error('Erro ao cadastrar:', err);
        alert('Erro ao cadastrar. Tente novamente.');
    }
});

// Inicialização da página
carregarMateriais();
