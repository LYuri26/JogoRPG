// assets/js/regras.js
document.addEventListener("DOMContentLoaded", function () {
  // Carrega o modal de regras dinamicamente
  const modalContainer = document.getElementById("regrasModalContainer");

  if (modalContainer) {
    modalContainer.innerHTML = `
      <div class="modal fade modal-rpg" id="regrasModal" tabindex="-1" aria-labelledby="regrasModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <div class="modal-content">
                  <div class="modal-header text-white">
                      <h2 class="modal-title" id="regrasModalLabel">
                          <i class="fas fa-scroll me-2"></i> Regras do Combate Tático
                      </h2>
                      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <div class="container-fluid">
                          <!-- Conteúdo será carregado via fetch -->
                      </div>
                  </div>
              </div>
          </div>
      </div>
      `;

    // Carrega o conteúdo do modal
    fetch("regras.html")
      .then((response) => response.text())
      .then((html) => {
        const modalBody = document.querySelector(
          "#regrasModal .modal-body .container-fluid"
        );
        if (modalBody) {
          modalBody.innerHTML = html;
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar regras:", error);
        const modalBody = document.querySelector(
          "#regrasModal .modal-body .container-fluid"
        );
        if (modalBody) {
          modalBody.innerHTML = `
                  <div class="alert alert-danger">
                      <i class="fas fa-exclamation-triangle me-2"></i>
                      Não foi possível carregar as regras do jogo. Por favor, tente novamente mais tarde.
                  </div>
                  `;
        }
      });
  }

  // Adiciona evento ao botão "Começar Jogo" no modal
  document.addEventListener("click", function (e) {
    if (e.target && e.target.closest("#startGameFromRules")) {
      const startBtn = document.getElementById("startGameBtn");
      if (startBtn && !startBtn.disabled) {
        startGame();
      }
    }
  });
});
