# Design system — MusicPlanner

## Decisões do usuário

O produto deve ser beginner friendly e lembrar um caderno de composição. A tela principal é um hub para as funcionalidades e para as cifras recentes. O uso deve ser guiado, com fundo escuro e controles retos e discretos. A personalidade vem da visualização de notas e da composição da tela. Notion é referência para organização e Spotify para encontrar e retomar conteúdo. A direção clara anterior, bordas arredondadas e aparência de template foram rejeitadas.

## Princípio de produto

Na tela inicial, a pessoa precisa reconhecer onde estão suas cifras e quais ferramentas existem. As ferramentas só viram ações quando funcionarem. Antes disso, exibir estado “Em breve” e um vazio honesto; não preencher o hub com músicas ou métricas fictícias. Quando o salvamento existir, ordenar cifras recentes por última edição e oferecer retomada direta.

## Linguagem visual

Tela escura, superfícies próximas do fundo e divisórias finas. Controles com bordas retas, sem gradientes nem sombras decorativas. Hierarquia pela disposição, tipografia e espaçamento. Uma pequena pauta musical aparece apenas no estado vazio, para conectar a área ao conteúdo que ela receberá. Em telas futuras, notas, acordes e blocos reais devem assumir esse papel visual.

Tokens de cor e espaçamento estão em `frontend/src/styles/tokens.css`. `--page`, `--sidebar` e `--panel` separam áreas; `--text`, `--muted` e `--subtle` organizam leitura; `--accent` marca seleção/ação; `--success` e `--error` são acompanhados por texto. Não adicionar uma nova cor a cada ferramenta. O sistema usa fonte do sistema para a interface e serifa apenas em pequenos sinais de notação.

## Composição e navegação

No desktop, barra lateral estável e conteúdo central. No mobile, cabeçalho simples e conteúdo em uma coluna; navegação adicional será definida quando houver páginas reais. Seções da tela atual: últimas cifras e ferramentas. A lista de cifras futura deve mostrar título, tonalidade se houver, última edição e ação de abrir. Evitar cards idênticos para todas as áreas; listas e divisórias facilitam comparação.

## Componentes e estados

- Navegação: links reais para seções ou rotas existentes; item atual identificado visualmente e por `aria-current`.
- Ícones: usar formas reconhecíveis e específicas à ação, sempre acompanhadas de rótulo. Não usar símbolos musicais ambíguos como substitutos de navegação; remover o ícone quando não ajudar. Conferir área clicável e foco.
- Linha de ferramenta: nome, descrição curta e estado. Sem clique enquanto a funcionalidade não existir.
- Lista de cifras: estado vazio explícito, nunca dados inventados. Quando implementada, títulos clicáveis e ordenação recente.
- Controles: 44px de altura mínima para toque, foco de teclado visível, rótulos específicos. Ações secundárias podem ser texto com sublinhado/borda discreta.
- Feedback: carregando, conectado e erro escritos em linguagem direta e anunciados com `role="status"`. Disponibilidade não é comunicada só pela cor.
- Detalhe musical: iniciantes veem explicação simples e reprodução; músicos podem expandir graus, funções e alternativas, sem lotar a visão inicial.

## Fluxo futuro

Hub → gravar/enviar frase → conferir notas → escolher tonalidade plausível → ouvir harmonizações → montar blocos → salvar. Cada etapa deve indicar o que a pessoa pode corrigir e o que acontece em seguida. “Tonalidade possível” é mais honesto que uma certeza automática para frases ambíguas.

## Acessibilidade e implementação

Validar a partir de 320px. Texto operacional secundário preferencialmente com 14px ou mais e contraste suficiente sobre fundo escuro; controles de 44px; contraste e foco visíveis. Respeitar movimento reduzido. Animação só quando explica uma mudança, nunca para atrasar navegação. `frontend/src/App.tsx` implementa o hub atual, `frontend/src/styles.css` define layouts e padrões, e `frontend/src/styles/tokens.css` centraliza valores. Extrair componentes React quando uma segunda tela precisar dos mesmos padrões.
