#!/bin/bash

# Script de Deploy - Listas para Eventos
# Este script ajuda a preparar o projeto para deploy

echo "🚀 Preparando deploy do projeto Listas para Eventos..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# Verificar se os arquivos necessários existem
echo "📋 Verificando arquivos de configuração..."

if [ ! -f "netlify.toml" ]; then
    echo "❌ Erro: netlify.toml não encontrado"
    exit 1
fi

if [ ! -f "backend/Procfile" ]; then
    echo "❌ Erro: backend/Procfile não encontrado"
    exit 1
fi

if [ ! -f "backend/app.json" ]; then
    echo "❌ Erro: backend/app.json não encontrado"
    exit 1
fi

echo "✅ Todos os arquivos de configuração encontrados"

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install
cd ..

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install
cd ..

echo "✅ Dependências instaladas com sucesso"

# Verificar se o git está configurado
if [ ! -d ".git" ]; then
    echo "⚠️  Aviso: Repositório git não encontrado"
    echo "   Execute: git init && git add . && git commit -m 'Initial commit'"
else
    echo "✅ Repositório git encontrado"
fi

echo ""
echo "🎉 Preparação concluída!"
echo ""
echo "📝 Próximos passos:"
echo "1. Configure o Supabase (veja INSTALACAO.md)"
echo "2. Deploy do backend no Render (GRATUITO) (veja RENDER_DEPLOYMENT.md)"
echo "3. Deploy do frontend no Netlify (veja DEPLOYMENT.md)"
echo "4. Configure as variáveis de ambiente"
echo ""
echo "📚 Documentação:"
echo "- RENDER_DEPLOYMENT.md - Deploy gratuito no Render ⭐"
echo "- DEPLOYMENT.md - Guia completo de deploy"
echo "- RAILWAY_DEPLOYMENT.md - Deploy alternativo no Railway"
echo "- INSTALACAO.md - Guia de instalação local" 