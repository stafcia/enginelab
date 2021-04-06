function agregarProducto()
{
    var cantidad = document.getElementById("numArticulos").value;
    var descripcion = document.getElementById("descripcionArticulos").value;
    var precio = document.getElementById("precioArticulos").value;
    var totalProducto = parseFloat(cantidad) * parseFloat(precio);

    if(cantidad != "" && descripcion != "" && precio !="" && !isNaN(cantidad) && !isNaN(precio) ){
        var table = document.getElementById("mainTable").getElementsByTagName('tbody')[0];
        var row = table.insertRow(0);
        var cantidades = row.insertCell(0);
        var descripciones = row.insertCell(1);
        var preciosUnitarios = row.insertCell(2);
        var totales = row.insertCell(3);
        var eliminar = row.insertCell(4);

        var cantidadTXT = document.createTextNode(cantidad);
        var descripcionTXT = document.createTextNode(descripcion);
        var precioUnitarioTXT = document.createTextNode(precio);
        var totalTXT = document.createTextNode(totalProducto);
        var eliminarTXT = document.createTextNode(cantidad);

        cantidades.appendChild(cantidadTXT);
        descripciones.appendChild(descripcionTXT);
        preciosUnitarios.appendChild(precioUnitarioTXT);
        totales.appendChild(totalTXT);
        eliminar.innerHTML = '<button type="button" class="badge badge-danger" id="botonBorrar">Borrar</a>';
        calcularFactura();
        document.getElementById("numArticulos").value = '';
        document.getElementById("descripcionArticulos").value = '';
        document.getElementById("precioArticulos").value = '';
        document.getElementById("numArticulos").focus();
    }
} 

function guardarFactura(){
    var fechaFactura = document.getElementById("nuevaFechaCreacion").value;
    let dtCreacion = new Date(fechaFactura.split('/')[2],fechaFactura.split('/')[1]-1,fechaFactura.split('/')[0]);
    var serieFactura = document.getElementById("serie").value;
    var numeroFactura = document.getElementById("numero").value;
    var proveedorId = document.getElementById("idProvedorExtranjero").value;
    var totalFactura = parseFloat(document.getElementById("totalFactura").innerHTML.replace("Total: $",""));
    var solicitudesGenerales = {
        serie:serieFactura,
        numero:numeroFactura,
        fecha:dtCreacion,
        idProvedorExtranjero:proveedorId,
        total:totalFactura
    }

    var numeroFilas = mainTable.rows.length;
    var filasFacturas=[];
    i=1;
    while (i < numeroFilas-1) {
        var cantidad = parseFloat(mainTable.rows[i].cells[0].innerHTML);
        var descripcion = mainTable.rows[i].cells[1].innerHTML;
        var precio = parseFloat(mainTable.rows[i].cells[2].innerHTML);
        var totalProducto = parseFloat(mainTable.rows[i].cells[3].innerHTML);
         
        var datos = {
            idFacturaExtranjeros:0,
            cantidadProducto:cantidad,
            descripcionProducto:descripcion,
            totalUnitario:precio,
            totalPartida:totalProducto
        }
        filasFacturas.push(datos);
        i++;
    }
    var Enviar = {
        generales:solicitudesGenerales,
        partidas: filasFacturas
    };
    var jsonEnviar = JSON.stringify(Enviar);
    ///secureSession/notaEntrada/agregarNuevaNotaEntrada/
    $.ajax({
        method: 'POST',
        url: '/secureSession/facturaExtranjero/guardar/',
        data: jsonEnviar,
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    }).then(respuesta=>{
        document.location.href = '/secureSession/facturaExtranjero/'+respuesta.facturaExtranjero;
    });


}

$(document).on('click','#botonBorrar',function(){
    $(this).closest('tr').remove();
    calcularFactura();
});

function calcularFactura(){
    var numeroFilas = mainTable.rows.length;
    var subtotal_=0;
    i=1;
    while (i < numeroFilas-1) {
        subtotal_ = subtotal_ + parseFloat(mainTable.rows[i].cells[3].innerHTML);
        i++;
    }
    document.getElementById("totalFactura").innerHTML = "Total: $"+ subtotal_.toFixed(2).toString();
}

$(function() {
     //Masked Input ============================================================================================================================
     var $demoMaskedInput = $('.inputFecha');

     //Date
     $demoMaskedInput.find('.date').inputmask('dd/mm/yyyy', {
         placeholder: '__/__/____'
     });
 });
