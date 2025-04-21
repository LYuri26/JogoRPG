let currentAttacker = 1;
let gameLog = [];

// Função para executar um ataque
function executeAttack(attackerNum) {
  const attacker = JSON.parse(localStorage.getItem(`player${attackerNum}`));
  const defenderNum = attackerNum === 1 ? 2 : 1;
  const defender = JSON.parse(localStorage.getItem(`player${defenderNum}`));

  if (!attacker.data || !defender.data) {
    console.error("Dados dos jogadores inválidos!");
    return;
  }

  // Rolagem do dado de dano
  const damageRoll = rollDice("D6", attackerNum);

  // Cálculo do poder de ataque
  const attackPower = damageRoll + attacker.data.damage;

  // Cálculo do dano final
  let damage = Math.max(1, attackPower - defender.data.armor);

  updateBattleLog(
    `${attacker.character} atacou com poder ${attackPower} (D6:${damageRoll} + Dano:${attacker.data.damage})`,
    gameLog
  );

  updateBattleLog(
    `Dano final: ${damage} (Poder ${attackPower} - Armadura ${defender.data.armor})`,
    gameLog
  );

  applyDamage(defenderNum, damage);

  // Desabilita botões de ataque após o uso
  document.getElementById(`player${attackerNum}D6Btn`).disabled = true;
  const specialDice = getSpecialDice(attacker.data.specialDice);
  document.getElementById(
    `player${attackerNum}${specialDice}Btn`
  ).disabled = true;

  // Alterna o turno após o ataque
  setTimeout(() => {
    switchTurn(defenderNum);
  }, 1500);
}

function applyPenalties(player, playerNum) {
  const penalties = {
    Guerreiro: () => {
      player.data.armor -= 1;
      player.armorPenalty = 1;
      updateBattleLog(
        `${player.character} sofreu -1 de Armadura no próximo turno!`,
        gameLog
      );
    },
    Ladino: () => {
      player.cooldown = 2;
      updateBattleLog(
        `${player.character} não poderá usar habilidade especial por 2 turnos!`,
        gameLog
      );
    },
    Mago: () => {
      player.data.dodge -= 2;
      player.dodgePenalty = 2;
      updateBattleLog(
        `${player.character} sofreu -2 de Esquiva no próximo turno!`,
        gameLog
      );
    },
    Paladino: () => {
      applyDamage(playerNum, 2);
      updateBattleLog(
        `${player.character} sofreu 2 de dano por usar Ira Sagrada!`,
        gameLog
      );
    },
    Bárbaro: () => {
      // Penalidade já aplicada pela condição (só pode usar com ≤15 de vida e 1x por combate)
      updateBattleLog(`${player.character} gastou toda sua Fúria!`, gameLog);
    },
    Arqueiro: () => {
      player.data.dodge -= 1;
      player.dodgePenalty = 1;
      updateBattleLog(
        `${player.character} sofreu -1 de Esquiva no próximo turno!`,
        gameLog
      );
    },
    Monge: () => {
      player.data.armor -= 1;
      player.armorPenalty = 1;
      updateBattleLog(
        `${player.character} sofreu -1 de Armadura após o Golpe Interior!`,
        gameLog
      );
    },
    Cavaleiro: () => {
      player.data.dodge -= 1;
      player.dodgePenalty = 1;
      updateBattleLog(
        `${player.character} sofreu -1 de Esquiva após a Investida de Ferro!`,
        gameLog
      );
    },
    Assassino: () => {
      // Penalidade já aplicada pela condição (só ativa com D20 ≥16)
      updateBattleLog(
        `${player.character} preparou uma Execução Silenciosa!`,
        gameLog
      );
    },
    Druida: () => {
      applyDamage(playerNum, 1);
      updateBattleLog(
        `${player.character} sofreu 1 de dano dos Espinhos Naturais! (${player.usedSpecial}/2 usos)`,
        gameLog
      );
    },
    Gladiador: () => {
      player.skipNextTurn = true;
      updateBattleLog(
        `${player.character} ficará exausto no próximo turno! (${player.usedSpecial}/3 usos)`,
        gameLog
      );
    },
    Caçador: () => {
      player.cooldown = 5;
      updateBattleLog(
        `${player.character} não poderá usar Disparo Selvagem por 5 turnos!`,
        gameLog
      );
    },
    Mercenário: () => {
      // Penalidade já aplicada pela condição (só com >30% vida e máx 3 usos)
      updateBattleLog(
        `${player.character} preparou uma Retaliação Precisa! (${player.usedSpecial}/3 usos)`,
        gameLog
      );
    },
    Feiticeiro: () => {
      const lifeLost = Math.floor(player.currentLife * 0.5);
      player.currentLife = Math.max(1, player.currentLife - lifeLost);
      updatePlayerUI(playerNum, player);
      updateBattleLog(
        `${player.character} perdeu ${lifeLost} de vida pela Explosão Arcana!`,
        gameLog
      );
    },
    Samurai: () => {
      player.usedLastTurn = true;
      updateBattleLog(
        `${player.character} não poderá usar habilidade no próximo turno! (${player.usedSpecial}/2 usos)`,
        gameLog
      );
    },
  };

  if (penalties[player.character]) {
    penalties[player.character]();
    updatePlayerUI(playerNum, player);
    localStorage.setItem(`player${playerNum}`, JSON.stringify(player));
  }
}

// Função para aplicar dano ao jogador
function applyDamage(playerNum, damage) {
  const player = JSON.parse(localStorage.getItem(`player${playerNum}`));
  player.currentLife = Math.max(0, player.currentLife - damage);

  // Atualiza no localStorage
  localStorage.setItem(`player${playerNum}`, JSON.stringify(player));

  // Feedback visual - verifica se o elemento existe
  var playerCard = document.getElementById(`player${playerNum}Card`);
  if (playerCard) {
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
  }

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
  // Atualiza cooldowns e penalidades antes de mudar o turno
  [1, 2].forEach((playerNum) => {
    const player = JSON.parse(localStorage.getItem(`player${playerNum}`));

    // Reduz cooldown se existir
    if (player.cooldown > 0) {
      player.cooldown--;
    }

    // Reseta penalidades de turno único
    if (player.armorPenalty && player.character !== "Monge") {
      player.data.armor += player.armorPenalty;
      delete player.armorPenalty;
    }

    if (
      player.dodgePenalty &&
      !["Mago", "Arqueiro", "Cavaleiro"].includes(player.character)
    ) {
      player.data.dodge += player.dodgePenalty;
      delete player.dodgePenalty;
    }

    // Reseta flag de turno anterior para Samurai
    if (player.character === "Samurai") {
      player.usedLastTurn = false;
    }

    // Pula turno se necessário (Gladiador)
    if (player.skipNextTurn) {
      delete player.skipNextTurn;
      newAttacker = newAttacker === 1 ? 2 : 1;
    }

    localStorage.setItem(`player${playerNum}`, JSON.stringify(player));
    updatePlayerUI(playerNum, player);
  });

  currentAttacker = newAttacker;
  document.getElementById("currentPhase").textContent =
    "Turno: " + currentAttacker;
  updateBattleLog(
    "Turno de " + (newAttacker === 1 ? "Jogador 1" : "Jogador 2"),
    gameLog
  );

  const player1 = JSON.parse(localStorage.getItem("player1"));
  const player2 = JSON.parse(localStorage.getItem("player2"));
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
window.gameLog = gameLog;
window.currentAttacker = currentAttacker;
