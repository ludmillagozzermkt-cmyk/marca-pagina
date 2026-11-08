/* ==========================================================================
   Marca-Página — pequenos detalhes em JavaScript
   1. Menu mobile · 2. Formulário de contato (demonstrativo)
   3. Resenhas dos leitores (localStorage) · 4. Votação do Clube do Leitor
   ========================================================================== */

(function () {
  "use strict";

  /* Utilitários --------------------------------------------------------------- */
  function el(tag, classe, texto) {
    var n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto) n.textContent = texto;
    return n;
  }

  function lerLocal(chave, padrao) {
    try {
      var valor = JSON.parse(localStorage.getItem(chave));
      return valor === null ? padrao : valor;
    } catch (erro) {
      return padrao;
    }
  }

  function salvarLocal(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
      return true;
    } catch (erro) {
      return false;
    }
  }

  /* 1. MENU MOBILE ---------------------------------------------------------- */
  var botaoMenu = document.querySelector(".menu-botao");
  var nav = document.getElementById("nav-principal");

  if (botaoMenu && nav) {
    botaoMenu.addEventListener("click", function () {
      var aberto = botaoMenu.getAttribute("aria-expanded") === "true";
      botaoMenu.setAttribute("aria-expanded", String(!aberto));
      botaoMenu.setAttribute("aria-label", aberto ? "Abrir menu" : "Fechar menu");
      nav.classList.toggle("aberto", !aberto);
    });

    // Fecha o menu com Esc
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("aberto")) {
        botaoMenu.click();
        botaoMenu.focus();
      }
    });
  }

  /* 2. FORMULÁRIO DE CONTATO ------------------------------------------------
     DEMONSTRATIVO: o site é estático (GitHub Pages) e não tem back-end.
     A carta NÃO é enviada para lugar nenhum; apenas mostramos a confirmação
     e impedimos o recarregamento da página. Para receber as mensagens de
     verdade, seria preciso um serviço como Formspree ou um servidor próprio. */
  var formCarta = document.getElementById("form-carta");

  if (formCarta) {
    var avisoCarta = document.getElementById("aviso-carta");
    formCarta.addEventListener("submit", function (e) {
      e.preventDefault();
      formCarta.reset();
      avisoCarta.hidden = false;
      avisoCarta.focus();
    });
  }

  /* 3. RESENHAS DOS LEITORES ------------------------------------------------
     Também sem back-end: cada resenha fica guardada no navegador de quem a
     escreveu (localStorage). Os textos são inseridos com textContent, nunca
     como HTML, para não executar nada que o visitante digite. */
  function iniciarResenhas() {
    var formResenha = document.getElementById("form-resenha");
    if (!formResenha) return;

    var CHAVE = "marcapagina:resenhas";
    var seletorLivro = document.getElementById("resenha-livro");
    var filtro = document.getElementById("filtro-mural");
    var lista = document.getElementById("mural-lista");
    var vazio = document.getElementById("mural-vazio");
    var avisoResenha = document.getElementById("aviso-resenha");

    // Nomes dos livros, a partir das opções do <select>
    var titulos = {};
    Array.prototype.forEach.call(seletorLivro.options, function (opt) {
      if (opt.value) titulos[opt.value] = opt.textContent;
    });

    // O filtro do mural recebe os mesmos livros
    Array.prototype.forEach.call(seletorLivro.querySelectorAll("optgroup"), function (grupo) {
      filtro.appendChild(grupo.cloneNode(true));
    });

    function desenharMural() {
      var resenhas = lerLocal(CHAVE, []);
      var livroFiltro = filtro.value;
      var visiveis = resenhas.filter(function (r) {
        return !livroFiltro || r.livro === livroFiltro;
      });

      lista.textContent = "";
      vazio.hidden = visiveis.length > 0;

      visiveis
        .slice()
        .reverse()
        .forEach(function (r) {
          var card = el("article", "card resenha-leitor");
          var topo = el("div", "resenha-leitor__topo");
          topo.appendChild(el("span", "avatar", r.nome.charAt(0).toUpperCase()));
          var quem = el("div");
          quem.appendChild(el("p", "resenha-leitor__nome", r.nome));
          quem.appendChild(el("p", "resenha-leitor__livro", "sobre “" + (titulos[r.livro] || r.livro) + "” · " + r.data));
          topo.appendChild(quem);
          card.appendChild(topo);

          var nota = el("span", "nota", "◆".repeat(r.nota) + "◇".repeat(5 - r.nota));
          nota.setAttribute("role", "img");
          nota.setAttribute("aria-label", "Nota " + r.nota + " de 5");
          card.appendChild(nota);
          card.appendChild(el("p", "resenha-leitor__texto", r.texto));

          var remover = el("button", "resenha-leitor__remover", "Remover minha resenha");
          remover.type = "button";
          remover.addEventListener("click", function () {
            salvarLocal(CHAVE, lerLocal(CHAVE, []).filter(function (x) { return x.id !== r.id; }));
            desenharMural();
          });
          card.appendChild(remover);
          lista.appendChild(card);
        });
    }

    formResenha.addEventListener("submit", function (e) {
      e.preventDefault();
      var dados = new FormData(formResenha);
      var nota = Number(dados.get("nota"));

      if (!nota) {
        formResenha.querySelector('input[name="nota"]').focus();
        return;
      }

      var resenhas = lerLocal(CHAVE, []);
      resenhas.push({
        id: Date.now(),
        livro: dados.get("livro"),
        nome: String(dados.get("nome") || "").trim(),
        nota: nota,
        texto: String(dados.get("texto") || "").trim(),
        data: new Date().toLocaleDateString("pt-BR")
      });

      avisoResenha.hidden = false;
      avisoResenha.textContent = salvarLocal(CHAVE, resenhas)
        ? "Sua resenha foi pendurada na estante! Ela aparece no mural ao lado."
        : "Não foi possível salvar neste navegador (o armazenamento local está bloqueado).";

      filtro.value = "";
      formResenha.reset();
      desenharMural();
    });

    filtro.addEventListener("change", desenharMural);

    // Links "Escrever minha resenha" já escolhem o livro no formulário
    document.querySelectorAll(".link-resenha[data-livro]").forEach(function (link) {
      link.addEventListener("click", function () {
        seletorLivro.value = link.getAttribute("data-livro");
        avisoResenha.hidden = true;
      });
    });

    desenharMural();
  }

  iniciarResenhas();

  /* 4. VOTAÇÃO DO CLUBE DO LEITOR -------------------------------------------
     Regras:
       • A cada rodada, 3 alas (gêneros) disputam o livro do próximo encontro.
       • Cada ala concorre com um livro do acervo que o Clube ainda não leu.
       • A ala vencedora fica "em descanso" pelas próximas 3 rodadas.
     DEMONSTRATIVO: sem back-end, o voto fica salvo só neste navegador.
     O botão "Encerrar rodada" simula o fim da votação para mostrar as regras.
     Para atualizar o site real a cada mês, basta acrescentar a ala e o livro
     vencedores em HISTORICO (a rodada seguinte é calculada sozinha). */
  function iniciarVotacao() {
    var area = document.getElementById("votacao-opcoes");
    if (!area) return;

    var DESCANSO = 3;
    var CHAVE = "marcapagina:votacao";
    var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
      "agosto", "setembro", "outubro", "novembro", "dezembro"];

    var GENEROS = [
      { id: "romance", nome: "Romance", livros: [
        ["e-assim-que-acaba", "É Assim que Acaba", "Colleen Hoover"],
        ["a-hipotese-do-amor", "A Hipótese do Amor", "Ali Hazelwood"],
        ["como-eu-era-antes-de-voce", "Como Eu Era Antes de Você", "Jojo Moyes"],
        ["orgulho-e-preconceito", "Orgulho e Preconceito", "Jane Austen"]] },
      { id: "fantasia", nome: "Fantasia", livros: [
        ["eragon", "Eragon", "Christopher Paolini"],
        ["harry-potter-e-a-pedra-filosofal", "Harry Potter e a Pedra Filosofal", "J. K. Rowling"],
        ["a-rainha-vermelha", "A Rainha Vermelha", "Victoria Aveyard"],
        ["o-nome-do-vento", "O Nome do Vento", "Patrick Rothfuss"]] },
      { id: "suspense", nome: "Suspense e Mistério", livros: [
        ["a-paciente-silenciosa", "A Paciente Silenciosa", "Alex Michaelides"],
        ["verity", "Verity", "Colleen Hoover"],
        ["e-nao-sobrou-nenhum", "E Não Sobrou Nenhum", "Agatha Christie"],
        ["o-homem-de-giz", "O Homem de Giz", "C. J. Tudor"]] },
      { id: "terror", nome: "Terror", livros: [
        ["it-a-coisa", "It: A Coisa", "Stephen King"],
        ["o-iluminado", "O Iluminado", "Stephen King"],
        ["a-assombracao-da-casa-da-colina", "A Assombração da Casa da Colina", "Shirley Jackson"],
        ["o-exorcista", "O Exorcista", "William Peter Blatty"]] },
      { id: "drama", nome: "Drama", livros: [
        ["a-menina-que-roubava-livros", "A Menina que Roubava Livros", "Markus Zusak"],
        ["extraordinario", "Extraordinário", "R. J. Palacio"],
        ["a-culpa-e-das-estrelas", "A Culpa é das Estrelas", "John Green"],
        ["o-pequeno-principe", "O Pequeno Príncipe", "Antoine de Saint-Exupéry"]] },
      { id: "ficcao-cientifica", nome: "Ficção Científica e Distopia", livros: [
        ["jogos-vorazes", "Jogos Vorazes", "Suzanne Collins"],
        ["1984", "1984", "George Orwell"],
        ["fahrenheit-451", "Fahrenheit 451", "Ray Bradbury"],
        ["divergente", "Divergente", "Veronica Roth"]] },
      { id: "romantasia", nome: "Romance de Fantasia", livros: [
        ["quarta-asa", "Quarta Asa", "Rebecca Yarros"],
        ["corte-de-espinhos-e-rosas", "Corte de Espinhos e Rosas", "Sarah J. Maas"],
        ["o-principe-cruel", "O Príncipe Cruel", "Holly Black"],
        ["a-serpente-e-as-asas-feitas-de-noite", "A Serpente e as Asas Feitas de Noite", "Carissa Broadbent"]] },
      { id: "classicos", nome: "Literatura Clássica", livros: [
        ["dom-casmurro", "Dom Casmurro", "Machado de Assis"],
        ["o-morro-dos-ventos-uivantes", "O Morro dos Ventos Uivantes", "Emily Brontë"],
        ["frankenstein", "Frankenstein", "Mary Shelley"],
        ["jane-eyre", "Jane Eyre", "Charlotte Brontë"]] },
      { id: "aventura", nome: "Aventura", livros: [
        ["a-ilha-do-tesouro", "A Ilha do Tesouro", "Robert Louis Stevenson"],
        ["as-cronicas-de-narnia-o-leao-a-feiticeira-e-o-guarda-roupa", "As Crônicas de Nárnia: O Leão, a Feiticeira e o Guarda-Roupa", "C. S. Lewis"],
        ["o-hobbit", "O Hobbit", "J. R. R. Tolkien"],
        ["robinson-crusoe", "Robinson Crusoé", "Daniel Defoe"]] },
      { id: "brasileira", nome: "Literatura Brasileira", livros: [
        ["torto-arado", "Torto Arado", "Itamar Vieira Junior"],
        ["a-hora-da-estrela", "A Hora da Estrela", "Clarice Lispector"],
        ["capitaes-da-areia", "Capitães da Areia", "Jorge Amado"],
        ["o-cortico", "O Cortiço", "Aluísio Azevedo"]] }
    ];

    // Livros sem capa encontrada usam a capa estilizada em CSS
    var SEM_CAPA = ["a-serpente-e-as-asas-feitas-de-noite"];

    // Encontros já realizados ou definidos (ala e livro vencedores, em ordem).
    // Para o site real: acrescente aqui o vencedor de cada nova rodada.
    var HISTORICO = [
      { mes: 8, ano: 2026, genero: "aventura", livro: "o-hobbit" },
      { mes: 9, ano: 2026, genero: "terror", livro: "o-iluminado" },
      { mes: 10, ano: 2026, genero: "classicos", livro: "dom-casmurro" },
      { mes: 11, ano: 2026, genero: "drama", livro: "a-menina-que-roubava-livros" }
    ];

    var genero = {};
    GENEROS.forEach(function (g) { genero[g.id] = g; });

    var elRodada = document.getElementById("votacao-rodada");
    var elEncontro = document.getElementById("votacao-encontro");
    var elPrazo = document.getElementById("votacao-prazo");
    var elDescanso = document.getElementById("votacao-descanso");
    var elHistorico = document.getElementById("votacao-historico");
    var aviso = document.getElementById("aviso-voto");
    var botaoEncerrar = document.getElementById("votacao-encerrar");
    var botaoReiniciar = document.getElementById("votacao-reiniciar");

    // Estado local: rodadas encerradas na demonstração + voto atual
    function estado() {
      return lerLocal(CHAVE, { encerradas: [], voto: null });
    }

    function historicoCompleto(st) {
      return HISTORICO.concat(st.encerradas);
    }

    // Mês/ano da rodada seguinte ao último encontro do histórico
    function proximoMes(hist) {
      var ultimo = hist[hist.length - 1];
      var mes = ultimo.mes + 1;
      return { mes: mes % 12, ano: ultimo.ano + Math.floor(mes / 12) };
    }

    // Encontros acontecem no terceiro sábado de cada mês, às 19h
    function terceiroSabado(mes, ano) {
      var d = new Date(ano, mes, 1);
      var ate = (6 - d.getDay() + 7) % 7;
      return new Date(ano, mes, 1 + ate + 14);
    }

    function dataPorExtenso(d) {
      return d.getDate() + " de " + MESES[d.getMonth()] + " de " + d.getFullYear();
    }

    // Embaralhamento com semente: todos os visitantes veem as mesmas 3 alas
    function sorteio(lista, semente) {
      var copia = lista.slice();
      var s = semente;
      for (var i = copia.length - 1; i > 0; i--) {
        s = (s * 9301 + 49297) % 233280;
        var j = Math.floor((s / 233280) * (i + 1));
        var tmp = copia[i];
        copia[i] = copia[j];
        copia[j] = tmp;
      }
      return copia;
    }

    function emDescanso(hist) {
      return hist.slice(-DESCANSO).map(function (h) { return h.genero; });
    }

    function candidatos(hist) {
      var alvo = proximoMes(hist);
      var semente = alvo.ano * 12 + alvo.mes;
      var bloqueadas = emDescanso(hist);
      var lidos = hist.map(function (h) { return h.livro; });

      var livres = GENEROS.filter(function (g) { return bloqueadas.indexOf(g.id) === -1; });
      return sorteio(livres, semente).slice(0, 3).map(function (g, i) {
        var naoLidos = g.livros.filter(function (l) { return lidos.indexOf(l[0]) === -1; });
        var opcoes = naoLidos.length ? naoLidos : g.livros;
        var livro = opcoes[(semente + i) % opcoes.length];
        return { genero: g.id, livro: livro };
      });
    }

    function capa(livro) {
      if (SEM_CAPA.indexOf(livro[0]) !== -1) {
        var falso = el("div", "capa capa-fallback", livro[1]);
        falso.setAttribute("role", "img");
        falso.setAttribute("aria-label", "Capa ilustrativa do livro " + livro[1] + ", de " + livro[2]);
        falso.appendChild(el("small", "", livro[2]));
        return falso;
      }
      var img = el("img", "capa");
      img.src = "img/capas/" + livro[0] + ".jpg";
      img.alt = "Capa do livro " + livro[1] + ", de " + livro[2];
      img.width = 200;
      img.height = 300;
      img.loading = "lazy";
      return img;
    }

    function tituloDoLivro(slug) {
      for (var i = 0; i < GENEROS.length; i++) {
        for (var j = 0; j < GENEROS[i].livros.length; j++) {
          if (GENEROS[i].livros[j][0] === slug) return GENEROS[i].livros[j][1];
        }
      }
      return slug;
    }

    function desenhar() {
      var st = estado();
      var hist = historicoCompleto(st);
      var alvo = proximoMes(hist);
      var encontro = terceiroSabado(alvo.mes, alvo.ano);
      var prazo = new Date(encontro.getTime() - 14 * 24 * 60 * 60 * 1000);
      var lista = candidatos(hist);
      var votoAtual = st.voto;

      elRodada.textContent = MESES[alvo.mes] + " de " + alvo.ano;
      elEncontro.textContent = "Sábado, " + dataPorExtenso(encontro) + ", às 19h";
      elPrazo.textContent = dataPorExtenso(prazo);

      // Cartões das 3 alas na disputa
      area.textContent = "";
      lista.forEach(function (c) {
        var g = genero[c.genero];
        var escolhido = votoAtual && votoAtual.genero === c.genero;
        var card = el("article", "card opcao-voto" + (escolhido ? " opcao-voto--escolhida" : ""));
        if (escolhido) card.appendChild(el("span", "opcao-voto__selo", "Seu voto"));
        var moldura = el("div", "opcao-voto__capa");
        moldura.appendChild(capa(c.livro));
        card.appendChild(moldura);
        card.appendChild(el("span", "sobretitulo", "Ala " + g.nome));
        card.appendChild(el("h3", "", c.livro[1]));
        card.appendChild(el("p", "livro__autor", c.livro[2]));

        var botao = el("button", "btn btn--pequeno" + (escolhido ? " btn--claro-escuro" : ""),
          escolhido ? "Voto registrado ✓" : (votoAtual ? "Mudar meu voto" : "Votar neste livro"));
        botao.type = "button";
        botao.setAttribute("aria-pressed", escolhido ? "true" : "false");
        botao.addEventListener("click", function () {
          var novo = estado();
          novo.voto = { genero: c.genero, livro: c.livro[0] };
          salvarLocal(CHAVE, novo);
          aviso.hidden = false;
          aviso.textContent = "Voto registrado: " + c.livro[1] + " (" + g.nome + "). Você pode mudar até o fim da votação.";
          desenhar();
        });
        card.appendChild(botao);
        area.appendChild(card);
      });

      // Alas em descanso (as 3 últimas vencedoras)
      elDescanso.textContent = "";
      hist.slice(-DESCANSO).reverse().forEach(function (h, i) {
        var item = el("li");
        item.appendChild(el("strong", "", genero[h.genero].nome));
        var faltam = DESCANSO - i;
        item.appendChild(el("span", "descanso__volta", faltam === 1 ? "volta na próxima rodada" : "volta em " + faltam + " rodadas"));
        elDescanso.appendChild(item);
      });

      // Histórico das últimas escolhas
      elHistorico.textContent = "";
      hist.slice(-6).reverse().forEach(function (h) {
        var item = el("li");
        item.appendChild(el("span", "historico__mes", MESES[h.mes].slice(0, 3) + "/" + String(h.ano).slice(2)));
        var texto = el("span");
        texto.appendChild(el("strong", "", tituloDoLivro(h.livro)));
        texto.appendChild(document.createTextNode(" · " + genero[h.genero].nome));
        item.appendChild(texto);
        elHistorico.appendChild(item);
      });

      botaoEncerrar.disabled = !votoAtual;
      botaoReiniciar.hidden = st.encerradas.length === 0 && !votoAtual;
    }

    // Demonstração: o voto deste navegador decide a rodada
    botaoEncerrar.addEventListener("click", function () {
      var st = estado();
      if (!st.voto) return;
      var alvo = proximoMes(historicoCompleto(st));
      st.encerradas.push({ mes: alvo.mes, ano: alvo.ano, genero: st.voto.genero, livro: st.voto.livro });
      var vencedor = st.voto;
      st.voto = null;
      salvarLocal(CHAVE, st);
      aviso.hidden = false;
      aviso.textContent = "Rodada encerrada! " + tituloDoLivro(vencedor.livro) + " venceu, e a ala " +
        genero[vencedor.genero].nome + " descansa pelas próximas " + DESCANSO + " rodadas. Nova votação aberta.";
      desenhar();
    });

    botaoReiniciar.addEventListener("click", function () {
      salvarLocal(CHAVE, { encerradas: [], voto: null });
      aviso.hidden = true;
      desenhar();
    });

    desenhar();
  }

  iniciarVotacao();
})();
