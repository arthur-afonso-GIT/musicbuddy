# MusicPlanner

Assistente de composição por blocos. Etapa atual: interface React conectada à rota de saúde de uma API FastAPI. As funcionalidades musicais estão no [plano de desenvolvimento](docs/DEV_PLAN.md).

Os fundamentos visuais e padrões de interação estão no [design system](docs/DESIGN_SYSTEM.md).

## Pré-requisitos

- Node.js 24 LTS e npm.
- Python 3.12 (compatibilidade das bibliotecas de áudio será avaliada posteriormente).
- PowerShell, dois terminais e acesso à internet na instalação.

Os comandos abaixo partem da raiz do repositório. Usamos `npm.cmd` para evitar bloqueio de scripts npm pelo PowerShell e o executável do ambiente virtual diretamente, sem precisar ativá-lo.

## Instalação

```powershell
py -3.12 -m venv backend/.venv
& ./backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.lock
& ./backend/.venv/Scripts/python.exe -m pip install --no-deps -e ./backend
npm.cmd --prefix frontend ci
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Se `py` não estiver disponível, use o caminho do seu Python 3.12 no primeiro comando. Neste ambiente Codex, a base foi criada com:

```powershell
& "$env:USERPROFILE/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe" -m venv backend/.venv
```

Copie os exemplos de configuração apenas na primeira instalação para não sobrescrever personalizações.

## Executar localmente

Terminal 1 — API:

```powershell
& ./backend/.venv/Scripts/python.exe -m uvicorn app.main:app --app-dir backend --env-file backend/.env --reload --host 127.0.0.1 --port 8000
```

Terminal 2 — interface:

```powershell
npm.cmd --prefix frontend run dev
```

Abra [MusicPlanner](http://127.0.0.1:5173). A página deve mostrar **Backend conectado**. A API também expõe [saúde](http://127.0.0.1:8000/health) e [documentação interativa](http://127.0.0.1:8000/docs). Use Ctrl+C em cada terminal para encerrar.

## Configuração

- `frontend/.env`: `VITE_API_URL` define o endereço da API. Reinicie o Vite após alterar. Variáveis `VITE_` são públicas no navegador; não coloque segredos nelas.
- `backend/.env`: `CORS_ORIGINS` define as origens autorizadas, separadas por vírgula. Padrão: localhost/127.0.0.1 na porta 5173. O backend carrega esse arquivo pelo argumento `--env-file`.
- Vite mantém a porta 5173 fixa. Se estiver ocupada, encerre o servidor anterior ou configure outra porta e ajuste as origens no backend.
- Para `npm run preview` na porta 4173, adicione explicitamente `http://127.0.0.1:4173` às origens e reinicie a API.

## Verificação

```powershell
npm.cmd --prefix frontend run build
& ./backend/.venv/Scripts/python.exe -m pip check
Invoke-RestMethod http://127.0.0.1:8000/health
```

A saúde retorna `status: ok` e `service: musicplanner-api`. Para verificar o estado de erro da tela, pare a API e clique em **Verificar novamente**; inicie a API novamente e repita a verificação. Cada tentativa tem limite de oito segundos.

`frontend/package-lock.json` e `backend/requirements.lock` registram as versões instaladas. O ambiente virtual, arquivos `.env`, dependências, builds, bancos e gravações temporárias ficam fora do Git.

## Estrutura

```text
backend/app/main.py         API e configuração de CORS
backend/pyproject.toml      Dependências diretas e pacote Python
backend/requirements.lock  Versões Python da instalação validada
frontend/src/api/client.ts Comunicação com a API
frontend/src/App.tsx        Tela de conexão
docs/DEV_PLAN.md            Etapas até o MVP
```
