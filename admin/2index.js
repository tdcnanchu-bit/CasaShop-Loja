/* =====================================================
   CASA SHOP - ADMIN
===================================================== */


/* =====================================================
   PRODUTOS
===================================================== */

function getProdutos() {
    try {
        return JSON.parse(
            localStorage.getItem("produtos")
        ) || [];
    } catch (erro) {
        console.error("Erro nos produtos:", erro);
        return [];
    }
}


function salvarProdutos(produtos) {
    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );
}


function dinheiro(valor) {
    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


function novoId() {
    return (
        Date.now().toString() +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );
}


/* =====================================================
   ADICIONAR PRODUTO
===================================================== */

function adicionarProduto() {

    const nome =
        document
            .getElementById("nomeProduto")
            .value
            .trim();

    const preco =
        Number(
            document
                .getElementById("precoProduto")
                .value
        );

    const categoria =
        document
            .getElementById("categoriaProduto")
            .value
            .trim();

    const estoque =
        Number(
            document
                .getElementById("estoqueProduto")
                .value
        );

    let imagem =
        document
            .getElementById("imagemProduto")
            .value
            .trim();


    if (
        !nome ||
        preco <= 0 ||
        !Number.isInteger(estoque) ||
        estoque < 0
    ) {
        alert("Preencha os dados corretamente.");
        return;
    }


    if (!imagem) {
        imagem =
            "https://via.placeholder.com/500x300?text=Produto";
    }


    const produtos = getProdutos();


    produtos.push({
        id: novoId(),
        nome: nome,
        preco: preco,
        categoria: categoria,
        estoque: estoque,
        imagem: imagem
    });


    salvarProdutos(produtos);

    limparFormulario();

    render();

    alert("✅ Produto adicionado!");
}


/* =====================================================
   LIMPAR FORMULÁRIO
===================================================== */

function limparFormulario() {

    document.getElementById(
        "nomeProduto"
    ).value = "";

    document.getElementById(
        "precoProduto"
    ).value = "";

    document.getElementById(
        "categoriaProduto"
    ).value = "";

    document.getElementById(
        "estoqueProduto"
    ).value = "";

    document.getElementById(
        "imagemProduto"
    ).value = "";
}


/* =====================================================
   MOSTRAR PRODUTOS
===================================================== */

function render() {

    const produtos = getProdutos();

    const area =
        document.getElementById(
            "listaProdutos"
        );


    if (!area) {
        return;
    }


    area.innerHTML = "";


    const total =
        document.getElementById(
            "totalProdutos"
        );


    if (total) {
        total.innerText =
            produtos.length;
    }


    if (produtos.length === 0) {

        area.innerHTML =
            "<p>Nenhum produto cadastrado.</p>";

        return;
    }


    produtos.forEach(function(produto) {

        area.innerHTML += `

            <div class="produto">

                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                >

                <h3>
                    ${produto.nome}
                </h3>

                <p>
                    💰 ${dinheiro(produto.preco)}
                </p>

                <p>
                    📂
                    ${produto.categoria || "Sem categoria"}
                </p>

                <p>
                    📦 Estoque:
                    ${produto.estoque}
                </p>

                <button
                    onclick="editarProduto('${produto.id}')"
                >
                    ✏️ Editar
                </button>

                <button
                    class="remover"
                    onclick="removerProduto('${produto.id}')"
                >
                    🗑️ Remover
                </button>

            </div>

        `;

    });
}


/* =====================================================
   EDITAR PRODUTO
===================================================== */

function editarProduto(id) {

    const produtos = getProdutos();


    const produto =
        produtos.find(function(p) {
            return p.id === id;
        });


    if (!produto) {
        return;
    }


    const nome =
        prompt(
            "Nome do produto:",
            produto.nome
        );


    if (nome === null) {
        return;
    }


    const preco =
        Number(
            prompt(
                "Preço:",
                produto.preco
            )
        );


    if (preco <= 0) {

        alert("Preço inválido.");

        return;
    }


    const categoria =
        prompt(
            "Categoria:",
            produto.categoria || ""
        );


    if (categoria === null) {
        return;
    }


    const estoque =
        Number(
            prompt(
                "Estoque:",
                produto.estoque
            )
        );


    if (
        !Number.isInteger(estoque) ||
        estoque < 0
    ) {

        alert("Estoque inválido.");

        return;
    }


    const imagem =
        prompt(
            "Link da imagem:",
            produto.imagem || ""
        );


    if (imagem === null) {
        return;
    }


    produto.nome =
        nome.trim();

    produto.preco =
        preco;

    produto.categoria =
        categoria.trim();

    produto.estoque =
        estoque;

    produto.imagem =
        imagem.trim();


    salvarProdutos(produtos);

    render();

    alert("✅ Produto atualizado!");
}


/* =====================================================
   REMOVER PRODUTO
===================================================== */

function removerProduto(id) {

    let produtos = getProdutos();


    const produto =
        produtos.find(function(p) {
            return p.id === id;
        });


    if (!produto) {
        return;
    }


    const confirmar =
        confirm(
            "Remover " +
            produto.nome +
            "?"
        );


    if (!confirmar) {
        return;
    }


    produtos =
        produtos.filter(function(p) {
            return p.id !== id;
        });


    salvarProdutos(produtos);

    render();

    alert("🗑️ Produto removido!");
}


/* =====================================================
   PEDIDOS
===================================================== */

function carregarPedidos() {

    if (typeof db === "undefined") {

        console.warn(
            "Firebase ainda não foi configurado."
        );

        return;
    }


    const area =
        document.getElementById(
            "listaPedidos"
        );


    if (!area) {
        return;
    }


    db.ref("pedidos").on(
        "value",
        function(snapshot) {

            const dados =
                snapshot.val();


            area.innerHTML = "";


            if (!dados) {

                area.innerHTML =
                    "<p>Nenhum pedido recebido.</p>";

                return;
            }


            const pedidos =
                Object.values(dados);


            pedidos.sort(
                function(a, b) {
                    return (
                        (b.data || 0) -
                        (a.data || 0)
                    );
                }
            );


            pedidos.forEach(
                function(pedido) {

                    let itens = "";


                    if (
                        Array.isArray(
                            pedido.itens
                        )
                    ) {

                        itens =
                            pedido.itens
                                .map(
                                    function(item) {

                                        return (
                                            item.nome +
                                            " x" +
                                            item.quantidade
                                        );

                                    }
                                )
                                .join(", ");

                    }


                    let botaoEntrega = "";


                    if (
                        pedido.status !==
                        "Entregue"
                    ) {

                        botaoEntrega = `

                            <button
                                onclick="enviarEntrega('${pedido.id}')"
                            >
                                🚚 Enviar para Entrega
                            </button>

                        `;

                    } else {

                        botaoEntrega = `

                            <p>
                                ✅ Pedido entregue
                            </p>

                        `;

                    }


                    area.innerHTML += `

                        <div class="produto">

                            <h3>
                                🧾 Pedido #${pedido.id}
                            </h3>

                            <p>
                                📦 ${itens}
                            </p>

                            <p>
                                💳
                                ${pedido.pagamento || "Não informado"}
                            </p>

                            <p>
                                💰
                                ${dinheiro(pedido.total)}
                            </p>

                            <p>
                                🚚 Status:
                                <strong>
                                    ${pedido.status || "Recebido"}
                                </strong>
                            </p>

                            ${botaoEntrega}

                            <a
                                href="entregador.html?pedido=${pedido.id}"
                                class="link-admin"
                            >
                                📍 Abrir Entregador
                            </a>

                        </div>

                    `;

                }
            );

        }
    );
}


/* =====================================================
   ENVIAR PEDIDO PARA ENTREGA
===================================================== */

function enviarEntrega(id) {

    if (typeof db === "undefined") {

        alert(
            "❌ Firebase não está configurado."
        );

        return;
    }


    db.ref(
        "pedidos/" + id
    ).update({

        status:
            "Saiu para entrega"

    });


    db.ref(
        "entregas/" + id
    ).update({

        status:
            "Saiu para entrega",

        atualizadoEm:
            Date.now()

    });


    alert(
        "🚚 Pedido enviado para o entregador!"
    );
}


/* =====================================================
   HISTÓRICO
===================================================== */

function renderHistorico() {

    let vendas = [];


    try {

        vendas =
            JSON.parse(
                localStorage.getItem(
                    "vendas"
                )
            ) || [];

    } catch (erro) {

        vendas = [];

    }


    const area =
        document.getElementById(
            "historico"
        );


    if (!area) {
        return;
    }


    const renda =
        Number(
            localStorage.getItem(
                "renda"
            )
        ) || 0;


    const totalVendas =
        document.getElementById(
            "totalVendas"
        );


    const faturamento =
        document.getElementById(
            "faturamento"
        );


    if (totalVendas) {

        totalVendas.innerText =
            vendas.length;

    }


    if (faturamento) {

        faturamento.innerText =
            dinheiro(renda);

    }


    area.innerHTML = "";


    if (vendas.length === 0) {

        area.innerHTML =
            "<p>Nenhuma venda realizada.</p>";

        return;
    }


    vendas
        .slice()
        .reverse()
        .forEach(
            function(venda) {

                let itens =
                    "";


                if (
                    Array.isArray(
                        venda.itens
                    )
                ) {

                    itens =
                        venda.itens
                            .map(
                                function(item) {

                                    return (
                                        item.nome +
                                        " x" +
                                        item.quantidade
                                    );

                                }
                            )
                            .join(", ");

                }


                area.innerHTML += `

                    <div class="item-carrinho">

                        <strong>
                            🧾 Venda #${venda.id}
                        </strong>

                        <p>
                            📅 ${venda.data}
                        </p>

                        <p>
                            🛍️ ${itens}
                        </p>

                        <p>
                            💳 ${venda.pagamento}
                        </p>

                        <strong>
                            💰
                            ${dinheiro(venda.total)}
                        </strong>

                    </div>

                `;

            }
        );
}


/* =====================================================
   ATUALIZAÇÃO
===================================================== */

window.addEventListener(
    "storage",
    function() {

        render();

        renderHistorico();

    }
);


/* =====================================================
   INICIAR
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        render();

        renderHistorico();

        carregarPedidos();

    }
);
