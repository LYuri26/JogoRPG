let currentSelectingPlayer = 1;
const selectedCharacters = { player1: null, player2: null };

// Função para criar o card de um personagem
function createCharacterCard(character, data) {
  return `
    <div class="col">
      <div class="card character-card h-100" id="${character}Card">
        <div class="card-img-container">
          <img src="./assets/images/${character.toLowerCase()}.jpeg" alt="${
    data.title
  }" class="card-img-top">
          <div class="character-badge bg-${data.badgeColor}">${
    data.badgeText
  }</div>
        </div>
        <div class="card-body">
          <h3 class="card-title character-name">${data.title}</h3>
          <p class="card-text character-desc">${data.description}</p>
          <div class="character-stats d-flex justify-content-between mb-3">
            <span class="badge bg-dark"><i class="fas fa-heart text-danger me-1"></i> ${
              data.life
            }</span>
            <span class="badge bg-dark"><i class="fas fa-fist-raised text-warning me-1"></i> ${
              data.damage
            }</span>
            <span class="badge bg-dark"><i class="fas fa-shield-alt text-primary me-1"></i> ${
              data.armor
            }</span>
          </div>
          <button id="${character}Btn" class="btn btn-primary w-100" onclick="openModal('${character}')">
            <i class="fas fa-search me-2"></i>Detalhes
          </button>
        </div>
      </div>
    </div>
  `;
}

// Função para carregar os personagens na página
function loadCharactersToPage() {
  const grid = document.getElementById("charactersGrid");
  if (!grid) return;

  grid.innerHTML = "";

  personagens.forEach((personagem) => {
    const script = document.createElement("script");
    script.src = `./assets/js/personagens/${personagem.toLowerCase()}.js`;
    script.onload = () => {
      characterData[personagem] = window[personagem.toLowerCase()];
      characterData[personagem].badgeColor = getBadgeColor(personagem);
      characterData[personagem].badgeText = getBadgeText(personagem);

      grid.innerHTML += createCharacterCard(
        personagem,
        characterData[personagem]
      );
    };
    script.onerror = () =>
      console.error(`Erro ao carregar personagem: ${personagem}`);
    document.head.appendChild(script);
  });
}

// Funções auxiliares para estilização
function getBadgeColor(character) {
  const colors = {
    Guerreiro: "danger",
    Ladino: "success",
    Mago: "info",
    Paladino: "primary",
    Barbaro: "danger",
    Arqueiro: "success",
    Monge: "warning",
    Cavaleiro: "primary",
    Assassino: "danger",
    Druida: "success",
    Gladiador: "warning",
    Cacador: "success",
    Mercenario: "secondary",
    Feiticeiro: "info",
    Samurai: "danger",
  };
  return colors[character] || "primary";
}

function getBadgeText(character) {
  const texts = {
    Guerreiro: "FORÇA",
    Ladino: "AGILIDADE",
    Mago: "MAGIA",
    Paladino: "PROTEÇÃO",
    Barbaro: "FÚRIA",
    Arqueiro: "PRECISÃO",
    Monge: "DESTREZA",
    Cavaleiro: "DEFESA",
    Assassino: "PRECISÃO",
    Druida: "NATUREZA",
    Gladiador: "COMBATE",
    Cacador: "RASTREIO",
    Mercenario: "VERSÁTIL",
    Feiticeiro: "ARCANO",
    Samurai: "HONRA",
  };
  return texts[character] || character.toUpperCase();
}

// Funções para seleção de jogadores
function setSelectingPlayer(playerNumber) {
  currentSelectingPlayer = playerNumber;
  document.querySelectorAll('[id^="selectPlayer"]').forEach((btn) => {
    btn.classList.remove("active");
  });
  document
    .getElementById(`selectPlayer${playerNumber}Btn`)
    .classList.add("active");
}

function selectCharacter() {
  const modalTitle = document.querySelector("#characterModal .modal-title");
  if (modalTitle && window.characterData) {
    const characterName = modalTitle.textContent;
    const charData = window.characterData[characterName];

    if (charData) {
      // Garante que a estrutura de dados seja consistente com o que o jogo espera
      const playerData = {
        character: characterName,
        title: characterName, // Adiciona title para compatibilidade
        data: {
          ...charData,
          title: characterName, // Garante que title exista no data
          specialDice: charData.specialDice || "D6", // Valores padrão
          cost: charData.cost || "1 Stamina",
          stamina: charData.stamina || 10, // Valor padrão se não existir
        },
        currentLife: charData.life,
        currentStamina: charData.stamina || 10,
        usedSpecial: 0,
      };

      selectedCharacters[`player${currentSelectingPlayer}`] = playerData;
      updatePlayerDisplay(currentSelectingPlayer, playerData.data);
      closeModal();
      checkReadyToStart();
    }
  }
}

function updatePlayerDisplay(playerNumber, characterData) {
  const playerElement = document.getElementById(
    `player${playerNumber}Selection`
  );
  if (playerElement) {
    playerElement.innerHTML = `
      <img src="./assets/images/${characterData.title.toLowerCase()}.jpeg" alt="${
      characterData.title
    }" 
           class="img-fluid rounded-circle mb-2" style="width: 100px; height: 100px; object-fit: cover;">
      <h4>${characterData.title}</h4>
      <div class="d-flex justify-content-center gap-2">
        <span class="badge bg-dark"><i class="fas fa-heart text-danger"></i> ${
          characterData.life
        }</span>
        <span class="badge bg-dark"><i class="fas fa-fist-raised text-warning"></i> ${
          characterData.damage
        }</span>
        <span class="badge bg-dark"><i class="fas fa-shield-alt text-primary"></i> ${
          characterData.armor
        }</span>
      </div>
    `;
  }
}

function checkReadyToStart() {
  const startBtn = document.getElementById("startGameBtn");
  startBtn.disabled = !(
    selectedCharacters.player1 && selectedCharacters.player2
  );
}

function startGame() {
  if (selectedCharacters.player1 && selectedCharacters.player2) {
    localStorage.setItem("player1", JSON.stringify(selectedCharacters.player1));
    localStorage.setItem("player2", JSON.stringify(selectedCharacters.player2));
    window.location.href = "jogo.html";
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  loadCharactersToPage();
  setSelectingPlayer(1);
});

window.selectCharacter = selectCharacter;
