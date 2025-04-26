// Função para criar o conteúdo do modal dinamicamente
function createModalContent(character, data) {
  return `
      <div class="modal-header">
          <h2 class="modal-title">${data.title}</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
          <div class="row">
              <div class="col-md-4 text-center">
                  <img src="./assets/images/${character.toLowerCase()}.jpeg" alt="${
    data.title
  }" 
                       class="img-fluid rounded mb-3 border border-2 border-gold">
              </div>
              <div class="col-md-8">
                  <div class="row g-3">
                      <div class="col-6">
                          <div class="stat-box p-3 rounded">
                              <h4 class="h6 text-danger"><i class="fas fa-heart me-2"></i>Vida</h4>
                              <p class="h4 mb-0">${data.life}</p>
                          </div>
                      </div>
                      <div class="col-6">
                          <div class="stat-box p-3 rounded">
                              <h4 class="h6 text-warning"><i class="fas fa-fist-raised me-2"></i>Dano</h4>
                              <p class="h4 mb-0">${data.damage}</p>
                          </div>
                      </div>
                      <div class="col-6">
                          <div class="stat-box p-3 rounded">
                              <h4 class="h6 text-primary"><i class="fas fa-shield-alt me-2"></i>Armadura</h4>
                              <p class="h4 mb-0">${data.armor}</p>
                          </div>
                      </div>
                      <div class="col-6">
                          <div class="stat-box p-3 rounded">
                              <h4 class="h6 text-success"><i class="fas fa-running me-2"></i>Esquiva</h4>
                              <p class="h4 mb-0">${data.dodge}</p>
                          </div>
                      </div>
                  </div>
                  <div class="special-ability p-3 rounded mt-3">
                      <h3 class="h5 text-gold"><i class="fas fa-fire me-2"></i>Habilidade Especial</h3>
                      <p class="mb-2">${data.specialDice}</p>
                      <div class="gap-2">
                          <span class="badge bg-danger"><strong>Custo:</strong> ${
                            data.cost
                          }</span>
                          <span class="badge bg-secondary"><strong>Penalidade:</strong> ${
                            data.penalty
                          }</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div class="modal-footer justify-content-center">
          <button class="btn btn-primary px-4 py-2" onclick="window.selectCharacter && window.selectCharacter()">
              <i class="fas fa-check me-2"></i>Selecionar Personagem
          </button>
      </div>
  `;
}

function openModal(character) {
  const charData = characterData[character];
  if (!charData) {
    console.error("Dados do personagem não encontrados:", character);
    return;
  }

  const modalContent = document.getElementById("modalContent");
  if (modalContent) {
    modalContent.innerHTML = createModalContent(character, charData);

    const modal = new bootstrap.Modal(
      document.getElementById("characterModal")
    );
    modal.show();
  }
}

// Mantém a função closeModal existente
function closeModal() {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("characterModal")
  );
  if (modal) modal.hide();
}

// Expõe as funções para o escopo global
window.openModal = openModal;
window.closeModal = closeModal;
