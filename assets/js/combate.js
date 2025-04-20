// combate.js - JavaScript puro (sem módulos ES6)

// Função para executar um ataque
function executeAttack(attackerNum) {
  const attacker = JSON.parse(localStorage.getItem(`player${attackerNum}`));
  const defenderNum = attackerNum === 1 ? 2 : 1;
  const defender = JSON.parse(localStorage.getItem(`player${defenderNum}`));

  // Rolagem de ataque
  var attackRoll = rollDice("D20", attackerNum);
  updateBattleLog(
    attacker.character + " rolou " + attackRoll + " no ataque!",
    gameLog
  );

  // Rolagem de defesa
  var defenseRoll = rollDice("D20", defenderNum);
  updateBattleLog(
    defender.character + " rolou " + defenseRoll + " na defesa!",
    gameLog
  );

  if (defenseRoll >= attackRoll) {
    // Esquiva bem-sucedida
    showFeedback("player" + defenderNum + "Card", "ESQUIVOU!", "special");
    updateBattleLog(defender.character + " esquivou do ataque!", gameLog);
  } else {
    // Ataque acertou
    var damageRoll = rollDice("D6", attackerNum);
    var damage = damageRoll + attacker.data.damage - defender.data.armor;
    damage = Math.max(1, damage); // Mínimo de 1 de dano

    applyDamage(defenderNum, damage);
  }

  // Alterna o turno
  setTimeout(function () {
    switchTurn(attackerNum === 1 ? 2 : 1);
  }, 1500);
}

// Função para aplicar dano ao jogador
function applyDamage(playerNum, damage) {
  const player = JSON.parse(localStorage.getItem(`player${playerNum}`));
  player.currentLife = Math.max(0, player.currentLife - damage);

  // Atualiza no localStorage
  localStorage.setItem(`player${playerNum}`, JSON.stringify(player));

  // Feedback visual
  var playerCard = document.getElementById("player" + playerNum + "Card");
  playerCard.classList.add("feedback-shake");
  setTimeout(function () {
    playerCard.classList.remove("feedback-shake");
  }, 300);

  // Mostra o valor do dano
  var damageFeedback = document.createElement("div");
  damageFeedback.className = "feedback-damage";
  damageFeedback.textContent = "-" + damage;
  playerCard.appendChild(damageFeedback);
  setTimeout(function () {
    damageFeedback.remove();
  }, 1000);

  updatePlayerUI(playerNum, player);
  updateBattleLog(
    player.character + " sofreu " + damage + " de dano!",
    gameLog
  );

  if (player.currentLife <= 0) {
    endGame(playerNum === 1 ? 2 : 1);
  }
}

// Função para alternar o turno entre jogadores
function switchTurn(newAttacker) {
  currentAttacker = newAttacker;
  document.getElementById("currentPhase").textContent =
    "Turno: " + currentAttacker;
  updateBattleLog(
    "Turno de " + (newAttacker === 1 ? "Jogador 1" : "Jogador 2"),
    gameLog
  );

  var player1 = JSON.parse(localStorage.getItem("player1"));
  var player2 = JSON.parse(localStorage.getItem("player2"));
  setupButtons(player1, player2, currentAttacker, gameLog);
}

// Função para finalizar o jogo
function endGame(winnerNum) {
  var winner =
    winnerNum === 1
      ? JSON.parse(localStorage.getItem("player1"))
      : JSON.parse(localStorage.getItem("player2"));

  // Desabilita todos os botões de dados
  var diceButtons = document.querySelectorAll(".dice-button");
  for (var i = 0; i < diceButtons.length; i++) {
    diceButtons[i].disabled = true;
  }

  // Efeito visual para o vencedor
  var winnerCard = document.getElementById("player" + winnerNum + "Card");
  winnerCard.classList.add("feedback-pulse");
  updateBattleLog(
    "FIM DE JOGO! " + winner.character + " venceu a batalha!",
    gameLog
  );

  // Botão para reiniciar o jogo
  var restartBtn = document.createElement("button");
  restartBtn.className = "btn btn-success mt-3";
  restartBtn.textContent = "Jogar Novamente";
  restartBtn.onclick = function () {
    window.location.href = "index.html";
  };
  document.querySelector(".turn-info").appendChild(restartBtn);
}

// Tornando as funções disponíveis globalmente
window.executeAttack = executeAttack;
window.applyDamage = applyDamage;
window.switchTurn = switchTurn;
window.endGame = endGame;
