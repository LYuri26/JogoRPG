window.barbaro = {
  title: "Bárbaro",
  name: "Conan",
  life: 34,
  damage: 4,
  armor: 3,
  dodge: 2,
  weight: 3,
  stamina: 6,
  staminaMax: 6,
  specialDice: "D12",
  specialAbility: "Fúria Primordial",
  cost: 6,
  costType: "Stamina",
  condition: "Vida ≤ 15",
  penalty: { type: "uses", value: 1, max: 1 }, // 1 uso por combate
  usedThisCombat: 0,

  useSpecial: function () {
    if (this.life > 15) return { error: "Vida deve ser ≤ 15!" };
    if (this.usedThisCombat >= this.penalty.max)
      return { error: "Já usou neste combate!" };
    if (this.stamina < this.cost) return { error: "Stamina insuficiente!" };

    this.stamina -= this.cost;
    this.usedThisCombat++;

    return {
      bonus: Math.floor(Math.random() * 12) + 1,
      message: "Fúria Primordial ativada!",
    };
  },

  resetCombat: function () {
    this.usedThisCombat = 0;
  },
};
