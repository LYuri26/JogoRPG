// Função para atualizar a interface do jogador
function updatePlayerUI(playerNum, playerData) {
  // Verifica se playerData.data existe (para compatibilidade)
  const data = playerData.data || playerData;

  document.getElementById(`player${playerNum}Character`).textContent =
    playerData.character || data.title;
  document.getElementById(`player${playerNum}Vida`).textContent =
    playerData.currentLife || data.life;
  document.getElementById(`player${playerNum}Dano`).textContent = data.damage;
  document.getElementById(`player${playerNum}Armadura`).textContent =
    data.armor;
  document.getElementById(`player${playerNum}Esquiva`).textContent = data.dodge;
  document.getElementById(`player${playerNum}Stamina`).textContent = `${
    playerData.currentStamina || data.stamina
  }/${data.stamina}`;
  document.getElementById(`player${playerNum}DadoEspecial`).textContent =
    getSpecialDice(data.specialDice);
  document.getElementById(`player${playerNum}Custo`).textContent = data.cost;

  // Atualiza a barra de vida
  const maxLife = data.life;
  const currentLife = playerData.currentLife || maxLife;
  const healthPercent = (currentLife / maxLife) * 100;
  document.getElementById(
    `player${playerNum}HealthBar`
  ).style.width = `${healthPercent}%`;
}

// Função para mostrar feedback visual (crítico, falha, normal)
function showFeedback(elementId, text, type) {
  type = type || "normal"; // Valor padrão se não fornecido

  const element = document.getElementById(elementId);
  if (!element) return;

  const feedback = document.createElement("div");
  feedback.className = `dice-roll-feedback ${
    type === "critical" ? "dice-critical" : ""
  } ${type === "fail" ? "dice-fail" : ""}`;
  feedback.textContent = text;

  element.appendChild(feedback);

  setTimeout(() => {
    feedback.style.opacity = "1";
    feedback.style.transform = "translateY(-30px)";
  }, 10);

  setTimeout(() => {
    feedback.style.opacity = "0";
    feedback.style.transform = "translateY(-60px)";
    setTimeout(() => feedback.remove(), 500);
  }, 1000);
}

// Função para rolar dados
function rollDice(diceType, playerNum) {
  const sides = parseInt(diceType.substring(1));
  const result = Math.floor(Math.random() * sides) + 1;

  const diceBtn = document.getElementById(`player${playerNum}${diceType}Btn`);
  showFeedback(
    `player${playerNum}${diceType}Btn`,
    result.toString(),
    result === sides ? "critical" : result === 1 ? "fail" : "normal"
  );

  document.getElementById(`player${playerNum}${diceType}`).textContent = result;

  return result;
}

// Função para configurar os botões de ação
function setupButtons(player1, player2, currentAttacker) {
  const attacker = currentAttacker === 1 ? player1 : player2;
  const defender = currentAttacker === 1 ? player2 : player1;

  // Configura botão de habilidade especial (D20)
  document
    .getElementById(`player${currentAttacker}D20Btn`)
    .addEventListener("click", function () {
      useSpecialAbility(attacker, defender, currentAttacker);
    });

  // Configura botões de dados normais (D6, D8, D10, D12)
  ["D6", "D8", "D10", "D12"].forEach(function (dice) {
    const btn = document.getElementById(`player${currentAttacker}${dice}Btn`);
    if (btn) {
      btn.addEventListener("click", function () {
        rollDice(dice, currentAttacker);
      });
    }
  });
}

// Função auxiliar para obter o tipo de dado especial
function getSpecialDice(specialText) {
  if (specialText.includes("D12")) return "D12";
  if (specialText.includes("D10")) return "D10";
  if (specialText.includes("D8")) return "D8";
  return "D6";
}

// Registra funções no escopo global
window.updatePlayerUI = updatePlayerUI;
window.showFeedback = showFeedback;
window.rollDice = rollDice;
window.setupButtons = setupButtons;
window.getSpecialDice = getSpecialDice;
