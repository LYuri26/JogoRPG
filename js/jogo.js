document.addEventListener("DOMContentLoaded", function () {
  // Recupera os dados dos jogadores do localStorage
  let player1Character = localStorage.getItem("player1Character");
  let player2Character = localStorage.getItem("player2Character");
  let player1Name = localStorage.getItem("player1Name");
  let player2Name = localStorage.getItem("player2Name");

  // Verifica se os dados dos jogadores estão disponíveis
  if (!player1Character || !player2Character || !player1Name || !player2Name) {
    console.error(
      "Erro: Personagens ou nomes não encontrados no localStorage."
    );
    alert("Os personagens não foram selecionados corretamente! Retornando...");
    window.location.href = "../index.html"; // Volta para a tela de seleção
    return;
  }

  // Remove espaços e aspas extras dos dados
  player1Character = player1Character.trim().replace(/^"|"$/g, "");
  player2Character = player2Character.trim().replace(/^"|"$/g, "");

  console.log(
    "Jogadores carregados do localStorage:",
    player1Name,
    player1Character,
    player2Name,
    player2Character
  );

  // Função para carregar o arquivo JS do personagem baseado no nome
  function carregarPersonagem(nomePersonagem) {
    let scriptSrc;
    let personagem;

    // Defina qual arquivo JS carregar baseado no nome do personagem
    if (nomePersonagem === "Guerreiro") {
      scriptSrc = "js/personagens/guerreiro.js"; // Caminho correto se estiver no servidor
    } else if (nomePersonagem === "Ladino") {
      scriptSrc = "js/personagens/ladino.js"; // Caminho correto se estiver no servidor
    } else {
      console.error("Personagem não encontrado.");
      return;
    }

    // Criando o script para importar dinamicamente
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.onload = () => {
      console.log(`${nomePersonagem} carregado com sucesso.`);

      // Agora que o script foi carregado, o objeto do personagem estará disponível
      if (nomePersonagem === "Guerreiro") {
        personagem = guerreiro; // Supondo que o arquivo guerreiro.js defina o objeto guerreiro
      } else if (nomePersonagem === "Ladino") {
        personagem = ladino; // Supondo que o arquivo ladino.js defina o objeto ladino
      }

      // Atualiza as informações no HTML com o personagem carregado
      if (nomePersonagem === player1Character) {
        updatePlayerInfo("player1", personagem, player1Name);
      } else if (nomePersonagem === player2Character) {
        updatePlayerInfo("player2", personagem, player2Name);
      }
    };
    script.onerror = () => {
      console.error(`Erro ao carregar o arquivo ${scriptSrc}`);
    };

    document.body.appendChild(script);
  }

  // Função para atualizar as informações do jogador no HTML
  function updatePlayerInfo(playerId, character, playerName) {
    if (!character) {
      console.error(`Erro: Características de ${playerId} não encontradas`);
      return;
    }

    console.log(`Atualizando dados de ${playerId}:`, character);

    // Defina os elementos que precisam ser atualizados
    const elements = [
      {
        id: `${playerId}Character`,
        value: `${playerName} - ${character.classe} - ${character.nome}`,
      },
      { id: `${playerId}Vida`, value: character.vida || "Desconhecido" },
      { id: `${playerId}Dano`, value: character.danoBase || "Desconhecido" },
      {
        id: `${playerId}Armadura`,
        value: character.armadura || "Desconhecido",
      },
      { id: `${playerId}Esquiva`, value: character.esquiva || "Desconhecido" },
      { id: `${playerId}Peso`, value: character.peso || "Desconhecido" },
      {
        id: `${playerId}Stamina`,
        value: character.staminaMana || "Desconhecido",
      },
      {
        id: `${playerId}DadoEspecial`,
        value: character.dadoEspecial || "Desconhecido",
      },
      {
        id: `${playerId}Custo`,
        value: character.custoStamina || "Desconhecido", // Corrigido para custoStamina
      },
      {
        id: `${playerId}Penalidade`,
        value: character.penalidade || "Desconhecido",
      },
    ];

    // Atualiza os campos do HTML com as informações do personagem
    elements.forEach((element) => {
      const el = document.getElementById(element.id);
      if (el) {
        el.textContent = element.value;
      } else {
        console.error(`Elemento ${element.id} não encontrado no HTML.`);
      }
    });
  }

  // Carregar os personagens com base nos dados do localStorage
  carregarPersonagem(player1Character); // Carrega o personagem do Jogador 1
  carregarPersonagem(player2Character); // Carrega o personagem do Jogador 2
});
