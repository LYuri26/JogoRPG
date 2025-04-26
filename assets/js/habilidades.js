// habilidades.js
const SPECIAL_CONDITIONS = {
  Barbaro: (attacker) => ({
    canUse: attacker.currentLife <= 15 && !attacker.hasUsedUltimate,
    failMessage:
      attacker.currentLife > 15
        ? "Só pode usar com 15 ou menos de vida!"
        : "Só pode usar 1x por combate!",
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
  Ladino: (attacker) => ({
    canUse: attacker.usedSpecial % 2 === 0,
    failMessage: "Só pode usar a cada 2 turnos!",
  }),
  Gladiador: (attacker) => ({
    canUse: !attacker.data.specialDisabled && (attacker.specialUses || 0) < 3,
    failMessage: attacker.data.specialDisabled
      ? "Habilidade indisponível neste turno!"
      : "Máximo de usos atingido (3)!",
  }),
  Samurai: (attacker) => ({
    canUse: attacker.usedSpecial === 0 && (attacker.specialUses || 0) < 2,
    failMessage:
      (attacker.specialUses || 0) >= 2
        ? "Máximo de usos atingido (2)!"
        : "Só pode usar a cada 2 turnos!",
  }),
  Cacador: (attacker) => ({
    canUse: attacker.usedSpecial % 5 === 0,
    failMessage: "Só pode usar a cada 5 turnos!",
  }),
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
};

const PENALTY_HANDLERS = {
  "dano direto": (attacker, value) => {
    const damage = Math.max(1, attacker.currentLife - value);
    attacker.currentLife = damage;
    return `⚡ ${attacker.character} sofreu ${value} de dano direto!`;
  },
  "50% da Vida": (attacker) => {
    const damage = Math.max(1, Math.floor(attacker.currentLife / 2));
    attacker.currentLife = damage;
    return `⚡ ${attacker.character} perdeu 50% da vida (${damage})!`;
  },
  "1 de dano": (attacker) => {
    attacker.currentLife = Math.max(1, attacker.currentLife - 1);
    return `⚡ ${attacker.character} sofreu 1 de dano!`;
  },
  Armadura: (attacker, value) => {
    attacker.data.armorPenalty = value;
    return `⚠️ ${attacker.character} perdeu ${value} de Armadura!`;
  },
  Esquiva: (attacker, value) => {
    attacker.data.dodgePenalty = value;
    return `⚠️ ${attacker.character} perdeu ${value} de Esquiva!`;
  },
  indisponível: (attacker) => {
    attacker.data.specialDisabled = true;
    return `⏳ ${attacker.character} não poderá usar habilidades no próximo turno!`;
  },
};

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

  const cost = getStaminaCost(attacker.data.cost);
  const specialDice = getSpecialDice(attacker.data.specialDice);
  const defenderNum = attackerNum === 1 ? 2 : 1;

  // Verifica condições específicas da classe
  const condition = SPECIAL_CONDITIONS[attacker.title]?.(
    attacker,
    attackerNum
  ) || { canUse: true };
  if (!condition.canUse) {
    showFeedback(`player${attackerNum}D20Btn`, condition.failMessage, "fail");
    return false;
  }

  // Verifica recurso (stamina/mana)
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
  attacker.usedSpecial++;
  attacker.specialUses = (attacker.specialUses || 0) + 1;

  // Aplica penalidades/condições
  if (attacker.data.penalty) {
    applyCharacterPenalties(attacker, defender, attackerNum);
  }

  // Casos especiais
  if (attacker.title === "Barbaro") attacker.hasUsedUltimate = true;

  // Atualiza dados e UI
  localStorage.setItem(`player${attackerNum}`, JSON.stringify(attacker));
  updatePlayerUI(attackerNum, attacker);

  // Feedback visual e de log
  showFeedback(`player${attackerNum}Card`, "HABILIDADE ESPECIAL!", "special");
  updateBattleLog(
    `${attacker.character} usou ${specialDice}! (Custo: ${attacker.data.cost})`
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
  if (!specialText) return "D6";
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
