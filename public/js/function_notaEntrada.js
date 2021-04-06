function cambiarFecha() 
{
    var nuevaFecha  = document.getElementById("nuevaFechaCreacion").value;
    var idNota = document.getElementById("idNota").value;
    //Convertimos Nueva Fecha
    let dt = new Date(nuevaFecha.split('/')[2],nuevaFecha.split('/')[1]-1,nuevaFecha.split('/')[0]);

    var solicitud = {
        id: idNota,
        createdAt: dt
    };
    var jsonSolicitud = JSON.stringify(solicitud);

    $.ajax({
        method: 'POST',
        url: '/secureSession/notaEntrada/fechaActualizar/',
        data: jsonSolicitud,
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    })
                                                
    document.getElementById("fechaCreacion").innerHTML = dt.toISOString().substring(0, 10);
    document.getElementById("nuevaFechaCreacion").value = "";
}
//2020-02-01