// ================================== CONSTANTES ==========================================
const URL_SERVICE_GEOSERVER = `${DOMINIO_ESPACIAL_SSL}/geoserver/`
const URL_LENGEND_TYPE = `/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=`
const URL_LEGEND_PROP = `&scale=1000&LEGEND_OPTIONS=forceLabels:on`;

// ===================================       INICIO     ====================================
// ===================================   HEADER COUNTER ====================================

// const $counter = document.querySelector('#header__counter')
// var stop = false;
// var totalSeconds = 0;
// setInterval(setTime, 1);
// function setTime() {
//     if (baseLoaded && categoryLoaded && layerLoaded && defaultLoaded)
//         return;
//     ++totalSeconds;
//     $counter.innerHTML = `${(totalSeconds / 1000.000).toFixed(3)} ms`;
// }

// $counter.addEventListener('click', function () {
//     localStorage.removeItem('bases');
//     localStorage.removeItem('categories');
//     localStorage.removeItem('layers');
//     location.reload();
// })

// ===================================   HEADER COUNTER ====================================
// ===================================       FINAL     ====================================


const SW_PERU = L.latLng(-19.2074285268012, -95.80078125000001);
const NE_PERU = L.latLng(0.4394488164139768, -53.98681640625001);
const BOUNDS_PERU = L.latLng(SW_PERU, NE_PERU);
const FACTOR_ZOOM = 0.10;
var MIN_ZOOM;
const MAX_ZOOM = 23.4;
const MAX_ZOOM_0401 = 23.4;

if (window.matchMedia('(max-width: 480px)').matches) {
    MIN_ZOOM = 4.25;
} else {
    MIN_ZOOM = 5.5;
}

const LAYERS_BBOX = [
    {
        name: 'peru_mr_andes_',
        ne_lat: -10.54576992794345,
        ne_lng: -69.0073018923459,
        sw_lat: -16.02743502240858,
        sw_lng: -81.12247985520524
    },
    // {
    //     name: 'peru_mr_andes_',
    //     ne_lat: -9.327750995915423,
    //     ne_lng: -66.446282113406,
    //     sw_lat: -17.232838478843778,
    //     sw_lng: -83.57973109904532
    // },
    {
        name: 'peru_mr_qhapaq_',
        ne_lat: -1.7035449112339942,
        ne_lng: -69.13230718875882,
        sw_lat: -9.785340908320716,
        sw_lng: -86.26575617439816
    },
    {
        name: 'peru_mr_costa_norte_',
        ne_lat: -2.1103081421237526,
        ne_lng: -63.89490625320454,
        sw_lat: -14.282493324142884,
        sw_lng: -89.86435872219887
    },
    {
        name: 'peru_mr_region_sur_',
        ne_lat: -7.499581030451128,
        ne_lng: -60.01301413934967,
        sw_lat: -19.457877630041114,
        sw_lng: -85.98246660834398
    },
    {
        name: 'peru_mr_pacifico_centro_',
        ne_lat: -6.85419462999735,
        ne_lng: -65.83054879048458,
        sw_lat: -14.831595533884846,
        sw_lng: -82.9639977761239
    },
    {
        name: 'peru_mr_huancavelica_ica_',
        ne_lat: -10.917746736013,
        ne_lng: -68.77383231701994,
        sw_lat: -16.499917046083688,
        sw_lng: -80.8890102798793
    },
    {
        name: 'peru_mr_macro_region_nororiente_',
        ne_lat: 0.6484550421540495,
        ne_lng: -63.908432009698814,
        sw_lat: -11.593561575406158,
        sw_lng: -89.87788447869313
    },
    {
        name: 'peru_mr_chavin_',
        ne_lat: 0.18859282465339686,
        ne_lng: -63.81375171423893,
        sw_lat: -12.043687069524369,
        sw_lng: -89.78320418323327
    },
    {
        name: 'peru_mr_amazonica_',
        ne_lat: 0.05030112312012799,
        ne_lng: -59.8988799630173,
        sw_lat: -13.96360227970891,
        sw_lng: -89.72994729432476
    },
    {
        name: 'peru_vraem_',
        ne_lat: -10.714415746054746,
        ne_lng: -71.0229799256838,
        sw_lat: -13.724735265975037,
        sw_lng: -77.51534304293237
    },
    {
        name: 'peru_corredor_minero_',
        ne_lat: -13.41261028918773,
        ne_lng: -67.68292409478036,
        sw_lat: -17.758943424408734,
        sw_lng: -77.62661320521617
    },
    {
        name: 'binacional_pe_sudamerica_mascara_',
        ne_lat: -3.3934925310215767,
        ne_lng: -79.99417503255744,
        sw_lat: -3.569255624298458,
        sw_lng: -80.3727743438968
    },
    {
        name: 'peru_distritos_frontera_',
        ne_lat: 0.4394488164139768,
        ne_lng: -53.98681640625001,
        sw_lat: -19.2074285268012,
        sw_lng: -95.80078125000001
    },
    {
        name: 'peru_departamento_distinct_fronterizo_',
        ne_lat: -0.19207725028678643,
        ne_lng: -69.84074032511113,
        sw_lat: -6.649806324927034,
        sw_lng: -83.34427373571238
    },
    {
        name: 'peru_pnfa',
        ne_lat: 0.04087574016199074,
        ne_lng: -57.024106096491614,
        sw_lat: -16.04262016009701,
        sw_lng: -92.83229918832048
    }
]

const optionsMaps = {
    zoomControl: false,
    doubleClickZoom: false,
    maxZoom: codUbigeoFiltro === '0401' ? MAX_ZOOM_0401 : MAX_ZOOM,
    minZoom: MIN_ZOOM,
    zoomDelta: FACTOR_ZOOM,
    zoomSnap: FACTOR_ZOOM,
    zoom: ZOOM_DEFAULT,
}

var map = L.map('map', optionsMaps).setView([LATITUD_DEFAULT, LONGITUD_DEFAULT], 6);

//Añadimos métodos al evento cuando finaliza de hacer zoom el mapa.
map.addEventListener('zoomend', function () {
    zoomToScale();
    controlMaxMinScale();
});

map.on('zoomend', function (e) {
    if (resetActivate) {
        resetActivate = false;
        setZoomMapa();
    }
    getAllPropertiesMap();
});

//Variable que controla el dibujo sobre el lienzo
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var cancelMetadata = false;
map.addEventListener(L.Draw.Event.CREATED, function (evt) {
    var setToolTip = true;
    if (evt.layerType === 'marker') {
        evt.layer.options.icon.options.iconUrl = '../../../images/options/markers/m_' + optionColorDraw + '.png';
        setToolTip = false;
    }
    var valor = '';
    evt.layer.options.color = optionColorSelected;
    evt.layer.options.weight = optionWeightSelected;
    var layer = evt.layer;
    var unitMetric = 'km²';
    if (evt.layerType === 'polyline') {
        if (line != undefined) {
            unitMetric = 'm';
            var valor = (line._getMeasurementString().replace('ft', '').replace(' ', '') * PIE_TO_METER);
            if (Math.trunc(valor / UN_MIL) > 0) {
                valor = valor / UN_MIL;
                unitMetric = 'km';
            }
        }
    }
    if (evt.layerType === 'rectangle' || evt.layerType === 'polygon') {
        var valor = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]) / UN_MILLON;
        if (Math.trunc(valor) === 0)
            valor = valor * UN_MILLON;
    }
    if (evt.layerType === 'circle') {
        var valor = (Math.PI * (evt.layer.getRadius() ^ 2)) / UN_MILLON;
        if (Math.trunc(valor) === 0)
            valor = valor * UN_MILLON;
    }

    if (setToolTip)
        layer.bindTooltip(valor.toFixed(2).toString() + unitMetric, { 'permanent': true, 'interactive': true });
    drawnItems.addLayer(layer);

    //Reseteamos todo.
    pointFlag = false, lineFlag = false, polilineFlag = false, rectangleFlag = false, circleFlag = false, eraserFlag = false;

    cancelMetadata = false;
    //Flag para bloquear metadata
    if (evt.layerType == 'rectangle' || evt.layerType == 'circle')
        cancelMetadata = true;

    //Habilitamos el evento click del WMS
    // $.each(layerGroup._layers, function (index, value) {
    //     map.on('click', this.getFeatureInfo, this);
    // });
});
map.addEventListener(L.Draw.Event.DRAWSTOP, function (evt) {
    //Habilitamos el evento click del WMS
    // $.each(layerGroup._layers, function (index, value) {
    //     map.on('click', this.getFeatureInfo, this);
    // });
});

//Función para detectar el pulsado de tecla
document.onkeydown = function (evt) {
    evt = evt || window.event;
    if (evt.key === 'Escape') {
        disabledDraw();
    }
};

//Función que se ejecuta cuando se termina de mover el mapa
map.addEventListener('moveend', function () {
    if (map.getCenter().lat.toFixed(4) != LATITUD_DEFAULT || map.getCenter().lng.toFixed(4) != LONGITUD_DEFAULT) {
        if (isResetHome) {
            map.zoomIn();
            map.zoomOut();
            isResetHome = false;
        }
    }
    else {
        if (isResetHome) isResetHome = false;
    }
    getAllPropertiesMap();
});

//Añadimos el evento del cursor para saber las coordenadas.
map.addEventListener('mousemove', onMouseMove);

//Control para la superposición de las capas (Z-Index)
map.createPane('defaultPane');
map.createPane('ubigeoPane');
map.createPane('geojsonPane');
map.getPane('defaultPane').style.zIndex = 400;
map.getPane('ubigeoPane').style.zIndex = 400;
map.getPane('geojsonPane').style.zindex = 800;

//Variable para obtener por defecto algunas capas (Si son varias capas separarlas por comas)
const LAYERS_DEFAULT = 'peru_departamento_|peru_proyectos_viru_distritos_|peru_departamento_pip_';

//LayerGroup para añadir o quitar las capas.
var layerGroup = new L.layerGroup().addTo(map);
//LayerGroup para añadir o quitar las capas.
var layerGroupUbigeo = new L.layerGroup().addTo(map);
// LayerGroup para añadir o quitar los dibujos
var drawnItems = new L.FeatureGroup().addTo(map);
// map.addLayer(drawnItems);

//Variables para verificar el estado de carga de la página.
var baseLoaded = false;
var categoryLoaded = false;
var layerLoaded = false;
var defaultLoaded = false;

//Función que obtiene la posición en el mapa
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alertCustom("Su navegador no soporta esta opción.");
    }
}

//Función que dibuja el icono sobre el mapa
var iconGPS = L.icon({
    iconUrl: '../images/general/me.png',
    iconSize: [36, 51],
});
function showPosition(position) {
    markerGPS = L.marker([position.coords.latitude,
    position.coords.longitude],
        { icon: iconGPS }
    ).addTo(layerGroup);
    markerGPS._icon.classList.add('selectedMarker');
}

//Función que remueve la ubicación sobre el mapa
function removeLocation() {
    layerGroup.removeLayer(markerGPS)
}

//Carga de mapa base
var mMapaBase = [];
async function loadBase() {

    let response = await fetch(URL_MAPA_BASE);
    let responseJson = await response.json();
    mMapaBase = responseJson;
    addNodeBase();
}

const $bodyBase = document.querySelector('#bodyBase');
//Función que agrega nodos de mapas base
function addNodeBase() {
    let tileTemporal = '';
    mMapaBase.forEach(base => {
        let subdominioTemporal = base.subdominio.split(';');
        if (BASE_DEFAULT !== -1) base.esdefault = (BASE_DEFAULT === base.idmapabase) ? true : false;
        if (base.esdefault) {
            tileTemporal = base.tilelayer;
            L.tileLayer('' + base.tilelayer + '', {
                attribution: '',
                minZoom: MIN_ZOOM,
                maxZoom: MAX_ZOOM,
                subdomains: subdominioTemporal,
                maxBounds: BOUNDS_PERU,
                setMaxBounds: BOUNDS_PERU,
                maxBoundsViscosity: 1.0,
            }).addTo(map);

            // map.setMaxBounds(map.getBounds()); //Quitamos el método porque no deja ubicar localidades de los extremos

            var tileMinimap = new L.TileLayer(tileTemporal, { minZoom: 3, maxZoom: 3, attribution: '', subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], });
            miniMap = new L.Control.MiniMap(tileMinimap, { toggleDisplay: true, position: 'topright' }).addTo(map);
        }

        let baseCurrentHTML = `<div class="option__base" onclick="toggleMapaBase(${base.idmapabase})";>
        <img alt="Mapa Base: ${base.imagen}" src="${base.imagen}">
        <span id="${base.idmapabase}" name="mapasBase" data-tag="${base.idmapabase}">${base.nombre}</span>
    </div>
`
        $bodyBase.insertAdjacentHTML('beforeend', baseCurrentHTML);
    });
    baseLoaded = true;

}

var currentMapaBase = 2; //ID del mapabase por default
var layersPreload = '';

var optionsBase = { layers: 'base_elevaciones', format: 'image/png8', maxZoom: MAX_ZOOM, transparent: true, /*crs: L.CRS.EPSG4326, */pane: 'defaultPane', opacity: 1.0, zIndex: 1, tiled: true }
var oBaseElevaciones = L.tileLayer.betterWms(URL_MAPSERVER_BASE, optionsBase);
async function toggleMapaBase(_baseId) {

    if (_baseId === null) return;
    if (_baseId == 0) return;
    let baseElevaciones = false;

    layersPreload = await SaveLayersSelected();

    map.eachLayer(function (currentLayer) {
        map.removeLayer(currentLayer);
    });
    var oMapaBaseTemporal = mMapaBase.find(i => i.idmapabase === _baseId);

    //Cuando seleccionamos el mapa de elevaciones, activamos el mapa base de Google Terreno con la capa de elevaciones.
    if (oMapaBaseTemporal.tilelayer === 'base_elevaciones') {
        baseElevaciones = true;
        oMapaBaseTemporal = mMapaBase.find(i => i.idmapabase === 3);
    }
    // oMapaBaseTemporal = mMapaBase.find(i => i.idmapabase === _baseId);
    let layerToLoad = '';

    L.tileLayer('' + oMapaBaseTemporal.tilelayer + '', {
        attribution: '',
        maxZoom: MAX_ZOOM,
        minZoom: MIN_ZOOM,
        subdomains: oMapaBaseTemporal.subdominio.split(';'),
        maxBoundsViscosity: 1.0,
    }).addTo(map);

    layerGroup = new L.layerGroup();
    layerGroup.addTo(map);

    var tempMinimap = new L.TileLayer(oMapaBaseTemporal.tilelayer, { minZoom: 3, maxZoom: 3, attribution: '', subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], });
    miniMap.changeLayer(tempMinimap);

    if (baseElevaciones)
        if (!layerGroup.hasLayer(oBaseElevaciones))
            layerGroup.addLayer(oBaseElevaciones);

    if (layerToLoad.length > 0) {
        var miCapa = allCapas[layerToLoad];
        if (!layerGroup.hasLayer(miCapa))
            layerGroup.addLayer(miCapa);
    }

    await loadLayerDefaultAsync();
    await loadLayerDefaultAsync(layersPreload);

    if (ubigeoFiltro.length > 0) {
        let localidadCurrent = ($filtroUbigeo.value === undefined) ? '' : $filtroUbigeo.value.substr(0, $filtroUbigeo.value.indexOf('(') - 1);
        setLimitLocalidad(ubigeoFiltro, localidadCurrent);
    }

    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    //Si no existe filtro de ubigeo, entonces 
    // enviamos un reset para que se centre el mapa nuevamente
    if (ubigeoFiltro.length === 0) {
        setTimeout(() => { resetHome(); }, 500);
    }

    if (codUbigeoFiltro === 'A00019') LYR_LOAD = 'binacional_pe_sudamerica_mascara_';
    else if (codUbigeoFiltro === 'A00023') LYR_LOAD = 'peru_departamento_distinct_fronterizo_';

    setTimeout(async () => {
        if (LYR_LOAD !== null) await loadLayerDefaultAsync(LYR_LOAD.replace('mancomunidad-', ''), true);
    }, 1000);

    if (onGPS) getLocation();

}

function SaveLayersSelected() {
    var layers = '';
    let $navContent = document.querySelector('.nav__content');
    let $checkboxesCurrent = $navContent.querySelectorAll('input[type=checkbox]:checked');

    $checkboxesCurrent.forEach(function (el, it) { if (el.name === 'checkbox') layers += el.dataset.xml + ','; });
    if (layers.length > 0) layers = layers.substring(0, layers.length - 1);

    return layers;
}

//Carga de categorías
const $categoryContent = document.querySelector('#category_content');
const $categoryContentMobile = document.querySelector('#category_content--mobile');
var mTematica = [];
var mCategory = [];
async function loadTematica(_idSubsistema = 0) {

    switchLoader(true);
    var formdata = new FormData();
    formdata.append("idsubs", _idSubsistema);

    var requestOptions = { method: 'POST', body: formdata, redirect: 'follow' };
    let respuesta = await fetch(URL_CATEGORIA_SUBSISTEMA, requestOptions);
    let respuestajson = await respuesta.json();

    if (tipoSubsistema !== 2) {
        let dataCategoryNacional = await fetch(URL_CATEGORIA_GENERAL);
        let dataCategoryNacionalJSON = await dataCategoryNacional.json();
        mTematica = respuestajson.concat(dataCategoryNacionalJSON);
    }
    else {
        mTematica = respuestajson;
    }
    addNodesCategories(_idSubsistema);
}

//Función que agrega nodos de las categorías
function addNodesCategories(_idSubsistema) {

    mTematica.forEach(categoria => {
        if (document.querySelector(`#div_category_${categoria.idtematico}`) === null) {
            let $controlContent;
            if (window.matchMedia('(max-width: 767px)').matches) $controlContent = $categoryContentMobile;
            else $controlContent = $categoryContent;

            $controlContent.insertAdjacentHTML('beforeend',
                `<div id="div_category_${categoria.idtematico}" class="category">
                    <img class="category__image" id="imageCategory_${categoria.idtematico}" alt="Ícono de ${categoria.tematico_descripcion}" src="${categoria.icono}">
                    <input class="category__checkbox" type="checkbox" id="category_${categoria.idtematico}">
                    <label class="category__label" for="category_${categoria.idtematico}" 
                        onmouseover="addHoverToElement('imageCategory_${categoria.idtematico}')" onmouseout="removeHoverToElement('imageCategory_${categoria.idtematico}')">
                        ${categoria.tematico_descripcion}
                    </label>
                    <ul class="category__list" id="category_list_${categoria.idtematico}">
                    </ul>
                </div>`);

            if (!mCategory.includes(categoria))
                mCategory.push(categoria);
        }
    });
    loadLayer(_idSubsistema);
    categoryLoaded = true;
}

//Carga de capas o layers
var mLayer = [];
var mGroup = [];
var allCapas = {};
async function loadLayer(_idSubsistema = 0) {

    var formdata = new FormData();
    formdata.append("idlayer", 0);
    formdata.append("idtematica", 0);
    formdata.append("idsubtematica", 0);
    formdata.append("idsubs", _idSubsistema);

    var requestOptions = { method: 'POST', body: formdata, redirect: 'follow' };
    let layerSubsistema = await fetch(URL_LAYER_SUBSISTEMA, requestOptions);
    let layerSubsistemaJSON = await layerSubsistema.json();

    if (tipoSubsistema !== 2) {
        let layerNacional = await fetch(URL_LAYER_GENERAL);
        let layerNacionalJSON = await layerNacional.json();
        mLayer = layerSubsistemaJSON.concat(layerNacionalJSON);
    }
    else {
        mLayer = layerSubsistemaJSON;
    }
    await addNodesLayers();

    if (LYR_LOAD !== null) await loadLayerDefaultAsync(LYR_LOAD.replace('mancomunidad-', ''), true);
    // if(codSubsistemaCurrent === 'A00018') {
    //     let $ctrlTemp = document.getElementById('chkLayer_23745');
    //     $ctrlTemp.checked = true;
    //     toggleStateCheckLayer($ctrlTemp);
    // }
}

//Función uqe carga los grupos de capas
function loadGroup(_idSubsistema = 0) {
    let formDataGroup = new FormData();
    formDataGroup.append('idgroup', 0);
    fetch(URL_GET_GROUPS, { method: 'POST', body: formDataGroup })
        .then(responseGroup => responseGroup.json())
        .then(responseGroupJSON => {
            mGroup = responseGroupJSON;
        })
}

function compareBySTOrder(a, b) {
    return a.orden_auxiliar1 - b.orden_auxiliar1;
}

//Función que agrega nodos de los layers 
async function addNodesLayers() {

    // let mLayerOrder = mLayer.sort(compareBySTOrder);
    mLayer.forEach(layer => {

        let $uParent;
        if (layer.idestado !== 1) return;

        if (layer.idsubtematica === 0) {
            $uParent = document.querySelector(`#category_list_${layer.idtematica}`);
        }
        else {
            if (document.querySelector(`#div_subcategory_${layer.idsubtematica}`) === null) {
                let $uList = document.querySelector(`#category_list_${layer.idtematica}`);
                if ($uList === null) return;
                if ($uList !== undefined) {

                    $uList.insertAdjacentHTML('beforeend',
                        `<div class="subcategory" id="div_subcategory_${layer.idsubtematica}" data-subsistema="${layer.idsubsistema}">
                            <input type="checkbox" id="subcategory_${layer.idsubtematica}">
                            <label title="${layer.tooltip_subtematica}" for="subcategory_${layer.idsubtematica}">${layer.subtematico_descripcion}</label>
                            <ul id="subcategory_list_${layer.idsubtematica}">
                            </ul>
                        </div>`
                    );
                }
            }
            $uParent = document.querySelector(`#subcategory_list_${layer.idsubtematica}`);
        }
        if ($uParent === null)
            return;

        //Completamos el objeto allCapas es el objeto donde manejaremos todas las capas.
        if (allCapas[layer.capaxml] === undefined) {

            let isExternalFile = false;
            if ((layer.idfuente === 2 || layer.idfuente === 9) && layer.alias.trim().length === 0)
                return;
            let urlEspacial = '';

            switch (layer.idfuente) {
                case 1: urlEspacial = URL_SERVICE_GEOSERVER + 'geoperu/wms?service=WMS&';
                    break;
                case 2:
                case 9:
                    if (layer.url_fuente.indexOf('?') > 0) urlEspacial = layer.url_fuente.substr(0, layer.url_fuente.indexOf('?') + 1);
                    else urlEspacial = layer.url_fuente;
                    break;
                case 3:
                case 4: urlEspacial = URL_SERVICE_GEOSERVER + 'subsistemas/wms?service=WMS&';
                    break;
                case 5:
                    if (layer.url_fuente.indexOf('?') > 0) urlEspacial = layer.url_fuente.substr(0, layer.url_fuente.indexOf('?') + 1);
                    else urlEspacial = layer.url_fuente;
                    break;
                case 6:
                    urlEspacial = layer.url_fuente.replace('.zip', '');
                    isExternalFile = true;
                    break;
            }

            addLayerToObjectMap(layer, urlEspacial, isExternalFile);
        }

        let hashcodeTmp = layer.hashcode === undefined ? layer.capaxml : (layer.hashcode.length > 0 ? layer.hashcode : layer.capaxml);

        let iconInfo = (layer.idfuente === 2 || layer.idfuente === 5 || layer.idfuente === 9) ? './images/nav/nav-accordion/info-wms.png' : './images/nav/nav-accordion/info.png';
        if (layer.idtematica === 56) iconInfo = './images/nav/nav-accordion/info.png';
        $uParent.insertAdjacentHTML('beforeend',
            `<li>
                <section data-code="${(layer.idfuente === 2 || layer.idfuente === 5 || layer.idfuente === 9) ? layer.alias : layer.capaxml}" data-subsistema="${layer.idsubsistema}">
                    <img src="${iconInfo}" alt="Ícono de información" onclick="showInformacionIdLayer('${layer.id}');">
                    <input class="checkbox__class" type="checkbox" name="checkbox" id="chkLayer_${layer.id}" data-source="${layer.idfuente}" data-xml="${layer.capaxml}" data-name="${layer.capa}" data-hash="${hashcodeTmp}">
                    <label for="chkLayer_${layer.id}" id="label_${layer.id}" title="${layer.tooltip_layer}">${layer.capa}</label>
                    <input id="rngLayer_${layer.id}" name="range" type="range" min="0" max="10" value="10" disabled  />
                </section>
            </li>`);
    });

    layerLoaded = true;

    //Loop que agrega un listener a los checkbox de los layers
    const $checkboxes = document.querySelectorAll('input[name=checkbox]');

    $checkboxes.forEach(function ($checkbox) {
        $checkbox.addEventListener('change', function () {
            toggleStateCheckLayer($checkbox)
        });
    });

    setTimeout(() => {
        $loader.classList.remove('displayBlock');
        controlMaxMinScale();
    }, 500);

    addLayerDefault();


    //Método que buscará todos los controles con nombre Range par asignarle el evento Change
    const $ranges = document.querySelectorAll('input[name=range]')
    $ranges.forEach(function ($range) {
        $range.addEventListener('input', function () {
            if (this.parentElement.dataset.code === undefined)
                return;
            setOpacity(this.parentElement.dataset.code, this.value)
        });
    });

    if (LAT_DEFAULT !== null && LNG_DEFAULT !== null && ZOOM_DEFAULT_ !== null) {
        if (LAT_DEFAULT !== 0 && LNG_DEFAULT !== 0 && ZOOM_DEFAULT_ !== 0) {
            setTimeout(() => {
                map.setView([LAT_DEFAULT, LNG_DEFAULT], ZOOM_DEFAULT_);
                addLayersURL();
            }, 1500);
        }
    }
}

//Función para agregar los layer de la URL
function addLayersURL() {

    let mLayers = LAYERS_DEFAULT_.split(',');
    mLayers.forEach(function (el) {
        if (el.trim().length === 0) return;
        let oLayerCurrent = mLayer.find(i => i.id === parseInt(el));
        if (oLayerCurrent === undefined) return;

        let chkLayerStr = '#chkLayer_' + oLayerCurrent.id.toString();
        let $chkLayerStr = document.querySelector(chkLayerStr);
        $chkLayerStr.checked = true;
        toggleStateCheckLayer($chkLayerStr);

        let oLayerToMap = allCapas[oLayerCurrent.capaxml];
        if (oLayerToMap === undefined) return;
        if (!layerGroup.hasLayer(oLayerToMap))
            layerGroup.addLayer(oLayerToMap)
    });
}

//Función que asigna el modal para ver la metadata de geojson
function popup(feature, layer) {

    if (feature.properties) {
        layer.bindPopup(Object.keys(feature.properties).map(function (k) {
            return "<b>" + k + ":</b> " + ((feature.properties[k] == '') ? '' : feature.properties[k]);
        }).join("<br />"), {
            maxHeight: 200
        });
    }
}

const geoJSONStyle = { opacity: 1, pane: 'geojsonPane' };
// Función para agregar layers al objeto allCapas que manejará sobre el mapa
async function addLayerToObjectMap(_layer, _urlService, _externalFile = false) {
    if (!_externalFile) {
        if (_layer.tilerequired) {
            Object.defineProperty(allCapas, _layer.capaxml, {
                value: L.tileLayer.betterWms(_urlService, {
                    pane: 'defaultPane',
                    opacity: 1.0,
                    format: 'image/png',
                    layers: _layer.capaxml,
                    maxZoom: MAX_ZOOM,
                    transparent: true,
                    zIndex: _layer.zindex,
                    idfuente: _layer.idfuente,
                    orden: _layer.ordercurrent,
                    alias: _layer.alias,
                    title: _layer.capa
                })
            });
        }
        else {
            if (_layer.idfuente === 2) {
                //Cuando es WMS, enviamos el ALIAS como nombre del objeto

                //let urlCurrentWMS = _urlService.indexOf('https') >= 0 ? _urlService : `${URL_PROXY}${_urlService.replace('http://', '').replace('https://', '')}`
                Object.defineProperty(allCapas, _layer.alias, {
                    value: L.nonTiledLayer.wms(_urlService, {
                        opacity: 1.0, format: 'image/png', maxZoom: MAX_ZOOM, transparent: true, pane: 'defaultPane', zIndex: _layer.zindex,
                        layers: _layer.capaxml, idfuente: _layer.idfuente, nombre: _layer.capa,
                        //orden: _layer.ordercurrent, alias: _layer.alias, url_fuente: _urlService.indexOf('https') >= 0 ? _urlService : `${URL_PROXY}${_urlService.replace('http://', '').replace('https://', '')}`,
                        orden: _layer.ordercurrent, alias: _layer.alias, url_fuente:_urlService,
                        title: _layer.capa
                    })
                });
            }
            else if (_layer.idfuente === 5) {
                Object.defineProperty(allCapas, _layer.alias, {
                    value: new L.WFS({
                        //url: `${URL_PROXY}${_urlService}`,
                        url: _urlService,
                        typeNS: _layer.capaxml.split('__')[0],
                        typeName: _layer.capaxml.split('__')[1],
                        // crs: L.CRS.EPSG4326,
                        geometryField: 'Shape',
                        pane: 'defaultPane',
                        nombre: _layer.capa,
                        idfuente: _layer.idfuente,
                        url_fuente: _urlService,
                        alias: _layer.alias,
                        title: _layer.capa
                    })
                });
            }
            else if (_layer.idfuente === 7 || _layer.idfuente === 8) {
                //let urlCurrentWMS = _urlService.indexOf('https') >= 0 ? _urlService : `${URL_PROXY}${_urlService.replace('http://', '').replace('https://', '')}`
                Object.defineProperty(allCapas, _layer.alias, {
                    value: L.nonTiledLayer.wms(_urlService, {
                        opacity: 1.0,
                        format: 'image/png',
                        maxZoom: MAX_ZOOM,
                        transparent: true,
                        pane: 'defaultPane',
                        zIndex: _layer.zindex,
                        layers: _layer.capaxml,
                        idfuente: _layer.idfuente,
                        nombre: _layer.capa,
                        orden: _layer.ordercurrent,
                        alias: _layer.alias,
                        url_fuente: `${_layer.idfuente === 7 ? `${URL_REPO_CDN}visor/modulos/geojson-icons/${_layer.hashcode}/${_layer.url_fuente}` : _layer.url_fuente}`,
                        url_icon: _layer.defaulticon,
                        title: _layer.capa
                    })
                });
            }
            else if (_layer.idfuente === 9) {
                Object.defineProperty(allCapas, _layer.alias, {

                    value: L.tileLayer.wmts(_layer.url_fuente, {
                        layer: _layer.capaxml.slice(0, _layer.capaxml.indexOf('___')),
                        tileMatrixSet: _layer.capaxml.slice(_layer.capaxml.indexOf('___') + 3),
                        idfuente: _layer.idfuente,
                    })
                });
            }
            else {
                Object.defineProperty(allCapas, _layer.capaxml, {
                    // value: L.nonTiledLayer.wms(`${URL_PROXY}${_urlService.replace('https://', '')}`, {
                    value: L.nonTiledLayer.wms(`${_urlService}`, {
                        pane: 'defaultPane',
                        opacity: 1.0,
                        format: 'image/png8',
                        layers: _layer.idfuente == 1 || _layer.idfuente == 2 ? _layer.capaxml : ((_layer.hashcode && _layer.hashcode.length > 0)) ? _layer.hashcode : _layer.url_fuente.replace('.zip', ''),
                        maxZoom: MAX_ZOOM,
                        transparent: true,
                        zIndex: _layer.zindex,
                        idfuente: _layer.idfuente,
                        orden: _layer.ordercurrent,
                        alias: _layer.alias,
                        title: _layer.capa
                    })
                });
            }
        }
    }
    else {
        let bodyGeoJSON = new FormData();
        bodyGeoJSON.append('ubigeo', (tipoSubsistema === 2) ? codSubsistemaCurrent : codUbigeoFiltro);
        bodyGeoJSON.append('layer', _urlService);
        fetch(URL_GET_GEOJSON, { method: 'POST', body: bodyGeoJSON })
            .then(geoJsonResponse => { return geoJsonResponse.json(); })
            .then(geoJsonResponse => {
                if (geoJsonResponse.response_status === 1) {
                    Object.defineProperty(allCapas, _layer.alias, {
                        value: L.geoJson(geoJsonResponse.response_message, {
                            pane: 'geojsonPane',
                            onEachFeature: popup,
                            style: geoJSONStyle,
                        })
                    })
                }
            })
            .catch(err => {
                console.log(`Error al crear la capa GeoJSON: ${_layer} || ${err}`);
                return;
            })
    }
}

//Función que agrega los layer por defecto
function addLayerDefault(_layersDefault = LAYERS_DEFAULT) {

    let mDefault = _layersDefault.replace(',', '|').split('|');

    mDefault.forEach(function (layerDefault) {
        if (layerDefault.length === 0) return;
        let oLayerDefault = mLayer.find(i => i.capaxml === layerDefault);
        if (oLayerDefault === undefined) oLayerDefault = mLayer.find(i => i.alias === layerDefault);
        if (oLayerDefault === undefined) return;

        let chkLayerStr = '#chkLayer_' + oLayerDefault.id.toString();
        let $chkLayerStr = document.querySelector(chkLayerStr);
        if ($chkLayerStr === null) return;
        // $chkLayerStr.click();
        $chkLayerStr.checked = true;
        toggleStateCheckLayer($chkLayerStr);

        let oLayerToMap = allCapas[layerDefault];
        if (oLayerToMap === undefined) return;
        if (!layerGroup.hasLayer(oLayerToMap))
            layerGroup.addLayer(oLayerToMap)
    });

    defaultLoaded = true;
    getAllPropertiesMap();
}

//Función que carga los layers por defecto, hace un request al servidor
async function loadLayerDefaultAsync(_layersLoad, _setBBox = false) {
    if ((codSubsistemaCurrent === 'M1' && _layersLoad === 'peru_mr_andes_') || (codSubsistemaCurrent === 'A09022') || (codSubsistemaCurrent === 'A00023') || _layersLoad === 'peru_vraem_') {
        console.info('No agregamos capas por defecto.');
    }
    else {
        _layersLoad = (_layersLoad === null || _layersLoad === undefined || _layersLoad === '') ? LAYERS_DEFAULT : _layersLoad;
        _layersLoad = _layersLoad.replace('|', ',');
        var defaultFormData = new FormData();
        defaultFormData.append("layers", _layersLoad);

        var requestOptions = { method: 'POST', body: defaultFormData, redirect: 'follow' };
        let respLoadLayers = await fetch(URL_CAPA_DEFAULT, requestOptions);
        let respLoadLayersJSON = await respLoadLayers.json();

        respLoadLayersJSON.forEach(function (el) {
            if (allCapas[el.nombre_capa] == undefined) {

                Object.defineProperty(allCapas, el.nombre_capa, {
                    value: (L.nonTiledLayer.wms(`${DOMINIO_ESPACIAL}/geoserver/geoperu/wms?service=WMS&`, {
                        opacity: 1.0,
                        layers: el.nombre_capa,
                        format: 'image/png',
                        transparent: true,
                        pane: 'defaultPane',
                        zIndex: el.zindex,
                        useCanvas: false
                    }))
                });
            }
            layerGroup.addLayer(allCapas[el.nombre_capa]);
        });

        addLayerDefault(_layersLoad);
        checkStatusCategories();
    }

    if (_setBBox) {
        const itemBBox = LAYERS_BBOX.filter(item => item.name === _layersLoad)

        if (itemBBox.length > 0) {
            oBBox = itemBBox[0];
            const SW_TEMP = L.latLng(oBBox.sw_lat, oBBox.sw_lng);
            const NE_TEMP = L.latLng(oBBox.ne_lat, oBBox.ne_lng);
            const BOUNDS_TEMP = L.latLngBounds(SW_TEMP, NE_TEMP);
            map.flyToBounds(BOUNDS_TEMP)

            //El método funciona pero no en su totalidad, cuando se fuerza a salir de los límites máximos, se desborda el mapa
            // setTimeout(() => {
            //     map.setMaxBounds(BOUNDS_TEMP);
            // }, 5000);
            if (itemBBox[0].name === 'peru_vraem_' || itemBBox[0].name === 'peru_corredor_minero_' ||
                itemBBox[0].name === 'peru_mr_andes_' || itemBBox[0].name === 'peru_mr_qhapaq_' ||
                itemBBox[0].name === 'peru_mr_costa_norte_' || itemBBox[0].name === 'peru_mr_region_sur_' ||
                itemBBox[0].name === 'peru_mr_pacifico_centro_' || itemBBox[0].name === 'peru_mr_huancavelica_ica_' ||
                itemBBox[0].name === 'peru_mr_macro_region_nororiente_' || itemBBox[0].name === 'peru_mr_chavin_' ||
                itemBBox[0].name === 'peru_mr_amazonica_' || itemBBox[0].name === 'binacional_pe_sudamerica_mascara_' ||
                itemBBox[0].name === 'peru_distritos_frontera_' || itemBBox[0].name === 'peru_departamento_distinct_fronterizo_' ||
                itemBBox[0].name === 'peru_pnfa') setOpacityDistinctAmbito(itemBBox[0].name);
        }
    }
}


loadBase();             //Para cargar los mapas base
// loadTematica();         //Para cargar las temáticas (Dentro de éste método se envía al de cargar capas)
setZoomMapa();          //Para setear el zoom del mapa de acuerdo a la resolución
zoomToScale();          //Para convertir el zoom a escala
loadServicioExterno();  //Para cargar los servicios WMS
getCapaDescarga();      //Para obtener las capas que se pueden descargar

//Función que cambia el estado del check del layer
async function toggleStateCheckLayer(_element) {
    toggleControlLayers(_element.id, _element.checked);
    let layerToLoad = document.getElementById(_element.id).parentElement.dataset.code;
    if (layerToLoad === undefined) return;
    let layerCurrent = allCapas[layerToLoad];
    if (layerCurrent === undefined) return;

    if (layerCurrent.options.idfuente !== undefined) {
        if (_element.dataset.source === '7' || _element.dataset.source === '8') {

            if (_element.checked) {

                const urlFile = `${layerCurrent.options.url_fuente}`
                iconCustonGJ = (layerCurrent.options.url_icon.length > 0) ? layerCurrent.options.url_icon : './css/leaflet/images/marker-icon.png';

                addLegend(_element, '25px', iconCustonGJ);
                let blobJson = await fetch(urlFile).then(r => r.blob());
                var reader = new FileReader();
                let controlIdTemporal = `${layerCurrent.options.alias}`;
                reader.onload = async function () {
                    let geojsonText = reader.result;
                    let oGeoJSON = JSON.parse(geojsonText);

                    let layerCurrentJSON = allCapas[`${controlIdTemporal}_${_element.dataset.source}`];
                    if (layerCurrentJSON === undefined)
                        Object.defineProperty(allCapas, `${controlIdTemporal}_${_element.dataset.source}`, {
                            value:
                                L.geoJson(oGeoJSON,
                                    {
                                        onEachFeature: async function (feature, layer) {
                                            if (feature.properties) {
                                                let htmlGJ = Object.keys(feature.properties).map(function (k) {
                                                    return "<b>" + k + "</b>: " + feature.properties[k];
                                                }).join("<br />")
                                                let titleGJ = `<h2>${layerCurrent.options.capa === undefined ?
                                                    layerCurrent.options.title : layerCurrent.options.capa}</h2>`;
                                                let htmlTitle = titleGJ + htmlGJ;

                                                layer.bindPopup(htmlTitle);
                                            }
                                        },
                                        pointToLayer: createCustomIcon
                                    }
                                )

                        });
                    layerCurrentJSON = allCapas[`${controlIdTemporal}_${_element.dataset.source}`];
                    layerGroup.addLayer(layerCurrentJSON);
                }
                reader.readAsText(blobJson);
            }
            else {
                let controlIdTemporal = `${layerCurrent.options.alias}_${_element.dataset.source}`;
                let layerCurrentJSON = allCapas[controlIdTemporal];
                layerGroup.removeLayer(layerCurrentJSON);
                removeLegend(_element);
            }
        }
        else {
            if (_element.checked) {
                layerGroup.addLayer(layerCurrent);
                if (layerCurrent.options.idfuente !== 5)
                    addLegend(_element);
            }
            else {
                layerGroup.removeLayer(layerCurrent);
                removeLegend(_element);
            }

            checkStatusCategories();
            getAllPropertiesMap();
        }
    }
}

//Función que cambia el estado del control de la capa (Range)
function toggleControlLayers(_controlCheck, _enable) {
    let controlRangeId = _controlCheck.replace('chkLayer', 'rngLayer');
    let $rangeCurrent = document.getElementById(controlRangeId);

    if (_enable) {
        $rangeCurrent.removeAttribute('disabled');
    }
    else {
        $rangeCurrent.setAttribute('disabled', !_enable);
    }
}

//Función que controla la opacidad de los layers
function setOpacity(_layer, _opacity) {
    let layerChangeOpacity = allCapas[_layer];
    if (layerGroup.hasLayer(layerChangeOpacity)) {

        //Si existe en el grupo de Layer, cambiamos la opacidad.
        Object.keys(layerGroup._layers).forEach(key => {
            let currentLayer = layerGroup._layers[key];
            if (currentLayer === undefined) return;
            if (currentLayer === layerChangeOpacity)
                layerGroup._layers[key].setOpacity(_opacity / 10);
        });
    }
}

//Función para cambiar el ícono de las categorías si es que existe nodo seleccionado
function checkStatusCategories() {
    let mCategoryToChange = [];
    Object.keys(layerGroup._layers).forEach(key => {
        let currentLayer = layerGroup._layers[key].options.layers;
        if (currentLayer === undefined) return;

        let oTemporal = mLayer.filter(i => i.capaxml === currentLayer)[0];
        //Buscamos por hashcode
        if (oTemporal === undefined) oTemporal = mLayer.filter(i => i.hashcode === currentLayer)[0];
        if (oTemporal === undefined) return;

        if (mCategoryToChange.indexOf(oTemporal.idtematica) === -1)
            mCategoryToChange.push(oTemporal.idtematica);
    });


    for (var i = 0; i < mCategory.length; i++) {
        let elementId = 'imageCategory_' + mCategory[i].idtematico.toString();
        let elementToChange = document.getElementById(elementId);
        let sourceImage = mCategory[i].icono;
        if (mCategoryToChange.includes(mCategory[i].idtematico))
            sourceImage = mCategory[i].icono_focus;

        elementToChange.src = sourceImage;
    }
}

//Función para agregar la leyenda de las capas
function addLegend(layerToAdd, _width = '', _src = './css/leaflet/images/marker-icon.png') {
    let sourceLayer = layerToAdd.dataset['source'];
    let urlLegendLayer = '';
    let workspaceLayer = (sourceLayer === '1') ? 'geoperu' : 'subsistemas';
    // workspaceLayer = (layerToAdd.parentElement.dataset.subsistema === '75') ? 'geoperu_pya' : workspaceLayer;
    let nameLayer = '';

    if (sourceLayer === '4')
        return;

    let oCapaCurrent = mLayer.find(item => item.id === parseInt(layerToAdd.id.replace('chkLayer_', '')));

    if (oCapaCurrent === undefined)
        return;

    nameLayer = (sourceLayer === '1' || sourceLayer === '2') ? oCapaCurrent.capaxml : (layerToAdd.dataset['hash'].length > 0 ? layerToAdd.dataset['hash'] : oCapaCurrent.url_fuente.replace('.zip', ''));

    if (sourceLayer === '2' || sourceLayer === '5')
    {
        let urlleyenda= oCapaCurrent.url_fuente;
        urlleyenda = urlleyenda.includes('?') ? urlleyenda : urlleyenda + '?';        
        urlLegendLayer = `${urlleyenda.substr(0, urlleyenda.indexOf('?') + 1)}${URL_LENGEND_TYPE.replace('/wms?', '&')}${nameLayer}`;       
    }
    else if (sourceLayer === '7' || sourceLayer === '8')
    {
        urlLegendLayer = _src;
    }
    else
        urlLegendLayer = URL_SERVICE_GEOSERVER + workspaceLayer + URL_LENGEND_TYPE + nameLayer + URL_LEGEND_PROP

    let htmlLegend = `<div id="legend_${oCapaCurrent.id}" class="section__legend"><label>${oCapaCurrent.capa}</label><br /><img class="legend__image ${sourceLayer === '9' ? 'displayNone' : ''}" ${(_width.length > 0 ? `style="width: ${_width}"` : '')} src="${urlLegendLayer}" alt="${oCapaCurrent.tematico_descripcion}: ${oCapaCurrent.capa}" ></img></div>`
    //Debemos buscar la categoría y subcateogría para añadir la leyenda.
    insertLegendHTML(htmlLegend, oCapaCurrent);
}

//Función que inserta el HTML de la Categoría, Subcategoría y Capas
function insertLegendHTML(_legend, _oCapaCurrent) {

    const $navLegend = document.querySelector('.nav__legend');
    const $navLegendMobile = document.querySelector('.mobile__legend');

    let $controlLegendCurrent;
    if (window.matchMedia('(max-width: 767px)').matches) $controlLegendCurrent = $navLegendMobile;
    else $controlLegendCurrent = $navLegend;

    let categoryId = `#legend_category_${_oCapaCurrent.idtematica}`;
    let subcategoryId = `#legend_subcategory_${_oCapaCurrent.idsubtematica}`;
    let $categoryLegendFound = $controlLegendCurrent.querySelector(categoryId);
    let $subcategoryLegendFound = $controlLegendCurrent.querySelector(subcategoryId);
    let $legendParentDiv = null;

    //Agregamos la Categoría
    if ($categoryLegendFound === null) {

        $controlLegendCurrent.insertAdjacentHTML('beforeend',
            `<div id="legend_category_${_oCapaCurrent.idtematica}" class="legend__categories">
                <span>${_oCapaCurrent.tematico_descripcion}</span>
                <div id="legend_category_${_oCapaCurrent.idtematica}_childrens" class="category__childrens">
                </div>
            </div>`
        );
    }
    $legendParentDiv = document.querySelector(`#legend_category_${_oCapaCurrent.idtematica}_childrens`);

    //Agregamos la Subcategoría
    if (_oCapaCurrent.idsubtematica !== 0) {
        if ($subcategoryLegendFound === null) {
            $legendParentDiv.insertAdjacentHTML('beforeend',
                `<div id="legend_subcategory_${_oCapaCurrent.idsubtematica}" class="legend__subcategories">
            <span>${_oCapaCurrent.subtematico_descripcion}</span>
            <div id="legend_subcategory_${_oCapaCurrent.idsubtematica}_childrens" class="subcategory__childrens">
            </div>
        </div>`
            );
        }
        $legendParentDiv = document.querySelector(`#legend_subcategory_${_oCapaCurrent.idsubtematica}_childrens`);
    }

    //Agregamos la leyenda
    $legendParentDiv.insertAdjacentHTML('beforeend', _legend);
}

//Función para remover la leyenda de las capas
function removeLegend(layerToAdd) {
    let oCapaCurrent = mLayer.find(item => item.id === parseInt(layerToAdd.id.replace('chkLayer_', '')));

    // Eliminamos la leyenda
    let $legendElement = document.querySelector(`#legend_${oCapaCurrent.id}`);
    if ($legendElement !== null)
        $legendElement.remove();

    //Verificamos la Subcategoría
    if (oCapaCurrent.idsubtematica !== 0) {
        let $elementSubcategoryChildrens = document.querySelector(`#legend_subcategory_${oCapaCurrent.idsubtematica}_childrens`);
        let countLegends = $elementSubcategoryChildrens.querySelectorAll('.section__legend');

        //Removemos el div de SubCategoría
        if (countLegends.length === 0) {
            let $elementSubcategory = document.querySelector(`#legend_subcategory_${oCapaCurrent.idsubtematica}`);
            if ($elementSubcategory !== null)
                $elementSubcategory.remove();
        }
    }

    //Verificamos la Categoría
    if (oCapaCurrent.idtematica !== 0) {
        let $elementCategoryChildrens = document.querySelector(`#legend_category_${oCapaCurrent.idtematica}_childrens`)
        let countLegends = 0;
        countLegends = $elementCategoryChildrens.querySelectorAll('.section__legend');

        //Removemos el div de Categoría
        if (countLegends.length === 0) {
            let $elementCategory = document.querySelector(`#legend_category_${oCapaCurrent.idtematica}`);
            if ($elementCategory !== null)
                $elementCategory.remove();
        }
    }
}

function getExternalLegend(_oCapa, _layer) {

    // let urlExternalLegend = '';
    let urlBaseExternal = _oCapa.url_fuente;

    // //Agregamos el tipo de petición si es que no tuviese
    // if (urlBaseExternal.indexOf('request=GetCapabilities&service=WMS') <= 0) urlBaseExternal += 'request=GetCapabilities&service=WMS'
    // urlBaseExternal = 'http://idesep.senamhi.gob.pe:80/geoserver/g_08_04/wms?'
    let urlParse = `https://geocors.herokuapp.com/${urlBaseExternal}`;
    fetch(urlParse, { method: 'GET', })
        .then(resp => resp.text())
        .then(respToXML => {
            return (new window.DOMParser()).parseFromString(respToXML, 'text/xml')
        })
        .then(externalDataXML => {
            console.log(externalDataXML)
        })
}

//Función para convertir un String en formato Capitalize
function stringCapitalize(_string) {
    return _string.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

//Si el código del ubigeo viene con información, debemos georreferenciar
if (codUbigeoFiltro.length > 0) {
    setLimitLocalidad(codUbigeoFiltro, nomUbigeoFiltro);
}

//Función que nos indicará si tenemos control de dibujo activo
function verificarControlDraw() {
    if (pointFlag || lineFlag || polilineFlag || rectangleFlag || circleFlag || eraserFlag)
        return true;
    return false;
}


// INIT METADATA

map.addEventListener('click', onClickMap);
const $modalMetadata = document.querySelector('#modalMetadata');
const $contentData = document.querySelector('#contentData');

function limpiarColumnas(tabla)
{
    //console.log(tabla);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = tabla;

    const filas = tempDiv.querySelectorAll("table tbody tr");

    const columnasAEliminar = ["objectid", "objectid1", "objectid12", "objectid_1",
        "shape", "st_areashape", "st_lengthshape", "shape.starea", "shape.stlength", 
        "fid", "area_ha", "shape.area", "shape.len",
        "shape.starea()", "shape.stlength()", "shape_leng",
        "perimetro", "datos_fundamentales.dbo.rio_area.area",
        "long", "lat", "x", "y", "datos_fundamentales.dbo.lago_y_laguna.area",
        "rgb.rojo", "rgb.verde", "rgb.azul",        
    ];

    const headers = filas[0].querySelectorAll("th");
    const indicesAEliminar = [];

    headers.forEach((header, index) => {
        header.textContent = header.textContent.toUpperCase().replace(/_/, " ");
        
        if (columnasAEliminar.includes(header.textContent.trim().toLowerCase().replace(/ /g, "_"))) {
            indicesAEliminar.push(index);
        }
    });

    indicesAEliminar.sort((a, b) => b - a);

    filas.forEach((fila) => {
    indicesAEliminar.forEach((index) => {
        fila.children[index].remove();
    });
    });

    tabla = tempDiv.innerHTML;
    return tabla;
}

// Función para traer la metadata al hacer click sobre el mapa
async function onClickMap(evt) {

    if (verificarControlDraw()) return;

    let layersGetInfo = [];     //Almacenaremos los layers que deben traer metadata
    let allMetadata = '';       //Para almacenar todo el HTML de la metadata
    $contentData.innerHTML = '';

    map.eachLayer(function (lyr) {
        if (lyr.options.layers === undefined) return;
        if (lyr.options.layers === null) return;
        if (lyr.options.layers === 'peru_sudamerica_mascara_') return;
        if (lyr.options.layers === 'peru_departamentos_distinct_') return;
        if (lyr.options.layers === 'peru_provincias_distinct_') return;
        if (lyr.options.layers === 'peru_distritos_distinct_') return;

        let oLayerInfo = { layer: lyr.options.layers, idfuente: lyr.options.idfuente, url: lyr.options.url_fuente, orden: lyr.options.orden, alias: lyr.options.alias, nombre: lyr.options.nombre, title: lyr.options.title };

        layersGetInfo.push(oLayerInfo);
    });

    if (layersGetInfo.length === 0) return;
    switchLoader(true);

    //Ordenamos el arreglo por el atributo 'orden'
    layersGetInfo = layersGetInfo.sort((a, b) => b.orden - a.orden);

    let cantRequest = 0;
    layersGetInfo.forEach(async function (item) {

        let urlTemporal = await getFeatureInfoUrlStr(evt, item.layer, item.url, item.alias);
        // console.log(`URL MD: ${urlTemporal}`)

        let headers = {}
        // let urlCurrentMD = urlTemporal.indexOf('https') >= 0 ? urlTemporal : `${URL_PROXY}${urlTemporal}`
        //let urlCurrentMD = urlTemporal.indexOf('espacialg.geoperu.gob.pe') >= 0 || urlTemporal.indexOf('sigdrif.minjus.gob.pe') >= 0 ? urlTemporal : `${URL_PROXY}${urlTemporal}`;       
        let urlCurrentMD = urlTemporal;// urlTemporal.indexOf('espacialg.geoperu.gob.pe') >= 0 || urlTemporal.indexOf('sigdrif.minjus.gob.pe') >= 0 ? urlTemporal : `${urlTemporal}`;

        let dataResponseText = await $.ajax({
            type: "get",
            url: urlCurrentMD,            
        });
        
        cantRequest += 1;
        //Extraemos sólo la tabla
        let metadataTableIni = -1;
        let metadataTableEnd = -1;
        let currentTable = '';

        if (dataResponseText.documentElement) {        
            console.log("Respuesta XML:", dataResponseText);
        } else if (typeof dataResponseText === "string" && dataResponseText.includes("<html")) {
            metadataTableIni = dataResponseText.indexOf('<table>');
            if (metadataTableIni === -1) metadataTableIni = dataResponseText.indexOf('<table');
            metadataTableEnd = dataResponseText.indexOf('</table>');
        }       

        //Si no se encuentra índices de tabla, se pasa al siguiente.
        if (metadataTableIni === -1 || metadataTableEnd === -1) {
            if (cantRequest === layersGetInfo.length) switchLoader(false);
            return;
        }
        let captionCurrent = '';
        let nuevaTabla= '';
        if (item.idfuente === 2 || item.idfuente === 5) {
            captionCurrent = `</br><span class="metadata__title">${item.title}</span>`;
            nuevaTabla = limpiarColumnas(dataResponseText.substr(metadataTableIni, dataResponseText.toString().length - metadataTableIni))
            currentTable = captionCurrent + nuevaTabla;
        }

        if (item.idfuente !== 2 && item.idfuente !== 5) {
            currentTable = captionCurrent + dataResponseText.substr(metadataTableIni, dataResponseText.toString().length - metadataTableIni)
            .replace('</body>', '')
            .replace('</html>', '');

            //Buscamos reemplazar el caption
            let iniCaption = currentTable.indexOf('<caption>'), endCaption = currentTable.indexOf('</caption>') + 10;
            if (iniCaption > 0 && endCaption > 0)
                currentTable = currentTable.substring(0, iniCaption) + `</br><caption>${item.title}</caption>` + currentTable.substring(endCaption);
        }

        allMetadata = currentTable + allMetadata;
        
        // if (cantRequest === layersGetInfo.length) {
        $contentData.innerHTML = '';
        $contentData.insertAdjacentHTML('beforeend', allMetadata);
        $modalMetadata.classList.add('displayBlock');
        $buttonsMetadata = $contentData.querySelectorAll('button:not([data-type="custom"])');
        $buttonsMetadata.forEach(function ($el) {
            $el.innerHTML = 'Ver reporte';
        })
        
        //Verificamos las columnas que requieren redondeo
        let columnsRoundedRequired = document.querySelectorAll('.column__rounded');
        columnsRoundedRequired.forEach(function (itemCurrent) {
            itemCurrent.innerHTML = parseFloat(itemCurrent.innerHTML).toFixed(itemCurrent.dataset.decimal === undefined ? 2 : itemCurrent.dataset.decimal);
        })

        let columnsThousandRequired = document.querySelectorAll('.column__thousand');
        columnsThousandRequired.forEach(function (itemCurrent) {
            itemCurrent.innerHTML = addCommas(parseFloat(itemCurrent.innerHTML).toFixed(0));
        });

        let columnsMixedRequired = document.querySelectorAll('.column__mixed');
        columnsMixedRequired.forEach(function (itemCurrent) {
            itemCurrent.innerHTML = addCommas(parseFloat(itemCurrent.innerHTML).toFixed(itemCurrent.dataset.decimal === undefined ? 2 : itemCurrent.dataset.decimal));
        });

        var captionsTable = document.querySelectorAll('.modal__body table caption');
        // captionsTable.forEach(it => { it.style.display = 'none'; })
        switchLoader(false);
    });
}

// Función para obtener la URL de la metadata
async function getFeatureInfoUrlStr(_evt, _lyr, _url, _alias) {

    let oLayerFeatureInfo = mLayer.find(i => i.capaxml == _lyr);
    if (oLayerFeatureInfo === undefined) oLayerFeatureInfo = mLayer.find(i => i.capaxml == _alias);
    if (oLayerFeatureInfo === undefined) oLayerFeatureInfo = mLayer.find(i => i.alias == _alias);

    if (oLayerFeatureInfo === undefined) return;
    if (oLayerFeatureInfo === null) return;

    let currentWorkspace = '';
    let currentAlias = oLayerFeatureInfo.hashcode !== undefined && oLayerFeatureInfo.hashcode.length > 0 ? oLayerFeatureInfo.hashcode.replace('.zip', '') : oLayerFeatureInfo.url_fuente.replace('.zip', '');
    let urlGetInfo = '';

    if (oLayerFeatureInfo.idfuente === 1) currentWorkspace = 'geoperu';
    if (oLayerFeatureInfo.idfuente === 3) currentWorkspace = 'subsistemas';
    // if (oLayerFeatureInfo.idsubsistema === 75) currentWorkspace = 'geoperu_pya';

    let currentBounds = map.getBounds();
    if (oLayerFeatureInfo.idfuente === 2 || oLayerFeatureInfo.idfuente === 5)
    {
        _url = _url.indexOf('?') === -1 ? _url + '?' : _url;
        urlGetInfo = `${_url}SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&BBOX=SUR_LAT,SUR_LNG,NOR_LAT,NOR_LNG&CRS=EPSG%3A4326&WIDTH=MAP_ANCHO&HEIGHT=MAP_ALTO&LAYERS=NOMB_CAPA&STYLES=&FORMAT=image/jpeg&QUERY_LAYERS=NOMB_CAPA&INFO_FORMAT=text/html&I=CORD_EQUIS&J=CORD_YE&FEATURE_COUNT=50`
    }
    else
        urlGetInfo = `${DOMINIO_ESPACIAL}/geoserver/${currentWorkspace}/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=NOMB_CAPA&LAYERS=NOMB_CAPA&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=text%2Fhtml&FEATURE_COUNT=50&X=CORD_EQUIS&Y=CORD_YE&SRS=EPSG%3A4326&STYLES=&WIDTH=MAP_ANCHO&HEIGHT=MAP_ALTO&BBOX=SUR_LNG%2CSUR_LAT%2CNOR_LNG%2CNOR_LAT`
    
    return urlGetInfo
        .replace('SUR_LNG', currentBounds._southWest.lng)
        .replace('SUR_LAT', currentBounds._southWest.lat)
        .replace('NOR_LNG', currentBounds._northEast.lng)
        .replace('NOR_LAT', currentBounds._northEast.lat)
        .replace('MAP_ALTO', map._size.y)
        .replace('MAP_ANCHO', map._size.x)
        .replace(/NOMB_CAPA/g, (oLayerFeatureInfo.idfuente === 1 || oLayerFeatureInfo.idfuente === 2 || oLayerFeatureInfo.idfuente === 5) ? _lyr : currentAlias)
        .replace('CORD_EQUIS', _evt.containerPoint.x.toFixed(0))
        .replace('CORD_YE', _evt.containerPoint.y.toFixed(0))
}

// END METADATA

