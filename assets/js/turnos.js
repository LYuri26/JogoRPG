const GerenciadorTurnos = {
  estado: {
    turnoAtual: 1,
    jogadorAtivo: null,
    fase: "inicial",
    atacante: null,
    defensor: null,
    dadosRolados: {
      player1: { d20: 0, d6: 0, d8: 0, d10: 0, d12: 0 },
      player2: { d20: 0, d6: 0, d8: 0, d10: 0, d12: 0 },
    },
    jogadorRolando: null,
  },

  iniciarTurno: function () {
    console.log(`Iniciando turno ${this.estado.turnoAtual}`);

    this.resetarDados();
    this.estado.jogadorAtivo = this.estado.turnoAtual % 2 === 1 ? 1 : 2;
    this.definirFase("inicial");
    this.atualizarInterface();

    // Habilita apenas o D20 do jogador ativo
    this.estado.jogadorRolando = this.estado.jogadorAtivo;
    this.desabilitarTodosDadosExceto(this.estado.jogadorRolando, "D20");
  },

  resetarDados: function () {
    this.estado.dadosRolados = {
      player1: { d20: 0, d6: 0, d8: 0, d10: 0, d12: 0 },
      player2: { d20: 0, d6: 0, d8: 0, d10: 0, d12: 0 },
    };

    // Desabilita todos os botões de dados
    document.querySelectorAll(".dice-button").forEach((btn) => {
      btn.disabled = true;
    });

    // Reseta os valores exibidos
    document
      .querySelectorAll(
        '[id^="player"][id$="D20"], [id^="player"][id$="D6"], [id^="player"][id$="D8"], [id^="player"][id$="D10"], [id^="player"][id$="D12"]'
      )
      .forEach((el) => {
        el.textContent = "0";
      });
  },

  habilitarD20: function (jogador) {
    // Desabilita todos os D20 primeiro
    this.desabilitarD20();

    // Habilita apenas o D20 do jogador especificado
    const btn = document.getElementById(`player${jogador}D20Btn`);
    if (btn) btn.disabled = false;

    console.log(`D20 do Jogador ${jogador} habilitado`);
  },

  desabilitarD20: function () {
    document.getElementById("player1D20Btn").disabled = true;
    document.getElementById("player2D20Btn").disabled = true;
  },

  definirFase: function (fase) {
    this.estado.fase = fase;
    this.atualizarInterface();
  },

  desabilitarTodosDadosExceto: function (jogador, dado) {
    // Desabilita todos os dados de todos os jogadores
    document.querySelectorAll(".dice-button").forEach((btn) => {
      btn.disabled = true;
    });

    // Habilita apenas o dado especificado para o jogador especificado
    if (dado && jogador) {
      const btn = document.getElementById(`player${jogador}${dado}Btn`);
      if (btn) btn.disabled = false;
    }
  },

  atualizarInterface: function () {
    document.getElementById(
      "contadorTurno"
    ).textContent = `Turno: ${this.estado.turnoAtual}`;
    document.getElementById(
      "currentPhase"
    ).textContent = `Fase: ${this.estado.fase}`;

    if (this.estado.fase === "inicial") {
      document.getElementById(
        "resultadoTurno"
      ).textContent = `Jogador ${this.estado.jogadorAtivo} começa o turno. Role o D20!`;
    } else if (this.estado.fase === "disputa") {
      document.getElementById("resultadoTurno").textContent =
        "Decidindo quem ataca...";
    } else if (this.estado.fase === "ataque") {
      document.getElementById(
        "resultadoTurno"
      ).textContent = `Jogador ${this.estado.atacante} pode atacar!`;
    }
  },

  rolarD20: function (jogador) {
    const resultado = Math.floor(Math.random() * 20) + 1;
    this.estado.dadosRolados[`player${jogador}`].d20 = resultado;

    document.getElementById(`player${jogador}D20`).textContent = resultado;

    // Usa a nova função para desabilitar todos os dados
    this.desabilitarTodosDadosExceto();

    // Verifica se é o jogador ativo rolando
    if (jogador === this.estado.jogadorAtivo) {
      // Agora é a vez do outro jogador rolar
      this.estado.jogadorRolando = jogador === 1 ? 2 : 1;
      this.desabilitarTodosDadosExceto(this.estado.jogadorRolando, "D20");
    } else {
      // Ambos já rolaram, verifica disputa
      this.verificarDisputaD20();
    }
  },

  verificarDisputaD20: function () {
    const { player1, player2 } = this.estado.dadosRolados;

    if (player1.d20 > 0 && player2.d20 > 0) {
      this.definirFase("disputa");

      // Verifica quem venceu a disputa
      if (player1.d20 > player2.d20) {
        this.estado.atacante = 1;
        this.estado.defensor = 2;
      } else if (player2.d20 > player1.d20) {
        this.estado.atacante = 2;
        this.estado.defensor = 1;
      } else {
        // Empate - encerra o turno sem ataque
        document.getElementById("resultadoTurno").textContent =
          "Empate! Turno encerrado.";
        this.finalizarTurno();
        return;
      }

      // Verifica se o atacante é o jogador ativo
      if (this.estado.atacante === this.estado.jogadorAtivo) {
        this.definirFase("ataque");

        // Habilita os dados de ataque para o atacante
        this.habilitarDadosAtaque(this.estado.atacante);

        if (typeof iniciarBatalha === "function") {
          iniciarBatalha(this.estado.atacante, this.estado.defensor);
        }
      } else {
        // Se não for, inverte os papéis e finaliza o turno
        document.getElementById(
          "resultadoTurno"
        ).textContent = `Jogador ${this.estado.jogadorAtivo} perdeu a disputa! Turno encerrado.`;
        this.finalizarTurno();
      }
    }
  },
  habilitarDadosAtaque: function (jogador) {
    // Desabilita todos os dados primeiro
    this.desabilitarTodosDadosExceto();

    // Habilita o D6 (ataque básico) para todos
    const d6Btn = document.getElementById(`player${jogador}D6Btn`);
    if (d6Btn) d6Btn.disabled = false;

    // Habilita dados especiais baseado na classe
    const personagem =
      jogador === 1 ? window.player1Character : window.player2Character;
    if (personagem) {
      if (personagem.classe === "Guerreiro") {
        const d8Btn = document.getElementById(`player${jogador}D8Btn`);
        if (d8Btn) d8Btn.disabled = false;
      } else if (personagem.classe === "Ladino") {
        const d10Btn = document.getElementById(`player${jogador}D10Btn`);
        if (d10Btn) d10Btn.disabled = false;
      }
      // Adicione outras classes conforme necessário
    }
  },

  finalizarTurno: function () {
    if (this.verificarFimDeJogo()) return;

    this.estado.turnoAtual++;
    setTimeout(() => this.iniciarTurno(), 1000);
  },

  verificarFimDeJogo: function () {
    const vidaJ1 =
      parseInt(document.getElementById("player1Vida").textContent) || 0;
    const vidaJ2 =
      parseInt(document.getElementById("player2Vida").textContent) || 0;

    if (vidaJ1 <= 0 || vidaJ2 <= 0) {
      const vencedor = vidaJ1 > 0 ? "Jogador 1" : "Jogador 2";

      document.getElementById(
        "mensagemBatalha"
      ).innerHTML = `<h3>Fim de Jogo! ${vencedor} venceu!</h3>`;

      document.querySelectorAll("button").forEach((btn) => {
        btn.disabled = true;
      });

      return true;
    }
    return false;
  },

  configurarEventos: function () {
    document.getElementById("player1D20Btn").addEventListener("click", () => {
      this.rolarD20(1);
    });

    document.getElementById("player2D20Btn").addEventListener("click", () => {
      this.rolarD20(2);
    });
  },
};

document.addEventListener("DOMContentLoaded", function () {
  GerenciadorTurnos.configurarEventos();
  GerenciadorTurnos.iniciarTurno();
});
