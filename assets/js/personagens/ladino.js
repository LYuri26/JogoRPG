window.ladino = {
  title: "Ladino",
  name: "Mulher Gato",
  life: 25,
  lifeMax: 25,
  damage: 2,
  armor: 2,
  dodge: 5,
  weight: 1,
  stamina: 6,
  staminaMax: 6,
  specialDice: "D10",
  specialAbility: "Ataque Furtivo",
  cost: 3,
  costType: "Stamina",
  condition: "Não foi atacado",
  penalty: { type: "uses", value: 1, max: 2 },
  usedThisCombat: 0,
  wasAttacked: false,
  playerId: null,

  useSpecial: function () {
    if (this.wasAttacked) return { error: "Não pode usar após ser atacado!" };
    if (this.usedThisCombat >= this.penalty.max)
      return { error: "Usos esgotados neste combate!" };
    if (this.stamina < this.cost) return { error: "Stamina insuficiente!" };

    this.stamina -= this.cost;
    this.usedThisCombat++;

    return {
      bonus: Math.floor(Math.random() * 10) + 1,
      message: "Ataque Furtivo realizado!",
    };
  },

  resetCombat: function () {
    this.usedThisCombat = 0;
  },

  resetTurn: function () {
    this.wasAttacked = false;
  },

  initialize: function (playerId) {
    this.playerId = playerId;
    this.createDiceButtons();
    this.updateInterface();
  },

  createDiceButtons: function () {
    const container = document.getElementById(
      `${this.playerId}-dice-container`
    );
    if (!container) {
      console.error(`Dice container not found for ${this.playerId}`);
      return;
    }

    container.innerHTML = "";

    const basicBtn = this.createDiceButton("D6", 6);
    const specialBtn = this.createDiceButton("D10", 10, true);

    container.append(basicBtn, specialBtn);
  },

  createDiceButton: function (diceType, faces, isSpecial = false) {
    const button = document.createElement("button");
    button.textContent = diceType;
    button.className = `dice-button ${isSpecial ? "special" : ""}`;

    button.onclick = () => {
      if (isSpecial) {
        const result = this.useSpecial();
        if (result.error) {
          console.log(result.error);
          return 0;
        }
        return result.bonus + this.damage;
      }
      return Math.floor(Math.random() * faces) + 1 + this.damage;
    };

    return button;
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
      if (p1Char && p1Char.classe === "Ladino") {
        window.ladino.initialize("player1");
      }
      if (p2Char && p2Char.classe === "Ladino") {
        window.ladino.initialize("player2");
      }
    }

    // Register with CharacterClasses if available
    if (window.CharacterClasses) {
      window.CharacterClasses.Ladino = window.ladino;
    }
  } catch (e) {
    console.error("Erro ao inicializar ladino:", e);
  }
});
