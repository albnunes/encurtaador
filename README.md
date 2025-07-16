# Encurtaador - Frontend

Frontend moderno para o sistema de encurtamento de URLs, construído com Svelte 5 e Vite.

## 🚀 Funcionalidades

- **Interface moderna e responsiva** com design system consistente
- **Autenticação completa** com login e registro de usuários
- **Encurtamento de URLs** com e sem autenticação
- **Dashboard personalizado** para gerenciar URLs
- **Geração de QR Codes** para URLs encurtadas
- **Estatísticas de cliques** e histórico de URLs
- **Interface intuitiva** com feedback visual

## 🛠️ Tecnologias

- **Svelte 5** - Framework reativo
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Axios** - Cliente HTTP
- **QRCode** - Geração de QR codes

## 📦 Instalação

1. **Instalar dependências:**

   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**

   ```bash
   cp env.example .env
   ```

   Edite o arquivo `.env` e configure:

   - `VITE_API_URL`: URL da API backend (padrão: http://localhost:3000)

3. **Executar em desenvolvimento:**

   ```bash
   npm run dev
   ```

4. **Build para produção:**
   ```bash
   npm run build
   ```

## 🏗️ Estrutura do Projeto

```
src/
├── lib/                    # Componentes e utilitários
│   ├── api.ts             # Cliente da API
│   ├── stores.ts          # Stores do Svelte
│   ├── AuthForm.svelte    # Formulário de autenticação
│   ├── Navigation.svelte  # Navegação
│   ├── UrlShortener.svelte # Encurtador de URLs
│   └── UrlList.svelte     # Lista de URLs
├── pages/                 # Páginas da aplicação
│   ├── Login.svelte       # Página de login
│   ├── Register.svelte    # Página de registro
│   └── Dashboard.svelte   # Dashboard do usuário
├── App.svelte            # Componente principal
├── main.ts               # Ponto de entrada
└── app.css              # Estilos globais
```

## 🔧 Configuração

### Variáveis de Ambiente

- `VITE_API_URL`: URL da API backend
- `VITE_APP_NAME`: Nome da aplicação
- `VITE_APP_VERSION`: Versão da aplicação

### Proxy de Desenvolvimento

O Vite está configurado para fazer proxy das requisições `/api` para o backend:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    }
  }
}
```

## 🎨 Design System

### Cores

- **Primária**: `#3b82f6` (Azul)
- **Secundária**: `#667eea` (Gradiente)
- **Sucesso**: `#10b981` (Verde)
- **Erro**: `#dc2626` (Vermelho)
- **Neutro**: `#6b7280` (Cinza)

### Tipografia

- **Família**: System fonts (San Francisco, Segoe UI, etc.)
- **Tamanhos**: Escala responsiva
- **Pesos**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## 📱 Responsividade

O frontend é totalmente responsivo e funciona em:

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 🔐 Autenticação

O sistema de autenticação inclui:

- **Login** com email e senha
- **Registro** de novos usuários
- **JWT** para sessões persistentes
- **Proteção de rotas** para páginas privadas
- **Logout** automático em caso de erro 401

## 📊 Funcionalidades

### Encurtamento de URLs

- **URLs anônimas**: Sem necessidade de cadastro
- **URLs autenticadas**: Vinculadas ao usuário
- **Validação de URLs**: Verificação de formato
- **QR Code**: Geração opcional de QR codes
- **Cópia para clipboard**: Funcionalidade nativa

### Dashboard

- **Lista de URLs**: Paginação e filtros
- **Estatísticas**: Número de cliques por URL
- **Ações**: Editar e excluir URLs
- **Histórico**: Data de criação e última atualização

## 🚀 Deploy

### Build para Produção

```bash
npm run build
```

### Servir Build

```bash
npm run preview
```

### Docker

```bash
# Build da imagem
docker build -t encurtaador-frontend .

# Executar container
docker run -p 5173:5173 encurtaador-frontend
```

## 🔧 Desenvolvimento

### Scripts Disponíveis

- `npm run dev`: Servidor de desenvolvimento
- `npm run build`: Build para produção
- `npm run preview`: Preview do build
- `npm run check`: Verificação de tipos

### Estrutura de Componentes

Cada componente segue o padrão Svelte 5:

```svelte
<script lang="ts">
  // Lógica do componente
</script>

<!-- Template HTML -->

<style>
  /* Estilos scoped */
</style>
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
