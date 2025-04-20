var currentAttacker = 1; // Controla de quem é o turno (1 ou 2)
var gameLog = []; // Armazena o histórico da batalha

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
  // Garante que os jogadores tenham a estrutura correta
  if (!player1.data) {
    player1 = {
      character: player1.title,
      data: player1,
      currentLife: player1.life,
      currentStamina: player1.stamina,
      usedSpecial: 0,
    };
  }

  if (!player2.data) {
    player2 = {
      character: player2.title,
      data: player2,
      currentLife: player2.life,
      currentStamina: player2.stamina,
      usedSpecial: 0,
    };
  }
}

// Salva os jogadores com a estrutura completa
localStorage.setItem("player1", JSON.stringify(player1));
localStorage.setItem("player2", JSON.stringify(player2));

// Atualiza a interface
updatePlayerUI(1, player1);
updatePlayerUI(2, player2);

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

// FUNÇÕES AUXILIARES (serão implementadas em outros arquivos)

// Funções placeholder (serão sobrescritas quando outros scripts carregarem)
function updatePlayerUI(playerNum, playerData) {
  console.warn(
    "updatePlayerUI não implementado ainda para jogador " + playerNum
  );
}

function setupButtons(player1, player2, currentAttacker, gameLog) {
  console.warn("setupButtons não implementado ainda");
}

// EXPOSIÇÃO DAS FUNÇÕES GLOBAIS

// Disponibiliza todas as funções e variáveis necessárias no escopo global
window.currentAttacker = currentAttacker;
window.gameLog = gameLog;
window.initGame = initGame;
window.updatePlayerUI = updatePlayerUI;
window.setupButtons = setupButtons;
window.updateBattleLog = updateBattleLog;
