# Pedido Simples

PROMPT COMPLETO — DESENVOLVIMENTO DO SISTEMA WEB BÁSICO DE CONTROLE DE PEDIDOS

1. Objetivo geral

Crie um site funcional, simples, moderno e responsivo chamado Sistema Web Básico de Controle de Pedidos.

Este projeto faz parte de uma atividade acadêmica do curso de Análise e Desenvolvimento de Sistemas, na disciplina de Projeto de Software.

O objetivo é desenvolver um MVP (Produto Mínimo Viável) para ajudar pequenos comerciantes de bairro a organizar seus produtos, controlar o estoque e registrar pedidos, substituindo anotações em papel ou informações espalhadas pelo celular.

O site deve parecer um sistema real de um pequeno comércio brasileiro, mas precisa ser extremamente simples de utilizar.

Prioridade absoluta: simplicidade, funcionalidade, acessibilidade e facilidade de navegação.

Não quero um sistema empresarial complexo, nem um painel administrativo cheio de gráficos. Quero um site básico, bonito, organizado e intuitivo, que um comerciante sem experiência com tecnologia consiga utilizar.

Todo o sistema deve estar em português brasileiro (pt-BR).

2. Público-alvo

O sistema será utilizado principalmente por:

Proprietários de pequenos comércios de bairro.

Funcionários responsáveis por produtos, estoque e pedidos.

Pessoas com pouca experiência em sistemas digitais.

Usuários que acessam a internet principalmente pelo celular.

O site também deverá funcionar em computadores.

Os clientes do comércio serão beneficiados indiretamente pela melhor organização dos pedidos, mas não precisarão acessar o sistema.

3. Identidade visual e estilo

Crie um design minimalista, limpo e profissional.

Cores:

Fundo principal branco ou cinza muito claro.

Azul como cor principal dos botões e cabeçalhos.

Textos em azul-escuro ou cinza-escuro.

Verde apenas para indicar operações concluídas.

Vermelho apenas para erros e alertas importantes.

Estilo visual:

Interface simples, sem elementos decorativos desnecessários.

Fonte moderna e legível, como Arial, Inter ou similar.

Botões grandes e fáceis de clicar.

Campos bem identificados.

Bordas levemente arredondadas.

Espaçamento confortável.

Ícones simples, quando realmente necessários.

Sem animações complexas.

Sem propagandas, banners ou imagens decorativas.

Sem gráficos, dashboards financeiros ou estatísticas avançadas.

O sistema deve transmitir a sensação de um aplicativo básico de organização comercial.

IMPORTANTE: não adicionar funcionalidades que não foram solicitadas. O objetivo é criar o menor sistema funcional possível.

4. Tecnologias e arquitetura

Utilize preferencialmente a seguinte estrutura tecnológica, definida no projeto acadêmico:

Back-end:

Python 3.12.

Flask 3.x.

Werkzeug para proteção de senhas.

Flask-SQLAlchemy 3.x para acesso ao banco.

Front-end:

HTML5.

CSS3.

Jinja2 para renderização das páginas.

JavaScript simples apenas quando necessário.

Banco de dados:

SQLite durante o desenvolvimento.

Arquitetura:

Monolítica em camadas.

Organização simplificada seguindo o padrão MVC.

Separação entre interface, regras de negócio e acesso aos dados.

Evite frameworks desnecessários, bibliotecas pesadas e microsserviços.

Se a plataforma de criação de sites não conseguir utilizar Python e Flask, informe claramente essa limitação e proponha uma alternativa funcional. Não apresente outra tecnologia como se fosse a arquitetura originalmente definida.

O código deve ser organizado, legível e fácil de manter.

5. Funcionalidades obrigatórias

RF01 — Cadastro de produtos

Prioridade: OBRIGATÓRIA.

Permitir que o comerciante cadastre produtos.

Campos:

Nome do produto (obrigatório).

Preço em reais (obrigatório).

Quantidade disponível em estoque (obrigatório).

Exemplo fictício:

Nome: Caderno
Preço: R$ 15,00
Estoque: 20 unidades

Regras:

O nome não pode estar vazio.

O preço deve ser maior que zero.

O estoque não pode ser negativo.

O estoque deve aceitar apenas números inteiros.

Os dados devem ser armazenados no banco.

Após cadastrar, apresentar:

"Produto cadastrado com sucesso!"

O comerciante também deve conseguir visualizar os produtos cadastrados.

RF02 — Login e autenticação

Prioridade: OBRIGATÓRIA.

Criar uma tela de login simples com:

Campo E-mail.

Campo Senha.

Botão Entrar.

Somente usuários autenticados poderão acessar os produtos e pedidos.

O sistema deverá permitir encerrar a sessão por meio do botão "Sair".

Para fins de demonstração acadêmica, permitir a criação de um usuário fictício de teste por um procedimento de inicialização documentado, sem deixar senhas reais ou credenciais fixas no código.

Não é necessário criar um sistema complexo de cadastro público de contas.

Mensagens esperadas:

"E-mail ou senha incorretos."

"Preencha todos os campos."

"Sessão encerrada com sucesso."

RF03 — Registro de pedidos

Prioridade: OBRIGATÓRIA.

Esta será a funcionalidade principal do site.

O comerciante deverá:

Acessar o sistema.

Escolher um produto já cadastrado.

Informar a quantidade desejada.

Visualizar o preço unitário e o total.

Clicar em "Registrar pedido".

Receber uma confirmação.

Exemplo:

Produto: Caderno
Preço unitário: R$ 15,00
Quantidade: 2
Total: R$ 30,00

O sistema deverá calcular automaticamente o total.

Regras:

Não aceitar quantidade zero ou negativa.

Não aceitar quantidade maior que o estoque disponível.

Não permitir registrar produtos inexistentes.

Não permitir pedidos sem produtos.

Um pedido poderá conter um ou mais produtos.

O estoque deverá ser atualizado quando um pedido for concluído.

O pedido e a atualização do estoque deverão ser gravados em uma única transação, evitando registros inconsistentes.

Se o estoque for insuficiente, mostrar:

"Estoque insuficiente. Verifique a quantidade disponível."

Se o pedido for salvo:

"Pedido registrado com sucesso!"

RF04 — Consulta de pedidos

Prioridade: OBRIGATÓRIA.

Criar uma tela simples para visualizar pedidos registrados.

Cada pedido deverá apresentar:

Número do pedido.

Data do pedido.

Produto ou produtos.

Quantidade.

Valor total.

Status.

Status previstos:

Pendente.

Concluído.

Cancelado.

A lista deve ser organizada e fácil de entender.

Não criar relatórios financeiros complexos.

RF05 — Filtro de pedidos

Prioridade: DESEJÁVEL.

Se for simples de implementar, permitir filtrar pedidos por:

Data.

Status.

Essa função é secundária. Implemente somente depois que todas as funcionalidades obrigatórias estiverem funcionando corretamente.

6. Banco de dados

Criar quatro entidades principais.

Tabela Usuarios

id_usuario: identificador único.

nome: texto obrigatório.

email: texto único e obrigatório.

senha_hash: hash seguro da senha.

ativo: booleano.

Tabela Produtos

id_produto: identificador único.

nome: texto obrigatório.

preco: valor decimal positivo.

estoque: número inteiro não negativo.

ativo: booleano.

Tabela Pedidos

id_pedido: identificador único.

data_pedido: data e hora.

status: pendente, concluído ou cancelado.

valor_total: valor decimal.

id_usuario: referência ao usuário responsável.

Tabela Itens_Pedido

id_item: identificador único.

id_pedido: referência ao pedido.

id_produto: referência ao produto.

quantidade: número inteiro positivo.

preco_unitario: preço registrado no momento da venda.

subtotal: valor calculado.

Relacionamentos:

Um usuário pode registrar vários pedidos.

Um pedido pode conter vários itens.

Um produto pode aparecer em vários pedidos.

Utilizar valores monetários com precisão decimal, evitando erros de arredondamento.

Não excluir definitivamente produtos associados a pedidos antigos; permitir desativá-los.

7. Telas principais do sistema

O protótipo acadêmico precisa apresentar três telas principais. O site funcional pode ter páginas adicionais mínimas quando necessárias, mas o fluxo central deve permanecer organizado nessas três etapas.

TELA 1 — Entrada principal

Título:

"Sistema de Pedidos"

Subtítulo:

"Organize seus produtos e pedidos de forma simples."

Componentes:

Nome do sistema.

Campo E-mail.

Campo Senha.

Botão azul "Entrar".

Mensagem simples em caso de erro.

Após o login, apresentar acesso claro às opções:

Produtos.

Novo pedido.

Consultar pedidos.

Sair.

A opção "Novo pedido" deve receber destaque, pois é a função central.

Evitar menus complicados.

TELA 2 — Cadastro de produtos e registro de pedidos

Esta tela poderá ter duas seções simples.

Seção A: Cadastrar produto

Título: "Cadastrar produto"

Campos:

Nome do produto.

Preço (R$).

Estoque.

Botão: "Salvar produto".

Seção B: Registrar pedido

Título: "Novo pedido"

Campos:

Produto.

Quantidade.

Informações:

Preço unitário.

Estoque disponível.

Total do pedido.

Botão: "Registrar pedido".

O formulário deve ser fácil de preencher em um celular.

Os campos devem ter rótulos visíveis e mensagens de erro compreensíveis.

TELA 3 — Resultado e consulta de pedidos

Após registrar um pedido, apresentar:

"✓ Pedido registrado com sucesso!"

Abaixo, mostrar um resumo do pedido.

Exemplo fictício:

Pedido nº 001
Data: 26/10/2026
Produto: Caderno
Quantidade: 2
Valor total: R$ 30,00
Status: Concluído

Botões:

Novo pedido.

Ver pedidos.

Voltar ao início.

Também deve existir uma listagem simples para consultar os pedidos anteriores.

Não usar apenas cores para transmitir mensagens. Utilizar texto e símbolos.

8. Datas e informações brasileiras

ATENÇÃO ESPECIAL ÀS DATAS:

A data atual de referência deste projeto é 26 de outubro de 2026.

Não utilizar 2025 em nenhuma tela, exemplo, cadastro, pedido ou imagem do protótipo.

Para os exemplos visuais, utilizar:

26/10/2026

Na aplicação funcional, as datas dos pedidos devem ser geradas automaticamente a partir da data real do servidor, com apresentação no fuso horário configurado para o Brasil.

Usar:

Datas no formato DD/MM/AAAA.

Moeda em reais (R$).

Textos em português brasileiro.

Separador decimal com vírgula na interface.

Os dados demonstrativos devem ser fictícios.

9. Segurança — RNF01

Implementar autenticação segura.

Requisitos:

Nunca armazenar senhas em texto limpo.

Não utilizar MD5 ou SHA-1 para armazenar senhas.

Utilizar o mecanismo de hash do Werkzeug com algoritmo robusto, como PBKDF2.

Proteger sessões de usuários.

Encerrar a sessão corretamente ao sair.

Impedir acesso a páginas protegidas sem login.

Utilizar HTTPS quando o sistema estiver publicado.

Configurar cookies de sessão com HttpOnly, Secure em HTTPS e SameSite.

Armazenar a chave secreta em variável de ambiente.

Adotar proteção proporcional contra tentativas repetidas de login.

O hash não é criptografia reversível. A senha original não deve ser recuperável a partir do banco.

10. Proteção de dados — RNF02

Aplicar controles básicos alinhados ao OWASP.

Prevenção contra SQL Injection:

Utilizar Flask-SQLAlchemy ou consultas parametrizadas.

Validar entradas no servidor.

Não montar SQL concatenando textos fornecidos pelo usuário.

Prevenção contra XSS:

Utilizar escape automático do Jinja2.

Não executar conteúdo HTML ou JavaScript inserido em campos.

Validar os valores permitidos.

Controle de acesso:

Verificar autenticação e autorização em cada operação protegida.

Não depender apenas de esconder botões na interface.

Configuração segura:

Não expor senhas, chaves ou segredos.

Não ativar modo de depuração em produção.

Não mostrar detalhes técnicos sensíveis nas mensagens de erro.

Manter as dependências atualizadas.

Adotar proteção contra CSRF nos formulários que modificam dados.

Minimização de dados:

Não solicitar CPF de clientes.

Não exigir informações pessoais desnecessárias.

Utilizar somente os dados essenciais para produtos, pedidos e usuários.

11. Desempenho e portabilidade — RNF03

O sistema deverá ser leve e funcionar em computadores e celulares.

Compatibilidade desejada:

Windows.

Linux.

Android e iOS por navegador.

Chrome, Firefox e Edge atuais.

Meta de desempenho:

A página de produtos deverá carregar seu conteúdo principal em até 3 segundos, considerando a mediana de cinco medições após uma execução de aquecimento.

Cenário de referência:

Celular básico ou intermediário.

Pelo menos 2 GB de RAM.

Conexão móvel de aproximadamente 5 Mbps.

Banco com cerca de 100 produtos fictícios.

Evitar:

Imagens grandes.

Bibliotecas pesadas.

Carregamento desnecessário de registros.

Animações que prejudiquem o desempenho.

Se necessário, implementar paginação, índices no banco e otimização das consultas.

Para implantação online, documentar as dependências e configurações. A hospedagem deve oferecer armazenamento persistente para o SQLite; se isso não for possível, explicar a limitação e considerar PostgreSQL.

Não afirmar que o desempenho foi comprovado sem executar os testes.

12. Acessibilidade

O site deverá ser acessível a pequenos comerciantes com diferentes níveis de familiaridade digital e possíveis dificuldades visuais ou motoras.

Implementar:

Interface responsiva.

Fonte legível.

Contraste suficiente.

Campos com rótulos visíveis.

Navegação por teclado.

Foco visível nos controles.

Botões e áreas de toque de pelo menos 44 × 44 pixels.

Mensagens de erro claras.

Textos que expliquem como corrigir erros.

Alertas com texto e símbolo, sem depender apenas de cores.

Ampliação de texto sem perda das funções essenciais.

As três telas principais devem demonstrar visualmente esses recursos.

A acessibilidade deve ser funcional, não apenas decorativa.

13. Conexão com o ODS

O projeto foi relacionado ao ODS 8 — Trabalho Decente e Crescimento Econômico, especialmente à meta 8.3, voltada ao incentivo ao empreendedorismo e ao desenvolvimento de micro e pequenas empresas.

A contribuição esperada é ajudar pequenos comerciantes a organizar melhor suas atividades.

O sistema não deve prometer aumentar vendas ou resolver problemas econômicos sozinho.

A acessibilidade também faz parte dessa proposta, pois uma ferramenta difícil de utilizar pode excluir comerciantes com pouca familiaridade tecnológica.

O objetivo é permitir que mais pessoas consigam utilizar o sistema de forma simples e autônoma.

14. Fluxo completo de utilização

O fluxo principal deverá funcionar assim:

O comerciante abre o site.

Informa e-mail e senha.

Entra no sistema.

Visualiza as opções principais.

Cadastra um produto, se necessário.

Seleciona um produto para registrar um pedido.

Informa a quantidade.

O sistema verifica o estoque.

O sistema calcula o total.

O comerciante confirma o pedido.

O sistema salva o pedido e atualiza o estoque.

Aparece a mensagem de sucesso.

O comerciante consulta o pedido.

Pode registrar outro pedido ou sair.

Esse fluxo deve funcionar de verdade, com dados persistidos no banco, e não apenas como uma simulação visual.

15. Mensagens do sistema

Utilizar mensagens simples e humanizadas.

Exemplos:

"Produto cadastrado com sucesso!"

"Pedido registrado com sucesso!"

"Preencha o nome do produto."

"Informe um preço maior que zero."

"A quantidade não pode ser negativa."

"Estoque insuficiente."

"Selecione um produto."

"E-mail ou senha incorretos."

"Não foi possível salvar. Tente novamente."

"Nenhum pedido encontrado."

Evitar mensagens técnicas como rastreamentos de erro, comandos SQL ou exceções do servidor.

16. Dados fictícios para demonstração

Criar alguns produtos fictícios:

ProdutoPreçoEstoqueCadernoR$ 15,0020Caneta azulR$ 2,5050LápisR$ 1,5030BorrachaR$ 3,0015Garrafa de águaR$ 4,0025

Criar um pedido demonstrativo:

Pedido: 001
Data: 26/10/2026
Produto: Caderno
Quantidade: 2
Total: R$ 30,00
Status: Concluído

Não utilizar dados pessoais reais.

Os dados fictícios poderão ser carregados por um comando de inicialização para demonstração, sem serem duplicados a cada execução.

17. Validação do projeto

O site deverá permitir que um pequeno comerciante realize tarefas simples durante uma validação remota.

Tarefas previstas:

Acessar o sistema com uma conta de teste.

Cadastrar um produto.

Registrar um pedido.

Consultar o pedido registrado.

Identificar uma mensagem de erro ao informar uma quantidade superior ao estoque.

Preparar o sistema para permitir observar:

Se o usuário conclui cada tarefa.

Quantos erros comete.

Quanto tempo leva.

Se precisa de ajuda.

Se compreende as mensagens.

Se considera o sistema fácil de usar.

Não inventar resultados de testes com participantes reais.

18. O que NÃO deve ser criado

Não incluir:

Pagamento online.

Integração com Pix.

Emissão de nota fiscal.

Integração com WhatsApp.

Cadastro de clientes com CPF.

Relatórios financeiros avançados.

Gráficos de faturamento.

Controle de funcionários complexo.

Inteligência artificial integrada.

Chatbot.

Sistema de entregas.

Rastreamento de encomendas.

Controle de fornecedores.

Planos pagos ou assinaturas.

Funcionalidades de comércio eletrônico para compradores.

Este é um projeto acadêmico de pequeno porte. Não transformar o MVP em um ERP completo.

19. Entregáveis esperados

Quero que você:

Crie o site completo, com interface simples e responsiva.

Implemente as funcionalidades obrigatórias.

Crie o banco de dados e seus relacionamentos.

Faça o login e a proteção das rotas.

Implemente cadastro de produtos e controle de estoque.

Implemente registro e consulta de pedidos.

Adicione validações e mensagens compreensíveis.

Organize o código seguindo a arquitetura escolhida.

Forneça instruções para executar o projeto.

Explique como configurar o ambiente e as variáveis necessárias.

Inclua um arquivo README com as tecnologias, requisitos e procedimentos de execução.

Prepare as três telas principais para capturas de tela acadêmicas.

Use dados fictícios e datas de 2026 nos exemplos.

Não apresente funcionalidades incompletas como se estivessem funcionando.

20. Instrução final

Quero o sistema mais simples possível, mas realmente funcional.

Priorize a seguinte ordem:

Login.

Cadastro de produtos.

Registro de pedidos.

Consulta de pedidos.

Segurança e validação.

Acessibilidade e responsividade.

Filtro de pedidos, somente se houver tempo.

A interface deve ser limpa, com poucos botões, poucos campos e navegação intuitiva.

Evite qualquer complexidade desnecessária.

O resultado final deve parecer um pequeno sistema web brasileiro criado para ajudar comerciantes de bairro a organizar produtos, estoque e pedidos.

Não crie apenas imagens ou telas estáticas. Desenvolva uma aplicação funcional, com front-end, back-end, banco de dados e persistência real, respeitando as decisões técnicas e o escopo acadêmico apresentados acima.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/117665b0-c2b6-530a-953c-55a50400b90f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
