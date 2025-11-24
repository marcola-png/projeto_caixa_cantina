(() => {
  'use strict';

  const CATEGORIAS = [
    'Salgados e Bolos',
    'Bebidas',
    'Cafeteria',
    'Combos do Café',
    'Sucos e Vitaminas',
    'Outros'
  ];

  const CATALOGO = [
    { categoria: 'Salgados e Bolos', nome: 'Coxinha de Frango', preco: 10, img: 'coxinha.jpg' },
    { categoria: 'Salgados e Bolos', nome: 'Bolinho de Carne', preco: 10, img: 'carne.jpg' },
    { categoria: 'Salgados e Bolos', nome: 'Bolinho de Queijo', preco: 10, img: 'queijo.jpg' },
    { categoria: 'Salgados e Bolos', nome: 'Pão de Queijo', preco: 5, img: 'pão-de-queijo.jpg' },
    { categoria: 'Salgados e Bolos', nome: 'Risole', preco: 10, img: 'risolis.jpg' },
    { categoria: 'Salgados e Bolos', nome: 'Hamburgão', preco: 8, img: 'hamburgão.jpg' },
    { categoria: 'Salgados e Bolos', nome: 'Coxinha de Frango Catupiry', preco: 12, img: 'coxinhacatupiry.jpg' },
    { categoria: 'Salgados e Bolos', nome: 'Esfirra de Carne', preco: 8, img: 'esfirracarne.jpg' },
    { categoria: 'Salgados e Bolos', nome: 'Esfirra de Frango', preco: 8, img: 'esfirrafrango.jpg' },
    { categoria: 'Salgados e Bolos', nome: 'Bolo Caseiro Fatia', preco: 7, img: 'bolocaseiro.jpg' },
    { categoria: 'Salgados e Bolos', nome: 'Bolo Gelado Trufado', preco: 10, img: 'bolotrufado.jpg' },
    { categoria: 'Bebidas', nome: 'Refrigerante Lata 350mL', preco: 7, img: 'refrigerante.jpg' },
    { categoria: 'Bebidas', nome: 'Suco Lata 290mL', preco: 7, img: 'suco-lata.jpg' },
    { categoria: 'Bebidas', nome: 'Água Mineral Com Gás 510mL', preco: 5, img: 'agua-gas.jpg' },
    { categoria: 'Bebidas', nome: 'Água Mineral Sem Gás 510mL', preco: 4, img: 'agua.jpg' },
    { categoria: 'Bebidas', nome: 'Refrigerante Mini 200mL', preco: 4, img: 'refrigerante-mini.jpg' },
    { categoria: 'Cafeteria', nome: 'Café Expresso', preco: 5, img: 'cafe.jpg' },
    { categoria: 'Cafeteria', nome: 'Café Com Leite', preco: 6, img: 'cafe-leite.jpg' },
    { categoria: 'Cafeteria', nome: 'Cappuccino', preco: 8, img: 'cappuccino.jpg' },
    { categoria: 'Cafeteria', nome: 'Chocolate Quente', preco: 7, img: 'chocolate-quente.jpg' },
    { categoria: 'Sucos e Vitaminas', nome: 'Vitaminas de Fruta MIX', preco: 12, img: 'vitamina.jpg' },
    { categoria: 'Sucos e Vitaminas', nome: 'Suco', preco: 10, img: 'sucos-frutas.jpg' },
    { categoria: 'Combos do Café', nome: 'Pão de Queijo + Café Expresso', preco: 10, img: 'pao-cafe.jpg' },
    { categoria: 'Combos do Café', nome: 'Pão de Queijo + Café com Leite', preco: 11, img: 'pao-leite.jpg' },
    { categoria: 'Combos do Café', nome: 'Pão de Queijo + Cappuccino', preco: 13, img: 'pao-cappuccino.jpg' },
    { categoria: 'Combos do Café', nome: 'Pão de Queijo + Chocolate Quente', preco: 12, img: 'pao-chocolate.jpg' },
    { categoria: 'Outros', nome: 'Chiclete', preco: 6, img: 'chiclete.jpg' },
    { categoria: 'Outros', nome: 'Bala', preco: 2.5, img: 'bala.jpg' },
    { categoria: 'Outros', nome: 'Outro', preco: null, img: 'outro.jpg', precoPersonalizado: true }
  ];

  let categoriaAtiva = CATEGORIAS[0];
  let comandaAtual = [];
  let comandasAbertas = [];
  const STORAGE_HISTORICO = 'historico_comandas';
  const STORAGE_NEXT_ID = 'proxima_comanda_id';

  const BRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const nowStamp = () => new Date().toISOString();

  function getHistorico() {
    try { return JSON.parse(localStorage.getItem(STORAGE_HISTORICO)) || []; } catch { return []; }
  }
  function setHistorico(lista) { localStorage.setItem(STORAGE_HISTORICO, JSON.stringify(lista)); }
  function getNextId() {
    const v = parseInt(localStorage.getItem(STORAGE_NEXT_ID) || '1', 10);
    localStorage.setItem(STORAGE_NEXT_ID, String(v + 1));
    return v;
  }
  function resetNextId() { localStorage.setItem(STORAGE_NEXT_ID, '1'); }

  function placeholderSVG(text) {
    const esc = encodeURIComponent(text);
    return "data:image/svg+xml;utf8," + encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='22' fill='#9ca3af'>${esc}</text></svg>`
    );
  }

  function agruparItens(lista) {
    const mapa = new Map();
    for (const it of lista) {
      const key = it.nome + '__' + it.preco;
      const atual = mapa.get(key) || { nome: it.nome, preco: it.preco, qtd: 0 };
      atual.qtd += 1;
      mapa.set(key, atual);
    }
    return Array.from(mapa.values());
  }

  function carimboArquivo() {
    const d = new Date(); const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}`;
  }
  function formatLocal(iso) {
    try { return new Date(iso).toLocaleString('pt-BR'); } catch { return iso || ''; }
  }

  function renderTabsCategorias() {
    const tabs = document.getElementById('tabs-categorias');
    tabs.innerHTML = '';
    CATEGORIAS.forEach((cat) => {
      const btn = document.createElement('button');
      btn.className = 'tab' + (cat === categoriaAtiva ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        categoriaAtiva = cat;
        renderTabsCategorias();
        renderProdutos();
      });
      tabs.appendChild(btn);
    });
  }

  function produtosDaCategoria(cat) {
    return CATALOGO.filter((p) => p.categoria === cat);
  }

  let produtoParaPrecificar = null;
  function abrirModalPreco(produto) {
    produtoParaPrecificar = produto;
    document.getElementById('modal-produto').textContent = produto.nome;
    const modal = document.getElementById('modal-preco');
    const input = document.getElementById('input-preco');
    input.value = '';
    modal.hidden = false;
    setTimeout(() => input.focus(), 0);
  }
  function fecharModalPreco() {
    document.getElementById('modal-preco').hidden = true;
    produtoParaPrecificar = null;
  }
  function confirmarPrecoPersonalizado() {
    const input = document.getElementById('input-preco');
    let v = String(input.value || '').replace(',', '.');
    const preco = parseFloat(v);
    if (Number.isNaN(preco) || preco < 0.01) {
      alert('Informe um valor válido');
      return;
    }
    adicionarProduto(produtoParaPrecificar.nome, +(preco.toFixed(2)));
    fecharModalPreco();
  }

  function renderProdutos() {
    const grid = document.getElementById('grid-produtos');
    grid.innerHTML = '';
    const produtos = produtosDaCategoria(categoriaAtiva);
    produtos.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'card-produto';

      const img = document.createElement('img');
      img.src = p.img;
      img.alt = p.nome;
      img.addEventListener('error', () => { img.src = placeholderSVG(p.nome); });

      const corpo = document.createElement('div');
      corpo.className = 'card-corpo';

      const titulo = document.createElement('div');
      titulo.className = 'card-titulo';
      titulo.textContent = p.nome;

      const preco = document.createElement('div');
      preco.className = 'card-preco';
      preco.textContent = p.precoPersonalizado ? 'Definir preço' : BRL(p.preco);

      const acoes = document.createElement('div');
      acoes.className = 'card-acoes';

      const btn = document.createElement('button');
      btn.className = 'btn primario';
      btn.textContent = p.precoPersonalizado ? 'Adicionar (definir preço)' : 'Adicionar';
      btn.addEventListener('click', () => {
        if (p.precoPersonalizado) abrirModalPreco(p);
        else adicionarProduto(p.nome, p.preco);
      });

      acoes.appendChild(btn);
      corpo.appendChild(titulo);
      corpo.appendChild(preco);
      corpo.appendChild(acoes);
      card.appendChild(img);
      card.appendChild(corpo);
      grid.appendChild(card);
    });
  }

  function adicionarProduto(nome, preco) {
    comandaAtual.push({ nome, preco });
    renderComandaAtual();
  }
  function limparComandaAtual() {
    comandaAtual = [];
    renderComandaAtual();
  }
  function alterarQuantidade(nome, preco, delta) {
    if (delta > 0) {
      comandaAtual.push({ nome, preco });
    } else {
      const idx = comandaAtual.findIndex((i) => i.nome === nome && i.preco === preco);
      if (idx >= 0) comandaAtual.splice(idx, 1);
    }
    renderComandaAtual();
  }
  function renderComandaAtual() {
    const ul = document.getElementById('lista-comanda');
    const totalEl = document.getElementById('total');
    ul.innerHTML = '';
    const grupos = agruparItens(comandaAtual);
    let total = 0;
    for (const g of grupos) {
      const li = document.createElement('li');
      li.className = 'item';
      const subtotal = g.preco * g.qtd;
      total += subtotal;

      const esquerda = document.createElement('div');
      esquerda.className = 'grupo';
      const nomeEl = document.createElement('span');
      nomeEl.className = 'nome';
      nomeEl.textContent = g.nome;
      const qtdEl = document.createElement('span');
      qtdEl.className = 'qtd';
      qtdEl.textContent = '×' + g.qtd;
      esquerda.appendChild(nomeEl);
      esquerda.appendChild(qtdEl);

      const direita = document.createElement('div');
      direita.className = 'grupo';
      const precoEl = document.createElement('span');
      precoEl.className = 'preco';
      precoEl.textContent = BRL(subtotal);

      const cont = document.createElement('div');
      cont.className = 'contadores';
      const menos = document.createElement('button');
      menos.className = 'btn secundario';
      menos.title = 'Remover 1';
      menos.textContent = '−';
      menos.addEventListener('click', () => alterarQuantidade(g.nome, g.preco, -1));
      const mais = document.createElement('button');
      mais.className = 'btn secundario';
      mais.title = 'Adicionar 1';
      mais.textContent = '+';
      mais.addEventListener('click', () => alterarQuantidade(g.nome, g.preco, +1));

      cont.appendChild(menos);
      cont.appendChild(mais);
      direita.appendChild(precoEl);
      direita.appendChild(cont);

      li.appendChild(esquerda);
      li.appendChild(direita);
      ul.appendChild(li);
    }
    totalEl.textContent = BRL(total);
  }

  function gerarComanda() {
    if (comandaAtual.length === 0) {
      alert('Adicione itens antes!');
      return;
    }
    const id = getNextId();
    const total = comandaAtual.reduce((acc, i) => acc + i.preco, 0);
    const comanda = { id, itens: comandaAtual.slice(), total, criadoEm: nowStamp() };
    comandasAbertas.push(comanda);
    comandaAtual = [];
    renderComandaAtual();
    renderComandasAbertas();
  }

  function renderComandasAbertas() {
    const container = document.getElementById('lista-comandas');
    const badge = document.getElementById('contador-abertas');
    container.innerHTML = '';
    comandasAbertas.forEach((c) => {
      const div = document.createElement('div');
      div.className = 'comanda-card';
      const grupos = agruparItens(c.itens);
      const ul = document.createElement('ul');
      ul.className = 'itens';
      grupos.forEach((g) => {
        const li = document.createElement('li');
        li.innerHTML = g.nome + ' ×' + g.qtd + ' — <strong>' + BRL(g.preco * g.qtd) + '</strong>';
        ul.appendChild(li);
      });
      const h3 = document.createElement('h3');
      h3.textContent = 'Comanda #' + c.id;
      const rodape = document.createElement('div');
      rodape.className = 'rodape';
      const totalP = document.createElement('p');
      totalP.innerHTML = '<strong>Total:</strong> ' + BRL(c.total);
      const acoes = document.createElement('div');
      acoes.className = 'acoes';
      const btn = document.createElement('button');
      btn.className = 'btn primario';
      btn.setAttribute('data-id', String(c.id));
      btn.textContent = 'Finalizar';
      btn.addEventListener('click', (ev) => {
        const id = Number(ev.currentTarget.getAttribute('data-id'));
        finalizarComanda(id);
      });
      acoes.appendChild(btn);
      rodape.appendChild(totalP);
      rodape.appendChild(acoes);
      div.appendChild(h3);
      div.appendChild(ul);
      div.appendChild(rodape);
      container.appendChild(div);
    });
    badge.textContent = String(comandasAbertas.length);
  }

  function finalizarComanda(id) {
    const idx = comandasAbertas.findIndex((c) => c.id === id);
    if (idx === -1) return;
    const comanda = comandasAbertas.splice(idx, 1)[0];
    const historico = getHistorico();
    historico.push({ id: comanda.id, itens: comanda.itens, total: comanda.total, criadoEm: comanda.criadoEm, finalizadaEm: nowStamp() });
    setHistorico(historico);
    renderComandasAbertas();
    alert('Comanda #' + id + ' finalizada e salva no histórico!');
  }

  function exportarVendasXLSX() {
    const historico = getHistorico();
    if (historico.length === 0) {
      alert('Não há comandas finalizadas no histórico para exportar.');
      return;
    }
    const itensRows = [];
    historico.forEach((c) => {
      const grupos = agruparItens(c.itens);
      grupos.forEach((g) => {
        itensRows.push({
          Data: formatLocal(c.finalizadaEm || c.criadoEm),
          Comanda: c.id,
          Item: g.nome,
          'Preço unitário': BRL(g.preco),
          Quantidade: g.qtd,
          Subtotal: BRL(g.preco * g.qtd)
        });
      });
    });
    const comandasRows = historico.map((c) => ({
      Data: formatLocal(c.finalizadaEm || c.criadoEm),
      Comanda: c.id,
      'Itens (qtd total)': c.itens.length,
      Total: BRL(c.total)
    }));
    const resumoMap = new Map();
    historico.forEach((c) => {
      const grupos = agruparItens(c.itens);
      grupos.forEach((g) => {
        const r = resumoMap.get(g.nome) || { Item: g.nome, Quantidade: 0, Faturamento: 0 };
        r.Quantidade += g.qtd;
        r.Faturamento += g.preco * g.qtd;
        resumoMap.set(g.nome, r);
      });
    });
    const resumoRows = Array.from(resumoMap.values()).map((r) => ({
      Item: r.Item,
      Quantidade: r.Quantidade,
      Faturamento: BRL(r.Faturamento)
    }));
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(itensRows);
    const ws2 = XLSX.utils.json_to_sheet(comandasRows);
    const ws3 = XLSX.utils.json_to_sheet(resumoRows);
    XLSX.utils.book_append_sheet(wb, ws1, 'Itens');
    XLSX.utils.book_append_sheet(wb, ws2, 'Comandas');
    XLSX.utils.book_append_sheet(wb, ws3, 'Resumo por Item');
    XLSX.writeFile(wb, 'vendas_' + carimboArquivo() + '.xlsx');
    setHistorico([]);
    resetNextId();
    atualizarDebugHistorico(true);
    alert('Exportação concluída! Histórico limpo e contagem de comanda reiniciada.');
  }

  function atualizarDebugHistorico(forceShow) {
    const pre = document.getElementById('debug-historico');
    const dados = getHistorico();
    pre.textContent = JSON.stringify(dados, null, 2);
    if (forceShow) pre.hidden = false;
  }
  function limparHistoricoSemExportar() {
    if (!confirm('Tem certeza que deseja limpar o histórico SEM exportar?')) return;
    setHistorico([]);
    resetNextId();
    atualizarDebugHistorico(true);
  }

  function bindEventos() {
    document.getElementById('btn-gerar-comanda').addEventListener('click', gerarComanda);
    document.getElementById('btn-limpar-atual').addEventListener('click', limparComandaAtual);
    document.getElementById('btn-exportar').addEventListener('click', exportarVendasXLSX);
    document.getElementById('btn-ver-historico').addEventListener('click', () => atualizarDebugHistorico(true));
    document.getElementById('btn-limpar-historico').addEventListener('click', limparHistoricoSemExportar);
    document.getElementById('btn-preco-cancelar').addEventListener('click', fecharModalPreco);
    document.getElementById('btn-preco-ok').addEventListener('click', confirmarPrecoPersonalizado);
    document.getElementById('input-preco').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') confirmarPrecoPersonalizado();
      if (e.key === 'Escape') fecharModalPreco();
    });
    document.getElementById('modal-preco').addEventListener('click', (e) => {
      if (e.target.id === 'modal-preco') fecharModalPreco();
    });
  }

  function init() {
    renderTabsCategorias();
    renderProdutos();
    renderComandaAtual();
    renderComandasAbertas();
    bindEventos();
    const anoEl = document.getElementById('ano');
    if (anoEl) anoEl.textContent = new Date().getFullYear();
  }

  init();
})();
