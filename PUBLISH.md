# Publicação do Pacote npm

## Como Publicar

### 1. Preparação
```bash
# Verificar se o pacote está pronto
npm run prepare

# Verificar se a versão está correta
npm version patch|minor|major

# Testar localmente (opcional)
npm pack
npx @paulojalowyj/openkit-1.0.0.tgz
```

### 2. Publicar no npm
```bash
# Login no npm (se necessário)
npm login

# Publicar no registry
npm publish --access public
```

### 3. Testar após publicação
```bash
# Em um novo projeto
npx @paulojalowyj/openkit init
npx @paulojalowyj/openkit doctor
```

## Checklist de Publicação

- [ ] Versão atualizada no `package.json`
- [ ] `npm run prepare` passou com sucesso
- [ ] .opencode contém todas as suas modificações (agents, skills, commands)
- [ ] Scripts de preparação funcionam
- [ ] Licença correta
- [ ] README.md completo/atualizado
- [ ] `.npmignore` configurado
- [ ] Dependências instaladas

## Configuração Registry do usuário

Para publicar no seu registry com o namespace @paulojalowyj:

```bash
# Crie o usuario no npmjs.org se não tiver
npm adduser

# Configure as opções corretas
npm config set scope @paulojalowyj
npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN

# Publicar
npm publish --access public
```

## Versionamento

```bash
# Patch (bug fixes)
npm version patch

# Minor (novas features backward compatible)
npm version minor

# Major (breaking changes)
npm version major
```