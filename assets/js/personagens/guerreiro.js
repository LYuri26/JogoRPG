// Objeto Guerreiro completo
window.guerreiro = {
  classe: "Guerreiro",
  nome: "Vegeta",
  vida: 30,
  danoBase: 3,
  armadura: 5,
  esquiva: 2,
  peso: 4,
  staminaMana: 6,
  dadoEspecial: "D8 extra no ataque",
  custoStamina: 2,
  penalidade: "-1 defesa no turno seguinte",
  foiAtacado: false,

  // Ataque especial do guerreiro
  ataqueEspecial: function () {
    if (this.staminaMana < this.custoStamina) {
      console.log("Stamina insuficiente para ataque especial!");
      return 0;
    }

    const dano = this.danoBase + Math.floor(Math.random() * 8) + 1;
    this.staminaMana -= this.custoStamina;
    this.aplicarPenalidade();
    return dano;
  },

  // Aplica penalidade após ataque especial
  aplicarPenalidade: function () {
    console.log("Penalidade aplicada: " + this.penalidade);
    // Implemente a lógica de penalidade aqui
  },

  // Restaura stamina
  restaurarStamina: function () {
    this.staminaMana = 6;
    console.log("Stamina restaurada!");
  },

  // Inicializa interface do jogador
  inicializar: function (playerId) {
    if (!playerId) {
      console.error("ID do jogador não fornecido!");
      return;
    }

    const playerSection = document.getElementById(playerId);
    if (!playerSection) {
      console.error(`Seção do jogador ${playerId} não encontrada!`);
      return;
    }

    this.criarBotoesDados(playerId);
    this.atualizarStatus(playerId);
    console.log(`Guerreiro inicializado para ${playerId}`);
  },

  // Cria botões de dados na interface
  criarBotoesDados: function (playerId) {
    const containerId = `${playerId}-dados-container`;
    let container = document.getElementById(containerId);

    if (container) {
      container.innerHTML = "";
    } else {
      container = document.createElement("div");
      container.id = containerId;
      container.className = "dice-container";
      document.getElementById(playerId).appendChild(container);
    }

    // Botão D6 (ataque básico)
    const btnD6 = this.criarBotaoDado(playerId, "D6", 6);

    // Botão D8 (ataque especial)
    const btnD8 = this.criarBotaoDado(playerId, "D8", 8, true);

    container.append(btnD6, btnD8);
  },

  // Cria um botão de dado genérico
  criarBotaoDado: function (playerId, tipoDado, faces, isEspecial = false) {
    const botao = document.createElement("button");
    botao.textContent = tipoDado;
    botao.className = `dice-button ${isEspecial ? "special" : ""}`;
    botao.dataset.faces = faces;

    botao.onclick = () => {
      const resultado = Math.floor(Math.random() * faces) + 1;
      console.log(`${playerId} rolou ${tipoDado}: ${resultado}`);

      if (isEspecial) {
        return this.ataqueEspecial();
      }
      return resultado;
    };

    return botao;
  },

  // Atualiza status na interface
  atualizarStatus: function (playerId) {
    const elementos = {
      vida: `${playerId}Vida`,
      stamina: `${playerId}Stamina`,
      nome: `${playerId}Character`,
    };

    for (const [prop, id] of Object.entries(elementos)) {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.textContent =
          prop === "nome" ? `Guerreiro - ${this.nome}` : this[prop];
      }
    }
  },
};

// Inicialização automática se necessário
document.addEventListener("DOMContentLoaded", function () {
  try {
    const p1Char = ConfigJogo.player1Character;
    const p2Char = ConfigJogo.player2Character;

    if (p1Char && p1Char.classe === "Guerreiro") {
      window.guerreiro.inicializar("player1");
    }

    if (p2Char && p2Char.classe === "Guerreiro") {
      window.guerreiro.inicializar("player2");
    }
  } catch (e) {
    console.error("Erro ao inicializar guerreiro:", e);
  }
});
