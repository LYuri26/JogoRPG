const SPECIAL_CONDITIONS = {
  // 1. Guerreiro - Sem condições prévias, penalidade após uso
  Guerreiro: () => ({
    canUse: true,
    failMessage: "",
  }),

  // 2. Ladino - Só pode usar a cada 2 turnos
  Ladino: (attacker) => {
    const lastUsed = attacker.lastSpecialTurn || 0;
    const currentTurn = attacker.currentTurn || 1;
    const canUse = currentTurn - lastUsed >= 2;

    return {
      canUse,
      failMessage: "Só pode usar a cada 2 turnos!",
      maxUses: Infinity,
    };
  },

  // 3. Mago - Sem condições prévias, penalidade após uso
  Mago: () => ({
    canUse: true,
    failMessage: "",
    maxUses: Infinity,
  }),

  // 4. Paladino - Sem condições prévias, penalidade após uso
  Paladino: () => ({
    canUse: true,
    failMessage: "",
    maxUses: Infinity,
  }),

  // 5. Bárbaro - Só com vida ≤15 e 1x por combate
  Barbaro: (attacker) => ({
    canUse: attacker.currentLife <= 15 && !attacker.hasUsedUltimate,
    failMessage:
      attacker.currentLife > 15
        ? "Só pode usar com 15 ou menos de vida!"
        : "Só pode usar 1x por combate!",
    maxUses: 1,
  }),

  // 6. Arqueiro - Sem condições prévias, penalidade após uso
  Arqueiro: () => ({
    canUse: true,
    failMessage: "",
    maxUses: Infinity,
  }),

  // 7. Monge - Sem condições prévias, penalidade após uso
  Monge: () => ({
    canUse: true,
    failMessage: "",
    maxUses: Infinity,
  }),

  // 8. Cavaleiro - Sem condições prévias, penalidade após uso
  Cavaleiro: () => ({
    canUse: true,
    failMessage: "",
    maxUses: Infinity,
  }),

  // 9. Assassino - Precisa de D20 ≥16
  Assassino: (attacker, attackerNum) => {
    const d20Roll = parseInt(
      document.getElementById(`player${attackerNum}D20`).textContent
    );
    return {
      canUse: d20Roll >= 16,
      failMessage: "Precisa tirar 16+ no D20!",
      maxUses: Infinity,
    };
  },

  // 10. Druida - Máximo 2 usos por combate
  Druida: (attacker) => ({
    canUse: true,
    failMessage: "Máximo de usos atingido (2)!",
    maxUses: 2,
  }),

  // 11. Gladiador - Máximo 3 usos, desabilita no próximo turno
  Gladiador: (attacker) => ({
    canUse: !attacker.data.specialDisabled && (attacker.specialUses || 0) < 3,
    failMessage: attacker.data.specialDisabled
      ? "Habilidade indisponível neste turno!"
      : "Máximo de usos atingido (3)!",
    maxUses: 3,
  }),

  // 12. Caçador - Só pode usar a cada 5 turnos
  Cacador: (attacker) => ({
    canUse: (attacker.usedSpecial || 0) % 5 === 0,
    failMessage: "Só pode usar a cada 5 turnos!",
    maxUses: Infinity,
  }),

  // 13. Mercenário - Vida >30% e máximo 3 usos
  Mercenario: (attacker) => ({
    canUse:
      attacker.currentLife / attacker.data.life > 0.3 &&
      (attacker.specialUses || 0) < 3,
    failMessage:
      attacker.currentLife / attacker.data.life <= 0.3
        ? "Precisa ter mais de 30% de vida!"
        : "Máximo de usos atingido (3)!",
    maxUses: 3,
  }),

  // 14. Feiticeiro - Não pode usar com 1 de vida
  Feiticeiro: (attacker) => ({
    canUse: attacker.currentLife > 1,
    failMessage: "Não pode usar com 1 de vida!",
    maxUses: Infinity,
  }),

  // 15. Samurai - Só pode usar a cada 2 turnos e máximo 2 usos
  Samurai: (attacker) => {
    const lastUsed = attacker.lastSpecialTurn || 0;
    const currentTurn = attacker.currentTurn || 1;
    const canUse =
      currentTurn - lastUsed > 1 && (attacker.specialUses || 0) < 2;

    return {
      canUse,
      failMessage:
        (attacker.specialUses || 0) >= 2
          ? "Máximo de usos atingido (2)!"
          : "Só pode usar se não usou habilidade no turno anterior!",
      maxUses: 2,
    };
  },
};

const PENALTY_HANDLERS = {
  // 1. Guerreiro: -1 Armadura no próximo turno
  Guerreiro: (attacker) => {
    attacker.data.armorPenalty = 1;
    return `⚠️ ${attacker.character} perdeu 1 de Armadura no próximo turno!`;
  },

  // 2. Ladino: Nenhuma penalidade (condição pré-uso)
  Ladino: (attacker) => {
    attacker.lastSpecialTurn = attacker.currentTurn;
    return `⏳ ${attacker.character} só poderá usar a habilidade novamente em 2 turnos!`;
  },

  // 3. Mago: -2 Esquiva no próximo turno
  Mago: (attacker) => {
    attacker.data.dodgePenalty = 2;
    return `⚠️ ${attacker.character} perdeu 2 de Esquiva no próximo turno!`;
  },

  // 4. Paladino: Sofre 2 de dano direto
  Paladino: (attacker) => {
    const damage = 2;
    attacker.currentLife = Math.max(1, attacker.currentLife - damage);
    return `⚡ ${attacker.character} sofreu ${damage} de dano direto!`;
  },

  // 5. Bárbaro: Marca como usado (1x por combate)
  Barbaro: (attacker) => {
    attacker.hasUsedUltimate = true;
    return `⚡ ${attacker.character} usou sua Fúria Primordial!`;
  },

  // 6. Arqueiro: -1 Esquiva no próximo turno
  Arqueiro: (attacker) => {
    attacker.data.dodgePenalty = 1;
    return `⚠️ ${attacker.character} perdeu 1 de Esquiva no próximo turno!`;
  },

  // 7. Monge: -1 Armadura permanente
  Monge: (attacker) => {
    attacker.data.armor = Math.max(0, attacker.data.armor - 1);
    return `⚠️ ${attacker.character} perdeu 1 de Armadura permanentemente!`;
  },

  // 8. Cavaleiro: -1 Esquiva no próximo turno
  Cavaleiro: (attacker) => {
    attacker.data.dodgePenalty = 1;
    return `⚠️ ${attacker.character} perdeu 1 de Esquiva no próximo turno!`;
  },

  // 9. Assassino: Nenhuma penalidade (condição pré-uso)
  Assassino: () => null,

  // 10. Druida: Sofre 1 de dano direto
  Druida: (attacker) => {
    const damage = 1;
    attacker.currentLife = Math.max(1, attacker.currentLife - damage);
    return `⚡ ${attacker.character} sofreu ${damage} de dano por usar Espinhos Naturais!`;
  },

  // 11. Gladiador: Desabilita habilidade no próximo turno
  Gladiador: (attacker) => {
    attacker.data.specialDisabled = true;
    return `⏳ ${attacker.character} não poderá usar habilidades no próximo turno!`;
  },

  // 12. Caçador: Nenhuma penalidade (condição pré-uso)
  Cacador: () => null,

  // 13. Mercenário: Nenhuma penalidade (condição pré-uso)
  Mercenario: () => null,

  // 14. Feiticeiro: Perde 50% da vida atual
  Feiticeiro: (attacker) => {
    const damage = Math.floor(attacker.currentLife / 2);
    attacker.currentLife = Math.max(1, attacker.currentLife - damage);
    return `⚡ ${attacker.character} perdeu 50% da vida (${damage})!`;
  },

  // 15. Samurai: Marca o turno de uso
  Samurai: (attacker) => {
    attacker.lastSpecialTurn = attacker.currentTurn;
    return `⏳ ${attacker.character} não poderá usar habilidades no próximo turno!`;
  },
};

// Função auxiliar para verificar condições de uso
function checkSpecialConditions(attacker, attackerNum) {
  const condition = SPECIAL_CONDITIONS[attacker.character]?.(
    attacker,
    attackerNum
  ) || {
    canUse: true,
    failMessage: "",
    maxUses: Infinity,
  };

  // Verifica se atingiu o máximo de usos
  if ((attacker.specialUses || 0) >= (condition.maxUses || Infinity)) {
    return {
      canUse: false,
      failMessage: condition.failMessage || "Máximo de usos atingido!",
    };
  }

  return condition;
}

function useSpecialAbility(attacker, defender, attackerNum) {
  // Verificação básica de dados
  if (!attacker.data || !attacker.data.specialDice || !attacker.data.cost) {
    console.error("Dados de habilidade especial inválidos para:", attacker);
    showFeedback(
      `player${attackerNum}D20Btn`,
      "Habilidade não disponível!",
      "fail"
    );
    return false;
  }

  // Verifica condições específicas da classe
  const condition = SPECIAL_CONDITIONS[attacker.character]?.(
    attacker,
    attackerNum
  ) || { canUse: true };
  if (!condition.canUse) {
    showFeedback(`player${attackerNum}D20Btn`, condition.failMessage, "fail");
    return false;
  }

  // Verifica limite de usos
  if (condition.maxUses && (attacker.specialUses || 0) >= condition.maxUses) {
    showFeedback(`player${attackerNum}D20Btn`, condition.failMessage, "fail");
    return false;
  }

  // Verifica recurso (stamina/mana)
  const cost = getStaminaCost(attacker.data.cost);
  const resourceType = attacker.data.cost.includes("Mana") ? "Mana" : "Stamina";
  const resourceKey = `current${resourceType}`;

  if (attacker[resourceKey] < cost) {
    showFeedback(
      `player${attackerNum}D20Btn`,
      `${resourceType} insuficiente!`,
      "fail"
    );
    return false;
  }

  // Aplica o custo
  attacker[resourceKey] -= cost;
  attacker.usedSpecial = (attacker.usedSpecial || 0) + 1;
  attacker.specialUses = (attacker.specialUses || 0) + 1;

  // Aplica penalidades específicas da classe
  const penaltyMessage = applyCharacterPenalties(
    attacker,
    defender,
    attackerNum
  );
  if (penaltyMessage) {
    updateBattleLog(penaltyMessage);
  }

  // Atualiza dados e UI
  localStorage.setItem(`player${attackerNum}`, JSON.stringify(attacker));
  updatePlayerUI(attackerNum, attacker);

  // Feedback visual e de log
  const specialDice = getSpecialDice(attacker.data.specialDice);
  showFeedback(`player${attackerNum}Card`, "HABILIDADE ESPECIAL!", "special");
  updateBattleLog(
    `⚡ ${attacker.character} usou ${specialDice}! (Custo: ${cost} ${resourceType})`
  );

  return true;
}

function applyCharacterPenalties(attacker, defender, attackerNum) {
  const defenderNum = attackerNum === 1 ? 2 : 1;

  // Aplica penalidade baseada na classe
  if (PENALTY_HANDLERS[attacker.character]) {
    const message = PENALTY_HANDLERS[attacker.character](attacker);

    // Atualiza defensor se a penalidade afetar atributos de defesa
    if (attacker.data.armorPenalty || attacker.data.dodgePenalty) {
      localStorage.setItem(`player${defenderNum}`, JSON.stringify(defender));
      updatePlayerUI(defenderNum, defender);
    }

    return message;
  }
  return null;
}

function getSpecialDice(specialText) {
  const diceMatch = specialText.match(/D\d+/);
  return diceMatch ? diceMatch[0] : "D6";
}

// Funções auxiliares
function getStaminaCost(costText) {
  const match = costText.match(/\d+/);
  return match ? parseInt(match[0]) : 1;
}

// Funções globais
window.useSpecialAbility = useSpecialAbility;
window.getSpecialDice = getSpecialDice;
window.applyCharacterPenalties = applyCharacterPenalties;
window.getStaminaCost = getStaminaCost;
