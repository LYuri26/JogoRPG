const GerenciadorTurnos = {
  estado: {
    turnoAtual: 1,
    jogadorAtivo: null,
    fase: "inicial",
    atacante: null,
    defensor: null,
    jogadorRolando: null,
  },

  iniciarTurno: function () {
    console.log(`Iniciando turno ${this.estado.turnoAtual}`);

    // Change these lines to use Personagens.aplicarPenalidades
    if (window.Personagens) {
      Personagens.aplicarPenalidades(1);
      Personagens.aplicarPenalidades(2);
    }

    DadosManager.resetarDados();
    this.estado.jogadorAtivo = this.estado.turnoAtual % 2 === 1 ? 1 : 2;
    this.definirFase("inicial");
    this.atualizarInterface();

    // Habilita apenas o D20 do jogador ativo
    this.estado.jogadorRolando = this.estado.jogadorAtivo;
    DadosManager.habilitarD20(this.estado.jogadorRolando);
  },

  definirFase: function (fase) {
    this.estado.fase = fase;
    this.atualizarInterface();
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
    const resultado = DadosManager.rolarDado("D20", jogador);

    // Desabilita todos os dados
    DadosManager.desabilitarTodosDados();

    // Verifica se é o jogador ativo rolando
    if (jogador === this.estado.jogadorAtivo) {
      // Agora é a vez do outro jogador rolar
      this.estado.jogadorRolando = jogador === 1 ? 2 : 1;
      DadosManager.habilitarD20(this.estado.jogadorRolando);
    } else {
      // Ambos já rolaram, verifica disputa
      this.verificarDisputaD20();
    }
  },

  verificarDisputaD20: function () {
    const d20Player1 = DadosManager.dadosRolados.player1.d20;
    const d20Player2 = DadosManager.dadosRolados.player2.d20;

    if (d20Player1 > 0 && d20Player2 > 0) {
      this.definirFase("disputa");

      // Verifica quem venceu a disputa
      if (d20Player1 > d20Player2) {
        this.estado.atacante = 1;
        this.estado.defensor = 2;
      } else if (d20Player2 > d20Player1) {
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
        DadosManager.habilitarDadosAtaque(this.estado.atacante);

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

  finalizarTurno: function () {
    if (this.verificarFimDeJogo()) return;

    // Resetar estado de ataque
    this.estado.atacante = null;
    this.estado.defensor = null;
    this.estado.fase = "inicial";

    // Limpar mensagens
    document.getElementById("mensagemBatalha").innerHTML = "";

    // Incrementar turno
    this.estado.turnoAtual++;

    // Verificar limite máximo de turnos (opcional)
    if (this.estado.turnoAtual > 100) {
      alert("Jogo atingiu o limite máximo de turnos!");
      window.location.reload();
      return;
    }

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
      DadosManager.desabilitarTodosDados();
      return true;
    }
    return false;
  },
};

document.addEventListener("DOMContentLoaded", function () {
  GerenciadorTurnos.iniciarTurno();
});
