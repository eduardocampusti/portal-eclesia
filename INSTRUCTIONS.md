# GUIA DEFINITIVO: Por que o Login não funciona?

O seu print do Console (F12) revelou o erro exato: **"Supabase credentials missing or invalid. URL provided: NONE"**.

Isso significa que o site no Vercel **não sabe** qual é o seu banco de dados. Ele está tentando conectar em um "servidor de teste" que não existe.

## 1. SOLUÇÃO PRINCIPAL: Preencher as chaves no Vercel

O seu print mostra as chaves `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` como **"Empty"** (Vazias). O sistema não funciona sem elas.

**Como preencher:**
1. No print que você mandou, clique nos **três pontinhos (...)** à direita de cada variável.
2. Escolha **Edit**.
3. No campo **Value**, cole a informação correspondente do seu Supabase.
4. Clique em **Save**.

**Onde achar as chaves no Supabase:**
- Vá em **Project Settings** (o ícone de engrenagem no canto inferior esquerdo).
- Clique em **API**.
- Copie o **Project URL** (para a `VITE_SUPABASE_URL`).
- Copie a **anon public key** (para a `VITE_SUPABASE_ANON_KEY`).

**PASSO FINAL (OBRIGATÓRIO):**
Após salvar no Vercel, você **PRECISA** fazer um novo Deploy para o site "aprender" os valores:
1. No menu superior do Vercel, clique em **Deployments**.
2. Clique no primeiro da lista (o mais recente).
3. No canto superior direito, clique em **Redeploy**.

## 2. Verificação de Senha
Após fazer o passo 1, o erro no console (F12) deve sumir e aparecer "Database Online". Aí sim você poderá logar com os usuários que criou:
- `admin@ipb.org.br`
- `impdigital@gmail.com`

> [!IMPORTANT]
> A senha do **Usuário** (criada na aba Authentication) é diferente da senha do **Banco** (criada ao iniciar o projeto). Se esqueceu, use o botão "Reset Password" no Dashboard do Supabase.

## 3. Modo de Emergência
Se o Vercel estiver difícil de configurar agora, use o botão **"Acesso Rápido (Modo Dev)"** na tela de login. Ele ignora o banco de dados e te deixa entrar para ver o sistema.
