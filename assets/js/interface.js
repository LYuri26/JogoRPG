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
  // Variável para armazenar o roll do atacante
  let attackRoll = 0;

  // Limpa event listeners anteriores e reinicia os valores dos dados
  const resetButtons = () => {
    ["D20", "D6", "D8", "D10", "D12"].forEach((dice) => {
      const btn = document.getElementById(`player${currentAttacker}${dice}Btn`);
      const resultDisplay = document.getElementById(
        `player${currentAttacker}${dice}`
      );

      if (btn) {
        // Remove e recria o botão para limpar event listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        // Só habilita o D20 inicialmente
        newBtn.disabled = dice !== "D20";
      }

      if (resultDisplay) {
        resultDisplay.textContent = "0"; // Reseta o valor exibido
      }
    });
  };
  resetButtons();

  // Configura botões para o atacante atual
  const attacker = currentAttacker === 1 ? player1 : player2;
  const defender = currentAttacker === 1 ? player2 : player1;
  const defenderNum = currentAttacker === 1 ? 2 : 1;

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
      "battleLog"
    );

    // Habilita o botão do defensor após 1 segundo
    setTimeout(() => {
      const defenderD20Btn = document.getElementById(
        `player${defenderNum}D20Btn`
      );
      if (defenderD20Btn) {
        defenderD20Btn.disabled = false;
      }
    }, 1000);
  });

  // Botão D20 do defensor (inicialmente desabilitado)
  const defenderD20Btn = document.getElementById(`player${defenderNum}D20Btn`);
  if (defenderD20Btn) {
    defenderD20Btn.disabled = true;
    defenderD20Btn.addEventListener("click", async () => {
      // Desabilita o botão do defensor
      defenderD20Btn.disabled = true;

      // Rolagem do defensor
      const defenseRoll = rollDice("D20", defenderNum);
      updateBattleLog(
        `${defender.character} rolou um D20: ${defenseRoll}`,
        "battleLog"
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

  // Configura botões de ataque (D6 e dado especial)
  ["D6", "D8", "D10", "D12"].forEach((dice) => {
    const btn = document.getElementById(`player${currentAttacker}${dice}Btn`);
    if (btn) {
      btn.addEventListener("click", () => {
        // Executa o ataque com o dado correspondente
        const damageRoll = rollDice(dice, currentAttacker);
        const attackPower = damageRoll + attacker.data.damage;
        const damage = Math.max(1, attackPower - defender.data.armor);

        updateBattleLog(
          `${attacker.character} atacou com ${dice}: ${damageRoll} + ${attacker.data.damage} (Dano) = ${attackPower}`,
          "battleLog"
        );
        updateBattleLog(
          `Dano final: ${attackPower} - ${defender.data.armor} (Armadura) = ${damage}`,
          "battleLog"
        );

        applyDamage(defenderNum, damage);

        // Desabilita todos os botões de ataque após o uso
        ["D6", "D8", "D10", "D12"].forEach((d) => {
          const attackBtn = document.getElementById(
            `player${currentAttacker}${d}Btn`
          );
          if (attackBtn) attackBtn.disabled = true;
        });

        // Alterna o turno após 1.5 segundos
        setTimeout(() => {
          switchTurn(defenderNum);
        }, 1500);
      });
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
    // Atacante venceu a disputa
    updateBattleLog(
      `${attacker.character} venceu a disputa! (${attackRoll} > ${defenseRoll})`,
      "battleLog"
    );

    // Habilita botão de ataque básico (D6)
    document.getElementById(`player${attackerNum}D6Btn`).disabled = false;

    // Habilita dado especial se tiver stamina suficiente
    if (attacker.currentStamina >= getStaminaCost(attacker.data.cost)) {
      const specialDice = getSpecialDice(attacker.data.specialDice);
      document.getElementById(
        `player${attackerNum}${specialDice}Btn`
      ).disabled = false;
    }
  } else {
    // Defensor venceu a disputa
    updateBattleLog(
      `${defender.character} defendeu com sucesso! (${defenseRoll} >= ${attackRoll})`,
      "battleLog"
    );

    // Desabilita todos os botões de ataque do atacante atual
    ["D6", "D8", "D10", "D12"].forEach((dice) => {
      const btn = document.getElementById(`player${attackerNum}${dice}Btn`);
      if (btn) btn.disabled = true;
    });

    // Alterna o turno para o defensor
    switchTurn(defenderNum);
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
