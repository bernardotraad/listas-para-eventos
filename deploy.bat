@echo off
REM Script de Deploy - Listas para Eventos (Windows)
REM Este script ajuda a preparar o projeto para deploy

echo 🚀 Preparando deploy do projeto Listas para Eventos...

REM Verificar se estamos no diretório correto
if not exist "package.json" (
    echo ❌ Erro: Execute este script na raiz do projeto
    pause
    exit /b 1
)

REM Verificar se os arquivos necessários existem
echo 📋 Verificando arquivos de configuração...

if not exist "netlify.toml" (
    echo ❌ Erro: netlify.toml não encontrado
    pause
    exit /b 1
)

if not exist "backend\Procfile" (
    echo ❌ Erro: backend\Procfile não encontrado
    pause
    exit /b 1
)

if not exist "backend\app.json" (
    echo ❌ Erro: backend\app.json não encontrado
    pause
    exit /b 1
)

echo ✅ Todos os arquivos de configuração encontrados

REM Instalar dependências do frontend
echo 📦 Instalando dependências do frontend...
cd frontend
call npm install
cd ..

REM Instalar dependências do backend
echo 📦 Instalando dependências do backend...
cd backend
call npm install
cd ..

echo ✅ Dependências instaladas com sucesso

REM Verificar se o git está configurado
if not exist ".git" (
    echo ⚠️  Aviso: Repositório git não encontrado
    echo    Execute: git init ^&^& git add . ^&^& git commit -m "Initial commit"
) else (
    echo ✅ Repositório git encontrado
)

echo.
echo 🎉 Preparação concluída!
echo.
echo 📝 Próximos passos:
echo 1. Configure o Supabase (veja INSTALACAO.md)
echo 2. Deploy do backend no Render (GRATUITO) (veja RENDER_DEPLOYMENT.md)
echo 3. Deploy do frontend no Netlify (veja DEPLOYMENT.md)
echo 4. Configure as variáveis de ambiente
echo.
echo 📚 Documentação:
echo - RENDER_DEPLOYMENT.md - Deploy gratuito no Render ⭐
echo - DEPLOYMENT.md - Guia completo de deploy
echo - RAILWAY_DEPLOYMENT.md - Deploy alternativo no Railway
echo - INSTALACAO.md - Guia de instalação local

pause 