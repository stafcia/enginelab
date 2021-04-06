$(function() {
    $('#mainTable').editableTableWidget();
    $('table td').on('change', function(evt, newValue) {
        var currentTargetId = evt.currentTarget.id;
        var currentField = evt.currentTarget.id.split('-')[0];
        var currentFieldId = evt.currentTarget.id.split('-')[1];

        if (currentField === "descripcion" && document.getElementById(currentTargetId).innerHTML != "") {
            var Descripcion = document.getElementById(currentTargetId).innerHTML;
            var solicitud = {
                id: currentFieldId,
                Descripcion
            };
            var jsonSolicitud = JSON.stringify(solicitud);

            $.ajax({
                method: 'POST',
                url: '/secureSession/productos/actualizar/',
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
        } else if (currentField === "producto" && !isNaN(document.getElementById(currentTargetId).innerHTML) && document.getElementById(currentTargetId).innerHTML != "") {
            return false;
        } else {
            return false;
        }
    });
});