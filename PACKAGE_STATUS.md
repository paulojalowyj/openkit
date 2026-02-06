# OpenKit - Pacote npm

## Status Pronto para Publicação

O pacote foi criado com sucesso e está pronto para publicação no npm registry.

### Arquivo: `${name}-1.1.23.tgz` (465 KB)

## Instruções de Publicação

### 1. Setup inicial (primeira vez)
```bash
# 1. Configurar registry para seu namespace
npm config set scope @paulojalowyj

# 2. Fazer login
npm login

# 3. Obter auth token
# O token será configurado automaticamente
```

### 2. Publish
```bash
npm publish --access public
```

### 3. Test após publicação
```bash
# Limpe o cache e teste
npm cache clean --force
npx @paulojalowyj/openkit init
```

## Informações do Pacote

- **Nome**: `@paulojalowyj/openkit`
- **Versão**: `1.1.23`
- **Tamanho**: 465 KB (empacotado) / 1.5 MB (descompactado)
- **Arquivos**: 198 arquivos
- **Binário**: `openkit`

## Usage Após Publicação

### Via npx (recomendado)
```bash
npx @paulojalowyj/openkit init
npx @paulojalowyj/openkit doctor
```

### Instalação global
```bash
npm install -g @paulojalowyj/openkit
openkit init
```

### No package.json
```bash
npm install --save-dev @paulojalowyj/openkit
```

## Features Implementadas

1. **Modelos GLM**: Todos agentes usando GLM (Thinking/Flash/Lite)
2. **Config Simplificado**: Removido config.json desnecessário
3. **CLI Funcional**: Comandos init e doctor validados
4. **Empacotamento**: Arquivos corretamente incluídos via .npmignore

## Validado 

- [x] Comando `opencode-glms init` funciona
- [x] Comando `opencode-glms doctor` funciona
- [x] .opencode copiado com todas modificações
- [x] Modelos GLM configurados corretamente
- [x] Scripts de preparação funcionam

## Comandos do CLI

```bash
opencode-glms init      # Instala .opencode no projeto
opencode-glms doctor    # Verifica instalação
opencode-glms --version # Mostra versão
opencode-glms --help    # Mostra ajuda
```

## Requisitos

- Node.js >= 18.0.0
- OpenCode TUI (para usar comandos /)
- Python 3.x (para scripts de validação)

## Suporte

Para problemas, verifique:
- `PUBLISH.md` - Instruções detalhadas
- `README.md` - Documentação completa
- `ARCHITECTURE.md` - Arquitetura do sistema
