// Variáveis globais para controle do estado da batalha
let jogoPausado = false;
let avisoExibido = false;

// ========== FUNÇÕES DE BATALHA ==========
function aplicarDano(defensorNum, dano) {
  const defensor =
    defensorNum === 1 ? window.player1Character : window.player2Character;
  defensor.foiAtacado = true;

  const vidaAtual =
    parseInt(document.getElementById(`player${defensorNum}Vida`).textContent) ||
    0;
  const novaVida = Math.max(0, vidaAtual - dano);

  // Atualizar valores
  document.getElementById(`player${defensorNum}Vida`).textContent = novaVida;
  defensor.vida = novaVida;
  atualizarBarraVida(defensorNum, novaVida, defensor.vidaMaxima);

  // Mensagem de batalha
  const mensagem =
    dano > 0
      ? `${
          defensorNum === 1
            ? window.player2Character.nome
            : window.player1Character.nome
        } causou ${dano} de dano!`
      : `${defensor.nome} esquivou do ataque!`;

  adicionarLogBatalha(mensagem);
  verificarFimDeJogo();
}

function finalizarAtaque(jogador, tipoDado) {
  if (jogoPausado) return;

  // Impedir que D20 cause dano
  if (tipoDado === "D20") {
    console.log("D20 não pode ser usado para atacar!");
    return;
  }

  const atacante =
    jogador === 1 ? window.player1Character : window.player2Character;
  const config = DanoSystem.ClassConfig[atacante.classe] || {};

  // Verifica se é ataque especial
  const isSpecialAttack = tipoDado === config.dice;

  // Verifica condições gerais
  if (!DanoSystem.verificarRestricoes(jogador, tipoDado)) return;

  // Verifica recursos
  if (isSpecialAttack && !DanoSystem.aplicarCustoHabilidade(jogador, tipoDado))
    return;

  jogoPausado = true;

  // Rolar o dado
  const resultado = DadosManager.rolarDado(tipoDado, jogador);

  // Calcular dano
  const dano = DanoSystem.calcularDano(jogador, tipoDado, resultado);

  // Aplicar efeitos pós-ataque
  if (isSpecialAttack && config.effect) {
    config.effect(atacante);
  }

  // Aplica dano
  const defensorNum = jogador === 1 ? 2 : 1;
  aplicarDano(defensorNum, dano);

  // Finaliza o turno
  setTimeout(() => {
    if (isSpecialAttack) {
      adicionarLogBatalha(`${atacante.nome} usou ${config.description}`);
    }

    if (window.GerenciadorTurnos) {
      GerenciadorTurnos.finalizarTurno();
    } else {
      finalizarTurno();
    }

    jogoPausado = false;
  }, 500);
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener("DOMContentLoaded", function () {
  // Configurar eventos de ataque
  const dados = ["D6", "D8", "D10", "D12", "D20"];

  for (let jogador of [1, 2]) {
    for (let dado of dados) {
      const btn = document.getElementById(`player${jogador}${dado}Btn`);
      if (btn) {
        btn.addEventListener("click", () => finalizarAtaque(jogador, dado));
      }
    }
  }

  // Inicializar personagens
  if (window.Personagens) {
    window.Personagens.inicializarPersonagem(
      "player1",
      window.player1Character?.nome || "Jogador 1"
    );
    window.Personagens.inicializarPersonagem(
      "player2",
      window.player2Character?.nome || "Jogador 2"
    );
  }
});
