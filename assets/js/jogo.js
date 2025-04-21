// =============================================
// FUNÇÕES PRINCIPAIS DO JOGO
// =============================================

// Função chamada quando o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", function () {
  const player1 = JSON.parse(localStorage.getItem("player1"));
  const player2 = JSON.parse(localStorage.getItem("player2"));

  if (!player1 || !player2) {
    alert("Dados dos jogadores não encontrados!");
    window.location.href = "index.html";
    return;
  }

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

  // Função auxiliar para garantir estrutura mínima do jogador
  const ensurePlayerStructure = (player) => {
    return {
      ...player,
      data: {
        ...player.data,
        title: player.data.title || player.character,
        specialDice: player.data.specialDice || "D6",
        cost: player.data.cost || "1 Stamina",
        stamina: player.data.stamina || 10,
      },
      currentLife: player.currentLife || player.data.life,
      currentStamina: player.currentStamina || player.data.stamina || 10,
      usedSpecial: player.usedSpecial || 0,
    };
  };

  // Verifica e completa a estrutura dos jogadores
  const verifiedPlayer1 = ensurePlayerStructure(player1);
  const verifiedPlayer2 = ensurePlayerStructure(player2);

  // Salva os jogadores no localStorage
  localStorage.setItem("player1", JSON.stringify(verifiedPlayer1));
  localStorage.setItem("player2", JSON.stringify(verifiedPlayer2));

  // Atualiza a interface dos jogadores
  updatePlayerUI(1, verifiedPlayer1);
  updatePlayerUI(2, verifiedPlayer2);

  // Configura os botões para o primeiro turno
  setupButtons(verifiedPlayer1, verifiedPlayer2, 1);

  // Inicializa todos os valores dos dados como 0
  ["D20", "D6", "D8", "D10", "D12"].forEach((dice) => {
    document.getElementById(`player1${dice}`).textContent = "0";
    document.getElementById(`player2${dice}`).textContent = "0";
  });

  // Habilita apenas o D20 do Jogador 1 (iniciante)
  document.getElementById("player1D20Btn").disabled = false;
  document.getElementById("player2D20Btn").disabled = true;

  // Desabilita todos os outros botões inicialmente
  ["D6", "D8", "D10", "D12"].forEach((dice) => {
    document.getElementById(`player1${dice}Btn`).disabled = true;
    document.getElementById(`player2${dice}Btn`).disabled = true;
  });

  // Inicia o log de combate
  const gameLog = document.getElementById("battleLog");
  updateBattleLog(
    `Começa o combate! ${verifiedPlayer1.character} vs ${verifiedPlayer2.character}`,
    gameLog
  );
  updateBattleLog(
    `${verifiedPlayer1.character}, role seu D20 para começar o ataque!`,
    gameLog
  );

  // Inicializa o turno como 1 (caso não exista)
  localStorage.setItem("currentTurn", "1");
}

// Função para atualizar o log de batalha
function updateBattleLog(message, logElementId) {
  // Adiciona a mensagem ao array de log
  gameLog.push(message);

  // Atualiza a exibição do log na tela
  var logElement = document.getElementById(logElementId);
  if (logElement) {
    var logEntry = document.createElement("div");
    logEntry.className = "log-entry";
    logEntry.textContent = message;
    logElement.insertBefore(logEntry, logElement.firstChild);
    logElement.scrollTop = 0;
  }
}

// Variáveis e funções expostas globalmente
window.currentAttacker = currentAttacker;
window.gameLog = gameLog;
window.initGame = initGame;
window.updatePlayerUI = updatePlayerUI;
window.setupButtons = setupButtons;
window.updateBattleLog = updateBattleLog;
