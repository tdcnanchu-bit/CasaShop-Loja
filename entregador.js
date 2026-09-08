let watchId = null;


/* =========================
   INICIAR GPS
========================= */

function iniciarEntrega() {

    let pedido =
        document
        .getElementById(
            "pedidoId"
        )
        .value
        .trim();


    if (!pedido) {

        alert(
            "Digite o número do pedido."
        );

        return;
    }


    if (
        !navigator.geolocation
    ) {

        alert(
            "GPS não disponível."
        );

        return;
    }


    document
        .getElementById(
            "statusGPS"
        )
        .innerText =
        "🟢 GPS ativo";


    document
        .getElementById(
            "statusGPS"
        )
        .className =
        "status ativo";


    /*
       Atualizar status
    */

    db.ref(
        "pedidos/" + pedido
    ).update({

        status:
            "Em transporte"

    });


    /*
       GPS
    */

    watchId =
        navigator.geolocation.watchPosition(

            function(position) {

                let latitude =
                    position.coords.latitude;

                let longitude =
                    position.coords.longitude;


                document
                    .getElementById(
                        "latitude"
                    )
                    .innerText =
                    latitude;


                document
                    .getElementById(
                        "longitude"
                    )
                    .innerText =
                    longitude;


                /*
                   SALVAR NO FIREBASE
                */

                db.ref(
                    "entregas/" + pedido
                ).set({

                    latitude:
                        latitude,

                    longitude:
                        longitude,

                    status:
                        "Em transporte",

                    atualizadoEm:
                        Date.now()

                });

            },

            function(error) {

                console.error(error);


                document
                    .getElementById(
                        "statusGPS"
                    )
                    .innerText =
                    "❌ Erro ao acessar GPS";

            },

            {

                enableHighAccuracy:
                    true,

                maximumAge:
                    3000,

                timeout:
                    10000

            }

        );

}


/* =========================
   FINALIZAR
========================= */

function finalizarEntrega() {

    let pedido =
        document
        .getElementById(
            "pedidoId"
        )
        .value
        .trim();


    if (!pedido)
        return;


    if (
        watchId !== null
    ) {

        navigator
            .geolocation
            .clearWatch(
                watchId
            );

        watchId = null;

    }


    db.ref(
        "pedidos/" + pedido
    ).update({

        status:
            "Entregue"

    });


    db.ref(
        "entregas/" + pedido
    ).update({

        status:
            "Entregue",

        atualizadoEm:
            Date.now()

    });


    document
        .getElementById(
            "statusGPS"
        )
        .innerText =
        "🏁 Entrega finalizada";


    document
        .getElementById(
            "statusGPS"
        )
        .className =
        "status";

}