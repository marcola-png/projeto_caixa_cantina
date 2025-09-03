let comandaAtual = [];
let comandas = [];
let contadorComandas = 1;

function adicionarProduto(nome, preco) {
  comandaAtual.push({ nome, preco });
  atualizarComanda();
}

function atualizarComanda() {
  const lista = document.getElementById("lista-comanda");
  const total = document.getElementById("total");
  
  lista.innerHTML = "";
  let soma = 0;
  
  comandaAtual.forEach(item => {
    let li = document.createElement("li");
    li.textContent = `${item.nome} - R$${item.preco}`;
    lista.appendChild(li);
    soma += item.preco;
  });
  
  total.textContent = soma;
}

function gerarComanda() {
  if (comandaAtual.length === 0) return alert("Adicione itens antes!");
  
  comandas.push({
    id: contadorComandas++,
    itens: [...comandaAtual],
    total: comandaAtual.reduce((acc, item) => acc + item.preco, 0)
  });

  comandaAtual = [];
  atualizarComanda();
  atualizarComandas();
}

function atualizarComandas() {
  const div = document.getElementById("lista-comandas");
  div.innerHTML = "";

  comandas.forEach(comanda => {
    let card = document.createElement("div");
    card.classList.add("comanda-card");
    card.innerHTML = `
      <h3>Comanda #${comanda.id}</h3>
      <ul>${comanda.itens.map(i => `<li>${i.nome}</li>`).join("")}</ul>
      <p>Total: R$${comanda.total}</p>
      <button onclick="finalizarComanda(${comanda.id})">Finalizar</button>
    `;
    div.appendChild(card);
  });
}

function finalizarComanda(id) {
  comandas = comandas.filter(c => c.id !== id);
  atualizarComandas();
}
