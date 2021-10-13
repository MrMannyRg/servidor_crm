const express = require('express')
const cors = require('cors')
const app = express();
const mysql = require('mysql')

const db = mysql.createConnection({
    host: '3.12.161.88',
    user: 'crm',
    password: 'Crm#28092021',
    database: 'crmsz'
})

app.use(cors())
app.use(express.json())

app.get('/obtener_clientes', function (req, res) {
    // funcion  que obtiene los clientes
    /*
        Recibe los parametros del usuario que inició sesion y los filtros
    */
    // Se convierten los parametros que llegan como objetos a un string de SQL
    const params = convertirParametros(req.query);

    // se hace un query a la bd con el SP necesario y sus parametros
    db.query(`call obtener_clientes(${params})`, function (error, results, fields) {

        if (error) throw error;
        else {
            let auxClientes = []; // Arreglo que contendrá todos los clientes 
            let idAux = -1; // Auxiliar que indica si llega o no un cliente repetido
            results[0].forEach((cliente) => {

                // Aqui se renombran las variables como ya se utilizaban anteriormente

                // Se crea un objeto con el responsable
                const responsable = {
                    id: cliente.id_usuario,
                    nombre: cliente.nombre
                }

                // Se crea un objeto con la direccion
                const direccion = {
                    id: cliente.id_direccion,
                    calleFacturacion: cliente.calle_facturacion,
                    ciudadFacturacion: cliente.ciudad_facturacion,
                    estadoFacturacion: cliente.estado_facturacion,
                    numeroExteriorFacturacion: cliente.numero_exterior_facturacion,
                    numeroInteriorFacturacion: cliente.numero_interior_facturacion,
                    paisFacturacion: cliente.pais_facturacion,
                    poblacionFacturacion: cliente.poblacion_facturacion
                }

                // Se pregunta si el cliente es repetido
                if (idAux !== cliente.id_cliente) {

                    // si no es repetido se guarda el id de ese cliente
                    idAux = cliente.id_cliente;

                    // Se crea el auxiliar de ese cliente
                    const aux = {
                        id: cliente.id_cliente,
                        key: cliente.id_cliente,
                        activo: cliente.activo,
                        calificacion: cliente.descripcion_calificacion_cliente,
                        foto: cliente.foto,
                        comentario: cliente.comentarios,
                        correo: cliente.correo,
                        creadoPor: cliente.creado_por,
                        fax: cliente.fax,
                        fechaCreacion: cliente.fecha_hora_creacion,
                        fechaModificacion: cliente.fecha_hora_modificacion,
                        giro: cliente.descripcion_giro_cliente,
                        indicador: cliente.indicador,
                        modificadoPor: cliente.modificado_por,
                        nombreComercial: cliente.nombre_comercial,
                        razonSocial: cliente.razon_social,
                        recomendacion: cliente.recomendacion,
                        telefono: [cliente.telefono],
                        tipoEmpresa: cliente.descripcion_tipo_empresa,
                        tipoPersona: cliente.descripcion_tipo_persona,
                        valorAnual: cliente.valor_anual,
                        valorTrimestral: cliente.valor_trimestral,
                        web: cliente.web,
                        zonaHoraria: cliente.zona_horaria,
                        id: cliente.id_cliente,
                        responsable: [responsable],
                        direccion: [direccion]
                    };

                    // Se agrega a la lista auxiliar de clientes
                    auxClientes.push(aux);
                } else {
                    // si es un cliente repetido quiere decir que tiene mas de una direccion o responsable

                    const indexCliente = auxClientes.length - 1; // index del ultimo cliente
                    const ultimoCliente = auxClientes[indexCliente]; // objeto del ultimo cliente

                    const indexResponsable = ultimoCliente.responsable.length - 1; // index del ultimo responsable 
                    const indexDireccion = ultimoCliente.direccion.length - 1; // index de la ultima direccion 

                    const UltimaDireccion = ultimoCliente.direccion[indexDireccion]; // objeto de la ultima direccion
                    const ultimoResponsable = ultimoCliente.responsable[indexResponsable]; // objeto del ultimo responsable

                    // Se pregunta si el id de la ultima direccion es diferente a la nueva que llega
                    if (UltimaDireccion.id !== direccion.id) {
                        // Se agrega esa direccion al arreglo de direcciones del ultimo cliente
                        auxClientes[indexCliente].direccion.push(direccion);
                    } else {
                        // Se pregunta si el id del ultimo responsable es diferente al nuevo que llega
                        if (ultimoResponsable.id !== responsable.id) {
                            // Se agrega ese responsable al arreglo de responsables del ultimo cliente
                            auxClientes[indexCliente].responsable.push(responsable);
                        }
                    }
                }
            });
            // Se devuelve el resultado de la peticion
            res.send(auxClientes);
        };
    })
});

app.get('/obtener_contactos', function (req, res) {

    // funcion  que obtiene los contactos
    /*
        No recibe ningun parametro
    */

    db.query('call obtener_contactos', function (error, results, fields) {

        if (error) throw error;
        else {
            let auxContactos = [] // Arreglo que contendrá todos los contactos
            let idAux = -1; // Auxiliar que indica si llega o no un contacto repetido

            results[0].forEach(contacto => {

                // Aqui se renombran las variables como ya se utilizaban anteriormente

                // Objeto de la red social
                const redSocial = {
                    id: contacto.id_red_social,
                    redSocial: contacto.descripcion_red_social_contacto,
                };

                if (idAux !== contacto.id) {

                    idAux = contacto.id;

                    const aux = {
                        id: contacto.id_contacto,
                        activo: contacto.activo,
                        apellido: contacto.apellido,
                        calleVisita: contacto.calle_visita,
                        ciudadVisita: contacto.ciudad_visita,
                        estadoVisita: contacto.estado_visita,
                        numeroExteriorVisita: contacto.numero_exterior_visita,
                        numeroInteriorVisita: contacto.numero_interior_visita,
                        paisVisita: contacto.pais_visita,
                        poblacionVisita: contacto.poblacion_visita,
                        cargo: contacto.descripcion_cargo_contacto,
                        cliente: {
                            id: contacto.id_cliente
                        },
                        comentario: contacto.comentarios,
                        correo: contacto.correo,
                        creadoPor: contacto.creado_por,
                        departamento: contacto.departamento,
                        extension: contacto.extension,
                        fechaCreacion: contacto.fecha_hora_creacion,
                        fechaModificacion: contacto.fecha_hora_modificacion,
                        fechaNacimiento: contacto.fecha_nacimiento,
                        foto: contacto.foto,
                        genero: contacto.descripcion_genero_contacto,
                        nombre: contacto.nombre,
                        telefono: contacto.telefono,
                        tratamiento: contacto.descripcion_tratamiento_contacto,
                        redesSociales: [redSocial]
                    };
                    auxContactos.push(aux);
                } else {
                    const indexContacto = auxContactos.length - 1; // index del ultimo cliente
                    const ultimoContacto = auxContactos[indexContacto]; // objeto del ultimo cliente

                    const indexRedesSociales = ultimoContacto.redesSociales.length - 1; // index de la ultima red social 

                    const UltimaRedSocial = ultimoContacto.redesSociales[indexRedesSociales]; // objeto de la ultima red socual


                    // Se pregunta si el id de la ultima red es diferente a la nueva que llega
                    if (UltimaRedSocial.id !== redSocial.id) {
                        // Se agrega esa direccion al arreglo de redes del ultimo cliente
                        auxContactos[indexContacto].redesSociales.push(redSocial);
                    }
                }

            });
            // se manda la informacion como resultado
            res.send(auxContactos);
        }
    });
});

app.get('/obtener_usuarios', function (req, res) {

    // funcion  que obtiene los usuarios
    /*
        No recibe ningun parametro
    */

    db.query('call obtener_usuarios', function (error, results, fields) {

        if (error) throw error;
        else {

            // Se acomodan los nombres de las variables a como ya se usan en el sistema
            let auxUsuarios = []; // Aux de los contactos
            results[0].forEach(usuario => {
                const data = {
                    ...usuario,
                    id: usuario.id_usuario,
                    uid: usuario.uuid
                }
                // Se agrega la data en el arreglo auxiliar
                auxUsuarios.push(data);
            });
            // se manda el resultado
            res.send(auxUsuarios);
        }
    });
});

app.get('/obtener_oportunidades', function (req, res) {

    // funcion  que obtiene las oportunidades
    /*
        Recibe los parametros del usuario que inició sesion y los filtros
    */
    // Se convierten los parametros que llegan como objetos a un string de SQL
    const params = convertirParametros(req.query);

    db.query(`call obtener_oportunidades(${params})`, function (error, results, fields) {
        if (error) throw error;
        else {

            // Se acomodan los nombres de las variables a como ya se usan en el sistema
            let auxOportunidades = []; // Arreglo que contendrá todos las oportunidades
            let idAux = -1; // Auxiliar que indica si llega o no una oportunidad repetida
            results[0].forEach((oportunidad, index) => {
                // objeto con el responsable y sus datos
                const responsable = {
                    id: oportunidad.id_responsable,
                    nombre: oportunidad.nombre_responsable,
                }

                // Pregunta si el auxid es difernte al de la oportunidad que llega
                if (idAux !== oportunidad.id_oportunidad) {
                    idAux = oportunidad.id_oportunidad;

                    const aux = {
                        id: oportunidad.id_oportunidad,
                        activo: oportunidad.activo,
                        cliente: {
                            id: oportunidad.id_cliente,
                            nombreComercial: oportunidad.nombre_comercial,
                            razonSocial: oportunidad.razon_social,
                        },
                        comentario: oportunidad.comentarios,
                        comentarioPerdida: oportunidad.comentario_perdida,
                        contacto: {
                            apellido: oportunidad.apellido,
                            id: oportunidad.id_contacto,
                            nombre: oportunidad.nombre,
                        },
                        creadoPor: oportunidad.creado_por,
                        divisa: oportunidad.descripcion_divisa,
                        etapa: oportunidad.descripcion_etapa_oportunidad,
                        fechaCreacion: oportunidad.fecha_hora_creacion,
                        fechaPrevista: oportunidad.fecha_prevista_venta,
                        fechaEstimadaCierre: oportunidad.fecha_estimada_cierre,
                        fechaModificacion: oportunidad.fecha_hora_modificacion,
                        importeTotal: oportunidad.importe_total,
                        intermediario: {
                            id: oportunidad.id_intermediario,
                            nombreComercial: oportunidad.nombre_comercial_intermediario,
                            razonSocial: oportunidad.razon_social_intermediario,
                        },
                        modificadoPor: oportunidad.modificado_por,
                        nombre: oportunidad.nombre_oportunidad,
                        origen: oportunidad.descripcion_origen_oportunidad,
                        otro: {
                            id: oportunidad.id_otro,
                            nombreComercial: oportunidad.nombre_comercial_otro,
                            razonSocial: oportunidad.razon_social_otro,
                        },
                        pasoSiguiente: oportunidad.paso_siguiente,
                        porcentage: oportunidad.probabilidad_venta,
                        razonPerdida: oportunidad.descripcion_razon_perdida,
                        ubicacion: oportunidad.ubicacion,
                        responsable: [responsable]
                    };
                    auxOportunidades.push(aux);
                } else {
                    // si llega un id repetido quiere decir que es que tiene mas de 1 responsable
                    // Se agrega ese responsable al arreglo de responsables de la oportunidad anterior
                    auxOportunidades[index - 1].responsable.push(responsable);
                }

            });
            res.send(auxOportunidades);
        }
    });
});

app.get('/obtener_actividades', function (req, res) {

    // funcion  que obtiene las actividades
    /*
        Recibe los parametros del usuario que inició sesion y los filtros
    */
    // Se convierten los parametros que llegan como objetos a un string de SQL
    const params = convertirParametros(req.query);

    db.query(`call obtener_actividades(${params})`, function (error, results, fields) {
        if (error) throw error;
        else {
            // Se acomodan los nombres de las variables a como ya se usan en el sistema
            let auxActividades = [];// Arreglo que contendrá todos las actividades
            let idAux = -1; // Auxiliar que indica si llega o no una actividad repetida
            results[0].forEach((actividad, index) => {

                // objeto con el responsable y sus datos
                const responsable = {
                    id: actividad.id_usuario,
                    nombre: actividad.nombre,
                }

                // Pregunta si el auxid es difernte al de la actividad que llega
                if (idAux !== actividad.id_actividad) {
                    // se cambia el valor del auxiliar
                    idAux = actividad.id_actividad;

                    const aux = {
                        id: actividad.id_actividad,
                        oportunidad: {
                            id: actividad.id_oportunidad,
                            nombre: actividad.nombre_oportunidad,
                        },
                        prioridad: actividad.descripcion_prioridad_actividad,
                        tipoGestion: actividad.descripcion_tipo_actividad,
                        fechaInicio: actividad.fecha_inicio,
                        fechaRealizacion: actividad.fecha_fin,
                        direccion: actividad.direccion,
                        ubicacion: actividad.direccion,
                        estatus: actividad.descripcion_estatus_actividad,
                        clienteProspecto: {
                            id: actividad.id_cliente,
                            nombreComercial: actividad.nombre_comercial_cliente,
                            razonSocial: actividad.razon_social_cliente,
                        },
                        contacto: {
                            apellido: actividad.apellido_contacto,
                            id: actividad.id_contacto,
                            nombre: actividad.nombre_contacto,
                        },
                        comentario: actividad.comentario,
                        recordatorio: actividad.descripcion_recordatorio,
                        asunto: actividad.asunto_actividad,
                        activo: true,
                        fechaCreacion: actividad.fecha_hora_creacion,
                        creadoPor: actividad.creado_por,
                        modificadoPor: actividad.modificado_por,
                        fechaModificacion: actividad.fecha_hora_modificacion,
                        responsable: [responsable],
                        completada: actividad.descripcion_estatus_actividad === 'Completada' ? true : false,
                    };
                    // Se agrega la actividad al arreglo de actividades
                    auxActividades.push(aux);
                } else {
                    // si llega un id repetido quiere decir que es que tiene mas de 1 responsable
                    // Se agrega ese responsable al arreglo de responsables de la actividad anterior
                    auxActividades[index - 1].responsable.push(responsable);
                }

            });
            res.send(auxActividades);
        }
    });
});


app.post('/agregar_actividad', function (req, res) {
    // funcion  que agrega una oportunidad
    /*
        Recibe todos los parametros necesarios para agregar una actividad
    */
    // Se convierten los parametros que llegan como objetos a un string de SQL
    const parameters = convertirParametros(req.query);
    db.query(`call agregar_actividad(${parameters})`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

app.post('/agregar_oportunidad', function (req, res) {
    // funcion  que agrega una oportunidad
    /*
        Recibe todos los parametros necesarios para agregar una actividad
    */
    // Se convierten los parametros que llegan como objetos a un string de SQL
    const parameters = convertirParametros(req.query);
    db.query(`call agregar_oportunidad(${parameters})`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

app.put('/completar_actividad', function (req, res) {
    // funcion  que completa una actividad
    /*
        Recibe todos los parametros necesarios para completar una actividad
    */
    // Se convierten los parametros que llegan como objetos a un string de SQL
    const parameters = convertirParametros(req.query)
    db.query(`call completar_actividad(${parameters})`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

app.put('/editar_actividad', function (req, res) {
    // funcion que edita una actividad
    /*
        Recibe todos los parametros necesarios para editar una actividad
    */
    // Se convierten los parametros que llegan como objetos a un string de SQL
    const parameters = convertirParametros(req.query);
    db.query(`call editar_actividad(${parameters})`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

app.put('/editar_oportunidad', function (req, res) {
    // funcion  que edita una oportunidad
    /*
        Recibe todos los parametros necesarios para editar una oportunidad
    */
    // Se convierten los parametros que llegan como objetos a un string de SQL
    const parameters = convertirParametros(req.query);
    db.query(`call editar_oportunidad(${parameters})`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

app.put('/cambiar_etapa_oportunidad', function (req, res) {
    // funcion  que edita una oportunidad
    /*
        Recibe todos los parametros necesarios para cambiar una etapa
    */
    // Se convierten los parametros que llegan como objetos a un string de SQL
    const parameters = convertirParametros(req.query);
    db.query(`call cambiar_etapa_oportunidad(${parameters})`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

app.put('/cambiar_solo_etapa_oportunidad', function (req, res) {
    // funcion  que edita una oportunidad
    /*
        Recibe todos los parametros necesarios para cambiar una etapa
    */
    // Se convierten los parametros que llegan como objetos a un string de SQL
    const parameters = convertirParametros(req.query);
    db.query(`call cambiar_solo_etapa_oportunidad(${parameters})`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

// Catalogos
app.get('/obtener_tipos_empresa', function (req, res) {
    // funcion que obtiene el catalogo de tipos de empresa
    /*
        No recibe parametros
    */
    db.query(`call obtener_tipos_empresa`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

app.get('/obtener_giros_cliente', function (req, res) {
    // funcion que obtiene el catalogo de giros de clientes
    /*
        No recibe parametros
    */
    db.query(`call obtener_giros_cliente`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

app.get('/obtener_calificaciones_cliente', function (req, res) {
    // funcion que obtiene el catalogo de calificaciones de clientes
    /*
        No recibe parametros
    */
    db.query(`call obtener_calificaciones_cliente`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

app.get('/obtener_prioridades_actividad', function (req, res) {
    // funcion que obtiene el catalogo de prioridades de actividad
    /*
        No recibe parametros
    */
    db.query(`call obtener_prioridades_actividad`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

app.get('/obtener_estatus_actividad', function (req, res) {
    // funcion que obtiene el catalogo de estatus de actividad
    /*
        No recibe parametros
    */
    db.query(`call obtener_estatus_actividad`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

app.get('/obtener_tipos_actividad', function (req, res) {
    // funcion que obtiene el catalogo de tipos de actividad
    /*
        No recibe parametros
    */
    db.query(`call obtener_tipos_actividad`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

app.get('/obtener_etapas_oportunidad', function (req, res) {
    // funcion que obtiene el catalogo de etapas de oportunidad
    /*
        No recibe parametros
    */
    db.query(`call obtener_etapas_oportunidad`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

app.get('/obtener_origenes_oportunidad', function (req, res) {
    // funcion que obtiene el catalogo de origenes de oportunidad
    /*
        No recibe parametros
    */
    db.query(`call obtener_origenes_oportunidad`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

app.get('/obtener_divisas', function (req, res) {
    // funcion que obtiene el catalogo de divisas
    /*
        No recibe parametros
    */
    db.query(`call obtener_divisas`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

app.get('/obtener_calificaciones_oportunidad', function (req, res) {
    // funcion que obtiene el catalogo de calificaciones de oportunidad
    /*
        No recibe parametros
    */
    db.query(`call obtener_calificaciones_oportunidad`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});

app.get('/obtener_razones_perdida', function (req, res) {
    // funcion que obtiene el catalogo de razones de perdida
    /*
        No recibe parametros
    */
    db.query(`call obtener_razones_perdida`, function (error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});
// END CATALOGOS

// METODOS

const convertirParametros = (query) => {
    // funcion que recibe un objeto y lo convierte en los parametros de SQL
    return Object.keys(query).map(key => query[key] != '' ? `'${query[key]}'` : 'null').join(',')
}

app.listen(3000, function () {
    console.log('listening on port 3000')
})