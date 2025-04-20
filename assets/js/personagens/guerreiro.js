window.guerreiro = {
  title: "Guerreiro",
  name: "Vegeta",
  life: 32,
  lifeMax: 32,
  damage: 3,
  armor: 4,
  dodge: 2,
  weight: 4,
  stamina: 6,
  staminaMax: 6,
  specialDice: "D8",
  specialAbility: "Golpe Brutal",
  cost: 2,
  costType: "Stamina",
  condition: null,
  penalty: { type: "armor", value: -1, duration: 1 },
  activePenalty: null,
  playerId: null,

  useSpecial: function () {
    if (this.stamina < this.cost) return { error: "Stamina insuficiente!" };

    this.stamina -= this.cost;
    this.activePenalty = { ...this.penalty };

    return {
      bonus: Math.floor(Math.random() * 8) + 1,
      message: `${this.name} usou Golpe Brutal!`,
    };
  },

  updateTurn: function () {
    if (this.activePenalty) {
      this.activePenalty.duration--;
      if (this.activePenalty.duration <= 0) {
        this.activePenalty = null;
      }
    }

    if (
      window.ConfigJogo &&
      ConfigJogo.turnoAtual % 2 === (this.playerId === "player1" ? 1 : 0)
    ) {
      this.stamina = Math.min(this.stamina + 2, this.staminaMax);
    }

    this.updateInterface();
  },

  initialize: function (playerId) {
    this.playerId = playerId;
    this.setupInterface();
    this.updateInterface();
  },

  setupInterface: function () {
    const container = document.getElementById(`${this.playerId}-abilities`);
    if (!container) {
      console.error(`Container not found for ${this.playerId}`);
      return;
    }

    const btn = document.createElement("button");
    btn.className = "ability-button";
    btn.textContent = this.specialAbility;
    btn.onclick = () => {
      const result = this.useSpecial();
      if (result && !result.error) {
        if (window.GerenciadorCombate) {
          GerenciadorCombate.registrarAtaque(
            this.playerId,
            this.specialDice,
            result.bonus
          );
        }
      } else if (result.error) {
        console.log(result.error);
      }
    };

    container.appendChild(btn);
  },

  updateInterface: function () {
    if (!this.playerId) return;

    const updateElement = (idSuffix, value) => {
      const element = document.getElementById(`${this.playerId}-${idSuffix}`);
      if (element) element.textContent = value;
    };

    updateElement("nome", this.name);
    updateElement("vida", this.life);
    updateElement("stamina", `${this.stamina}/${this.staminaMax}`);

    const btn = document.querySelector(`#${this.playerId}-abilities button`);
    if (btn) {
      btn.disabled = this.stamina < this.cost;
    }

    if (window.ResourceManager) {
      ResourceManager.updateAbilityButtons(this);
    }

    if (window.jogo && jogo.atualizarBarraVida) {
      jogo.atualizarBarraVida(this.playerId, this.life, this.lifeMax);
    }
  },
};

// Auto-initialization when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  try {
    // Check if ConfigJogo exists and has character data
    if (window.ConfigJogo) {
      const p1Char = ConfigJogo.player1Character;
      const p2Char = ConfigJogo.player2Character;

      // Initialize if this class is selected for either player
      if (p1Char && p1Char.classe === "Guerreiro") {
        window.guerreiro.initialize("player1");
      }
      if (p2Char && p2Char.classe === "Guerreiro") {
        window.guerreiro.initialize("player2");
      }
    }

    // Register with CharacterClasses if available
    if (window.CharacterClasses) {
      window.CharacterClasses.Guerreiro = window.guerreiro;
    }
  } catch (e) {
    console.error("Erro ao inicializar guerreiro:", e);
  }
});
