/* =========================
   PRODUTOS
========================= */

function getProdutos() {

    return JSON.parse(
        localStorage.getItem("produtos")
    ) || [];

}


function salvarProdutos(produtos) {

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

}


function dinheiro(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =========================
   CARRINHO
========================= */

function getCarrinho() {

    return JSON.parse(
        localStorage.getItem("carrinho")
    ) || [];

}


function salvarCarrinho(carrinho) {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

}


/* =========================
   RENDER
========================= */

function render() {

    let produtos = getProdutos();

    let area =
        document.getElementById("produtos");

    let busca =
        document
        .getElementById("busca")
        .value
        .toLowerCase();

    let categoria =
        document.getElementById(
            "categoria"
        ).value;


    area.innerHTML = "";


    /* CATEGORIAS */

    let categorias = [
        ...new Set(
            produtos
                .map(p => p.categoria)
                .filter(Boolean)
        )
    ];


    let select =
        document.getElementById(
            "categoria"
        );


    let categoriaAnterior =
        select.value;


    select.innerHTML =
        `<option value="">
            Todas as categorias
        </option>`;


    categorias.forEach(cat => {

        select.innerHTML += `
            <option value="${cat}">
                ${cat}
            </option>
        `;

    });


    if (
        categorias.includes(
            categoriaAnterior
        )
    ) {

        select.value =
            categoriaAnterior;

    }


    /* FILTRO */

    let filtrados =
        produtos.filter(produto => {

            let nome =
                produto.nome
                    .toLowerCase();

            let buscaOK =
                nome.includes(busca);

            let categoriaOK =
                !categoria ||
                produto.categoria === categoria;

            return (
                buscaOK &&
                categoriaOK
            );

        });


    if (
        filtrados.length === 0
    ) {

        area.innerHTML =
            "<p>Nenhum produto encontrado.</p>";

        renderCarrinho();

        return;
    }


    filtrados.forEach(produto => {

        let imagem =
            produto.imagem ||
            "https://via.placeholder.com/500x300?text=Produto";


        area.innerHTML += `

            <div class="produto">

                <img
                    src="${imagem}"
                    alt="${produto.nome}"
                >

                <h3>
                    ${produto.nome}
                </h3>

                <p>
                    📂 ${produto.categoria || "Sem categoria"}
                </p>

                <strong>
                    ${dinheiro(produto.preco)}
                </strong>

                <p>
                    📦 Estoque:
                    ${produto.estoque}
                </p>

                ${
                    produto.estoque > 0
                    ?
                    `
                    <button
                        onclick="adicionarCarrinho('${produto.id}')"
                    >
                        🛒 Adicionar
                    </button>
                    `
                    :
                    `
                    <button disabled>
                        ❌ Sem estoque
                    </button>
                    `
                }

            </div>

        `;

    });


    renderCarrinho();

}


/* =========================
   ADICIONAR CARRINHO
========================= */

function adicionarCarrinho(id) {

    let produtos =
        getProdutos();


    let produto =
        produtos.find(
            p => p.id === id
        );


    if (!produto) return;


    let carrinho =
        getCarrinho();


    let item =
        carrinho.find(
            p => p.id === id
        );


    if (item) {

        if (
            item.quantidade >=
            produto.estoque
        ) {

            alert(
                "Quantidade máxima em estoque."
            );

            return;
        }


        item.quantidade++;

    } else {

        carrinho.push({

            id: produto.id,

            nome: produto.nome,

            preco: produto.preco,

            quantidade: 1

        });

    }


    salvarCarrinho(carrinho);

    renderCarrinho();

}


/* =========================
   CARRINHO
========================= */

function renderCarrinho() {

    let carrinho =
        getCarrinho();


    let area =
        document.getElementById(
            "carrinho"
        );


    let totalArea =
        document.getElementById(
            "total"
        );


    area.innerHTML = "";


    if (
        carrinho.length === 0
    ) {

        area.innerHTML =
            "<p>🛒 Carrinho vazio.</p>";

        totalArea.innerText =
            "Total: R$ 0,00";

        return;
    }


    let total = 0;


    carrinho.forEach(item => {

        let subtotal =
            item.preco *
            item.quantidade;


        total += subtotal;


        area.innerHTML += `

            <div class="item-carrinho">

                <strong>
                    ${item.nome}
                </strong>

                <p>
                    ${dinheiro(item.preco)}
                </p>

                <button
                    onclick="diminuir('${item.id}')"
                >
                    ➖
                </button>

                <strong>
                    ${item.quantidade}
                </strong>

                <button
                    onclick="aumentar('${item.id}')"
                >
                    ➕
                </button>

                <p>
                    Subtotal:
                    ${dinheiro(subtotal)}
                </p>

                <button
                    class="remover"
                    onclick="removerCarrinho('${item.id}')"
                >
                    🗑️ Remover
                </button>

            </div>

        `;

    });


    totalArea.innerText =
        "Total: " +
        dinheiro(total);

}


/* =========================
   QUANTIDADE
========================= */

function aumentar(id) {

    let produtos =
        getProdutos();

    let carrinho =
        getCarrinho();


    let produto =
        produtos.find(
            p => p.id === id
        );

    let item =
        carrinho.find(
            p => p.id === id
        );


    if (!produto || !item)
        return;


    if (
        item.quantidade >=
        produto.estoque
    ) {

        alert(
            "Estoque máximo atingido."
        );

        return;
    }


    item.quantidade++;


    salvarCarrinho(carrinho);

    renderCarrinho();

}


function diminuir(id) {

    let carrinho =
        getCarrinho();


    let item =
        carrinho.find(
            p => p.id === id
        );


    if (!item) return;


    item.quantidade--;


    if (
        item.quantidade <= 0
    ) {

        carrinho =
            carrinho.filter(
                p => p.id !== id
            );

    }


    salvarCarrinho(carrinho);

    renderCarrinho();

}


function removerCarrinho(id) {

    let carrinho =
        getCarrinho();


    carrinho =
        carrinho.filter(
            p => p.id !== id
        );


    salvarCarrinho(carrinho);

    renderCarrinho();

}


function limparCarrinho() {

    if (
        !confirm(
            "Limpar carrinho?"
        )
    ) return;


    localStorage.removeItem(
        "carrinho"
    );


    renderCarrinho();

}


/* =========================
   FINALIZAÇÃO
========================= */

function abrirFinalizacao() {

    let carrinho =
        getCarrinho();


    if (
        carrinho.length === 0
    ) {

        alert(
            "Carrinho vazio."
        );

        return;
    }


    let area =
        document.getElementById(
            "resumoCompra"
        );


    let total = 0;


    area.innerHTML = "";


    carrinho.forEach(item => {

        let subtotal =
            item.preco *
            item.quantidade;


        total += subtotal;


        area.innerHTML += `

            <p>
                ${item.nome}
                x${item.quantidade}
                —
                ${dinheiro(subtotal)}
            </p>

        `;

    });


    area.innerHTML += `

        <hr>

        <h3>
            Total:
            ${dinheiro(total)}
        </h3>

    `;


    document
        .getElementById("modal")
        .style.display = "flex";

}


function fecharModal() {

    document
        .getElementById("modal")
        .style.display = "none";

}


/* =========================
   FINALIZAR COMPRA
========================= */

function finalizarCompra() {

    let carrinho =
        getCarrinho();

    let produtos =
        getProdutos();


    if (
        carrinho.length === 0
    ) return;


    /* VERIFICAR ESTOQUE */

    for (
        let item of carrinho
    ) {

        let produto =
            produtos.find(
                p => p.id === item.id
            );


        if (
            !produto ||
            produto.estoque <
            item.quantidade
        ) {

            alert(
                "Estoque insuficiente para " +
                item.nome
            );

            return;
        }

    }


    let pagamento =
        document.getElementById(
            "pagamento"
        ).value;


    let total = 0;


    /* BAIXAR ESTOQUE */

    carrinho.forEach(item => {

        let produto =
            produtos.find(
                p => p.id === item.id
            );


        produto.estoque -=
            item.quantidade;


        total +=
            item.preco *
            item.quantidade;

    });


    salvarProdutos(produtos);


    /* PEDIDO */

    let pedidoId =
        Date.now().toString();


    let vendas =
        JSON.parse(
            localStorage.getItem(
                "vendas"
            )
        ) || [];


    let venda = {

        id: pedidoId,

        data:
            new Date()
            .toLocaleString(
                "pt-BR"
            ),

        itens:
            carrinho,

        pagamento:
            pagamento,

        total:
            total,

        status:
            "Pedido recebido"

    };


    vendas.push(venda);


    localStorage.setItem(
        "vendas",
        JSON.stringify(vendas)
    );


    /* FATURAMENTO */

    let renda =
        Number(
            localStorage.getItem(
                "renda"
            )
        ) || 0;


    localStorage.setItem(
        "renda",
        renda + total
    );


    /* CRIAR PEDIDO NO FIREBASE */

    if (
        typeof db !== "undefined"
    ) {

        db.ref(
            "pedidos/" + pedidoId
        ).set({

            id: pedidoId,

            status:
                "Pedido recebido",

            pagamento:
                pagamento,

            total:
                total,

            data:
                Date.now(),

            itens:
                carrinho

        });

    }


    localStorage.removeItem(
        "carrinho"
    );


    fecharModal();

    render();


    alert(
        "✅ Compra realizada!\n\n" +
        "Número do pedido: " +
        pedidoId
    );

}


/* =========================
   MAPA
========================= */

let mapa = null;

let marcador = null;

let pedidoAtual = null;


/* =========================
   RASTREAR
========================= */

function rastrearPedido() {

    let id =
        document
        .getElementById(
            "pedidoRastreamento"
        )
        .value
        .trim();


    if (!id) {

        alert(
            "Digite o número do pedido."
        );

        return;
    }


    pedidoAtual = id;


    if (!mapa) {

        mapa =
            L.map("mapa")
            .setView(
                [-5.0892, -42.8016],
                13
            );


        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    "&copy; OpenStreetMap"
            }
        ).addTo(mapa);

    }


    db.ref(
        "entregas/" + id
    ).on(
        "value",
        function(snapshot) {

            let dados =
                snapshot.val();


            if (!dados) {

                document
                    .getElementById(
                        "statusEntrega"
                    )
                    .innerText =
                    "🚚 Pedido ainda não saiu para entrega.";

                return;
            }


            document
                .getElementById(
                    "statusEntrega"
                )
                .innerHTML =

                "🚚 Status: <strong>" +
                dados.status +
                "</strong>";


            let posicao = [

                Number(
                    dados.latitude
                ),

                Number(
                    dados.longitude
                )

            ];


            if (!marcador) {

                marcador =
                    L.marker(
                        posicao
                    )
                    .addTo(mapa)
                    .bindPopup(
                        "🚚 Entregador CasaShop"
                    );

            } else {

                marcador
                    .setLatLng(
                        posicao
                    );

            }


            mapa.setView(
                posicao,
                16
            );

        }
    );

}


/* =========================
   ATUALIZAÇÃO
========================= */

window.addEventListener(
    "storage",
    function() {

        render();

    }
);


render();