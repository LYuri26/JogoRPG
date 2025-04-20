// Função para usar habilidade especial
function useSpecialAbility(attacker, defender, attackerNum) {
  var cost = parseInt(attacker.data.cost);

  // Verifica se tem stamina suficiente
  if (attacker.currentStamina < cost) {
    showFeedback(
      "player" + attackerNum + "D20Btn",
      "Sem stamina suficiente!",
      "fail"
    );
    updateBattleLog(
      attacker.character + " não tem stamina suficiente!",
      gameLog
    );
    return;
  }

  // Gasta a stamina e incrementa contador
  attacker.currentStamina -= cost;
  attacker.usedSpecial++;

  // Feedback visual
  showFeedback(
    "player" + attackerNum + "Card",
    "HABILIDADE ESPECIAL!",
    "special"
  );

  // Atualiza UI e log
  updatePlayerUI(attackerNum, attacker);
  updateBattleLog(
    attacker.character +
      " usou " +
      attacker.data.specialDice +
      "! (Custo: " +
      attacker.data.cost +
      ")",
    gameLog
  );

  // Habilita o dado especial
  var specialDice = getSpecialDice(attacker.data.specialDice);
  var diceBtn = document.getElementById(
    "player" + attackerNum + specialDice + "Btn"
  );

  if (diceBtn) {
    diceBtn.disabled = false;
    diceBtn.classList.add("feedback-pulse");
    setTimeout(function () {
      diceBtn.classList.remove("feedback-pulse");
    }, 1000);
  }
}

// Função auxiliar para obter o tipo de dado especial
function getSpecialDice(specialText) {
  if (specialText.includes("D12")) return "D12";
  if (specialText.includes("D10")) return "D10";
  if (specialText.includes("D8")) return "D8";
  return "D6";
}

// Tornando as funções disponíveis globalmente
window.useSpecialAbility = useSpecialAbility;
window.getSpecialDice = getSpecialDice;
