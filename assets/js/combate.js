let currentAttacker = 1;
let gameLog = [];

function updateBattleLog(message, logElementId = "battleLog") {
  gameLog.push(message);
  const logElement = document.getElementById(logElementId);
  if (logElement) {
    const logEntry = document.createElement("div");
    logEntry.className = "log-entry";
    logEntry.textContent = message;
    logElement.appendChild(logEntry);
    logElement.scrollTop = logElement.scrollHeight;
  }
}

function processCombatResult(
  attacker,
  defender,
  attackerNum,
  attackRoll,
  defenseRoll
) {
  const defenderNum = attackerNum === 1 ? 2 : 1;

  updateBattleLog(`🎲 ${attacker.character} rolou: ${attackRoll}`);
  updateBattleLog(`🎲 ${defender.character} rolou: ${defenseRoll}`);

  if (attackRoll > defenseRoll) {
    updateBattleLog(
      `✅ ${attacker.character} venceu (${attackRoll} > ${defenseRoll}) e pode atacar!`
    );
    setupAttackButtons(attacker, defender, attackerNum, defenderNum);
  } else {
    updateBattleLog(
      `🔄 ${defender.character} venceu (${defenseRoll} >= ${attackRoll}) e agora ataca!`
    );
    switchTurn(defenderNum);
  }
}

function applyDamage(playerNum, damage) {
  const player = JSON.parse(localStorage.getItem(`player${playerNum}`));
  if (!player) return;

  player.currentLife = Math.max(0, player.currentLife - damage);
  localStorage.setItem(`player${playerNum}`, JSON.stringify(player));

  // Feedback visual
  const playerCard = document.getElementById(`player${playerNum}Card`);
  if (playerCard) {
    playerCard.classList.add("feedback-shake");
    const damageFeedback = document.createElement("div");
    damageFeedback.className = "feedback-damage";
    damageFeedback.textContent = `-${damage}`;
    playerCard.appendChild(damageFeedback);

    setTimeout(() => {
      playerCard.classList.remove("feedback-shake");
      damageFeedback.remove();
    }, 1000);
  }

  updatePlayerUI(playerNum, player);
  updateBattleLog(`💥 ${player.character} sofreu ${damage} de dano!`);

  if (player.currentLife <= 0) {
    endGame(playerNum === 1 ? 2 : 1);
  }
}

function switchTurn(newAttacker) {
  const player1 = JSON.parse(localStorage.getItem("player1"));
  const player2 = JSON.parse(localStorage.getItem("player2"));
  const attacker = newAttacker === 1 ? player1 : player2;

  currentAttacker = newAttacker;
  localStorage.setItem("currentTurn", newAttacker.toString());

  // Reseta os valores dos dados visuais
  ["D20", "D6", "D8", "D10", "D12"].forEach((dice) => {
    [1, 2].forEach((playerNum) => {
      const display = document.getElementById(`player${playerNum}${dice}`);
      if (display) display.textContent = "0";
    });
  });

  // Atualiza a interface
  document.getElementById(
    "currentPhase"
  ).textContent = `Turno: ${attacker.character}`;
  updateBattleLog(`🔄 Turno de ${attacker.character}`);

  // Configura os botões para o novo turno
  setupButtons(player1, player2, newAttacker);
}

function endGame(winnerNum) {
  const winner =
    winnerNum === 1
      ? JSON.parse(localStorage.getItem("player1"))
      : JSON.parse(localStorage.getItem("player2"));

  if (!winner) return;

  // Desabilita todos os botões
  document.querySelectorAll(".dice-button").forEach((btn) => {
    btn.disabled = true;
  });

  // Efeito visual
  const winnerCard = document.getElementById(`player${winnerNum}Card`);
  if (winnerCard) winnerCard.classList.add("feedback-pulse");

  updateBattleLog(`🏆 FIM DE JOGO! ${winner.character} venceu a batalha!`);

  // Botão para reiniciar
  const restartBtn = document.createElement("button");
  restartBtn.className = "btn btn-success mt-3";
  restartBtn.textContent = "Jogar Novamente";
  restartBtn.onclick = () => (window.location.href = "index.html");

  const turnInfo = document.querySelector(".turn-info");
  if (turnInfo) turnInfo.appendChild(restartBtn);
}

// Exporta funções globais
window.applyDamage = applyDamage;
window.switchTurn = switchTurn;
window.endGame = endGame;
window.processCombatResult = processCombatResult;
window.updateBattleLog = updateBattleLog;
