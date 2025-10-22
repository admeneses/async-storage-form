# AsyncStorage Form - App de Login

Este projeto demonstra o uso completo do AsyncStorage em React Native com Expo, implementando um sistema de login persistente.

### Tela de Login
- **Campos de entrada**: Email e senha
- **Lembrar usuário**: Switch para salvar credenciais automaticamente
- **Habilitar biometria**: Flag para preferência futura de autenticação biométrica
- **Validação**: Verificação de campos obrigatórios
- **Credenciais de teste**: 
  - Email: `usuario@teste.com`
  - Senha: `123456`

### Tela Home
- **Informações do usuário**: Exibe o email do usuário logado
- **Botão de logout**: Remove sessão atual
- **Ver dados salvos**: Mostra todos os dados armazenados no AsyncStorage
- **Limpar todos os dados**: Remove completamente todos os dados salvos

### Métodos AsyncStorage Utilizados

#### Métodos Principais
- `AsyncStorage.setItem()` - Salvar dados
- `AsyncStorage.getItem()` - Recuperar dados
- `AsyncStorage.removeItem()` - Remover item específico
- `AsyncStorage.multiRemove()` - Remover múltiplos itens
- `AsyncStorage.getAllKeys()` - Obter todas as chaves
- `AsyncStorage.multiGet()` - Obter múltiplos valores
- `AsyncStorage.clear()` - Limpar todos os dados

#### Dados Persistidos (Padrão @MeuApp:config)

**Dados em JSON (usando JSON.stringify/parse):**
- `@MeuApp:loginData`: Objeto JSON com dados da sessão atual
  ```json
  {
    "email": "usuario@teste.com",
    "password": "123456",
    "loginTime": "2024-01-01T10:00:00.000Z",
    "isAuthenticated": true
  }
  ```
- `@MeuApp:savedCredentials`: Objeto JSON com credenciais salvas
  ```json
  {
    "email": "usuario@teste.com",
    "password": "123456",
    "savedAt": "2024-01-01T10:00:00.000Z"
  }
  ```

**Dados em String (valores simples):**
- `@MeuApp:rememberUser`: Flag para lembrar credenciais ("true"/"false")
- `@MeuApp:enableBiometry`: Flag para habilitar biometria ("true"/"false")

## Estrutura do Projeto

```
src/
├── constants/
│   └── colors.ts          # Paleta de cores harmoniosas em verde
├── screens/
│   ├── LoginScreen.tsx    # Tela de login com AsyncStorage
│   └── HomeScreen.tsx     # Tela home com logout
App.tsx                    # Navegação principal
```

## Como Usar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar o projeto**:
   ```bash
   npm start
   ```

3. **Testar o login**:
   - Use as credenciais: `usuario@teste.com` / `123456`
   - Ative "Lembrar usuário" para persistir credenciais
   - Ative "Habilitar biometria" para salvar preferência

4. **Funcionalidades na Home**:
   - Visualizar dados salvos no AsyncStorage
   - Fazer logout mantendo ou removendo credenciais
   - Limpar todos os dados salvos
