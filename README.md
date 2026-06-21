# Controle de Almoxarifado — SENAC Zona Norte

> 🔗 **Projeto no ar:** https://github.com/Universidade-Cesumar/prova-2bi-ads-3sem-alanrossinedev
Sistema web para modernizar o controle do almoxarifado de itens de saúde usado nas aulas práticas do curso técnico de Enfermagem do SENAC Zona Norte. Substitui a planilha manual usada hoje, permitindo cadastrar materiais, dar baixa no estoque, excluir itens e acompanhar visualmente o que está em nível crítico.

Projeto desenvolvido em 3 sprints, como exercício de entregas ágeis e incrementais.

## Funcionalidades

- **Cadastrar material**: nome e quantidade inicial em estoque.
- **Listar materiais**: tabela atualizada em tempo real a partir da API.
- **Dar baixa no estoque**: informe a quantidade no campo "Quantidade a retirar" e clique em "Baixar" na linha do material desejado. Validação impede valores negativos, zero ou maiores que o estoque disponível.
- **Excluir material**: remove um item do controle, com confirmação.
- **Buscar material**: filtro pelo nome, sem precisar recarregar a página.
- **Dashboard de total de itens**: contador atualizado conforme os materiais exibidos (considera o filtro de busca ativo).
- **Alerta visual de estoque crítico**: linhas da tabela com quantidade menor que 10 unidades ficam destacadas em vermelho.
- **Tratamento de erros de rede**: todas as requisições à API têm `try/catch`, evitando que a tela "quebre" silenciosamente em caso de instabilidade de conexão.

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript (ES6+, com `fetch`, `async/await`)
- [MockAPI.io](https://mockapi.io) como backend simulado (API RESTful)

## Sobre o uso do MockAPI no projeto

### O que é a MockAPI?

A MockAPI é uma plataforma online que permite criar APIs REST de forma rápida e simples, simulando um banco de dados para aplicações em desenvolvimento, sem a necessidade de configurar um servidor ou banco de dados próprio. É amplamente usada em projetos acadêmicos e protótipos, pois deixa o desenvolvedor focado na construção da aplicação em si.

Principais vantagens:

- Facilidade de utilização
- Disponibilidade gratuita para projetos de estudo
- Integração simples com aplicações web
- Simulação de operações reais de banco de dados
- Agilidade no desenvolvimento e nos testes

### Como ela é usada aqui

A MockAPI funciona como repositório de dados temporário do sistema, armazenando os materiais cadastrados. Toda comunicação é feita automaticamente pelo JavaScript da aplicação através de requisições HTTP (`GET`, `POST`, `PUT`, `DELETE`) — o usuário final nunca acessa a API diretamente.

**Endpoint utilizado:**
```
https://6a306dc7a7f8866418d605f8.mockapi.io/materias
```

| Campo | Descrição |
|---|---|
| `id` | Identificador único gerado automaticamente pela API |
| `nome` | Nome do material |
| `quantidade` | Quantidade atual em estoque |

### Fluxo de funcionamento

1. O usuário acessa o sistema.
2. Realiza uma operação de cadastro, baixa ou exclusão de material.
3. O sistema envia os dados para a MockAPI.
4. A MockAPI armazena/atualiza as informações.
5. Os dados são retornados para a aplicação.
6. O estoque é atualizado automaticamente e exibido ao usuário.

### Considerações finais

A MockAPI permite que o sistema funcione de forma semelhante a uma aplicação real, possibilitando testar completamente as funcionalidades de controle de estoque. Por ser uma ferramenta voltada à prototipação, seu uso é adequado para o contexto acadêmico deste projeto. Em uma implantação real, recomenda-se substituí-la por um banco de dados definitivo, como MySQL ou PostgreSQL.

## Estrutura do projeto

```
├── index.html      # Estrutura da página
├── style.css       # Estilo visual (identidade clínica, alertas de estoque)
├── main.js         # Lógica da aplicação e integração com a API
├── __tests__/      # Testes automatizados (Jest) de cada sprint
└── README.md
```

## Próximos passos (fora do escopo desta entrega)

- Registro de histórico de saídas (quem retirou, quando, para qual turma/professor)
- Cadastro de categoria e data de validade dos materiais
- Autenticação de colaboradores autorizados a movimentar o estoque
