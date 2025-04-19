// Configurações globais do jogo
window.ConfigJogo = {
  // Estado do jogo
  turnoAtual: 1,
  jogadorAtivo: 1,
  fase: "inicial",
  jogoPausado: false,
  avisoExibido: false,
  atacante: null,
  defensor: null,
  player1Character: null,
  player2Character: null,
  player1Name: null,
  player2Name: null,
  dadosRolados: {
    player1: { d20: 0, d6: 0, d8: 0, d10: 0, d12: 0 },
    player2: { d20: 0, d6: 0, d8: 0, d10: 0, d12: 0 },
  },

  // Inicializa as configurações
  inicializar: function () {
    try {
      this.player1Character = this.parsePersonagem(
        localStorage.getItem("player1Character")
      );
      this.player2Character = this.parsePersonagem(
        localStorage.getItem("player2Character")
      );
      this.player1Name = localStorage.getItem("player1Name");
      this.player2Name = localStorage.getItem("player2Name");
    } catch (e) {
      console.error("Erro ao carregar configurações:", e);
    }
  },

  // Parse seguro do personagem
  parsePersonagem: function (dados) {
    if (!dados) return null;

    try {
      const parsed = JSON.parse(dados);
      return typeof parsed === "object" ? parsed : { classe: dados };
    } catch {
      return { classe: dados };
    }
  },

  // Reseta os dados para um novo turno
  resetarDados: function () {
    this.dadosRolados = {
      player1: { d20: 0, d6: 0, d8: 0, d10: 0, d12: 0 },
      player2: { d20: 0, d6: 0, d8: 0, d10: 0, d12: 0 },
    };
  },

  // Atualiza o jogador ativo
  atualizarJogadorAtivo: function () {
    this.jogadorAtivo = this.turnoAtual % 2 === 1 ? 1 : 2;
  },

  // Avança para o próximo turno
  proximoTurno: function () {
    this.turnoAtual++;
    this.atualizarJogadorAtivo();
    this.resetarDados();
    this.jogoPausado = false;
    this.avisoExibido = false;
  },
};

// Inicialização quando o script é carregado
document.addEventListener("DOMContentLoaded", function () {
  ConfigJogo.inicializar();
});
