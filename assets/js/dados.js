// Objeto para armazenar os dados rolados
const dadosRolados = {
  player1: { d20: 0, d6: 0, d8: 0, d10: 0, d12: 0 },
  player2: { d20: 0, d6: 0, d8: 0, d10: 0, d12: 0 },
};

// Função para rolar qualquer tipo de dado
function rolarDado(tipoDado, jogador) {
  const faces = parseInt(tipoDado.replace("D", ""));
  const resultado = Math.floor(Math.random() * faces) + 1;

  // Armazena o resultado no objeto dadosRolados
  dadosRolados[`player${jogador}`][tipoDado.toLowerCase()] = resultado;

  // Atualiza a interface
  atualizarInterfaceDados(jogador, tipoDado, resultado);

  return resultado;
}

// Função para atualizar a interface com os resultados dos dados
function atualizarInterfaceDados(jogador, tipoDado, resultado) {
  const elemento = document.getElementById(`player${jogador}${tipoDado}`);
  if (elemento) {
    elemento.textContent = resultado;
  }
}
