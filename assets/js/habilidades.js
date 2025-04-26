const SPECIAL_CONDITIONS = {
  Guerreiro: () => ({ canUse: true }), // Sem condições especiais
  Ladino: (attacker) => ({
    canUse: attacker.usedSpecial % 2 === 0,
    failMessage: "Só pode usar a cada 2 turnos!",
  }),
  Mago: () => ({ canUse: true }), // Penalidade é aplicada após o uso
  Paladino: () => ({ canUse: true }), // Penalidade é aplicada após o uso
  Barbaro: (attacker) => ({
    canUse: attacker.currentLife <= 15 && !attacker.hasUsedUltimate,
    failMessage:
      attacker.currentLife > 15
        ? "Só pode usar com 15 ou menos de vida!"
        : "Só pode usar 1x por combate!",
  }),
  Arqueiro: () => ({ canUse: true }), // Penalidade é aplicada após o uso
  Monge: () => ({ canUse: true }), // Penalidade é aplicada após o uso
  Cavaleiro: () => ({ canUse: true }), // Penalidade é aplicada após o uso
  Assassino: (attacker, attackerNum) => {
    const d20Roll = parseInt(
      document.getElementById(`player${attackerNum}D20`).textContent
    );
    return {
      canUse: d20Roll >= 16,
      failMessage: "Precisa tirar 16+ no D20!",
    };
  },
  Druida: (attacker) => ({
    canUse: (attacker.specialUses || 0) < 2,
    failMessage: "Máximo de usos atingido (2)!",
  }),
  Gladiador: (attacker) => ({
    canUse: !attacker.data.specialDisabled && (attacker.specialUses || 0) < 3,
    failMessage: attacker.data.specialDisabled
      ? "Habilidade indisponível neste turno!"
      : "Máximo de usos atingido (3)!",
  }),
  Cacador: (attacker) => ({
    canUse: attacker.usedSpecial % 5 === 0,
    failMessage: "Só pode usar a cada 5 turnos!",
  }),
  Mercenario: (attacker) => ({
    canUse:
      attacker.currentLife / attacker.data.life > 0.3 &&
      (attacker.specialUses || 0) < 3,
    failMessage:
      attacker.currentLife / attacker.data.life <= 0.3
        ? "Precisa ter mais de 30% de vida!"
        : "Máximo de usos atingido (3)!",
  }),
  Feiticeiro: (attacker) => ({
    canUse: attacker.currentLife > 1,
    failMessage: "Não pode usar com 1 de vida!",
  }),
  Samurai: (attacker) => ({
    canUse: attacker.usedSpecial === 0 && (attacker.specialUses || 0) < 2,
    failMessage:
      (attacker.specialUses || 0) >= 2
        ? "Máximo de usos atingido (2)!"
        : "Só pode usar a cada 2 turnos!",
  }),
};

const PENALTY_HANDLERS = {
  Guerreiro: (attacker) => {
    attacker.data.armorPenalty = 1;
    return `⚠️ ${attacker.character} perdeu 1 de Armadura no próximo turno!`;
  },
  Ladino: () => {}, // Condição é verificada antes do uso
  Mago: (attacker) => {
    attacker.data.dodgePenalty = 2;
    return `⚠️ ${attacker.character} perdeu 2 de Esquiva no próximo turno!`;
  },
  Paladino: (attacker) => {
    const damage = 2;
    attacker.currentLife = Math.max(1, attacker.currentLife - damage);
    return `⚡ ${attacker.character} sofreu ${damage} de dano direto!`;
  },
  Barbaro: (attacker) => {
    attacker.hasUsedUltimate = true;
    return `⚡ ${attacker.character} usou sua Fúria Primordial!`;
  },
  Arqueiro: (attacker) => {
    attacker.data.dodgePenalty = 1;
    return `⚠️ ${attacker.character} perdeu 1 de Esquiva no próximo turno!`;
  },
  Monge: (attacker) => {
    attacker.data.armorPenalty = 1;
    return `⚠️ ${attacker.character} perdeu 1 de Armadura!`;
  },
  Cavaleiro: (attacker) => {
    attacker.data.dodgePenalty = 1;
    return `⚠️ ${attacker.character} perdeu 1 de Esquiva no próximo turno!`;
  },
  Assassino: () => {}, // Condição é verificada antes do uso
  Druida: (attacker) => {
    const damage = 1;
    attacker.currentLife = Math.max(1, attacker.currentLife - damage);
    return `⚡ ${attacker.character} sofreu ${damage} de dano por usar Espinhos Naturais!`;
  },
  Gladiador: (attacker) => {
    attacker.data.specialDisabled = true;
    return `⏳ ${attacker.character} não poderá usar habilidades no próximo turno!`;
  },
  Cacador: () => {}, // Condição é verificada antes do uso
  Mercenario: () => {}, // Condição é verificada antes do uso
  Feiticeiro: (attacker) => {
    const damage = Math.floor(attacker.currentLife / 2);
    attacker.currentLife = Math.max(1, damage);
    return `⚡ ${attacker.character} perdeu 50% da vida (${damage})!`;
  },
  Samurai: () => {}, // Condição é verificada antes do uso
};

function useSpecialAbility(attacker, defender, attackerNum) {
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
  if (PENALTY_HANDLERS[attacker.character]) {
    const message = PENALTY_HANDLERS[attacker.character](attacker);
    if (message) updateBattleLog(message);
  }

  // Atualiza dados e UI
  localStorage.setItem(`player${attackerNum}`, JSON.stringify(attacker));
  updatePlayerUI(attackerNum, attacker);

  // Feedback visual e de log
  const specialDice = getSpecialDice(attacker.data.specialDice);
  showFeedback(`player${attackerNum}Card`, "HABILIDADE ESPECIAL!", "special");
  updateBattleLog(
    `⚡ ${attacker.character} usou ${specialDice}! (Custo: ${attacker.data.cost})`
  );

  return true;
}

function applyCharacterPenalties(attacker, defender, attackerNum) {
  const penalty = attacker.data.penalty;
  const defenderNum = attackerNum === 1 ? 2 : 1;

  // Processa cada tipo de penalidade
  for (const [key, handler] of Object.entries(PENALTY_HANDLERS)) {
    if (penalty.includes(key)) {
      const value = penalty.match(/\d+/)?.[0];
      const message = handler(attacker, value ? parseInt(value) : null);
      if (message) updateBattleLog(message);
    }
  }

  // Atualiza defensor se necessário
  if (penalty.includes("Armadura") || penalty.includes("Esquiva")) {
    localStorage.setItem(`player${defenderNum}`, JSON.stringify(defender));
    updatePlayerUI(defenderNum, defender);
  }
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
