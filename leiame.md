# 🛡️ Sistema de Combate Tático por Turnos

Projeto de jogo de combate baseado em turnos, com 15 classes jogáveis, cada uma com atributos únicos, habilidades especiais, consumo de recursos (Stamina/Mana) e penalidades estratégicas. Ideal para duelos entre jogadores ou implementação em sistemas de RPG mais amplos.

---

## 🎯 Objetivo

Permitir combates entre dois jogadores que escolhem classes distintas, usando rolagens de dados, ações táticas e habilidades com custos e restrições.

---

## 🧠 Mecânica Geral

### 🎲 Fluxo do Turno

1. **Atacante** decide se usará uma habilidade especial (gasta Stamina/Mana).
2. **Defensor** decide se usará uma habilidade especial (também gasta recurso).
3. **Atacante** rola um dado de 20 lados (D20).
4. **Defensor** rola um D20 para tentar esquivar.
5. **Compara-se os resultados:**
   - Se o defensor empatar ou superar o resultado do atacante, esquiva com sucesso.
   - Se o atacante vencer, rola um dado de 6 lados (D6), soma o **Dano Base** e aplica **reduções** de Armadura e Esquiva do defensor.
6. **Registra-se o dano** e o combate continua até alguém zerar a Vida.

---

### 📌 Regras das Habilidades

- Habilidades devem ser declaradas **antes da rolagem**.
- O custo de Stamina ou Mana é **pago na hora**.
- Algumas têm **limites por combate** ou **condições específicas**.
- Penalidades entram em vigor **após o uso**, mesmo que o efeito não seja bem-sucedido.

---

## 🛡️ Tabela Atualizada de Classes e Atributos

Cada classe possui um conjunto fixo de atributos e uma habilidade especial que pode virar o jogo. Use com estratégia — o custo sempre cobra a fatura!

| **Classe**     | **Vida** | **Dano** | **Armadura** | **Esquiva** | **Peso** | **Recursos** | **Habilidade Especial**              | **Custo**     | **Condição / Penalidade**                            |
|----------------|----------|----------|--------------|-------------|----------|--------------|--------------------------------------|---------------|-------------------------------------------------------|
| **Guerreiro**  | 32       | 3        | 4            | 2           | 4        | 6 Stamina    | **Golpe Brutal**: +1D8 no ataque     | 2 Stamina     | -1 Armadura no próximo turno                        |
| **Ladino**     | 26       | 2        | 2            | 5           | 1        | 6 Stamina    | **Ataque Furtivo**: +1D10 no ataque  | 3 Stamina     | Só pode usar a cada 2 turnos                         |
| **Mago**       | 20       | 4        | 1            | 4           | 2        | 6 Mana       | **Bola de Fogo**: +1D12 no ataque    | 3 Mana        | -2 Esquiva no próximo turno                          |
| **Paladino**   | 36       | 3        | 4            | 2           | 3        | 6 Stamina    | **Ira Sagrada**: +1D8 no ataque      | 2 Stamina     | Sofre 2 de dano direto após o uso                    |
| **Bárbaro**    | 34       | 4        | 3            | 2           | 3        | 6 Stamina    | **Fúria Primordial**: +1D12 no ataque| 6 Stamina     | Só se tiver ≤15 Vida. Usável 1x por combate          |
| **Arqueiro**   | 26       | 3        | 2            | 4           | 1        | 6 Stamina    | **Tiro Certeiro**: +1D8 no ataque    | 2 Stamina     | -1 Esquiva no próximo turno                          |
| **Monge**      | 30       | 3        | 3            | 5           | 0        | 6 Stamina    | **Golpe Interior**: +1D8 no ataque   | 2 Stamina     | -1 Armadura após o uso                               |
| **Cavaleiro**  | 35       | 3        | 5            | 2           | 4        | 6 Stamina    | **Investida de Ferro**: +1D8 ataque  | 3 Stamina     | -1 Esquiva no próximo turno                          |
| **Assassino**  | 25       | 4        | 2            | 4           | 1        | 6 Stamina    | **Execução Silenciosa**: +1D10 no ataque se tirar ≥16 no D20 | 3 Stamina | Só ativa com D20 ≥16                                |
| **Druida**     | 30       | 3        | 3            | 3           | 2        | 6 Mana       | **Espinhos Naturais**: +1D8 no ataque| 3 Mana        | Máx. 2 usos por combate. Causa 1 de dano ao usuário  |
| **Gladiador**  | 34       | 4        | 4            | 2           | 3        | 6 Stamina    | **Força Impiedosa**: +1D8 no ataque  | 2 Stamina     | Máx. 3 vezes por combate. Fica indisponível no próximo turno |
| **Caçador**    | 27       | 3        | 3            | 4           | 2        | 6 Stamina    | **Disparo Selvagem**: +1D12 ataque   | 3 Stamina     | Só pode usar a cada 5 turnos                         |
| **Mercenário** | 30       | 3        | 4            | 3           | 3        | 6 Stamina    | **Retaliação Precisa**: +1D10 no ataque após esquiva bem-sucedida | 2 Stamina | Só se tiver >30% da Vida. Máx. 3 usos por combate   |
| **Feiticeiro** | 20       | 4        | 1            | 3           | 2        | 6 Mana       | **Explosão Arcana**: +1D12 ataque    | 3 Mana        | Perde 50% da Vida atual. Não pode usar com 1 de Vida |
| **Samurai**    | 30       | 4        | 4            | 3           | 3        | 6 Stamina    | **Espírito Afiado**: +1D10 ataque    | 3 Stamina     | Só se não usou habilidade no turno anterior. Máx. 2 vezes por combate |

---

## 🔍 Como Interpretar os Atributos

- **Vida**: HP bruto. Quando zera, é tchau e bença.
- **Dano Base**: Soma no ataque padrão (D6 + Dano).
- **Armadura**: Reduz o dano recebido.
- **Esquiva**: Chance de evitar totalmente o golpe (comparado com D20 do atacante).
- **Peso**: Pode influenciar na velocidade em sistemas futuros.
- **Recursos**: Stamina ou Mana — combustível das habilidades.
- **Habilidade Especial**: Ativada antes da rolagem, muda o rumo do combate.


## 📂 Estrutura de Diretórios

```
/sistema-combate-rpg
│
├── /recursos
│   ├── /imagens            # Imagens do projeto (opcional)
│   ├── /fontes             # Fontes personalizadas
│   ├── /estilos
│   │   ├── estilo.css      # Estilo principal
│   │   └── classes/*.css   # Arquivos CSS por classe
│   ├── /scripts
│       ├── dados.js        # Lógica de rolagens e combate
│       └── classes/*.js    # Funções por classe (guerreiro.js, mago.js etc)
│
├── index.html              # Página principal
└── README.md               # Este arquivo
```

---

## 🚧 Funcionalidades Futuras

- Sistema de iniciativa por velocidade/peso  
- Sistema de status (sangramento, queimadura etc.)  
- Modo de campanha ou torneio  
- Interface gráfica com animações simples  

---

## 🤝 Contribuição

Sugestões, correções e melhorias são bem-vindas. Mande aquele **commit limpo** ou abra um tópico.

---

## 📜 Licença

Projeto livre para uso e modificação.