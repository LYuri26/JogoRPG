// =============================================
// FUNÇÕES PRINCIPAIS DO JOGO
// =============================================

// Função chamada quando o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", function () {
  // Recupera os dados dos jogadores do localStorage
  var player1 = JSON.parse(localStorage.getItem("player1"));
  var player2 = JSON.parse(localStorage.getItem("player2"));

  // Verifica se os dados dos jogadores existem
  if (!player1 || !player2) {
    alert(
      "Dados dos jogadores não encontrados! Por favor, selecione os personagens novamente."
    );
    window.location.href = "index.html";
    return;
  }

  // Inicia o jogo com os jogadores carregados
  initGame(player1, player2);
});

// Função para inicializar o jogo
function initGame(player1, player2) {
  // Verificação crítica de dados
  if (!player1 || !player2 || !player1.data || !player2.data) {
    alert("Dados dos jogadores corrompidos! Redirecionando...");
    window.location.href = "index.html";
    return;
  }

  // Garante que os dados tenham a estrutura mínima necessária
  const ensurePlayerStructure = (player) => {
    return {
      ...player,
      data: {
        ...player.data,
        title: player.data.title || player.character, // Garante que title exista
        specialDice: player.data.specialDice || "D6",
        cost: player.data.cost || "1 Stamina",
        stamina: player.data.stamina || 10,
      },
      currentLife: player.currentLife || player.data.life,
      currentStamina: player.currentStamina || player.data.stamina || 10,
      usedSpecial: player.usedSpecial || 0,
    };
  };

  const verifiedPlayer1 = ensurePlayerStructure(player1);
  const verifiedPlayer2 = ensurePlayerStructure(player2);

  // Salva os jogadores com a estrutura completa
  localStorage.setItem("player1", JSON.stringify(verifiedPlayer1));
  localStorage.setItem("player2", JSON.stringify(verifiedPlayer2));

  // Atualiza a interface
  updatePlayerUI(1, verifiedPlayer1);
  updatePlayerUI(2, verifiedPlayer2);

  // Configura os botões para o primeiro turno
  setupButtons(verifiedPlayer1, verifiedPlayer2, 1);
  document.getElementById("player2D20Btn").disabled = true;
  document.getElementById("player1D20Btn").disabled = false;
  updateBattleLog(
    `Começa o combate! ${verifiedPlayer1.character} vs ${verifiedPlayer2.character}`,
    gameLog
  );
  updateBattleLog(
    `${verifiedPlayer1.character}, role seu D20 para começar o ataque!`,
    gameLog
  );
}

// Função para atualizar o log de batalha
function updateBattleLog(message, logArray) {
  // Adiciona a mensagem ao array de log
  logArray.push(message);

  // Atualiza a exibição do log na tela
  var logElement = document.getElementById("logBatalha");
  if (logElement) {
    // Cria um novo elemento para a mensagem
    var logEntry = document.createElement("div");
    logEntry.className = "log-entry";
    logEntry.textContent = message;

    // Adiciona ao topo do log
    logElement.insertBefore(logEntry, logElement.firstChild);

    // Mantém o scroll no topo
    logElement.scrollTop = 0;
  }
}

// Disponibiliza todas as funções e variáveis necessárias no escopo global
window.currentAttacker = currentAttacker;
window.gameLog = gameLog;
window.initGame = initGame;
window.updatePlayerUI = updatePlayerUI;
window.setupButtons = setupButtons;
window.updateBattleLog = updateBattleLog;
