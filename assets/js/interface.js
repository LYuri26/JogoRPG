function updatePlayerUI(playerNum, playerData) {
  // Verifica se os dados existem
  if (!playerData || !playerData.data) {
    console.error("Dados do jogador inválidos:", playerData);
    return;
  }

  // Atualiza os elementos básicos
  const elements = {
    character: `player${playerNum}Character`,
    vida: `player${playerNum}Vida`,
    dano: `player${playerNum}Dano`,
    armadura: `player${playerNum}Armadura`,
    esquiva: `player${playerNum}Esquiva`,
    stamina: `player${playerNum}Stamina`,
    dadoEspecial: `player${playerNum}DadoEspecial`,
    custo: `player${playerNum}Custo`,
    healthBar: `player${playerNum}HealthBar`,
  };

  // Atualiza os textos
  document.getElementById(elements.character).textContent =
    playerData.character || playerData.data.title;
  document.getElementById(
    elements.vida
  ).textContent = `${playerData.currentLife}/${playerData.data.life}`;
  document.getElementById(elements.dano).textContent = playerData.data.damage;
  document.getElementById(elements.armadura).textContent =
    playerData.data.armor;
  document.getElementById(elements.esquiva).textContent = playerData.data.dodge;
  document.getElementById(
    elements.stamina
  ).textContent = `${playerData.currentStamina}/${playerData.data.stamina}`;
  document.getElementById(elements.dadoEspecial).textContent =
    playerData.data.specialDice;
  document.getElementById(elements.custo).textContent = playerData.data.cost;

  // Atualiza a barra de vida
  const healthBar = document.getElementById(elements.healthBar);
  const healthPercent = (playerData.currentLife / playerData.data.life) * 100;
  healthBar.style.width = `${healthPercent}%`;
  healthBar.className = `progress-bar ${
    healthPercent > 30 ? "bg-danger" : "bg-warning"
  }`;

  // Atualiza penalidades visíveis
  document.getElementById(`player${playerNum}ArmaduraPenalidade`).textContent =
    playerData.armorPenalty ? `(-${playerData.armorPenalty})` : "";
  document.getElementById(`player${playerNum}EsquivaPenalidade`).textContent =
    playerData.dodgePenalty ? `(-${playerData.dodgePenalty})` : "";
}

function setupButtons(player1, player2, currentAttacker) {
  // Limpa event listeners anteriores
  const clearButtons = () => {
    ["D20", "D6", "D8", "D10", "D12"].forEach((dice) => {
      const btn = document.getElementById(`player${currentAttacker}${dice}Btn`);
      if (btn) {
        btn.replaceWith(btn.cloneNode(true));
      }
    });
  };
  clearButtons();

  // Configura botões para o atacante atual
  const attacker = currentAttacker === 1 ? player1 : player2;
  const defender = currentAttacker === 1 ? player2 : player1;

  // Variáveis para armazenar os resultados dos dados
  let attackRoll = null;
  let defenseRoll = null;

  // Botão D20 do atacante
  const attackerD20Btn = document.getElementById(
    `player${currentAttacker}D20Btn`
  );
  attackerD20Btn.addEventListener("click", async () => {
    // Desabilita o botão do atacante
    attackerD20Btn.disabled = true;

    // Rolagem do atacante
    attackRoll = rollDice("D20", currentAttacker);
    updateBattleLog(
      `${attacker.character} rolou um D20: ${attackRoll}`,
      gameLog
    );

    // Habilita o botão do defensor após 1 segundo
    setTimeout(() => {
      const defenderNum = currentAttacker === 1 ? 2 : 1;
      const defenderD20Btn = document.getElementById(
        `player${defenderNum}D20Btn`
      );
      if (defenderD20Btn) {
        defenderD20Btn.disabled = false;
      }
    }, 1000);
  });

  // Botão D20 do defensor (inicialmente desabilitado)
  const defenderNum = currentAttacker === 1 ? 2 : 1;
  const defenderD20Btn = document.getElementById(`player${defenderNum}D20Btn`);
  if (defenderD20Btn) {
    defenderD20Btn.disabled = true;
    defenderD20Btn.addEventListener("click", async () => {
      // Desabilita o botão do defensor
      defenderD20Btn.disabled = true;

      // Rolagem do defensor
      defenseRoll = rollDice("D20", defenderNum);
      updateBattleLog(
        `${defender.character} rolou um D20: ${defenseRoll}`,
        gameLog
      );

      // Processa o resultado após 1 segundo
      setTimeout(() => {
        processCombatResult(
          attacker,
          defender,
          currentAttacker,
          attackRoll,
          defenseRoll
        );
      }, 1000);
    });
  }

  // Configura botões de ação (inicialmente desabilitados)
  ["D6", "D8", "D10", "D12"].forEach((dice) => {
    const btn = document.getElementById(`player${currentAttacker}${dice}Btn`);
    if (btn) {
      btn.addEventListener("click", () => {
        if (dice === "D6") {
          executeAttack(currentAttacker);
        } else {
          rollDice(dice, currentAttacker);
        }
      });
      btn.disabled = true;
    }
  });
}

function processCombatResult(
  attacker,
  defender,
  attackerNum,
  attackRoll,
  defenseRoll
) {
  const defenderNum = attackerNum === 1 ? 2 : 1;

  if (attackRoll > defenseRoll) {
    // Atacante venceu
    updateBattleLog(
      `${attacker.character} venceu a disputa! (${attackRoll} > ${defenseRoll})`,
      gameLog
    );

    // Habilita botões de ataque
    document.getElementById(`player${attackerNum}D6Btn`).disabled = false;

    // Habilita dado especial se o personagem tiver stamina suficiente
    if (attacker.currentStamina >= getStaminaCost(attacker.data.cost)) {
      const specialDice = getSpecialDice(attacker.data.specialDice);
      document.getElementById(
        `player${attackerNum}${specialDice}Btn`
      ).disabled = false;
    }
  } else {
    // Defensor venceu
    updateBattleLog(
      `${defender.character} defendeu com sucesso! (${defenseRoll} >= ${attackRoll})`,
      gameLog
    );

    // Alterna o turno
    setTimeout(() => {
      switchTurn(defenderNum);
    }, 1500);
  }
}

function getStaminaCost(costText) {
  // Extrai o valor numérico do custo (ex: "2 Stamina" → 2)
  const match = costText.match(/\d+/);
  return match ? parseInt(match[0]) : 1;
}

// Função para mostrar feedback visual
function showFeedback(elementId, text, type = "normal") {
  const element = document.getElementById(elementId);
  if (!element) return;

  const feedback = document.createElement("div");
  feedback.className = `dice-roll-feedback ${type}`;
  feedback.textContent = text;

  element.appendChild(feedback);

  // Animação
  setTimeout(() => {
    feedback.style.opacity = "1";
    feedback.style.transform = "translateY(-30px)";
  }, 10);

  setTimeout(() => {
    feedback.style.opacity = "0";
    setTimeout(() => feedback.remove(), 500);
  }, 1000);
}

function rollDice(diceType, playerNum) {
  const sides = parseInt(diceType.substring(1));
  const result = Math.floor(Math.random() * sides) + 1;

  // Atualiza a interface
  document.getElementById(`player${playerNum}${diceType}`).textContent = result;

  // Feedback visual
  showFeedback(
    `player${playerNum}${diceType}Btn`,
    result.toString(),
    result === sides ? "critical" : result === 1 ? "fail" : "normal"
  );

  return result;
}

// Exporta funções globais
window.updatePlayerUI = updatePlayerUI;
window.setupButtons = setupButtons;
window.rollDice = rollDice;
window.showFeedback = showFeedback;
