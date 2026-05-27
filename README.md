# 🍬 Sistema de Controle de Estoque — Jojoca Doces

Sistema web para controle de estoque e gerenciamento de pedidos de uma confeitaria, desenvolvido com JavaScript vanilla, Vite, Tailwind CSS v4 e Firebase. A aplicação é uma SPA (Single Page Application) com roteamento client-side implementado do zero, sem uso de frameworks como React ou Vue.

---

## 🚀 Demo

> Deploy realizado na **Vercel** com rewrite de SPA configurado via `vercel.json`.

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| JavaScript (ES Modules) | ES2022+ | Linguagem principal |
| Vite | ^7.2.4 | Bundler e servidor de desenvolvimento |
| Tailwind CSS | ^4.1.17 | Estilização utilitária |
| Firebase Auth | ^12.6.0 | Autenticação de administrador |
| Firebase Realtime Database | ^12.6.0 | Banco de dados em tempo real |
| Toastify JS | CDN | Notificações toast |
| Vercel | — | Deploy e hospedagem |

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Login de administrador com **e-mail e senha** via Firebase Authentication
- Validação de e-mail com **regex** antes de enviar para o Firebase
- Middleware de **proteção de rotas**: redireciona para login caso o usuário não esteja autenticado
- Logout com limpeza de sessão e redirecionamento automático
- Toggle de visibilidade da senha no campo de input

### 📦 Gestão de Estoque
- Cadastro dinâmico de **massas**, **recheios** e **bebidas** (quantidade ilimitada de itens por envio)
- Adição e remoção de campos de produto em tempo real no formulário
- Persistência no **Firebase Realtime Database**
- Exibição do estoque cadastrado com sincronização em tempo real (`onValue`)
- **Estoque atual calculado dinamicamente**: subtrai automaticamente as quantidades utilizadas nos pedidos registrados
- Atualização do "estoque disponível" salva de volta no banco (`dbCurrentMassa`, `dbCurrentRecheio`)
- Limpeza total do banco de dados de estoque com um clique

### 🧾 Pedidos
- Formulário de criação de pedido com **nome do cliente** e seleção de **2 massas + 2 recheios**
- Os `<select>` de massa e recheio são populados **dinamicamente** com os produtos que ainda têm estoque disponível (quantidade > 0)
- Validação de todos os campos obrigatórios antes do envio
- Salvamento do pedido no Firebase com status inicial `false` (em preparo)
- Exibição de **contadores** de pedidos totais e em preparo em tempo real

### 📋 Painel de Pedidos
- Painel dedicado com todos os pedidos em tempo real
- **Marcar como pronto**: toggle de status do pedido com atualização imediata no banco
- **Excluir pedido** individualmente
- Limpeza de todos os pedidos de uma vez
- Feedback visual: pedidos concluídos recebem estilo diferenciado

### 🔔 UX & Componentes
- **Loading Overlay**: spinner de tela cheia durante operações assíncronas
- **Toast notifications** (Toastify): feedback de sucesso e erro em todas as ações
- **Navbar responsiva** com menu mobile (hamburguer) e botão de logout
- Data atual exibida nas páginas de estoque e pedidos

---

## 🏗️ Arquitetura

### Roteamento SPA Manual

O roteamento é implementado do zero em `src/app.js`, sem bibliotecas externas:

```javascript
const routes = {
    "/": "/pages/login-admin/login.html",
    "/Home": "/pages/home.html",
    "/Estoque": "/pages/estoquePage/index.html",
    "/Pedidos": "/pages/pedidoPage/index.html",
    "/Painel-pedidos": "/pages/ordersPanel/index.html"
};
```

- **Event delegation** no `document.body` intercepta cliques em `<a data-link>` e usa a History API (`pushState`) para navegação sem reload
- `window.onpopstate` garante que o botão Voltar/Avançar do browser funcione corretamente
- Após carregar o HTML da rota via `fetch`, a função `logicPage()` inicializa a lógica JavaScript correspondente à página

### Middleware de Autenticação

```javascript
export const checkAuth = async () => {
    return new Promise(resolve => {
        onAuthStateChanged(auth, (user) => {
            resolve(user);
        });
    });
};
```

Toda navegação para rotas privadas passa por `checkAuth()`. Se o usuário não estiver autenticado, é redirecionado para `/` automaticamente.

### Cálculo de Estoque Disponível

O estoque atual não é armazenado estaticamente — ele é **recalculado sempre que há mudança** nos pedidos ou no estoque cadastrado:

```
Estoque disponível = Quantidade cadastrada − Quantidade usada nos pedidos
```

Três `onValue` listeners são registrados simultaneamente (massa, recheio, orders). Qualquer alteração em qualquer um deles dispara o `renderDatas()`, que recalcula e atualiza a UI e o banco.

---

## 📁 Estrutura de Pastas

```
controle-estoque/
├── index.html                         # Entry point da SPA
├── vite.config.js                     # Configuração do Vite + Tailwind
├── vercel.json                        # Rewrite para SPA na Vercel
├── package.json
│
├── public/
│   ├── img/
│   │   └── Logo_principal.png
│   └── pages/
│       ├── home.html
│       ├── login-admin/
│       │   └── login.html
│       ├── estoquePage/
│       │   └── index.html
│       ├── pedidoPage/
│       │   └── index.html
│       └── ordersPanel/
│           └── index.html
│
└── src/
    ├── app.js                         # Firebase init, router, event delegation
    ├── styles/
    │   └── style.css
    ├── components/
    │   ├── navbar.js                  # Menu mobile + logout
    │   ├── loadingOverlay.js          # Spinner de carregamento
    │   └── toastify.js                # Wrapper de notificações
    └── pages/
        ├── login-admin/
        │   └── script-login/
        │       ├── auth-firebase.js   # signIn, signOut, monitorAuthState
        │       ├── event-login.js     # Listeners do formulário de login
        │       └── middleware-route.js # checkAuth (Promise + onAuthStateChanged)
        ├── estoquePage/
        │   ├── scriptStock.js         # Orquestrador da página de estoque
        │   ├── feature-db/
        │   │   ├── cleanDb.js         # Remove massa/recheio/bebida do DB
        │   │   └── checkData.js       # Verifica se há dados e chama updateUI
        │   └── feature-estoque/
        │       ├── updateUI.js        # Lê DB e renderiza estoque cadastrado
        │       └── loadCurrentEstoque.js # Calcula estoque real descontando pedidos
        ├── pedidoPage/
        │   ├── scriptOrders.js        # Orquestrador da página de pedidos
        │   ├── feature-db/
        │   │   └── cleanOrderDb.js    # Remove todos os pedidos
        │   └── feature-display/
        │       ├── renderOrders.js    # Renderiza lista de pedidos com ações
        │       └── handleSelect.js    # Popula selects com estoque disponível
        └── ordersPanel/
            └── scriptOrdersPanel.js   # Painel de pedidos (reutiliza renderOrders)
```

---

## 🔥 Firebase — Estrutura do Banco de Dados

```
firebase-realtime-database/
├── massa/
│   └── {pushId}/
│       └── listMassas: [ { massa: string, quantidade: number } ]
│
├── recheio/
│   └── {pushId}/
│       └── listRecheios: [ { recheio: string, quantidade: number } ]
│
├── bebida/
│   └── {pushId}/
│       └── listBebidas: [ { bebida: string, quantidade: number } ]
│
├── dbCurrentMassa/
│   └── currentMassaEstoque: [ { massa: string, quantidade: number } ]
│
├── dbCurrentRecheio/
│   └── currentRecheioEstoque: [ { recheio: string, quantidade: number } ]
│
└── orders/
    └── {pushId}/
        ├── name: string
        ├── massa1: string
        ├── recheio1: string
        ├── massa2: string
        ├── recheio2: string
        └── status: boolean  // false = em preparo, true = pronto
```

---

## ⚙️ Como Executar Localmente

**Pré-requisitos:** Node.js 18+

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/controle-estoque.git
cd controle-estoque

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## 🚢 Deploy

O projeto está configurado para deploy na **Vercel**. O arquivo `vercel.json` redireciona todas as rotas para `index.html`, garantindo que a SPA funcione corretamente com URLs diretas e refresh de página:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🧩 Padrões e Decisões Técnicas

**SPA sem framework** — O roteamento, a inicialização de módulos por página e a gestão de estado são feitos manualmente com JavaScript puro e a History API. Isso demonstra compreensão profunda de como frameworks como React e Vue funcionam internamente.

**ES Modules nativos** — Todo o código usa `import/export` estático. O Vite realiza o bundling e tree-shaking para produção.

**Listeners em tempo real** — O Firebase `onValue` é usado extensivamente para que qualquer mudança no banco (novo pedido, atualização de estoque) reflita na interface de todos os clientes conectados sem necessidade de polling.

**Separação de responsabilidades** — Cada página tem um arquivo orquestrador (ex: `scriptStock.js`) que delega para módulos de feature (`feature-db/`, `feature-display/`, `feature-estoque/`), seguindo o princípio de responsabilidade única.

**Componentes reutilizáveis** — `loadingOverlay`, `toastify` e `navbar` são módulos isolados importados por qualquer página que precise deles. O `renderOrders` é compartilhado entre a página de pedidos e o painel de pedidos.

---

## 📸 Páginas da Aplicação

| Rota | Descrição |
|---|---|
| `/` | Login do administrador |
| `/Home` | Página inicial com navegação |
| `/Estoque` | Cadastro e visualização do estoque |
| `/Pedidos` | Registro e acompanhamento de pedidos |
| `/Painel-pedidos` | Painel operacional de pedidos em tempo real |

## 👨‍💻 Autor
**Paulo César**