[README.md](https://github.com/user-attachments/files/34551435/README.md)
# Marca-Página

> Um porto seguro para leitores virtuais.

Blog estático desenvolvido para a **AOP2**. Tema: **Livros**.

## Descrição

**A dor:** leitores na internet se sentem sozinhos e perdidos. As recomendações estão espalhadas em algoritmos, vídeos curtos e listas genéricas. É difícil descobrir o próximo livro e mais difícil ainda encontrar outras pessoas para conversar sobre ele.

**A solução:** o Marca-Página funciona como uma biblioteca antiga online. Oferece um acervo organizado por gênero, resenhas honestas e um espaço de encontro entre leitores, o **Clube do Leitor**. Os visitantes também podem deixar as próprias resenhas. O nome traduz a proposta: o lugar onde você para e sempre volta.

## Páginas

| Página | Arquivo | Conteúdo |
| --- | --- | --- |
| Home | `index.html` | Apresentação do blog, destaques com imagens clicáveis, citação e chamada para o Clube |
| Gêneros | `generos.html` | As 10 alas da biblioteca, com descrição, 4 títulos e link para a estante |
| Livros | `livros.html` | Acervo com 40 livros em 10 estantes, resenhas originais e mural de resenhas dos leitores |
| Clube do Leitor | `clube.html` | O que é o Clube, livro do mês, próximos encontros, como participar e recomendações da equipe |
| Contatos | `contatos.html` | Formulário de carta (demonstrativo), redes sociais e equipe |

## Tecnologias

- HTML5 semântico
- CSS3 puro, em um único arquivo (`css/style.css`), com variáveis, Grid, Flexbox e layout mobile first
- JavaScript mínimo (`js/main.js`) para o menu mobile, a confirmação do formulário e as resenhas dos leitores
- Google Fonts: Cinzel e Cormorant Garamond

Sem frameworks, sem build e sem dependências.

## Estrutura

```
/
├── index.html
├── generos.html
├── livros.html
├── clube.html
├── contatos.html
├── css/style.css
├── js/main.js
├── img/
│   ├── capas/       (39 capas de livros)
│   ├── destaques/   (imagens dos cards da Home)
│   └── ui/          (logo, favicon e foto do topo da Home)
└── README.md
```

## Como rodar localmente

Abra a pasta no VS Code e use a extensão **Live Server**: clique com o botão direito em `index.html` e escolha "Open with Live Server". Outra opção é rodar `npx serve .` na pasta do projeto.

## Observações

- **Formulário de contato:** é demonstrativo. Não existe back-end, então a carta não é enviada para lugar nenhum. O site apenas mostra a mensagem de confirmação.
- **Resenhas dos leitores:** ficam salvas no navegador de quem as escreveu, com `localStorage`. Para formar um mural compartilhado entre todos os visitantes, seria preciso um serviço externo, como o Giscus (GitHub Discussions).
- **Votação do Clube do Leitor:** a cada rodada, 3 alas são sorteadas entre as disponíveis, cada uma com um livro que o Clube ainda não leu. A ala vencedora fica 3 rodadas sem concorrer. Os votos são demonstrativos e ficam salvos no navegador. Para atualizar o site, acrescente o vencedor de cada mês em `HISTORICO`, em `js/main.js`. A rodada seguinte é calculada automaticamente.
- **Capas:** foram obtidas na [Open Library](https://openlibrary.org), com preferência pela edição brasileira, e conferidas uma a uma.
  - Capa não encontrada (usa a capa estilizada em CSS): **A Serpente e as Asas Feitas de Noite**, de Carissa Broadbent.
  - Capas da edição original em inglês, porque não havia edição brasileira disponível na fonte: A Hipótese do Amor, Como Eu Era Antes de Você, Quarta Asa, O Príncipe Cruel, Jane Eyre, A Ilha do Tesouro e As Crônicas de Nárnia.
  - Capa da edição portuguesa: Dom Casmurro (Projecto Adamastor).
- **Fotos:** vêm do [Unsplash](https://unsplash.com), sob a licença gratuita do Unsplash.
- As capas são usadas em contexto acadêmico. Autorizações serão tratadas caso o site seja publicado comercialmente.

## Dados acadêmicos

- **Instituição:** Universidade Vila Velha
- **Curso:** Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas
- **Disciplina:** Experiência e Interfaces com Usuário

## Integrantes

| Nome completo | Matrícula |
| --- | --- |
| Ludmilla Gozzer dos Santos | 202531855 |
| Danillo Martins Peruch | 202531873 |

## Site publicado

🔗 **Site:** https://ludmillagozzermkt-cmyk.github.io/marca-pagina/

📁 **Repositório:** https://github.com/ludmillagozzermkt-cmyk/marca-pagina

---

© 2026 Marca-Página — Projeto acadêmico
