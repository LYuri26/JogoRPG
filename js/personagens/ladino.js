// Definindo o personagem Ladino
const ladino = {
  classe: "Ladino",
  nome: "Mulher Gato",
  vida: 25,
  danoBase: 2,
  armadura: 2,
  esquiva: 5,
  peso: 1,
  staminaMana: 6,
  dadoEspecial: "D10 extra no ataque (se não foi atacado)", // Representa o dado extra que o Ladino usa no ataque
  custoStamina: 3, // Custo de Stamina
  penalidade: 2, // Quantas vezes o Ladino pode usar a habilidade especial
  usosRestantes: 2, // Contador de usos restantes para a habilidade especial
  ataqueEspecial: function () {
    // Verifica se o Ladino ainda pode usar a habilidade especial
    if (this.usosRestantes <= 0) {
      console.log("O Ladino não pode mais usar o ataque especial.");
      return 0;
    }

    // Verifica se o Ladino foi atacado antes de usar a habilidade especial
    if (!this.foiAtacado) {
      // Se não foi atacado, faz o ataque com dado extra (D10)
      const dadoD10 = Math.floor(Math.random() * 10) + 1;
      const danoTotal = this.danoBase + dadoD10;
      console.log("Dano do ataque especial:", danoTotal);

      // Decrementa a Stamina após o uso do ataque especial
      this.staminaMana -= this.custoStamina;
      console.log("Stamina restante:", this.staminaMana);

      // Decrementa os usos restantes da habilidade
      this.usosRestantes--;
      console.log("Usos restantes do ataque especial:", this.usosRestantes);

      // Marca que o Ladino foi atacado para não usar a habilidade especial imediatamente após
      this.foiAtacado = true;

      return danoTotal;
    } else {
      console.log(
        "O Ladino não pode usar a habilidade especial após ser atacado."
      );
      return 0;
    }
  },
  restaurarStamina: function () {
    // Função para restaurar a Stamina (caso necessário no jogo)
    this.staminaMana = 6;
    console.log("Stamina restaurada para:", this.staminaMana);
  },
  resetarAtaqueEspecial: function () {
    // Função para resetar a condição de ataque especial após um turno
    this.foiAtacado = false;
    console.log(
      "O Ladino pode usar novamente a habilidade especial no próximo turno."
    );
  },
  foiAtacado: false, // Verifica se o Ladino foi atacado antes de usar a habilidade
  mostrarJogador: function () {
    const jogadorSelecionado =
      localStorage.getItem("player1Character") === "Ladino"
        ? "player1"
        : localStorage.getItem("player2Character") === "Ladino"
        ? "player2"
        : null;

    if (jogadorSelecionado) {
      console.log(`O Ladino foi selecionado pelo ${jogadorSelecionado}`);
      this.adicionarDadosNaTela(jogadorSelecionado);
    } else {
      console.log("Nenhum jogador selecionou o Ladino.");
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

    // Criar botão para D10
    const d10Button = document.createElement("button");
    d10Button.textContent = "D10";
    d10Button.id = `${playerId}-d10`;
    d10Button.classList.add("dice-button");

    // Adicionar botões ao contêiner
    diceContainer.appendChild(d6Button);
    diceContainer.appendChild(d10Button);

    // Adicionar contêiner ao jogador correspondente
    playerSection.appendChild(diceContainer);
  },
};

// Chamar a função para exibir os dados apenas no jogador correto
ladino.mostrarJogador();
