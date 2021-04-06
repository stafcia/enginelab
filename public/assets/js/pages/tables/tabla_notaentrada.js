$(function() {
    $('#mainTable').editableTableWidget();
    $('#mainTable2').editableTableWidget();

    function recalculaFactura(globalTargetId) {
        var numeroFilas = mainTable.rows.length;
        var i = 0;

        var tags = $('table td[id*="totalPartida-"]');
        var tagsIVA = $('table td[id*="iVA-"]');
        var tagsIEPS = $('table td[id*="iEPS-"]');
        var totales = 0;
        var iVA = 0;
        var iEPS = 0;
        while (i < numeroFilas - 1) {
            totales = totales + Number(document.getElementById(tags[i].id).innerHTML);
            iVA = iVA + Number(document.getElementById(tagsIVA[i].id).innerHTML);
            iEPS = iEPS + Number(document.getElementById(tagsIEPS[i].id).innerHTML);
            i++;
        }
        document.getElementById("subTotal").innerHTML = totales;
        descuento = document.getElementById("descuento").innerHTML;
        document.getElementById("iVA").innerHTML = roundNumber(iVA + iEPS, 2);
        document.getElementById("total").innerHTML = roundNumber((totales - Number(descuento) + iVA + iEPS), 2);
        var solicitud = {
            id: globalTargetId,
            Subtotal: totales,
            Descuento: descuento,
            Impuestos: roundNumber(iVA + iEPS, 2),
            Total: roundNumber((totales - Number(descuento) + iVA + iEPS), 2)
        };


        var jsonSolicitud = JSON.stringify(solicitud);

        $.ajax({
            method: 'POST',
            url: '/secureSession/notasEntrada/actualizar/',
            data: jsonSolicitud,
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        });
    }

    $('input').on('change',
        function(evt, newValue) {
            var currentTargetId = evt.currentTarget.id;
            if (currentTargetId.includes('productoInput') && document.getElementById(currentTargetId).value != '') {
                var currTargetId = evt.currentTarget.id.split('-')[1];
                var currTargetModificar = evt.currentTarget.id.split('-')[2];
                var DatosInput = document.getElementById(currentTargetId).value;
                var Descripcion = DatosInput.split('-')[0];
                var Codigo = DatosInput.split('-')[1];



                var solicitud = {
                    id: currTargetModificar,
                    CodigoInterno: Codigo
                }

                var jsonSolicitud = JSON.stringify(solicitud);
                $.ajax({
                    method: 'POST',
                    url: '/secureSession/notaEntrada/actualizar/',
                    data: jsonSolicitud,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                }).done(res => {
                    document.getElementById("codigoInterno-" + currTargetId + "-" + currTargetModificar).innerHTML = Codigo;

                    solicitud = {
                        id: currTargetModificar,
                        Descripcion: Descripcion
                    }

                    jsonSolicitud = JSON.stringify(solicitud);
                    $.ajax({
                        method: 'POST',
                        url: '/secureSession/notaEntrada/actualizar/',
                        data: jsonSolicitud,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8"
                    }).done(res => {
                        document.getElementById("descripcion-" + currTargetId + "-" + currTargetModificar).innerHTML = Descripcion;
                        document.getElementById(currentTargetId).value = '';
                    });
                });



            }
        })

    $('table td').on('change', function(evt, newValue) {

        // do something with the new cell value 
        var currentTargetId = evt.currentTarget.id;
        var currTargetField = evt.currentTarget.id.split('-')[0];
        var currTargetId = evt.currentTarget.id.split('-')[1];
        var globalTargetId = evt.currentTarget.id.split('-')[2];
        if (currTargetField === "precioUnitario") {
            var precioUnitario = document.getElementById(currentTargetId).innerHTML;
            if (!isNaN(newValue) && newValue != "" && precioUnitario != 0) {
                var cantidad = document.getElementById("cantidad-" + currTargetId + "-" + globalTargetId).innerHTML;
                var totalPartida = precioUnitario * cantidad;
                var iVA = document.getElementById("iVA-" + currTargetId + "-" + globalTargetId).innerHTML;
                var iEPS = document.getElementById("iEPS-" + currTargetId + "-" + globalTargetId).innerHTML;
                var porciEPS = document.getElementById("iEPSPorc-" + currTargetId + "-" + globalTargetId).innerHTML;

                console.log(iVA + '-' + iEPS + '-' + porciEPS);

                if (iVA > 0) {
                    iVA = totalPartida * .16;
                }

                if (porciEPS > 0) {
                    iEPS = totalPartida * porciEPS;
                }


                var solicitud = {
                    id: globalTargetId,
                    Cantidad: cantidad,
                    PrecioUnitario: precioUnitario,
                    TotalPartida: totalPartida,
                    IVApartida: iVA,
                    IEPSpartida: iEPS
                };
                console.log(solicitud)
                var jsonSolicitud = JSON.stringify(solicitud);

                $.ajax({
                    method: 'POST',
                    url: '/secureSession/notaEntrada/actualizar/',
                    data: jsonSolicitud,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                }).done(res => {
                    if (res.success) {
                        try {
                            return true;
                        } finally {

                            document.getElementById("totalPartida-" + currTargetId + "-" + globalTargetId).innerHTML = totalPartida;
                            document.getElementById("iVA-" + currTargetId + "-" + globalTargetId).innerHTML = iVA;
                            document.getElementById("iEPS-" + currTargetId + "-" + globalTargetId).innerHTML = iEPS;
                            //console.log(res.id);
                            recalculaFactura(res.id);
                        }
                    } else {
                        return false;
                    }
                });
            } else {
                return false;
            }
        } else if (currTargetField === "codigoInterno") {
            var solicitud = {
                id: globalTargetId,
                CodigoInterno: document.getElementById(currentTargetId).innerHTML
            }

            var jsonSolicitud = JSON.stringify(solicitud);
            $.ajax({
                method: 'POST',
                url: '/secureSession/notaEntrada/actualizar/',
                data: jsonSolicitud,
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            }).done(res => {
                if (res.success) {
                    return true;
                } else {
                    return false;
                }
            });
            //Modificar Codigo Producto en bd
        } else if (currTargetField === "descripcion") {
            var solicitud = {
                id: globalTargetId,
                Descripcion: document.getElementById(currentTargetId).innerHTML
            }

            var jsonSolicitud = JSON.stringify(solicitud);
            $.ajax({
                method: 'POST',
                url: '/secureSession/notaEntrada/actualizar/',
                data: jsonSolicitud,
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            }).done(res => {
                if (res.success) {
                    return true;
                } else {
                    return false;
                }
            });
            //Modificar Codigo Producto en bd
        } else if (currTargetField === "cantidad") {
            var cantidad = document.getElementById(currentTargetId).innerHTML;
            if (!isNaN(newValue) && newValue != "" && cantidad != 0) {

                var precioUnitario = document.getElementById("precioUnitario-" + currTargetId + "-" + globalTargetId).innerHTML;
                var totalPartida = precioUnitario * cantidad;
                var iVA = document.getElementById("iVA-" + currTargetId + "-" + globalTargetId).innerHTML;
                var iEPS = document.getElementById("iEPS-" + currTargetId + "-" + globalTargetId).innerHTML;
                var porciEPS = document.getElementById("iEPSPorc-" + currTargetId + "-" + globalTargetId).innerHTML;

                console.log(iVA + '-' + iEPS + '-' + porciEPS);

                if (iVA > 0) {
                    iVA = totalPartida * .16;
                }

                if (porciEPS > 0) {
                    iEPS = totalPartida * porciEPS;
                }


                var solicitud = {
                    id: globalTargetId,
                    Cantidad: cantidad,
                    PrecioUnitario: precioUnitario,
                    TotalPartida: totalPartida,
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
                }).done(res => {
                    if (res.success) {
                        try {
                            return true;
                        } finally {

                            document.getElementById("totalPartida-" + currTargetId + "-" + globalTargetId).innerHTML = totalPartida;
                            document.getElementById("iVA-" + currTargetId + "-" + globalTargetId).innerHTML = iVA;
                            document.getElementById("iEPS-" + currTargetId + "-" + globalTargetId).innerHTML = iEPS;
                            //console.log(res.id);
                            recalculaFactura(res.id);
                        }
                    } else {
                        return false;
                    }
                });
            } else {
                return false;
            }
        }


    });

    function roundNumber(num, scale) {
        if (!("" + num).includes("e")) {
            return +(Math.round(num + "e+" + scale) + "e-" + scale);
        } else {
            var arr = ("" + num).split("e");
            var sig = ""
            if (+arr[1] + scale > 0) {
                sig = "+";
            }
            return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
        }
    }
});