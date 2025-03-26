let atacante = null;
let defensor = null;
let jogoPausado = false; // Flag para pausar o jogo enquanto o jogador está atacando
let avisoExibido = false; // Flag para garantir que o aviso seja mostrado apenas uma vez

function iniciarBatalha() {
  if (atacante && !jogoPausado) {
    console.log(`Iniciando batalha com o Jogador ${atacante.nome} ativo.`);

    // Exibe a mensagem no HTML
    document.getElementById(
      "mensagemBatalha"
    ).textContent = `Jogador ${atacante.nome} está atacando o Jogador ${defensor.nome}.`;

    // Lógica da batalha (o atacante pode usar seus dados específicos)
    let danoTotal = 0;

    // O atacante usa os dados apropriados
    if (atacante.classe === "Guerreiro") {
      danoTotal = usarDadoGuerreiro(atacante);
    } else if (atacante.classe === "Ladino") {
      danoTotal = usarDadoLadino(atacante);
    }

    // Aplica o dano ao defensor
    defensor.vida -= danoTotal;
    console.log(
      `${defensor.nome} perdeu ${danoTotal} de vida. Vida restante: ${defensor.vida}`
    );

    // Atualiza a interface
    document.getElementById(
      "mensagemBatalha"
    ).textContent += ` Dano total: ${danoTotal}. Vida restante de ${defensor.nome}: ${defensor.vida}`;

    // Pausa o jogo para impedir que outro jogador execute ações enquanto o atacante causa dano
    jogoPausado = true;

    // Exibe a mensagem de aviso uma única vez
    if (!avisoExibido) {
      avisoExibido = true;
      setTimeout(() => {
        alert(`${defensor.nome} perdeu. Próximo turno.`);
      }, 1000); // Atraso para exibir a mensagem de aviso
    }

    // Chama a função para finalizar o turno
    finalizarTurno();
  }
}

// Função para finalizar o turno após o atacante causar dano
function finalizarTurno() {
  // Despausa o jogo e alterna os turnos
  setTimeout(() => {
    jogoPausado = false; // Retorna ao estado normal
    alternarTurno(); // Chama a função para alternar os turnos
    avisoExibido = false; // Reseta a flag para o próximo turno
  }, 1000); // Atraso de 1 segundo para simular a pausa
}

function usarDadoGuerreiro(guerreiro) {
  const dadoD8 = Math.floor(Math.random() * 8) + 1;
  const danoTotal = guerreiro.danoBase + dadoD8;
  guerreiro.staminaMana -= guerreiro.custoStamina;
  console.log("Dano do Guerreiro:", danoTotal);
  return danoTotal;
}

function usarDadoLadino(ladino) {
  const dadoD10 = Math.floor(Math.random() * 10) + 1;
  const danoTotal = ladino.danoBase + dadoD10;
  ladino.staminaMana -= ladino.custoStamina;
  console.log("Dano do Ladino:", danoTotal);
  return danoTotal;
}
