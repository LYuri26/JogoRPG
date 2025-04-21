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

  // Botão D20 (disputa de turno)
  document
    .getElementById(`player${currentAttacker}D20Btn`)
    .addEventListener("click", () => {
      // Rolagem do atacante
      const attackRoll = rollDice("D20", currentAttacker);

      // Rolagem do defensor
      const defenseRoll = rollDice("D20", currentAttacker === 1 ? 2 : 1);

      // Determina quem ganha o turno
      if (attackRoll > defenseRoll) {
        // Atacante mantém o turno
        updateBattleLog(
          `${attacker.character} venceu a disputa do turno! (${attackRoll} vs ${defenseRoll})`,
          gameLog
        );
        // Permite escolher entre ataque normal ou habilidade especial
        document.getElementById(
          `player${currentAttacker}D6Btn`
        ).disabled = false;
      } else {
        // Defensor ganha o turno
        updateBattleLog(
          `${defender.character} venceu a disputa do turno! (${defenseRoll} vs ${attackRoll})`,
          gameLog
        );
        // Alterna o turno
        setTimeout(() => {
          switchTurn(currentAttacker === 1 ? 2 : 1);
        }, 1500);
      }
    });

  // Configura botões de ação (após vencer a disputa)
  ["D6", "D8", "D10", "D12"].forEach((dice) => {
    const btn = document.getElementById(`player${currentAttacker}${dice}Btn`);
    if (btn) {
      btn.addEventListener("click", () => {
        if (dice === "D6") {
          // Ataque básico
          executeAttack(currentAttacker);
        } else {
          // Habilidade especial
          rollDice(dice, currentAttacker);
        }
      });
      btn.disabled = true; // Inicialmente desabilitados
    }
  });
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
