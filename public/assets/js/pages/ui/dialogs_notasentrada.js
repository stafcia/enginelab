    $(function() {
        $('.js-sweetalert button').on('click', function() {
            var type = $(this).data('type');
            var id = $(this).data('id');

            if (type === 'tipo-cambio') {
                showPromptMessage(id);
            }

        });
    });

    //These codes takes from http://t4t5.github.io/sweetalert/


    function showPromptMessage(id) {
        swal({
            title: "Tipo de Cambio",
            text: "Teclee el tipo de Cambio:",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Escribe el Tipo de Cambio"
        }, function(inputValue) {
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("¡Necesitas escribir un numero decimal!");
                return false
            } else if (!isNaN(inputValue)) {
                if (ConvertirTC(inputValue, id) === true) {
                    swal("Tipo de cambio", "Tipo de Cambio Seleccionado: " + inputValue, "success");
                }
            } else {
                swal("Error", "El dato escrito no es un numero", "error");
            }

        });
    }

    function ConvertirTC(tipoCambio, id) {
        var Moneda = "MXN";
        var Subtotal = document.getElementById("subTotal").innerHTML * tipoCambio;
        var Descuento = document.getElementById("descuento").innerHTML * tipoCambio;
        var Impuestos = document.getElementById("iVA").innerHTML * tipoCambio;
        var Total = document.getElementById("total").innerHTML * tipoCambio;


        var solicitud = {
            id,
            Moneda,
            Subtotal,
            Descuento,
            Impuestos,
            Total
        };
        var jsonSolicitud = JSON.stringify(solicitud);
        $.ajax({
            method: 'POST',
            url: '/secureSession/notasEntrada/actualizar/',
            data: jsonSolicitud,
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        })

        $(".js-sweetalert button").remove();
        document.getElementById("Moneda").innerHTML = Moneda;
        document.getElementById("subTotal").innerHTML = Subtotal;
        document.getElementById("descuento").innerHTML = Descuento;
        document.getElementById("iVA").innerHTML = Impuestos;
        document.getElementById("total").innerHTML = Total;
        var tags = $('table td[id*="totalPartida-"]');
        var tagsIVA = $('table td[id*="iVA-"]');
        var tagsIEPS = $('table td[id*="iEPS-"]');
        var tagsPUnitario = $('table td[id*="precioUnitario-"]');

        var numeroFilas = mainTable.rows.length;
        var totales = 0;
        var iVA = 0;
        var iEPS = 0;
        var pUnitario = 0;
        var i = 0;
        while (i < numeroFilas - 1) {
            globalTargetId = tags[i].id.split('-')[2];
            totales = Number(document.getElementById(tags[i].id).innerHTML) * tipoCambio;
            iVA = Number(document.getElementById(tagsIVA[i].id).innerHTML) * tipoCambio;
            iEPS = Number(document.getElementById(tagsIEPS[i].id).innerHTML) * tipoCambio;
            pUnitario = Number(document.getElementById(tagsPUnitario[i].id).innerHTML) * tipoCambio;

            document.getElementById(tags[i].id).innerHTML = totales;
            document.getElementById(tagsIVA[i].id).innerHTML = iVA;
            document.getElementById(tagsIEPS[i].id).innerHTML = iEPS;
            document.getElementById(tagsPUnitario[i].id).innerHTML = pUnitario;

            console.log("target:" + globalTargetId);
            var solicitud = {
                id: globalTargetId,
                PrecioUnitario: pUnitario,
                TotalPartida: totales,
                IVApartida: iVA,
                IEPSpartida: iEPS
            };
            var jsonSolicitud = JSON.stringify(solicitud);

            $.ajax({
                method: 'POST',
                url: '/secureSession/notaEntrada/actualizar/',
                data: jsonSolicitud,
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
            i++;
        }

        return true;

    }