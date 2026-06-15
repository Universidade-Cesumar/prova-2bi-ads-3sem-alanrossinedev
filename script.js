const API_URL = 'https://6a306dc7a7f8866418d605f8.mockapi.io/materiais';

const inputNome       = document.getElementById('input-nome');
const inputQuantidade = document.getElementById('input-quantidade');
const btnCadastrar    = document.getElementById('btn-cadastrar');
const lista           = document.getElementById('lista-materiais');

async function carregarMateriais() {
    try {
        const res   = await fetch(API_URL);
        const dados = await res.json();

        lista.innerHTML = '';

        dados.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.quantidade}</td>
            `;
            lista.appendChild(tr);
        });

    } catch (err) {
        console.error('Erro ao carregar:', err);
    }
}

btnCadastrar.addEventListener('click', async () => {
    const nome       = inputNome.value.trim();
    const quantidade = inputQuantidade.value.trim();

    if (!nome || quantidade === '') {
        alert('Preencha todos os campos.');
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, quantidade: Number(quantidade) })
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

carregarMateriais();
