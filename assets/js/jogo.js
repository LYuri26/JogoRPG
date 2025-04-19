document.addEventListener("DOMContentLoaded", function () {
  // Inicialização do tooltip do Bootstrap
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });

  if (window.personagensCarregados) return;
  window.personagensCarregados = true;

  // Recupera e processa os dados dos jogadores
  try {
    const player1Data = JSON.parse(localStorage.getItem("player1Character"));
    const player2Data = JSON.parse(localStorage.getItem("player2Character"));
    const player1Name = localStorage.getItem("player1Name")?.trim();
    const player2Name = localStorage.getItem("player2Name")?.trim();

    if (!player1Data || !player2Data || !player1Name || !player2Name) {
      throw new Error("Dados dos jogadores incompletos");
    }

    // Cria os objetos de personagem no formato esperado
    window.player1Character = {
      classe: player1Data.title,
      nome: player1Data.name,
      vida: player1Data.life,
      vidaMaxima: player1Data.life,
      danoBase: player1Data.damage,
      armadura: player1Data.armor,
      esquiva: player1Data.dodge,
      staminaMana: player1Data.stamina,
      staminaManaMax: player1Data.stamina,
      dadoEspecial: player1Data.specialDice,
      custoStamina: player1Data.cost,
      penalidade: player1Data.penalty,
      // Propriedades específicas de classes
      usosRestantes: player1Data.title === "Ladino" ? 2 : null,
      foiAtacado: false,
    };

    window.player2Character = {
      classe: player2Data.title,
      nome: player2Data.name,
      vida: player2Data.life,
      vidaMaxima: player2Data.life,
      danoBase: player2Data.damage,
      armadura: player2Data.armor,
      esquiva: player2Data.dodge,
      staminaMana: player2Data.stamina,
      staminaManaMax: player2Data.stamina,
      dadoEspecial: player2Data.specialDice,
      custoStamina: player2Data.cost,
      penalidade: player2Data.penalty,
      // Propriedades específicas de classes
      usosRestantes: player2Data.title === "Ladino" ? 2 : null,
      foiAtacado: false,
    };

    // Atualiza a interface
    atualizarInformacoesJogador(
      "player1",
      window.player1Character,
      player1Name
    );
    atualizarInformacoesJogador(
      "player2",
      window.player2Character,
      player2Name
    );
    atualizarBarraVida(
      "player1",
      window.player1Character.vida,
      window.player1Character.vidaMaxima
    );
    atualizarBarraVida(
      "player2",
      window.player2Character.vida,
      window.player2Character.vidaMaxima
    );

    // Configura eventos
    configurarEventosJogo();
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    alert("Erro ao carregar os personagens! Redirecionando...");
    window.location.href = "../index.html";
  }
});

/**
 * Atualiza as informações do jogador na interface
 * @param {string} playerId - ID do jogador
 * @param {Object} character - Objeto do personagem
 * @param {string} playerName - Nome do jogador
 */
function atualizarInformacoesJogador(playerId, character, playerName) {
  if (!character) {
    console.error(`Personagem ${playerId} não definido`);
    return;
  }

  console.log(`Atualizando ${playerId}:`, character);

  // Elementos obrigatórios
  const elementos = [
    {
      id: `${playerId}Character`,
      value: `${playerName} - ${character.classe} - ${character.nome}`,
    },
    { id: `${playerId}Vida`, value: character.vida },
    { id: `${playerId}Dano`, value: character.danoBase },
    { id: `${playerId}Armadura`, value: character.armadura },
    { id: `${playerId}Esquiva`, value: character.esquiva },
    {
      id: `${playerId}Stamina`,
      value: `${character.staminaMana}/${character.staminaManaMax}`,
    },
    { id: `${playerId}DadoEspecial`, value: character.dadoEspecial },
    { id: `${playerId}Custo`, value: character.custoStamina || "-" },
    {
      id: `${playerId}PenalidadeAtiva`,
      value: character.penalidade || "Nenhuma",
    },
  ];

  // Atualiza a interface
  elementos.forEach((item) => {
    const elemento = document.getElementById(item.id);
    if (elemento) {
      elemento.textContent = item.value;
    } else {
      console.warn(`Elemento ${item.id} não encontrado`);
    }
  });
}

function formatarPenalidade(classe) {
  const penalidades = {
    Guerreiro: "-1 defesa no turno seguinte",
    Ladino: "Só pode ser usado a cada 2 turnos",
    Mago: "-1 esquiva no turno seguinte",
    // ... outras classes
  };
  return penalidades[classe] || "Nenhuma";
}

function obterCustoHabilidade(classe) {
  const custos = {
    Guerreiro: 2,
    Ladino: 3,
    Mago: 3,
    // Adicione outras classes conforme necessário
  };
  return custos[classe] || "-";
}

/**
 * Configura todos os eventos do jogo
 */
function configurarEventosJogo() {
  // Configura eventos de ataque para todos os dados
  const tiposDado = ["D6", "D8", "D10", "D12"];

  for (let jogador of [1, 2]) {
    tiposDado.forEach((dado) => {
      const botao = document.getElementById(`player${jogador}${dado}Btn`);
      if (botao) {
        botao.addEventListener("click", () => {
          if (typeof finalizarAtaque === "function") {
            finalizarAtaque(jogador, dado);
          }
        });
      }
    });
  }
}

/**
 * Carrega os scripts dos personagens selecionados
 * @param {string} p1Char - Personagem do jogador 1
 * @param {string} p2Char - Personagem do jogador 2
 * @param {string} p1Name - Nome do jogador 1
 * @param {string} p2Name - Nome do jogador 2
 */
function carregarPersonagens(p1Char, p2Char, p1Name, p2Name) {
  // Lista de classes disponíveis
  const classesDisponiveis = ["Guerreiro", "Ladino", "Mago"];

  // Verifica se os personagens selecionados são válidos
  if (!classesDisponiveis.includes(p1Char)) {
    console.error(`Personagem ${p1Char} não é válido`);
    p1Char = "Guerreiro"; // Valor padrão
  }

  if (!classesDisponiveis.includes(p2Char)) {
    console.error(`Personagem ${p2Char} não é válido`);
    p2Char = "Ladino"; // Valor padrão
  }

  // Carrega cada personagem
  carregarPersonagem(p1Char, "player1", p1Name);
  carregarPersonagem(p2Char, "player2", p2Name);
}

/**
 * Carrega um personagem específico
 * @param {string} nomePersonagem - Nome do personagem a ser carregado
 * @param {string} playerId - ID do jogador ('player1' ou 'player2')
 * @param {string} playerName - Nome do jogador
 */
function carregarPersonagem(nomePersonagem, playerId, playerName) {
  const scriptSrc = `./assets/js/personagens/${nomePersonagem.toLowerCase()}.js`;

  // Verifica se o script já foi carregado
  if (document.querySelector(`script[src="${scriptSrc}"]`)) {
    console.log(`${nomePersonagem} já carregado`);
    return;
  }

  // Cria e configura o script
  const script = document.createElement("script");
  script.src = scriptSrc;

  script.onload = () => {
    console.log(`${nomePersonagem} carregado com sucesso`);
    const personagem = window[nomePersonagem.toLowerCase()];

    if (personagem) {
      atualizarInformacoesJogador(playerId, personagem, playerName);
      atualizarBarraVida(
        playerId,
        personagem.vida,
        personagem.vidaMaxima || personagem.vida
      );
    } else {
      console.error(`Objeto do personagem ${nomePersonagem} não encontrado`);
    }
  };

  script.onerror = () => {
    console.error(`Falha ao carregar ${scriptSrc}`);
    // Carrega um personagem padrão em caso de erro
    carregarPersonagemPadrao(playerId, playerName);
  };

  document.body.appendChild(script);
}

/**
 * Atualiza as informações do jogador na interface
 * @param {string} playerId - ID do jogador
 * @param {Object} character - Objeto do personagem
 * @param {string} playerName - Nome do jogador
 */
function atualizarInformacoesJogador(playerId, character, playerName) {
  if (!character) {
    console.error(`Personagem ${playerId} não definido`);
    return;
  }

  console.log(`Atualizando ${playerId}:`, character);

  // Elementos obrigatórios
  const elementos = [
    {
      id: `${playerId}Character`,
      value: `${playerName} - ${character.classe} - ${character.nome}`,
    },
    { id: `${playerId}Vida`, value: character.vida },
    { id: `${playerId}Dano`, value: character.danoBase },
    { id: `${playerId}Armadura`, value: character.armadura },
    { id: `${playerId}Esquiva`, value: character.esquiva },
    {
      id: `${playerId}Stamina`,
      value: `${character.staminaMana}/${
        character.staminaManaMax || character.staminaMana
      }`,
    },
    { id: `${playerId}DadoEspecial`, value: character.dadoEspecial },
    { id: `${playerId}Custo`, value: character.custoStamina || "-" },
    { id: `${playerId}Penalidade`, value: character.penalidade || "-" },
  ];

  // Atualiza a interface
  elementos.forEach((item) => {
    const elemento = document.getElementById(item.id);
    if (elemento) {
      elemento.textContent = item.value;
    } else {
      console.warn(`Elemento ${item.id} não encontrado`);
    }
  });
}

/**
 * Atualiza a barra de vida visual do jogador
 * @param {string} playerId - ID do jogador
 * @param {number} vidaAtual - Vida atual
 * @param {number} vidaMaxima - Vida máxima
 */
function atualizarBarraVida(playerId, vidaAtual, vidaMaxima) {
  const porcentagem = (vidaAtual / vidaMaxima) * 100;
  const barra = document.getElementById(`${playerId}HealthBar`);

  if (barra) {
    barra.style.width = `${porcentagem}%`;

    // Altera a cor conforme a vida
    if (porcentagem < 20) {
      barra.classList.remove("bg-success", "bg-warning");
      barra.classList.add("bg-danger");
    } else if (porcentagem < 50) {
      barra.classList.remove("bg-success", "bg-danger");
      barra.classList.add("bg-warning");
    } else {
      barra.classList.remove("bg-warning", "bg-danger");
      barra.classList.add("bg-success");
    }
  }
}

/**
 * Carrega um personagem padrão em caso de erro
 * @param {string} playerId - ID do jogador
 * @param {string} playerName - Nome do jogador
 */
function carregarPersonagemPadrao(playerId, playerName) {
  const personagemPadrao = {
    classe: playerId === "player1" ? "Guerreiro" : "Ladino",
    nome: playerId === "player1" ? "Conan" : "Loki",
    vida: 30,
    danoBase: 3,
    armadura: 5,
    esquiva: 2,
    staminaMana: 6,
    dadoEspecial: playerId === "player1" ? "D8" : "D10",
  };

  atualizarInformacoesJogador(playerId, personagemPadrao, playerName);
}
/**
 * Função auxiliar para formatar a descrição da penalidade
 */
function formatarPenalidade(classe) {
  const penalidades = {
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
  };

  return penalidades[classe] || "-";
}

/**
 * Função auxiliar para obter o custo da habilidade por classe
 */
function obterCustoHabilidade(classe) {
  const custos = {
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
  };

  return custos[classe] || "-";
}
