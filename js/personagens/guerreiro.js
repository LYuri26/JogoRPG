// Definindo o personagem Guerreiro
const guerreiro = {
  classe: "Guerreiro",
  nome: "Vegeta",
  vida: 30,
  danoBase: 3,
  armadura: 5,
  esquiva: 2,
  peso: 4,
  staminaMana: 6,
  dadoEspecial: "D8 extra no ataque", // Representa o dado extra que o Guerreiro usa no ataque
  custoStamina: 2, // Corrigido para custoStamina
  penalidade: "-1 defesa no turno seguinte", // Penalidade após usar a habilidade
  ataqueEspecial: function () {
    const dadoD8 = Math.floor(Math.random() * 8) + 1;
    const danoTotal = this.danoBase + dadoD8;
    console.log("Dano do ataque especial:", danoTotal);
    this.staminaMana -= this.custoStamina;
    console.log("Stamina restante:", this.staminaMana);
    this.aplicarPenalidade();
    return danoTotal;
  },
  aplicarPenalidade: function () {
    console.log(this.penalidade);
  },
  restaurarStamina: function () {
    this.staminaMana = 6;
    console.log("Stamina restaurada para:", this.staminaMana);
  },
  mostrarJogador: function () {
    const jogadorSelecionado =
      localStorage.getItem("player1Character") === "Guerreiro"
        ? "player1"
        : localStorage.getItem("player2Character") === "Guerreiro"
        ? "player2"
        : null;

    if (jogadorSelecionado) {
      console.log(`O Guerreiro foi selecionado pelo ${jogadorSelecionado}`);
      this.adicionarDadosNaTela(jogadorSelecionado);
    } else {
      console.log("Nenhum jogador selecionou o Guerreiro.");
    }
  },
  adicionarDadosNaTela: function (playerId) {
    const playerSection = document.getElementById(playerId);
    if (!playerSection) {
      console.error(`Elemento ${playerId} não encontrado.`);
      return;
    }

    // Criar contêiner para os dados
    const diceContainer = document.createElement("div");
    diceContainer.id = `${playerId}-dados-container`;

    // Criar botão para D6
    const d6Button = document.createElement("button");
    d6Button.textContent = "D6";
    d6Button.id = `${playerId}-d6`;
    d6Button.classList.add("dice-button");

    // Criar botão para D8
    const d8Button = document.createElement("button");
    d8Button.textContent = "D8";
    d8Button.id = `${playerId}-d8`;
    d8Button.classList.add("dice-button");

    // Adicionar botões ao contêiner
    diceContainer.appendChild(d6Button);
    diceContainer.appendChild(d8Button);

    // Adicionar contêiner ao jogador correspondente
    playerSection.appendChild(diceContainer);
  },
};

// Chamar a função para exibir os dados apenas no jogador correto
guerreiro.mostrarJogador();
