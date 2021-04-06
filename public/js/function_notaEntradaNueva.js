
                    function agregarPreciosSelectOption(codigoProducto)
                    {
                        var solicitud = {
                            codigo: codigoProducto
                        };
                        var jsonSolicitud = JSON.stringify(solicitud);
                    
                        $.ajax({
                            method: 'POST',
                            url: '/secureSession/notasEntrada/obtenerPrecios/',
                            data: jsonSolicitud,
                            dataType: "json",
                            contentType: "application/json; charset=utf-8"
                        }).then(precios=>{
                            $('#precioProducto')
                            .find('option')
                            .remove()
                            .selectpicker('refresh');
                            var tableHeaderRowCount = 1;
                            var table = document.getElementById('tablaPrecios');
                            var rowCount = table.rows.length;
                            for (var i = tableHeaderRowCount; i < rowCount; i++) {
                                table.deleteRow(tableHeaderRowCount);
                            }
                            
                            precios.precios.forEach(precio => {
                                /*$('#precioProducto').append(`<option value="${precio.PrecioUnitario}"> 
                                       ${precio.PrecioUnitario} 
                                  </option>`); */
                                  var table = document.getElementById("tablaPrecios").getElementsByTagName('tbody')[0];
                                    var row = table.insertRow(0);
                                    var pActual = row.insertCell(0);
                                    var pActualTXT = document.createTextNode(precio.PrecioUnitario);
                                    pActual.appendChild(pActualTXT);
                            });
                            //$('#precioProducto').selectpicker('refresh');
                        })
                    }
                    function agregarProducto() 
                    {
                        
                        var cantidad = document.getElementById("cantidad").value;
                        var codigo = document.getElementById("codigoProducto").value;
                        var descripcion = document.getElementById("descripcion").value;
                        var precio = document.getElementById("precioProducto").value;

                        var table = document.getElementById("mainTable").getElementsByTagName('tbody')[0];
                        var row = table.insertRow(0);
                        var codigoInterno = row.insertCell(0);
                        var descripciones = row.insertCell(1);
                        var cantidades = row.insertCell(2);
                        var precioUnitario = row.insertCell(3);
                        var iVA = row.insertCell(4);
                        var iEPS = row.insertCell(5);
                        var porcIEPS = row.insertCell(6);
                        var total = row.insertCell(7);
                        var Busqueda = row.insertCell(8);

                        var codigoInternoTXT = document.createTextNode(codigo);
                        var descripcionTXT = document.createTextNode(descripcion);
                        var cantidadesTXT = document.createTextNode(cantidad);
                        var precioUnitarioTXT = document.createTextNode(precio);
                        var iVATXT = document.createTextNode(parseFloat(cantidad)*(parseFloat(precio)*.16));
                        var iEPSTXT = document.createTextNode(0);
                        var porcIEPSTXT = document.createTextNode(0);
                        var totalTXT = document.createTextNode(parseFloat(cantidad)*(parseFloat(precio)));

                        codigoInterno.appendChild(codigoInternoTXT);
                        cantidades.appendChild(cantidadesTXT);
                        precioUnitario.appendChild(precioUnitarioTXT);
                        iVA.appendChild(iVATXT);
                        iEPS.appendChild(iEPSTXT);
                        porcIEPS.appendChild(porcIEPSTXT);
                        total.appendChild(totalTXT);
                        descripciones.appendChild(descripcionTXT);
                        Busqueda.innerHTML = '<button type="button" class="badge badge-danger" id="botonBorrar">Borrar</a>';

                        var numeroFilas = mainTable.rows.length;
                        var subtotal_=0;
                        var impuestos_ = 0;
                        i=1;
                        while (i < numeroFilas) {
                            
                            subtotal_ = subtotal_ + parseFloat(mainTable.rows[i].cells[7].innerHTML);
                            impuestos_ = impuestos_ + parseFloat(mainTable.rows[i].cells[4].innerHTML);
                            i++;
                            
                        }
                        document.getElementById("subTotal").innerHTML = subtotal_;
                        document.getElementById("iVA").innerHTML = impuestos_;
                        document.getElementById("total").innerHTML = subtotal_+impuestos_;

                        document.getElementById("cantidad").value = '';
                        document.getElementById("codigoProducto").value = '';
                        document.getElementById("descripcion").value = '';
                        document.getElementById("precioProducto").value = '';
                        document.getElementById("cantidad").focus();
                    } 
                    function guardarNotaEntrada(){
                        var nombreProveedor = document.getElementById("nombreProveedor").value;
                        var rFC = document.getElementById("RFC").value;
                        var numRemision = document.getElementById("numRemision").value;
                        var moneda = $("#moneda option:selected").text();
                        var fechaCreacion = document.getElementById("nuevaFechaCreacion").value;
                        let dtCreacion = new Date(fechaCreacion.split('/')[2],fechaCreacion.split('/')[1]-1,fechaCreacion.split('/')[0]);
                        var subTotal = document.getElementById("subTotal").innerHTML;
                        var descuento = document.getElementById("descuento").innerHTML;
                        var impuestos =document.getElementById("iVA").innerHTML;
                        var total =document.getElementById("total").innerHTML;

                        var solicitudGenerales = {
                            RFC: rFC,
                            NombreProveedor: nombreProveedor,
                            Subtotal: subTotal,
                            Descuento: descuento,
                            Impuestos: impuestos,
                            Total: total,
                            Moneda: moneda,
                            NumRemision:numRemision,
                            createdAt: dtCreacion,
                            Status:'A'
                        };

                        

                        var numeroFilas = mainTable.rows.length;
                        var $filasNotas=[];
                        i=1;
                        while (i < numeroFilas) {
                            
                            var codigo = parseFloat(mainTable.rows[i].cells[0].innerHTML);
                            var descripcion = mainTable.rows[i].cells[1].innerHTML;
                            var cantidad = parseFloat(mainTable.rows[i].cells[2].innerHTML);
                            var precioUnitario = parseFloat(mainTable.rows[i].cells[3].innerHTML);
                            var iVAField = parseFloat(mainTable.rows[i].cells[4].innerHTML);
                            var Total = parseFloat(mainTable.rows[i].cells[7].innerHTML);

                            var Datos = {
                                id_NotasEntradas:0,
                                Descripcion: descripcion,
                                Cantidad:cantidad,
                                PrecioUnitario:precioUnitario,
                                CodigoInterno:codigo,
                                ClaveProdServ:'0',
                                ClaveUnidad:'',
                                TotalPartida:Total,
                                IVApartida: iVAField,
                                IEPSpartida:0.00,
                                IEPSporc:0.00
                            }
                            $filasNotas.push(Datos);
                            i++;
                            
                        }

                        var Enviar = {
                            generales:solicitudGenerales,
                            partidas: $filasNotas
                        };

                        var jsonEnviar = JSON.stringify(Enviar);

                        $.ajax({
                            method: 'POST',
                            url: '/secureSession/notaEntrada/agregarNuevaNotaEntrada/',
                            data: jsonEnviar,
                            dataType: "json",
                            contentType: "application/json; charset=utf-8"
                        }).then(respuesta=>{
                            document.location.href = '/secureSession/notaEntrada/'+respuesta.notaEntrada;
                        });


                    }

                    $(document).on('click','#botonBorrar',function(){
                        $(this).closest('tr').remove();
                        var numeroFilas = mainTable.rows.length;
                        var subtotal_=0;
                        var impuestos_ = 0;
                        i=1;
                        while (i < numeroFilas) {
                            
                            subtotal_ = subtotal_ + parseFloat(mainTable.rows[i].cells[7].innerHTML);
                            impuestos_ = impuestos_ + parseFloat(mainTable.rows[i].cells[4].innerHTML);
                            i++;
                            
                        }
                        document.getElementById("subTotal").innerHTML = subtotal_;
                        document.getElementById("iVA").innerHTML = impuestos_;
                        document.getElementById("total").innerHTML = subtotal_ + impuestos_;
                    });

                    $(function() {
                        $("#nombreProveedor").on('change', function(){
                            var nombreRFC = document.getElementById("nombreProveedor").value;
                            document.getElementById("nombreProveedor").value = nombreRFC.split('-')[0];
                            document.getElementById("RFC").disabled = true;
                            document.getElementById("RFC").value = nombreRFC.split('-')[1];
                         })
                         $("#RFC").on('change', function(){
                            var nombreRFC = document.getElementById("RFC").value;
                            document.getElementById("RFC").value = nombreRFC.split('-')[0];
                            document.getElementById("nombreProveedor").disabled = true;
                            document.getElementById("nombreProveedor").value = nombreRFC.split('-')[1];
                         })

                         $("#codigoProducto").on('change', function(){
                             
                            var producto = document.getElementById("codigoProducto").value;
                            agregarPreciosSelectOption(producto.split('-')[1]);
                            document.getElementById("codigoProducto").value = producto.split('-')[1];
                            document.getElementById("descripcion").value = producto.split('-')[0];
                         })

                         $("#descripcion").on('change', function(){
                            var producto = document.getElementById("descripcion").value;
                            agregarPreciosSelectOption(producto.split('-')[0]);
                            document.getElementById("descripcion").value = producto.split('-')[1];
                            document.getElementById("codigoProducto").value = producto.split('-')[0];
                         })

                         

                        //Masked Input ============================================================================================================================
                        var $demoMaskedInput = $('.demo-masked-input');

                        //Date
                        $demoMaskedInput.find('.date').inputmask('dd/mm/yyyy', {
                            placeholder: '__/__/____'
                        });
                    });
