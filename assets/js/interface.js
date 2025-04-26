function updatePlayerUI(playerNum, playerData) {
  if (!playerData || !playerData.data) {
    console.error("Dados do jogador inválidos:", playerData);
    return;
  }

  // Elementos básicos
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

  // Atualiza textos
  document.getElementById(elements.character).textContent =
    playerData.character;
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

  // Barra de vida
  const healthBar = document.getElementById(elements.healthBar);
  const healthPercent = (playerData.currentLife / playerData.data.life) * 100;
  healthBar.style.width = `${healthPercent}%`;
  healthBar.className = `progress-bar ${
    healthPercent > 30 ? "bg-danger" : "bg-warning"
  }`;

  // Penalidades
  document.getElementById(`player${playerNum}ArmaduraPenalidade`).textContent =
    playerData.armorPenalty ? `(-${playerData.armorPenalty})` : "";
  document.getElementById(`player${playerNum}EsquivaPenalidade`).textContent =
    playerData.dodgePenalty ? `(-${playerData.dodgePenalty})` : "";
}

function setupButtons(player1, player2, currentAttacker) {
  // Limpa event listeners
  ["D20", "D6", "D8", "D10", "D12"].forEach((dice) => {
    [1, 2].forEach((playerNum) => {
      const btn = document.getElementById(`player${playerNum}${dice}Btn`);
      if (btn) {
        btn.replaceWith(btn.cloneNode(true));
        btn.disabled = true;
      }
    });
  });

  const defenderNum = currentAttacker === 1 ? 2 : 1;
  const attackerD20Btn = document.getElementById(
    `player${currentAttacker}D20Btn`
  );

  attackerD20Btn.disabled = false;
  attackerD20Btn.addEventListener(
    "click",
    function () {
      this.disabled = true;
      const attackRoll = rollDice("D20", currentAttacker);

      setTimeout(() => {
        const defenderD20Btn = document.getElementById(
          `player${defenderNum}D20Btn`
        );
        if (defenderD20Btn) {
          defenderD20Btn.disabled = false;
          defenderD20Btn.addEventListener(
            "click",
            function () {
              this.disabled = true;
              const defenseRoll = rollDice("D20", defenderNum);

              setTimeout(() => {
                const attacker = currentAttacker === 1 ? player1 : player2;
                const defender = currentAttacker === 1 ? player2 : player1;
                processCombatResult(
                  attacker,
                  defender,
                  currentAttacker,
                  attackRoll,
                  defenseRoll
                );
              }, 1000);
            },
            { once: true }
          );
        }
      }, 1000);
    },
    { once: true }
  );
}

function setupAttackButtons(attacker, defender, attackerNum, defenderNum) {
  const d6Btn = document.getElementById(`player${attackerNum}D6Btn`);
  if (d6Btn) {
    d6Btn.disabled = false;
    d6Btn.addEventListener(
      "click",
      function () {
        this.disabled = true;
        const damageRoll = rollDice("D6", attackerNum);
        const attackPower = damageRoll + attacker.data.damage;
        const damage = Math.max(1, attackPower - defender.data.armor);

        updateBattleLog(
          `⚔️ ${attacker.character} atacou com D6: ${damageRoll} + ${attacker.data.damage} = ${attackPower}`
        );
        updateBattleLog(
          `🛡️ Dano final: ${attackPower} - ${defender.data.armor} = ${damage}`
        );

        applyDamage(defenderNum, damage);
        setTimeout(() => switchTurn(defenderNum), 1500);
      },
      { once: true }
    );
  }

  if (attacker.currentStamina >= getStaminaCost(attacker.data.cost)) {
    const specialDice = getSpecialDice(attacker.data.specialDice);
    const specialBtn = document.getElementById(
      `player${attackerNum}${specialDice}Btn`
    );

    if (specialBtn) {
      specialBtn.disabled = false;
      specialBtn.addEventListener(
        "click",
        function () {
          this.disabled = true;

          // Verifica se pode usar a habilidade
          if (!useSpecialAbility(attacker, defender, attackerNum)) {
            return; // Se não puder usar, retorna sem executar o ataque
          }

          const damageRoll = rollDice(specialDice, attackerNum);
          const attackPower = damageRoll + attacker.data.damage;

          // Aplica penalidades se existirem
          const armorReduction = defender.data.armorPenalty
            ? defender.data.armor - parseInt(defender.data.armorPenalty)
            : defender.data.armor;

          const damage = Math.max(1, attackPower - armorReduction);

          updateBattleLog(
            `⚡ ${attacker.character} usou habilidade especial (${specialDice}): ${damageRoll} + ${attacker.data.damage} = ${attackPower}`
          );
          updateBattleLog(
            `🛡️ Dano final: ${attackPower} - ${armorReduction} = ${damage}`
          );

          applyDamage(defenderNum, damage);
          setTimeout(() => switchTurn(defenderNum), 1500);
        },
        { once: true }
      );
    }
  }
}

function showFeedback(elementId, text, type = "normal") {
  const element = document.getElementById(elementId);
  if (!element) return;

  const feedback = document.createElement("div");
  feedback.className = `dice-roll-feedback ${type}`;
  feedback.textContent = text;
  element.appendChild(feedback);

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

  document.getElementById(`player${playerNum}${diceType}`).textContent = result;
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
window.getStaminaCost = getStaminaCost;
window.getSpecialDice = getSpecialDice;
