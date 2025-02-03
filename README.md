# CRUDReactJSNetCore-Frontend

Frontend para o CRUDReactJSNetCore - Sistema de Gestão de Funcionários

## Premissas para Execução

### Usuário Principal

Para acesso inicial ao sistema, utilize as seguintes credenciais:

- **Email**: admin@admin.com.br
- **Senha**: Admin@123

### Pré-requisitos

- Node.js instalado
- Yarn instalado
- Backend do projeto em execução

### Configuração do Ambiente

1. **Backend**

   - Execute primeiro o docker-compose do projeto de backend
   - Aguarde a inicialização completa dos serviços

2. **Frontend**
   - Clone este repositório
   - Execute `yarn install` para instalar as dependências
   - Execute `yarn dev` para iniciar o projeto

### Observações Importantes

- Todos os testes de interface foram realizados utilizando a execução via `yarn dev`
- Não foram implementados testes de automação na interface
- O sistema requer que o backend esteja em execução para funcionar corretamente

### Limitações e Considerações

- Eventos de push notification (email, whatsapp, etc) foram mapeados, porém não implementados por não fazerem parte do escopo do teste. Por exemplo, a senha gerada na inclusão de um usuário seria enviada por email para realização do primeiro acesso
- A obrigatoriedade de alteração de senha no primeiro acesso foi mapeada, mas não implementada devido a restrições de tempo
- Para acessar o sistema com um usuário cadastrado, utilize a funcionalidade de reset de senha. Uma nova senha será gerada e exibida para você

## Funcionalidades

- Autenticação de usuários
- Gestão de funcionários (CRUD)
- Alteração de senha
- Reset de senha de funcionários
- Ativação/Desativação de funcionários
- Gestão de cargos e níveis hierárquicos
