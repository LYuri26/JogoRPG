let currentPlayer = 1;
let player1Character = null;
let player2Character = null;
let previousPlayer1Character = null;
let previousPlayer2Character = null;

// Função para selecionar o personagem
function selectCharacter() {
  const character = document.getElementById("characterTitle").textContent;
  console.log("Personagem selecionado:", character);

  // Se o jogador já tiver escolhido um personagem antes, restaura o anterior
  if (currentPlayer === 1 && player1Character) {
    previousPlayer1Character = player1Character;
    resetCharacter(previousPlayer1Character);
  } else if (currentPlayer === 2 && player2Character) {
    previousPlayer2Character = player2Character;
    resetCharacter(previousPlayer2Character);
  }

  // Armazena o novo personagem selecionado pelo jogador atual
  if (currentPlayer === 1) {
    player1Character = character;
    console.log("Jogador 1 escolheu:", player1Character);
    document.getElementById("player1Status").textContent =
      "Jogador 1: " + player1Character + " selecionado!";
    document.getElementById("continueButton").style.display = "block";
    loadCharacterScript(player1Character);

    localStorage.setItem(
      "player1Character",
      JSON.stringify(characterData[character])
    );
    localStorage.setItem("player1Name", "Jogador 1");
  } else {
    player2Character = character;
    console.log("Jogador 2 escolheu:", player2Character);
    document.getElementById("player2Status").textContent =
      "Jogador 2: " + player2Character + " selecionado!";
    loadCharacterScript(player2Character);

    localStorage.setItem(
      "player2Character",
      JSON.stringify(characterData[character])
    );
    localStorage.setItem("player2Name", "Jogador 2");
  }

  updateCardSelection(character);

  if (player1Character !== null && player2Character !== null) {
    document.getElementById("startGameButton").style.display = "block";
  }

  atualizarStatusJogador();
  closeModal();
}

// Funções auxiliares
function resetCharacter(character) {
  const card = document.getElementById(character + "Card");
  if (card) {
    card.classList.remove("selected-character");
    card.style.opacity = 1;
  }

  const button = document.getElementById(character + "Btn");
  if (button) {
    button.style.display = "block";
    button.disabled = false;
  }
}

function updateCardSelection(character) {
  const card = document.getElementById(character + "Card");
  if (card) {
    card.classList.add("selected-character");
    card.style.opacity = "0.7";
  }

  const button = document.getElementById(character + "Btn");
  if (button) {
    button.style.display = "none";
  }
}

function loadCharacterScript(character) {
  const script = document.createElement("script");
  script.src = `./assets/js/personagens/${character.toLowerCase()}.js`;
  script.type = "module";
  document.head.appendChild(script);
}

function continueGame() {
  if (currentPlayer === 1 && player1Character !== null) {
    currentPlayer = 2;
    atualizarStatusJogador();
    document.getElementById("continueButton").style.display = "none";
  }
}

function atualizarStatusJogador() {
  let statusText =
    currentPlayer === 1
      ? "Jogador 1 Selecionando Personagem"
      : "Jogador 2 Selecionando Personagem";

  document.getElementById("player1Status").textContent = player1Character
    ? "Jogador 1: " + player1Character + " selecionado!"
    : statusText;
  document.getElementById("player2Status").textContent = player2Character
    ? "Jogador 2: " + player2Character + " selecionado!"
    : "Jogador 2 Aguardando...";

  let playerStatusTitle = document.getElementById("playerStatusTitle");
  if (playerStatusTitle) {
    playerStatusTitle.textContent = statusText;
  }
}

function startGame() {
  if (!player1Character || !player2Character) {
    alert("Ambos os jogadores precisam selecionar um personagem!");
    return;
  }

  loadCharacterScript(player1Character);
  loadCharacterScript(player2Character);
  alert("Iniciando o jogo com " + player1Character + " e " + player2Character);
  window.location.href = "../jogo.html";
}

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
  currentPlayer = 1;
  document.getElementById("player1Status").textContent =
    "Jogador 1 Selecionando Personagem";
  document.getElementById("player2Status").textContent =
    "Jogador 2 Aguardando...";

  console.log(
    "Jogador 1 selecionou:",
    localStorage.getItem("player1Character")
  );
  console.log(
    "Jogador 2 selecionou:",
    localStorage.getItem("player2Character")
  );
});
