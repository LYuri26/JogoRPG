// Objeto Ladino completo
window.ladino = {
  classe: "Ladino",
  nome: "Mulher Gato",
  vida: 25,
  danoBase: 2,
  armadura: 2,
  esquiva: 5,
  peso: 1,
  staminaMana: 6,
  dadoEspecial: "D10 extra no ataque (se não foi atacado)",
  custoStamina: 3,
  penalidade: 2,
  usosRestantes: 2,
  foiAtacado: false,

  // Ataque especial do ladino
  ataqueEspecial: function () {
    if (this.usosRestantes <= 0) {
      console.log("Usos do ataque especial esgotados!");
      return 0;
    }

    if (this.foiAtacado) {
      console.log("Não pode usar ataque especial após ser atacado!");
      return 0;
    }

    if (this.staminaMana < this.custoStamina) {
      console.log("Stamina insuficiente para ataque especial!");
      return 0;
    }

    const dano = this.danoBase + Math.floor(Math.random() * 10) + 1;
    this.staminaMana -= this.custoStamina;
    this.usosRestantes--;

    return dano;
  },

  // Reseta estado após turno
  resetarTurno: function () {
    this.foiAtacado = false;
  },

  // Restaura stamina
  restaurarStamina: function () {
    this.staminaMana = 6;
    console.log("Stamina do Ladino restaurada!");
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
    console.log(`Ladino inicializado para ${playerId}`);
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

    // Botão D10 (ataque especial)
    const btnD10 = this.criarBotaoDado(playerId, "D10", 10, true);

    container.append(btnD6, btnD10);
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
          prop === "nome" ? `Ladino - ${this.nome}` : this[prop];
      }
    }
  },
};

// Inicialização automática se necessário
document.addEventListener("DOMContentLoaded", function () {
  try {
    const p1Char = ConfigJogo.player1Character;
    const p2Char = ConfigJogo.player2Character;

    if (p1Char && p1Char.classe === "Ladino") {
      window.ladino.inicializar("player1");
    }

    if (p2Char && p2Char.classe === "Ladino") {
      window.ladino.inicializar("player2");
    }
  } catch (e) {
    console.error("Erro ao inicializar ladino:", e);
  }
});
