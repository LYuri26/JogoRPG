// Adicionar no início do arquivo classes.js, antes da definição do objeto Personagens
const PenalidadesAtivas = {
  player1: { defesa: 0, esquiva: 0, dano: 0 },
  player2: { defesa: 0, esquiva: 0, dano: 0 },
};

window.PenalidadesAtivas = PenalidadesAtivas; // Torna global se necessário

// Objeto global para armazenar personagens
window.Personagens = {
  // Todas as classes disponíveis
  classesDisponiveis: [
    "Guerreiro",
    "Ladino",
    "Mago",
    "Paladino",
    "Bárbaro",
    "Arqueiro",
    "Monge",
    "Cavaleiro",
    "Assassino",
    "Druida",
    "Gladiador",
    "Caçador",
    "Mercenário",
    "Feiticeiro",
    "Samurai",
  ],

  resetTurn: function (character) {
    if (!character) return;

    // Reseta penalidades ativas
    character.penaltyActive = false;

    // Atualiza flag do Samurai
    if (character.classe === "Samurai") {
      character.usedAbilityLastTurn = false;
    }

    // Atualiza interface
    this.atualizarInterfacePersonagem(
      character.playerId === "player1" ? 1 : 2,
      character
    );
  },

  // Configurações completas para todas as classes
  configClasses: {
    Guerreiro: {
      vida: 30,
      danoBase: 4,
      armadura: 6,
      esquiva: 1,
      stamina: 6,
      dadoEspecial: "D8",
      descricao: "Especialista em combate corpo a corpo",
    },
    Ladino: {
      vida: 25,
      danoBase: 3,
      armadura: 3,
      esquiva: 4,
      stamina: 6,
      dadoEspecial: "D10",
      descricao: "Mestre em ataques furtivos",
    },
    Mago: {
      vida: 20,
      danoBase: 5,
      armadura: 2,
      esquiva: 3,
      stamina: 8,
      dadoEspecial: "D12",
      descricao: "Poderoso conjurador de magias",
    },
    Paladino: {
      vida: 28,
      danoBase: 4,
      armadura: 5,
      esquiva: 2,
      stamina: 6,
      dadoEspecial: "D8",
      descricao: "Cavaleiro sagrado com bênçãos divinas",
    },
    Bárbaro: {
      vida: 32,
      danoBase: 5,
      armadura: 4,
      esquiva: 2,
      stamina: 6,
      dadoEspecial: "D10",
      descricao: "Guerreiro selvagem com fúria incontrolável",
    },
    Arqueiro: {
      vida: 24,
      danoBase: 4,
      armadura: 3,
      esquiva: 5,
      stamina: 6,
      dadoEspecial: "D8",
      descricao: "Precisão mortal à distância",
    },
    Monge: {
      vida: 26,
      danoBase: 3,
      armadura: 3,
      esquiva: 6,
      stamina: 6,
      dadoEspecial: "D6",
      descricao: "Mestre em artes marciais",
    },
    Cavaleiro: {
      vida: 30,
      danoBase: 4,
      armadura: 7,
      esquiva: 1,
      stamina: 6,
      dadoEspecial: "D8",
      descricao: "Defensor com armadura pesada",
    },
    Assassino: {
      vida: 22,
      danoBase: 6,
      armadura: 2,
      esquiva: 5,
      stamina: 6,
      dadoEspecial: "D12",
      descricao: "Especialista em golpes letais",
    },
    Druida: {
      vida: 26,
      danoBase: 3,
      armadura: 3,
      esquiva: 3,
      stamina: 6,
      dadoEspecial: "D8",
      descricao: "Guardião da natureza com poderes de cura",
    },
    Gladiador: {
      vida: 28,
      danoBase: 4,
      armadura: 4,
      esquiva: 3,
      stamina: 6,
      dadoEspecial: "D6",
      descricao: "Lutador de arena versátil",
    },
    Caçador: {
      vida: 25,
      danoBase: 4,
      armadura: 3,
      esquiva: 4,
      stamina: 6,
      dadoEspecial: "D12",
      descricao: "Rastreador e sobrevivente",
    },
    Mercenário: {
      vida: 27,
      danoBase: 4,
      armadura: 4,
      esquiva: 3,
      stamina: 6,
      dadoEspecial: "D6",
      descricao: "Lutador prático e adaptável",
    },
    Feiticeiro: {
      vida: 18,
      danoBase: 6,
      armadura: 1,
      esquiva: 2,
      stamina: 6,
      dadoEspecial: "D20",
      descricao: "Manipulador de energias arcanas",
    },
    Samurai: {
      vida: 27,
      danoBase: 5,
      armadura: 5,
      esquiva: 3,
      stamina: 6,
      dadoEspecial: "D10",
      descricao: "Espadachim disciplinado e preciso",
    },
  },

  // Penalidades completas para todas as classes
  penalidadesClasses: {
    Guerreiro: "-1 defesa no turno seguinte",
    Ladino: "Só pode ser usado a cada 2 turnos",
    Mago: "-1 esquiva no turno seguinte",
    Paladino: "-2 no próximo ataque",
    Bárbaro: "Só pode ser usado uma vez por combate",
    Arqueiro: "-1 esquiva no turno seguinte",
    Monge: "-1 dano no próximo ataque",
    Cavaleiro: "Não pode atacar no turno seguinte",
    Assassino: "Custa 2 Stamina adicionais se falhar",
    Druida: "Só pode ser usado 3 vezes por combate",
    Gladiador: "Não pode usar outra habilidade no próximo turno",
    Caçador: "Só pode ser usado a cada 3 turnos",
    Mercenário: "-1 esquiva no turno seguinte",
    Feiticeiro: "Reduz 2 de vida ao usar",
    Samurai: "Só pode ser usado 2 vezes por combate",
  },

  // Custos completos de habilidades para todas as classes
  custosHabilidades: {
    Guerreiro: 2,
    Ladino: 3,
    Mago: 3,
    Paladino: 2,
    Bárbaro: 3,
    Arqueiro: 2,
    Monge: 2,
    Cavaleiro: 3,
    Assassino: 3,
    Druida: 3,
    Gladiador: 2,
    Caçador: 3,
    Mercenário: 2,
    Feiticeiro: 3,
    Samurai: 3,
  },

  // Usos especiais completos para todas as classes
  usosEspeciais: {
    Ladino: 2,
    Bárbaro: 1,
    Samurai: 2,
    Assassino: 3,
    Druida: 3,
    Paladino: 2,
    Mago: 2,
    Feiticeiro: 1,
    Caçador: 2,
    Cavaleiro: 1,
  },

  /**
   * Carrega os scripts dos personagens selecionados
   * @param {string} p1Char - Personagem do jogador 1
   * @param {string} p2Char - Personagem do jogador 2
   * @param {string} p1Name - Nome do jogador 1
   * @param {string} p2Name - Nome do jogador 2
   */
  carregarPersonagens: function (p1Char, p2Char, p1Name, p2Name) {
    // Valida personagens
    p1Char = this.validarPersonagem(p1Char, "Guerreiro");
    p2Char = this.validarPersonagem(p2Char, "Ladino");

    // Carrega cada personagem
    this.carregarPersonagem(p1Char, "player1", p1Name);
    this.carregarPersonagem(p2Char, "player2", p2Name);
  },

  /**
   * Valida um personagem e retorna o padrão se inválido
   */
  validarPersonagem: function (personagem, padrao) {
    return this.classesDisponiveis.includes(personagem) ? personagem : padrao;
  },

  /**
   * Carrega um personagem específico
   */
  carregarPersonagem: function (nomePersonagem, playerId, playerName) {
    const scriptSrc = `./assets/js/personagens/${nomePersonagem.toLowerCase()}.js`;

    // Verifica se já está carregado
    if (document.querySelector(`script[src="${scriptSrc}"]`)) {
      console.log(`${nomePersonagem} já carregado`);
      this.inicializarPersonagem(playerId, playerName);
      return;
    }

    // Carrega o script
    const script = document.createElement("script");
    script.src = scriptSrc;

    script.onload = () => {
      console.log(`${nomePersonagem} carregado com sucesso`);
      this.inicializarPersonagem(playerId, playerName);
    };

    script.onerror = () => {
      console.error(`Falha ao carregar ${scriptSrc}`);
      this.carregarPersonagemPadrao(playerId, playerName);
    };

    document.body.appendChild(script);
  },

  /**
   * Inicializa um personagem com valores padrão
   */
  inicializarPersonagem: function (playerId, playerName) {
    const personagem = window[playerId + "Character"] || {};
    const classe =
      personagem.classe || (playerId === "player1" ? "Guerreiro" : "Ladino");
    const config = this.configClasses[classe] || this.configClasses.Guerreiro;

    // Define propriedades básicas
    personagem.classe = classe;
    personagem.nome = playerName || config.descricao;
    personagem.vida = personagem.vida || config.vida;
    personagem.vidaMaxima = personagem.vidaMaxima || config.vida;
    personagem.danoBase = personagem.danoBase || config.danoBase;
    personagem.armadura = personagem.armadura || config.armadura;
    personagem.esquiva = personagem.esquiva || config.esquiva;
    personagem.staminaMana = personagem.staminaMana || config.stamina;
    personagem.staminaManaMax = personagem.staminaManaMax || config.stamina;
    personagem.dadoEspecial = personagem.dadoEspecial || config.dadoEspecial;

    // Inicializa valores base e usos especiais
    personagem.armaduraBase = personagem.armadura;
    personagem.esquivaBase = personagem.esquiva;
    personagem.danoBaseBase = personagem.danoBase;
    personagem.usosRestantes = this.usosEspeciais[classe] || 0;
    personagem.foiAtacado = false;

    // Atualiza a interface
    this.atualizarInterfacePersonagem(playerId, personagem);
  },

  /**
   * Carrega um personagem padrão em caso de erro
   */
  carregarPersonagemPadrao: function (playerId, playerName) {
    const classePadrao = playerId === "player1" ? "Guerreiro" : "Ladino";
    const personagem = {
      classe: classePadrao,
      nome: playerName || this.configClasses[classePadrao].descricao,
      ...this.configClasses[classePadrao],
    };

    window[playerId + "Character"] = personagem;
    this.inicializarPersonagem(playerId, playerName);
  },

  /**
   * Atualiza a interface do personagem
   */
  atualizarInterfacePersonagem: function (playerId, personagem) {
    const numJogador = playerId === "player1" ? 1 : 2;

    // Atualiza elementos básicos - usando os IDs corretos do HTML
    document.getElementById(`player${numJogador}Character`).textContent =
      personagem.nome || `Jogador ${numJogador}`;
    document.getElementById(`player${numJogador}Vida`).textContent =
      personagem.vida;
    document.getElementById(
      `player${numJogador}Stamina`
    ).textContent = `${personagem.staminaMana}/${personagem.staminaManaMax}`;
    document.getElementById(`player${numJogador}Dano`).textContent =
      personagem.danoBase;
    document.getElementById(`player${numJogador}Armadura`).textContent =
      personagem.armadura;
    document.getElementById(`player${numJogador}Esquiva`).textContent =
      personagem.esquiva;
    document.getElementById(`player${numJogador}DadoEspecial`).textContent =
      personagem.dadoEspecial;
    document.getElementById(
      `player${numJogador}Custo`
    ).textContent = `${this.obterCustoHabilidade(personagem.classe)} Stamina`;

    // Atualiza barra de vida
    this.atualizarBarraVida(numJogador, personagem.vida, personagem.vidaMaxima);
  },

  /**
   * Atualiza a barra de vida visual
   */
  atualizarBarraVida: function (jogador, vidaAtual, vidaMaxima) {
    const porcentagemVida = (vidaAtual / vidaMaxima) * 100;
    const barraVida = document.getElementById(`player${jogador}HealthBar`);

    if (!barraVida) return;

    barraVida.style.width = `${porcentagemVida}%`;

    // Atualiza cor conforme a vida
    const cores = ["bg-success", "bg-warning", "bg-danger"];
    let novaCor = "bg-success";

    if (porcentagemVida < 20) novaCor = "bg-danger";
    else if (porcentagemVida < 50) novaCor = "bg-warning";

    barraVida.classList.remove(...cores);
    barraVida.classList.add(novaCor);
  },

  /**
   * Aplica penalidades ao personagem
   */
  aplicarPenalidades: function (jogador) {
    const numJogador =
      typeof jogador === "number" ? jogador : jogador === "player1" ? 1 : 2;
    const personagem =
      numJogador === 1 ? window.player1Character : window.player2Character;
    const penalidades = PenalidadesAtivas[`player${numJogador}`];

    // Aplica penalidades aos valores base
    personagem.armadura = Math.max(
      0,
      (personagem.armaduraBase || personagem.armadura) - penalidades.defesa
    );
    personagem.esquiva = Math.max(
      0,
      (personagem.esquivaBase || personagem.esquiva) - penalidades.esquiva
    );
    personagem.danoBase = Math.max(
      1,
      (personagem.danoBaseBase || personagem.danoBase) - penalidades.dano
    );

    // Atualiza interface e reseta penalidades
    this.atualizarPenalidadesInterface(numJogador);
    PenalidadesAtivas[`player${numJogador}`] = {
      defesa: 0,
      esquiva: 0,
      dano: 0,
    };
  },

  /**
   * Atualiza a interface de penalidades
   */
  atualizarPenalidadesInterface: function (jogador) {
    const personagem =
      jogador === 1 ? window.player1Character : window.player2Character;
    const penalidades = PenalidadesAtivas[`player${jogador}`];

    // Atualiza valores principais
    document.getElementById(`player${jogador}Armadura`).textContent =
      personagem.armadura;
    document.getElementById(`player${jogador}Esquiva`).textContent =
      personagem.esquiva;
    document.getElementById(`player${jogador}Dano`).textContent =
      personagem.danoBase;

    // Atualiza indicadores de penalidade
    this.atualizarIndicadorPenalidade(jogador, "Armadura", penalidades.defesa);
    this.atualizarIndicadorPenalidade(jogador, "Esquiva", penalidades.esquiva);

    // Atualiza mensagem consolidada
    this.atualizarMensagemPenalidades(jogador, penalidades);
  },

  /**
   * Atualiza um indicador de penalidade específico
   */
  atualizarIndicadorPenalidade: function (jogador, tipo, valor) {
    const elemento = document.getElementById(
      `player${jogador}${tipo}Penalidade`
    );
    if (elemento) {
      elemento.textContent = valor > 0 ? `-${valor}` : "";
      elemento.style.display = valor > 0 ? "inline" : "none";
    }
  },

  /**
   * Atualiza a mensagem de penalidades ativas
   */
  atualizarMensagemPenalidades: function (jogador, penalidades) {
    const elemento = document.getElementById(`player${jogador}PenalidadeAtiva`);
    if (!elemento) return;

    const mensagens = [];
    if (penalidades.defesa > 0) mensagens.push(`Defesa -${penalidades.defesa}`);
    if (penalidades.esquiva > 0)
      mensagens.push(`Esquiva -${penalidades.esquiva}`);
    if (penalidades.dano > 0) mensagens.push(`Dano -${penalidades.dano}`);

    elemento.textContent = mensagens.length ? mensagens.join(", ") : "Nenhuma";
  },

  /**
   * Registra uma nova penalidade
   */
  registrarPenalidade: function (jogador, tipo, valor) {
    const numJogador =
      typeof jogador === "number" ? jogador : jogador === "player1" ? 1 : 2;
    PenalidadesAtivas[`player${numJogador}`][tipo] += valor;
    this.atualizarPenalidadesInterface(numJogador);
  },

  /**
   * Obtém a descrição da penalidade para uma classe
   */
  obterDescricaoPenalidade: function (classe) {
    return this.penalidadesClasses[classe] || "-";
  },

  /**
   * Obtém o custo da habilidade para uma classe
   */
  obterCustoHabilidade: function (classe) {
    return this.custosHabilidades[classe] || "-";
  },
};

// Inicializa o sistema de personagens
document.addEventListener("DOMContentLoaded", function () {
  // Garante que o objeto global existe
  if (!window.Personagens) {
    window.Personagens = Personagens;
  }
});
