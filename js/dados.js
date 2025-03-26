let jogadorAtivo = 1; // Definindo o jogador ativo inicialmente como Jogador 1
let dadosRolados = { player1: 0, player2: 0 };

function rolarDado(dado, jogador) {
  console.log(`Dado recebido para rolar: ${dado}`);

  if (!/^D\d+$/.test(dado)) {
    console.error(`Erro: O dado ${dado} não tem um formato válido.`);
    return NaN;
  }

  const max = parseInt(dado.replace("D", ""), 10);

  if (isNaN(max)) {
    console.error(`Erro: O dado ${dado} não tem um valor numérico válido.`);
    return NaN;
  }

  const resultado = Math.floor(Math.random() * max) + 1;
  console.log(`Rolagem do dado ${dado}: ${resultado}`);

  // Atualiza a variável de dados rolados para cada jogador
  if (jogador === 1) {
    dadosRolados.player1 = resultado;
    document.getElementById(
      "player1D20"
    ).textContent = `Jogador 1 rolou: ${resultado}`;
  } else if (jogador === 2) {
    dadosRolados.player2 = resultado;
    document.getElementById(
      "player2D20"
    ).textContent = `Jogador 2 rolou: ${resultado}`;
  }

  // Atualiza o resultado no elemento 'resultadoTurnoAnterior'
  atualizarResultadoTurno();

  return resultado;
}

function prepararRolagemD20() {
  dadosRolados = { player1: 0, player2: 0 };
  document.getElementById("player1D20").textContent = "";
  document.getElementById("player2D20").textContent = "";

  // Verifica o jogador ativo e habilita/desabilita os botões de rolagem
  if (jogadorAtivo === 1) {
    document.getElementById("player1D20Btn").disabled = false;
    document.getElementById("player2D20Btn").disabled = true;
    console.log("Agora é a vez do Jogador 1.");
  } else {
    document.getElementById("player1D20Btn").disabled = true;
    document.getElementById("player2D20Btn").disabled = false;
    console.log("Agora é a vez do Jogador 2.");
  }
}

// Função para atualizar o elemento 'resultadoTurnoAnterior' com os dados rolados
function atualizarResultadoTurno() {
  const resultadoTurno = document.getElementById("resultadoTurnoAnterior");
  resultadoTurno.textContent = `Jogador 1 rolou: ${dadosRolados.player1}, Jogador 2 rolou: ${dadosRolados.player2}`;
}

// Chama prepararRolagemD20 ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  prepararRolagemD20();
});
