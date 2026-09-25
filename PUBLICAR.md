# Site da Banda 3 em 1

O site continua em `dist`: index.html, conteudo.js, styles.css, script.js e assets.
As molduras aparecem no início, sobre e integrantes. A galeria mostra quatro fotos sem molduras, com as demais no botão Ver mais fotos.

## Ativar a agenda automática no GitHub

1. Envie `dist`, `.github` e `.gitignore` para a raiz do repositório `lucaspagnota/site_banda_3_em_1` (branch principal). Não envie backups ou node_modules.
2. No repositório, abra Settings → Pages → Build and deployment → Source → GitHub Actions.
3. Abra Actions → Atualizar agenda e publicar site → Run workflow.
4. Após a execução concluir, abra o endereço indicado em Pages.

A rotina lê a agenda pública e publica somente `dist`. Os dados são gerados durante a publicação; não é necessário editar músicas, fotos ou arquivos para atualizar shows. A agenda é consultada nos minutos 7, 22, 37 e 52 de cada hora. O agendamento do GitHub pode atrasar; não é sincronização instantânea. No site aberto, os cartões consultam a versão publicada a cada minuto e quando a aba volta a ficar ativa.

Se a leitura do Google falhar, a publicação é interrompida e a versão anterior permanece online. O site avisa quando os dados têm mais de 24 horas. Em repositórios públicos sem atividade por 60 dias, o GitHub pode desativar rotinas agendadas; reative em Actions quando necessário.

## Editar os shows

Edite a agenda SHOWS no Google. Título, data, horário e campo Local são usados nos cartões. O Local gera o botão Como chegar e o mapa. Eventos de dia inteiro não recebem um horário inventado. Cancelamentos, eventos privados e eventos com `[nao-site]` no título ou descrição não entram na lista. Outros eventos públicos dessa agenda aparecem no site, incluindo lembretes e recitais.

O identificador da agenda está em `dist/conteudo.js`, no campo `agendaGoogle`. A lista `agenda` desse arquivo é apenas uma reserva caso os dados publicados não possam ser carregados.

## Verificar localmente

Requer Node.js 22 ou superior:

```powershell
npm.cmd ci --prefix .github/scripts --ignore-scripts
node --test .github/scripts/sync-agenda.test.cjs
node .github/scripts/sync-agenda.cjs
```

Abra o site por um servidor HTTP local para permitir a leitura de `assets/agenda.json`.
As configurações e os scripts da automação ficam em `.github`; essa pasta não é publicada como parte do site.
