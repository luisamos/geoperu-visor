
const OPTIONS_TUTORIAL = {
    " nextButton ": { className: " myNext ", texto: " NEXT " },
    " skipButton ": { className: " mySkip ", texto: " SKIP " },
}

const STEPS_TUTORIAL_1 = [
    {
        'next .filter__ubigeo ': `<img style="margin: 0px 0px 0px -50px !important;" src="./images/tutorial/step_1.png"><span style="position: absolute; margin: 6px 0px 0px 2px; font-size: 30px; font-weight: 600">&nbsp;Buscador geográfico</span><br />
                            Inicia en Geo Perú realizando una búsqueda a nivel <br />
                            departamental, provincial o distrital a nivel nacional.
                            <br />&nbsp;`
    },
    {
        'next .menu__container': `<img style="margin: 0px 0px 0px -50px !important;" src="./images/tutorial/step_2.png"><span style="position: absolute; margin: 6px 0px 0px 2px; font-size: 30px; font-weight: 600">&nbsp;Panel de capas</span><br />
                            Activa <b>capas geográficas</b> <img src="./images/tutorial/layers.png"> de entre más de 300 disponibles y <br />
                            conoce su significado con la herramienta <b>Leyenda</b> <img src="./images/tutorial/legend.png">. Agiliza tu <br />
                            navegación con las herramientas de <b>mapa completo</b> <img src="./images/tutorial/home.png">, <br />
                            <b>Acercar</b> <img src="./images/tutorial/zoom_in.png"> o 
                            <b>Alejar</b> <img src="./images/tutorial/zoom_out.png"> el mapa y <b>Desactivar capas.</b> <img src="./images/tutorial/refresh.png">
                            <br />&nbsp;<br />&nbsp;`
    }
    ,
    {
        'next #map ': `<img style="margin: 0px 0px 0px -50px !important;" src="./images/tutorial/step_3.png"><span style="position: absolute; margin: 6px 0px 0px 2px; font-size: 30px; font-weight: 600">&nbsp;Mapa interactivo</span><br />
                            Observa en el mapa nacional los cambios <br />
                            visuales de las capas geográficas activadas. A<br />
                            medida que se activen más en el menú, se <br />
                            podrán ver más colores y/o indicadores.<br />
                            <br />&nbsp;
                            <img alt="Mapa del Perú" src="./images/tutorial/mapa_step.png" style="width: 500px; margin-left: 200px" >`,
        'shape': 'circle',
        'radius': 10

    }
    ,
    {
        'next .menu__options': `<img style="margin: 0px 0px 0px -50px !important;" src="./images/tutorial/step_4.png"><span style="position: absolute; margin: 6px 0px 0px 2px; font-size: 30px; font-weight: 600">&nbsp;Panel de herramientas</span><br />
                            Conoce nuestros <b>reportes digitales</b> <img src="./images/tutorial/reports.png"> (se activan al buscar un departamento, provincia o<br />
                            distrito). Cambia el mapa de fondo con <b>mapas base</b> <img src="./images/tutorial/maps.png">. Activa archivos WMS online o<br />
                            sube tus archivos geográficos con <b>Cargar</b> <img src="./images/tutorial/upload.png">. Crea tus polígonos en el mapa con <b> Dibujar y<br /> 
                            medir </b> <img src="./images/tutorial/draw.png">. Descarga los datos de un grupo de capas disponibles con <b> Descargar datos</b> <img src="./images/tutorial/download.png">.<br />
                            <b> Imprimir </b> <img src="./images/tutorial/print.png"> te permite llevar tus mapas en físico, y a las redes sociales con <b>Compartir</b> <img src="./images/tutorial/share.png">.
                            <br />&nbsp;<br />&nbsp;`
    }
    ,
    {
        'next #map ': `<img style="margin: 0px 0px 0px -50px !important;" src="./images/tutorial/step_5.png"><span style="position: absolute; margin: 6px 0px 0px 2px; font-size: 30px; font-weight: 600">&nbsp;Accede a metadata</span><br />
                            Luego de editar tus capas con las herramientas, haz  <br />
                            clic en los indicadores visuales o colores del mapa e<br />
                            ingresa a la metadata que estos contienen. <br />
                            <br />&nbsp;
                            <img alt="Mapa metadata" src="./images/tutorial/metadata_step.png" style="width: 500px; margin-left: 200px" >`,
        'shape': 'circle',
        'radius': 10

    }
];

const STEPS_TUTORIAL_2 = [
    {
        'next .control__scale ': `<img style="margin: 0px 0px 0px -50px !important;" src="../images/tutorial/step_1.png"><span style="position: absolute; margin: 6px 0px 0px 2px; font-size: 30px; font-weight: 600">&nbsp;Escala personalizada</span><br />
                            Permite introducir una escala personalizada en este  recuadro <br />
                            para ajustar a qué nivel de acercamiento vemos nuestro mapa.
                            <br />&nbsp;`
    }
    ,
    {
        'next footer ': `<img style="margin: 0px 0px 0px -50px !important;" src="../images/tutorial/step_2.png"><span style="position: absolute; margin: 6px 0px 0px 2px; font-size: 30px; font-weight: 600">&nbsp;Sistemas de proyección de información geográfica</span><br />
                            Datum WGS84 es el sistema de referencia terrestre que permite localizar cualquier punto sobre la<br />
                            Tierra, además de ser el usado oficialmente en el Perú. Los sistemas. <b>GCS y UTM</b> permiten entender la  <br />
                            ubicación de estos puntos, en el primer caso expresándose en las magnitudes de Latitud y Longitud, <br />
                            mientras que en el segundo en la distribución de zonas meridionales y expresado metros. 
                            <br />&nbsp;`
    }
    ,
    {
        'next .brujula__norte': `<img style="margin: 0px 0px 0px -50px !important;" src="../images/tutorial/step_3.png"><span style="position: absolute; margin: 6px 0px 0px 2px; font-size: 30px; font-weight: 600">&nbsp;Brújula al Norte</span><br />
                            Nos brinda el marco referencial de dónde se ubica este punto cardinal.
                            <br /><br /><br /><br />&nbsp;`
    }
    ,
    {
        'next .leaflet-control-minimap ': `<img style="margin: 0px 0px 0px -50px !important;" src="../images/tutorial/step_4.png"><span style="position: absolute; margin: 6px 0px 0px 2px; font-size: 30px; font-weight: 600">&nbsp;Minimapa</span><br />
                            Permite conocer la ubicación referencial a nivel nacional<br /> 
                            del lugar sobre el que estamos verificando información.
                            <br />&nbsp;`
    }
    ,
    // {
    //     'next header ': `<img style="margin: 0px 0px 0px -50px !important;" src="../images/tutorial/step_5.png"><span style="position: absolute; margin: 6px 0px 0px 2px; font-size: 30px; font-weight: 600">&nbsp;Web Geo Perú</span><br />
    //                         Conozca más información del proyecto haciendo <br />
    //                         clic en el logo Geo Perú y visitando la página web.
    //                         <br />&nbsp;`
    // }
];

//Función para ejecutar el tutorial 1
function tutorial1() {
    $modalHelp.classList.remove('displayBlock');
    if (window.matchMedia('(max-width: 767px)').matches) return;
    let enjoyhint_instance_1 = new EnjoyHint({});

    enjoyhint_instance_1.set(STEPS_TUTORIAL_1, OPTIONS_TUTORIAL);
    enjoyhint_instance_1.run();
}

//Función para ejecutar el tutorial 2
function tutorial2(){
    $modalHelp.classList.remove('displayBlock');
    if (window.matchMedia('(max-width: 767px)').matches) return;
    let enjoyhint_instance_2 = new EnjoyHint({});

    enjoyhint_instance_2.set(STEPS_TUTORIAL_2, OPTIONS_TUTORIAL);
    enjoyhint_instance_2.run();
}
