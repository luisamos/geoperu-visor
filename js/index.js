var IdSubsistemaVisor = 0;
var BASE_DEFAULT = -1;
var LAT_DEFAULT = 0;
var LNG_DEFAULT = 0;
var ZOOM_DEFAULT_ = 0;
var LAYERS_DEFAULT_ = 0;
var LYR_LOAD = '';
var LYR_PRELOAD = '';

$body = document.querySelector('body');
$map = document.querySelector('#map');
$loader = document.querySelector('.loader');
$loaderPrint = document.querySelector('.loader__print');
$menuContainer = document.querySelector('.menu__container');
$itemNav = document.querySelector('.nav__menu');
$navContent = document.querySelector('.nav__content');
$navMobileLayer = document.querySelector('.mobile__layer');
$navMobileLegend = document.querySelector('.mobile__legend');
$navLegend = document.querySelector('.nav__legend');
$itemNavLayer = document.querySelector('#btnLayer');
$itemNavLegend = document.querySelector('#btnLegend');
$itemNavRefresh = document.querySelector('#btnRefresh');
$btnRefreshMobile = document.querySelector('#btnRefreshMobile');
$mobileTitle = document.querySelector('#mobile__title');
$itemNav.addEventListener('click', toggleMenu);
$itemNavLayer.addEventListener('click', toggleMenu);
$itemNavLegend.addEventListener('click', toggleMenu);
$itemNavRefresh.addEventListener('click', resetLayers);
$btnRefreshMobile.addEventListener('click', resetLayers);
var menuSideCurrent = '';

//Añadimos el display para el loader
// $loader.classList.add('displayBlock');


//Función para habilitar/deshabilitar el loader (logo de carga)
function switchLoader(_sw) {
    if (_sw) {
        $loader.classList.add('displayBlock');
        // $map.classList.add('cursor--hide');
    } else {
        $loader.classList.remove('displayBlock');
        // $map.classList.remove('cursor--hide');
    }
}

switchLoader(true);

function swithcLoaderPrint(_sw) {
    if (_sw) $loaderPrint.classList.add('displayBlock');
    else $loaderPrint.classList.remove('displayBlock');
}

const mAmbitoPB = ['0102', '0104', '0608', '0609', '2001', '2401', '2002', '2003', '1607', '1603', '1601', '20', '24', '04', '16']
function evalLogoPB(_ubigeo) {
    if (window.matchMedia('(max-width: 480px)').matches) {
        let $header = document.querySelector('header');
        if (mAmbitoPB.indexOf(_ubigeo) >= 0)
            $header.classList.add('header__pb');
        else $header.classList.remove('header__pb');
    }
}

//Función anónima donde evaluamos los parámetros de la URL
//Usaremos la variable tipoSubsistema para [1] Nacional || [2] Localidades || [3] Clones
var codUbigeoFiltro = '', nomUbigeoFiltro = '', tipoSubsistema = 0, idSubsistemaURL = 0;
var ubigeoFiltro = '';
var codSubsistemaCurrent = '';
(async function () {
    await init();
    setTimeout(() => {
        loadTematica(idSubsistemaURL);
    }, 1000);
})();

async function init() {

    const queryString = new URL(window.location.href);
    BASE_DEFAULT = (queryString.searchParams.get('base') !== null) ? parseInt(queryString.searchParams.get('base')) : -1;
    LAT_DEFAULT = queryString.searchParams.get('lat');
    LNG_DEFAULT = queryString.searchParams.get('lng');
    ZOOM_DEFAULT_ = queryString.searchParams.get('zoom');
    LAYERS_DEFAULT_ = queryString.searchParams.get('layers');
    LYR_LOAD = queryString.searchParams.get('lyr');
    let ubigeo = queryString.searchParams.get('ubicacion');
    let subsistema = queryString.searchParams.get('subsistema');

    if (subsistema === null || subsistema === undefined) {
        let ubigeoArray = [];
        if (ubigeo !== null && ubigeo !== undefined) {
            ubigeoArray = ubigeo.split('-');
            codUbigeoFiltro = ubigeoArray[ubigeoArray.length - 1];

            ubigeoArray.forEach(function (value, index) {
                nomUbigeoFiltro += (index === 0 || index === (ubigeoArray.length - 1)) ? '' : `${value} `
            });
            ubigeoFiltro = codUbigeoFiltro;
            if (codUbigeoFiltro === '0501') BASE_DEFAULT = 1;
            // if(codUbigeoFiltro == '0104') map.maxZoom
            evalLogoPB(codUbigeoFiltro);
            await getLogo(codUbigeoFiltro, true);

        }
    }
    else {
        tipoSubsistema = 2;
        subsistemaArray = subsistema.split('-');
        codSubsistemaCurrent = subsistemaArray[subsistemaArray.length - 1];

        if (codSubsistemaCurrent === 'A00002') BASE_DEFAULT = 1;
        if (codSubsistemaCurrent === 'A00018') setSpecialStyle();
        await getLogo(codSubsistemaCurrent, true);

        //Si es subsistema de Mancomunidades, debemos mandar a cargar el geojson
        if (codSubsistemaCurrent.indexOf('M') >= 0) {
            codUbigeoFiltro = codSubsistemaCurrent;
            toggleOptionReport(codSubsistemaCurrent, false);
            LYR_LOAD = 'peru_mr_andes_';
        }
        else if (codSubsistemaCurrent === 'A09022') {
            codUbigeoFiltro = codSubsistemaCurrent;
            toggleOptionReport(codSubsistemaCurrent, false);
            LYR_LOAD = 'peru_distritos_frontera_';
        }
        else if (codSubsistemaCurrent === 'A00023') {
            codUbigeoFiltro = codSubsistemaCurrent;
            toggleOptionReport(codSubsistemaCurrent, false);
            LYR_LOAD = 'peru_departamento_distinct_fronterizo_';
        }
        else if (codSubsistemaCurrent === 'A00019') {
            codUbigeoFiltro = codSubsistemaCurrent;
            LYR_LOAD = 'binacional_pe_sudamerica_mascara_';
        }
        else if (codSubsistemaCurrent === 'A00002' && $VAL === 210) {
            //Seteamos región Piura
            setLimitLocalidad('20', 'PIURA', false);
        }
        else if (codSubsistemaCurrent === 'A00027') {
            BASE_DEFAULT = 1;
            codUbigeoFiltro = codSubsistemaCurrent;
            LYR_LOAD = 'peru_vraem_';
        }
        else if (codSubsistemaCurrent === 'A00032') {
            //Ocultar botón de reporte -> encargo de JP
            document.getElementById('optionPrint').classList.add('displayNone');
            codUbigeoFiltro = codSubsistemaCurrent;
        }
        else if (codSubsistemaCurrent === 'A00033') {
            //Ocultar botón de reporte -> encargo de JP
            BASE_DEFAULT = 1;
            codUbigeoFiltro = codSubsistemaCurrent;
        }
        else if (codSubsistemaCurrent === 'A00034') {
            BASE_DEFAULT = 2;
            LYR_LOAD = 'peru_pnfa';
        }
    }
}

function setSpecialStyle() {
    BASE_DEFAULT = 1;
    // let $headerTemporal = document.querySelector('header');
    // $headerTemporal.style.backgroundColor = '#fff';
    // $headerTemporal.style.backgroundImage = "url('./images/general/logo_CEMSC.svg')";
    // $headerTemporal.style.borderBottom = '2px solid #BDBDBD';
    // $headerTemporal.style.backgroundPosition = '22px 0';


    // if (window.matchMedia('(max-width: 480px)').matches) {
    //     $headerTemporal.style.backgroundImage = "url('./images/general/logo_CEMSC-mobile.svg')";
    //     $headerTemporal.style.backgroundPosition = '8px 0px';
    // }
    // LYR_LOAD = 'capa_A00018_8';
}

// getParametersFromURL();

//Función para mostrar y ocultar el nav de layer o legend según corresponda
function navMenuToggle(buttonNav) {
    resetBackgroundImageNav();
    if (buttonNav === 'btnLayer') {
        $navContent.style.display = 'block'
        $navLegend.style.display = 'none'
        document.querySelector('.nav__title').querySelector('span').innerText = 'CAPAS';
    }
    else {
        $navContent.style.display = 'none'
        $navLegend.style.display = 'block'
        document.querySelector('.nav__title').querySelector('span').innerText = 'LEYENDAS';
    }

    $itemNav.classList.add('nav__menu--open');

    let itemNav = buttonNav.toString().toLowerCase().replace('btn', '');
    if (itemNav.length === 0) return;
    document.querySelector('#' + buttonNav).style.backgroundImage = `url('./images/nav/f_${itemNav}.svg')`;
}

//Función para controlar el estado del menú de navegación
function toggleMenu() {
    let currentMenu = (this.id === 'btnLegend') ? 'btnLegend' : 'btnLayer';
    let menuIsOpen = $menuContainer.classList.contains('menu__container--open');

    if (menuIsOpen) {
        if (menuSideCurrent === currentMenu || this.id === '') {
            menuSideCurrent = '';
            $menuContainer.classList.remove('menu__container--open');
            resetBackgroundImageNav();
        }
        else {
            menuSideCurrent = currentMenu;
            navMenuToggle(currentMenu);
        }
    }
    else {
        menuSideCurrent = currentMenu;
        $menuContainer.classList.add('menu__container--open');
        navMenuToggle(currentMenu);
    }
}

//Función que resetea las imágenes del SideBar a su estado inicial (Elimina el hover)
function resetBackgroundImageNav() {
    $itemNavLayer.removeAttribute('style');
    $itemNavLegend.removeAttribute('style');

    $itemNav.classList.remove('nav__menu--open');
}

//Función que reinicia el estado del checkbox y del range por cada capa
function resetControlsLayers() {
    let $controlContent;
    if (window.matchMedia('(max-width: 767px)').matches) $controlContent = $navMobileLayer;
    else $controlContent = $navContent;

    let checkboxListChecked = $controlContent.querySelectorAll('.checkbox__class:checked');

    checkboxListChecked.forEach((element) => {
        toggleControlLayers(element.id, false);
        document.querySelector('#' + element.id).checked = false;
    });
}

//Función que reinicia la selección de layers activas.
function resetLayers() {

    $filtroUbigeo.value = '';

    resetLegends();
    resetControlsLayers();
    layerGroup.clearLayers();
    layerGroupUbigeo.clearLayers();
    addLayerDefault();

    resetHome();
    toggleOptionReport('', true);

    if (IdSubsistemaVisor === 0)
        $logoSubsistema.classList.remove('displayBlock');

    loadLayerDefaultAsync(LYR_LOAD.replace('mancomunidad-', ''), true);
}

//Función que elimina todas las leyendas
function resetLegends() {
    $navLegend.innerHTML = '';
    $navMobileLegend.innerHTML = '';
}

//Variables para controlar la búsqueda de capas
$searchLayer = document.querySelector('#searchLayer');
$searchLayer.addEventListener('keydown', keyDownInputText, false);
$filterLayer = document.querySelector('#filterLayer');

$searchLayerMobile = document.querySelector('#searchLayerMobile');
$searchLayerMobile.addEventListener('keydown', keyDownInputText, false);
$filterLayerMobile = document.querySelector('#filterLayerMobile');

//Evento cuando se hace click sobre un item del filtro de capas
$filterLayer.addEventListener('click', function (e) {
    setLayerSelected(e);
});
//Evento del mobile cuando se hace click sobre un item del filtro de capas
$filterLayerMobile.addEventListener('click', function (e) {
    setLayerSelected(e);
});

// Función que setea la capa seleccionada y acciona todos los controles 
function setLayerSelected(e) {
    if (e.target && e.target.matches('li')) {
        let IdLayerCurrents = [];
        if (e.target.getAttribute('data-type') === 'group')
            IdLayerCurrents = e.target.getAttribute('data-layers').toString().split(',');
        else IdLayerCurrents.push(e.target.getAttribute('data-value'));

        IdLayerCurrents.forEach(function (el, item) {
            if (el.trim().length > 0) {
                let chkLayerStr = '#chkLayer_' + el;
                let $chkLayerStr = document.querySelector(chkLayerStr);
                $chkLayerStr.checked = true;
                toggleStateCheckLayer($chkLayerStr);
            }
        });
        clearCloseFilterLayer();
    }
}

//Función para cerrar y limpiar el filtro de capas.
function clearCloseFilterLayer() {
    let $controlCurrent;
    let $controlSearchCurrent;
    if (window.matchMedia('(max-width: 767px)').matches) {
        $controlSearchCurrent = $searchLayerMobile;
        $controlCurrent = $filterLayerMobile;
    }
    else {
        $controlCurrent = $filterLayer;
        $controlSearchCurrent = $searchLayer;
    }

    $controlCurrent.innerHTML = '';
    $searchLayer.value = '';
    $controlCurrent.classList.remove('displayBlock');
}

//Método que detecta cambios en el input del filtro de capas
function keyDownInputText(e) {
    if (e.keyCode !== 13) {
        let $controlCurrent;
        if (window.matchMedia('(max-width: 767px)').matches) $controlCurrent = $filterLayerMobile;
        else $controlCurrent = $filterLayer;
        $controlCurrent.innerHTML = ''
        let characterInput = String.fromCharCode(e.keyCode);
        let textToSearch = e.target.value + ((/[a-zA-Z0-9-_ ]/.test(characterInput)) ? e.key : '');

        if (e.keyCode === 8)
            textToSearch = textToSearch.substr(0, textToSearch.length - 1);

        if (textToSearch.length !== 0) {
            let containerFound = mLayer.filter(i => i.capa.toLowerCase().includes(textToSearch.toLowerCase()));
            $controlCurrent.classList.add('displayBlock');
            containerFound.forEach(element => {
                $controlCurrent.insertAdjacentHTML('beforeend',
                    `<li data-value='${element.id}' data-type='single'>${element.capa}</li>`)
            });

            //Buscamos en los grupos
            let groupFound = mGroup.filter(i => i.nombre.toLowerCase().includes(textToSearch.toLowerCase()));
            groupFound.forEach(element => {
                $controlCurrent.insertAdjacentHTML('beforeend',
                    `<li data-value='${element.id}' data-type='group' data-layers='${element.layers}'>${element.nombre}</li>`)
            });
        }
        else {
            clearCloseFilterLayer();
            resetFiltroUbigeoImage();
        }
    }
}

//Método para agregar hover a un elemento cuando no puede hacerse por css
function addHoverToElement(_element) {
    let $element = document.querySelector('#' + _element);
    $element.classList.add('hover');
}

//Método para eliminar hover a un elemento cuando no puede hacerse por css
function removeHoverToElement(_element) {
    let $element = document.querySelector('#' + _element);
    $element.classList.remove('hover');
}

//Función de control de zoom en adición
function setZoomAdd() {
    if (map.getZoom() + FACTOR_ZOOM >= map.getMaxZoom()) {
        console.info('Ya no puede acercar el mapa.')
        return;
    }
    map.zoomIn();
}

//Función de control de zoom en sustracción
function setZommMinus() {
    if (map.getZoom() - FACTOR_ZOOM <= map.getMinZoom()) {
        console.info('Ya no puede alejar el mapa.')
        return;
    }
    map.zoomOut();
}

const $btnIn = document.querySelector('#btnIn');
const $btnOut = document.querySelector('#btnOut');

$btnIn.addEventListener('click', setZoomAdd);
$btnOut.addEventListener('click', setZommMinus);
$btnIn.classList.add('displayNone');
$btnOut.classList.add('displayNone');

const $btnHome = document.querySelector('#btnHome');
const $btnHomeMobile = document.querySelector('#btnHomeMobile');
$btnHome.addEventListener('click', resetHome);
$btnHomeMobile.addEventListener('click', resetHome);
var isResetHome = false;

//Función para ir a la vista original del Visor
let resetActivate = false;
function resetHome() {

    isResetHome = true;
    //Agregamos clase de ocultar cursor para evitar que el mapa se descentre.
    $body.classList.add('cursor--hide');
    $loader.classList.add('displayBlock');

    if (IdSubsistemaVisor === 0 || codUbigeoFiltro === '') {
        resetActivate = true;
        map.setView([LATITUD_DEFAULT, LONGITUD_DEFAULT], ZOOM_DEFAULT);
        // setTimeout(() => {
        //     setZoomMapa();
        // }, 1000);
    } else {
        if (codUbigeoFiltro === 'A00019') setLimitLayer('binacional_pe_sudamerica_mascara_', '');
        else setLimitLocalidad(codUbigeoFiltro, nomUbigeoFiltro);
    }

    //Removemos clase de ocultar cursor agregada al iniciar el evento.
    setTimeout(() => {
        $loader.classList.remove('displayBlock');
        setTimeout(() => {
            $body.classList.remove('cursor--hide');
        }, 1500);
    }, 1200);
}

//Función que asigna el zoom dependiendo del alto de pantalla
function setZoomMapa() {
    let _alto = 900;
    try {
        _alto = document.querySelector('#map').offsetHeight;

        if (_alto >= 1001)
            zoomDefaultSize = 6.4;
        if (_alto >= 951 && _alto <= 1000)
            zoomDefaultSize = 6.3;
        if (_alto >= 901 && _alto <= 950)
            zoomDefaultSize = 6.2;
        if (_alto >= 865 && _alto <= 900)
            zoomDefaultSize = 6;
        if (_alto >= 821 && _alto <= 864)
            zoomDefaultSize = 5.9;
        if (_alto >= 761 && _alto <= 820)
            zoomDefaultSize = 5.8;
        if (_alto >= 711 && _alto <= 760)
            zoomDefaultSize = 5.7;
        if (_alto >= 661 && _alto <= 710)
            zoomDefaultSize = 5.6;
        if (_alto >= 601 && _alto <= 660)
            zoomDefaultSize = 5.5;
        if (_alto >= 541 && _alto <= 600)
            zoomDefaultSize = 5.3;
        if (_alto >= 481 && _alto <= 540)
            zoomDefaultSize = 5.1;
        if (_alto >= 421 && _alto <= 480)
            zoomDefaultSize = 4.8;
        if (_alto >= 361 && _alto <= 420)
            zoomDefaultSize = 4.6;
        if (_alto <= 360)
            zoomDefaultSize = 4.5;
    } catch (error) {
        console.info('No se pudo obtener los pixeles de la pantalla');
        _alto = 900;
    }

    // console.log(`Zoom display: ${zoomDefaultSize}`);
    map.setZoom(zoomDefaultSize);
}

const $menu__mobile = document.querySelector('.menu__mobile');
const $options__mobile = document.querySelector('.options__mobile');
const $listUbigeo = document.querySelector('#listUbigeo');
$menu__mobile.addEventListener('click', toggleMenuMobile);

//Función toggle (abrir y cerrar) el menú mobile
function toggleMenuMobile() {
    $options__mobile.classList.toggle('displayBlock');
}


//Función para completar el buscador de capas
const $filtroUbigeo = document.querySelector('#filtroUbigeo');
const optionsFuse = {
    shouldSort: true,
    threshold: 0.3,
    isCaseSensitive: false,
    minMatchCharLength: 2,
    findAllMatches: true,
    keys: ['i', 'nombre', 'extra']
};
const fuse = new Fuse(Ubigeo2, optionsFuse);

$filtroUbigeo.addEventListener('input', function () {

    let searchUbigeo = fuse.search($filtroUbigeo.value, { limit: 15 });
    searchUbigeo.sort((a, b) => (a.i > b.i) ? 1 : (a.i === b.i) ? 0 : -1);
    $listUbigeo.innerHTML = '';
    if ($filtroUbigeo.value.length < 1) {
        $listUbigeo.classList.remove('displayBlock');
        return;
    }

    $listUbigeo.classList.add('displayBlock');
    searchUbigeo.forEach(function (el) {
        if (el.codigo.toString() !== '00')
            $listUbigeo.insertAdjacentHTML('beforeend', `
                <div class="filtro__result" onclick="openSubsistema('${el.i}', '${el.codigo}', '${el.nombre}');">
                    <span class="nombre__localidad">${el.nombre}</span>
                    <span class="tipo__localidad">${el.tipo}</span>
                </div>
            `);
        else
            $listUbigeo.insertAdjacentHTML('beforeend', `<li class="li_lnkUbigeo">
                <span onclick="setLimitLayer('${el.cod_dist.toString()}', '${el.nom_dist}')">${el.nom_dist}</span>
            </li>`);
    });

    if (searchUbigeo.length === 0) {
        $listUbigeo.insertAdjacentHTML('beforeend', `<span> No existen coincidencias para su búsqueda</span>`);
        return;
    }
});

var oFiltroUbigeo = new Object();
const ubigeoStyle = { color: "#A71398", weight: 5, fillOpacity: .001, opacity: 1, pane: 'ubigeoPane' };
const $ubigeoImage = document.querySelector('.ubigeo__image').getElementsByTagName('img')[0];

async function openSubsistema(_i, _codigo, _nombre) {
    //console.log(parseInt(_i))
    if (parseInt(_i) === 1) {
        //Mapa nacional
        window.open(URL_VISOR, '_self');
    }
    else if (parseInt(_i) <= 5) {
        //Mapa de localidad
        let fData = new FormData();
        fData.append('ubigeo', _codigo);
        const data = await fetch(GET_SUBSISTEMA_URL, { method: 'POST', body: fData }).then(resp => resp.json());
        if (data.length > 0) {
            const oData = data[0];

            if (parseInt(oData.status_response) > 0)
                window.open(oData.description_response, '_self');

            else
                setLimitLocalidad(_codigo, _nombre);
        }
    }
    else
        setLimitLayer(_codigo, _nombre)
}

$ubigeoImage.addEventListener('click', function () {

    resetFiltroUbigeoImage();
    map.setView([LATITUD_DEFAULT, LONGITUD_DEFAULT], ZOOM_DEFAULT);
    // layerGroup.clearLayers();
    layerGroup.removeLayer(filtroUbigeo)
    layerGroupUbigeo.clearLayers();
    $filtroUbigeo.value = '';
    $logoSubsistema.classList.remove('displayBlock');
});

//Función para obtener el Logo del subsistema por código de ubigeo.
const $headerLogo = document.querySelector('.header__logo');
const $logoSubsistema = $headerLogo.getElementsByTagName('img')[0];
var urlSubsistema = URL_VISOR;
$logoSubsistema.addEventListener('click', openVisorSubsistema);

//Función para abrir otra pestaña el subsistema al hacer click sobre el logo
function openVisorSubsistema() {
    window.open(urlSubsistema, '_blank');
}

//Función para traer los datos del subsistema por el código de ubigeo
async function getLogo(_ubigeo, _setSubsistema = false) {
    var data = new FormData();
    data.append('codigo', _ubigeo);

    let dataSubsistema = await fetch(URL_GET_SUBSISTEMA_X_UBIGEO, { method: 'POST', body: data });
    let respLogoJson = await dataSubsistema.json();

    try {
        // let $subsistema__switch = document.querySelector('.subsistema__switch');
        // let $subsistema__responsable = document.querySelector('.subsistema__responsable');

        // if (respLogoJson[0] === undefined) {
        //     $subsistema__responsable.classList.add('displayNone');

        //     $subsistema__switch.classList.remove('active');
        //     $subsistema__switch.innerText = 'No integrado a Geo Perú'
        // }
        // else {
        //     $subsistema__responsable.classList.remove('displayNone');
        //     $subsistema__responsable.innerText = `Responsable: \n${respLogoJson[0].paterno_usuario} ${respLogoJson[0].materno_usuario}, ${respLogoJson[0].nombres_usuario}`

        //     $subsistema__switch.classList.add('active');
        //     $subsistema__switch.innerText = 'Integrado a Geo Perú'
        // }


        urlSubsistema = URL_VISOR;
        $logoSubsistema.classList.remove('displayBlock');
        if (respLogoJson !== undefined && respLogoJson !== null) {
            if (respLogoJson[0].loginrequired === 1) {
                //Verificamos si existe sesión
                let subsistemaCurrent = `${respLogoJson[0].nombre.replace(/ /g, '-')}-${respLogoJson[0].ubigeo}`
                await validarToken(subsistemaCurrent);
                setInterval(() => {
                    validarToken(subsistemaCurrent);
                }, 60000);
            }
            if (respLogoJson.length > 0) {
                if (respLogoJson[0].logo !== 'images/logo.png')
                    $logoSubsistema.setAttribute('src', respLogoJson[0].logo);
                urlSubsistema = respLogoJson[0].url_subsistema;
                if (respLogoJson[0].logo !== 'images/logo.png')
                    $logoSubsistema.classList.add('displayBlock');
                tipoSubsistema = respLogoJson[0].tipo_subsistema;
                idSubsistemaURL = respLogoJson[0].idsubsistema;
                if (_setSubsistema) IdSubsistemaVisor = respLogoJson[0].idsubsistema;
            } else {
                $logoSubsistema.classList.remove('displayBlock');
            }
        }
    } catch (error) {
        $logoSubsistema.classList.remove('displayBlock');
        console.log(error);
        return;
    }
}

async function setLimitLayer(_codeLayerSelected, _nameLayerSelected) {
    $filtroUbigeo.value = _nameLayerSelected;
    $ubigeoImage.src = './images/general/close.svg'
    $listUbigeo.classList.remove('displayBlock');

    loadLayerDefaultAsync(_codeLayerSelected, true);
}

//Función para limitar la localidad
async function setLimitLocalidad(_ubigeo, _localidad, _updateLayers = true) {
    switchLoader(true);
    evalLogoPB(_ubigeo)

    let tipoLocalidad = (_ubigeo.length === 2) ? 'Departamento' :
        (_ubigeo.length === 3) ? 'Lima' :
            (_ubigeo.length === 4) ? 'Provincia' :
                (_ubigeo.length === 6) ? 'Distrito' : '- - -';
    let textCurrentLocalidad = `${_localidad} (${tipoLocalidad})`
    $filtroUbigeo.value = textCurrentLocalidad;
    $ubigeoImage.src = './images/general/close.svg'

    if (layerGroup.hasLayer(filtroUbigeo)) {
        layerGroup.removeLayer(filtroUbigeo);
    }

    let ulrFilterUbigeo = (_ubigeo.length === 2) ? URL_GET_DEPARTAMENTO :
        (_ubigeo.length === 3 || _ubigeo.length === 4) ? URL_GET_PROVINCIA :
            (_ubigeo.length === 6) ? URL_GET_DISTRITO : _ubigeo;


    if (ulrFilterUbigeo === _ubigeo) {
        alertCustom(`El código ${_ubigeo} no es válido.`);
        switchLoader(false);
        return;
    }

    $listUbigeo.classList.remove('displayBlock');
    if (_ubigeo !== '150801') setOpacityDistinct(_ubigeo);
    let dataUbigeo = await ASYNC_FETCH_JSON(`${ulrFilterUbigeo}/${_ubigeo}`);

    oFiltroUbigeo =
    {
        type: 'FeatureCollection',
        name: 'GeoPerú',
        crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: [{ properties: { cod: _ubigeo }, geometry: JSON.parse(dataUbigeo[0].geometry), type: "Feature" }]
    }

    filtroUbigeo = L.geoJSON(oFiltroUbigeo,
        {
            style: ubigeoStyle, filter: function (feature, layer) {
                return feature.properties.cod == _ubigeo;
            }
        });

    if (filtroUbigeo === undefined) { switchLoader(false); return; }
    if (filtroUbigeo === null) { switchLoader(false); return; }

    if (!layerGroup.hasLayer(filtroUbigeo)) {
        layerGroup.addLayer(filtroUbigeo);
        map.flyToBounds(filtroUbigeo.getBounds(), { 'duration': .5 });
        if (_updateLayers) await getLogo(_ubigeo);
        ubigeoFiltro = _ubigeo;
        switchLoader(false);
        toggleOptionReport(_ubigeo, false);
    }
}

// Función para resetear la imagen de filtro de ubigeo
function resetFiltroUbigeoImage() {
    $ubigeoImage.src = './images/general/search-white.svg'
}

//Función para establecer los límites del mapa y no dejar arrastrar a otra localidad
function setLimiteMapa() {

    limit = map.getBounds();
    const LIMIT_CENTER = limit;
    map.setMaxBounds(limit);
}

//Función para limpiar odos los layers del layerGroupUbigeo
function clearLayerGroupUbigeo() {
    layerGroupUbigeo.eachLayer(function (_value) {
        layerGroupUbigeo.removeLayer(_value);
    });
}

//Función para dar efecto de poner gris el resto del mapa
function setOpacityDistinct(_ubigeo) {
    clearLayerGroupUbigeo();

    let strFiltro = '';
    let strLayer = '';
    if (_ubigeo.length === 6) {
        strLayer = 'peru_distritos_distinct_';
        strFiltro = `cod_dist<>'${_ubigeo}'`;
    }
    if (_ubigeo.length === 4) {
        strLayer = 'peru_provincias_distinct_';
        strFiltro = `cod_prov<>'${_ubigeo}'`;
    }
    if (_ubigeo.length === 3) {
        strLayer = 'peru_regiones_distinct_';
        strFiltro = `cod_region<>15`;
    }
    if (_ubigeo.length === 2) {
        strLayer = 'peru_departamentos_distinct_';
        strFiltro = `cod_dpto<>'${_ubigeo}'`;
    }

    let cqlURL = `${DOMINIO_ESPACIAL}/geoserver/geoperu/wms?service=WMS&CQL_FILTER=` + strFiltro;
    var ubigeoContextPeru = L.nonTiledLayer.wms(cqlURL,
        {
            maxZoom: 22, minZoom: 0, opacity: 1.0, layers: strLayer, zIndex: 1,
            format: 'image/png8', transparent: true, pane: 'ubigeoPane', useCanvas: false
        });

    var ubigeoContextSudamerica = L.nonTiledLayer.wms(`${DOMINIO_ESPACIAL}/geoserver/geoperu/wms?service=WMS&`,
        {
            maxZoom: 22, minZoom: 0, opacity: 1.0, layers: 'peru_sudamerica_mascara_',
            format: 'image/png8', transparent: true, pane: 'ubigeoPane', zIndex: 1, useCanvas: false
        });

    layerGroupUbigeo.addTo(map);
    layerGroupUbigeo.addLayer(ubigeoContextPeru);
    layerGroupUbigeo.addLayer(ubigeoContextSudamerica);
}

function setOpacityDistinctAmbito(_ambito) {
    clearLayerGroupUbigeo();
    let cqlURL;
    let layerContextPeru;

    switch (_ambito) {
        case 'peru_vraem_':
            layerContextPeru = 'peru_distritos_distinct_';
            cqlURL = `${DOMINIO_ESPACIAL}/geoserver/geoperu/wms?service=WMS&CQL_FILTER=cod_dist NOT IN (${DISTRITOS_AMBITO_VRAEM})`;
            break;

        case 'peru_corredor_minero_':
            layerContextPeru = 'peru_distritos_distinct_';
            cqlURL = `${DOMINIO_ESPACIAL}/geoserver/geoperu/wms?service=WMS&CQL_FILTER=cod_dist NOT IN (${DISTRITOS_CORREDOR_MINERO})`;
            break;

        case 'peru_mr_andes_':
            layerContextPeru = 'peru_departamentos_distinct_';
            cqlURL = `${DOMINIO_ESPACIAL}/geoserver/geoperu/wms?service=WMS&CQL_FILTER=cod_dpto NOT IN (${DEPARTAMENTOS_MANCOMUNIDAD_M1})`;
            break;
        case 'binacional_pe_sudamerica_mascara_':
            layerContextPeru = 'peru_distritos_distinct_';
            cqlURL = `${DOMINIO_ESPACIAL}/geoserver/geoperu/wms?service=WMS&CQL_FILTER=cod_dist NOT IN (${DISTRITO_AGUAS_VERDES})`;
            break;

        case 'peru_distritos_frontera_':
            layerContextPeru = 'peru_distritos_distinct_';
            cqlURL = `${DOMINIO_ESPACIAL}/geoserver/geoperu/wms?service=WMS&CQL_FILTER=cod_dist NOT IN (${DISTRITOS_FRONTERAS})`;
            break;

        case 'peru_departamento_distinct_fronterizo_':
            layerContextPeru = 'peru_distritos_distinct_';
            // cqlURL = `${DOMINIO_ESPACIAL}/geoserver/geoperu/wms?service=WMS&CQL_FILTER=cod_dpto NOT IN (${DEPARTAMENTOS_FRONTERIZO})`;
            cqlURL = `${DOMINIO_ESPACIAL}/geoserver/geoperu/wms?service=WMS&CQL_FILTER=cod_dist NOT IN (${DISTRITOS_FRONTERIZO})`;
            break;

    }

    if (cqlURL) {

        let ubigeoContextPeru = L.nonTiledLayer.wms(cqlURL,
            {
                maxZoom: 22, minZoom: 0, opacity: 1.0, layers: layerContextPeru, zIndex: 1,
                format: 'image/png8', transparent: true, pane: 'ubigeoPane', useCanvas: false
            });

        layerGroupUbigeo.addLayer(ubigeoContextPeru);
    }

    var ubigeoContextSudamerica = L.nonTiledLayer.wms(`${DOMINIO_ESPACIAL}/geoserver/geoperu/wms?service=WMS&`,
        {
            maxZoom: 22, minZoom: 0, opacity: 1.0, layers: 'peru_sudamerica_mascara_',
            format: 'image/png8', transparent: true, pane: 'ubigeoPane', zIndex: 1, useCanvas: false
        });

    var ubigeoContextSudamericaEspecial = L.nonTiledLayer.wms(`${DOMINIO_ESPACIAL}/geoserver/geoperu/wms?service=WMS&`,
        {
            maxZoom: 22, minZoom: 0, opacity: 1.0, layers: 'binacional_pe_sudamerica_mascara_',
            format: 'image/png8', transparent: true, pane: 'ubigeoPane', zIndex: 1, useCanvas: false
        });

    var ubigeoContextPNFAEspecial = L.nonTiledLayer.wms(`${DOMINIO_ESPACIAL}/geoserver/geoperu/wms?service=WMS&`,
        {
            maxZoom: 22, minZoom: 0, opacity: 1.0, layers: 'capa_gris_pnfa_',
            format: 'image/png8', transparent: true, pane: 'ubigeoPane', zIndex: 1, useCanvas: false
        });

    // layerGroupUbigeo.addTo(map);
    if (_ambito === 'binacional_pe_sudamerica_mascara_') layerGroupUbigeo.addLayer(ubigeoContextSudamericaEspecial);
    else if (_ambito === 'peru_pnfa') layerGroupUbigeo.addLayer(ubigeoContextPNFAEspecial);
    else layerGroupUbigeo.addLayer(ubigeoContextSudamerica);

    let DATA_POLYGON;
    // let DATA_POLYGON = (_ambito === 'peru_vraem_') ? DATA_VRAEM_POLYGON : DATA_CORREDOR_POLYGON;
    switch (_ambito) {
        case 'peru_vraem_':
            DATA_POLYGON = DATA_VRAEM_POLYGON;
            break;

        case 'peru_corredor_minero_':
            DATA_POLYGON = DATA_CORREDOR_POLYGON;
            break;

        case 'peru_mr_andes_':
        case 'M1':
            DATA_POLYGON = DATA_MR_ANDES_POLYGON;
            break;

        case 'peru_mr_qhapaq_':
            DATA_POLYGON = DATA_MR_QHAPAQ_POLYGON;
            break;

        case 'peru_mr_costa_norte_':
            DATA_POLYGON = DATA_MR_COSTA_NORTE_POLYGON;
            break;

        case 'peru_mr_region_sur_':
            DATA_POLYGON = DATA_MR_REGION_SUR_POLYGON;
            break;

        case 'peru_mr_pacifico_centro_':
            DATA_POLYGON = DATA_MR_PACIFICO_CENTRO_POLYGON;
            break;

        case 'peru_mr_huancavelica_ica_':
            DATA_POLYGON = DATA_MR_HUANCAVELICA_ICA_POLYGON;
            break;

        case 'peru_mr_macro_region_nororiente_':
            DATA_POLYGON = DATA_MR_REGION_NORORIENTE_POLYGON;
            break;

        case 'peru_mr_chavin_':
            DATA_POLYGON = DATA_MR_CHAVIN_POLYGON;
            break;

        case 'peru_mr_amazonica_':
            DATA_POLYGON = DATA_MR_AMAZONICA_POLYGON;
            break;
        case 'binacional_pe_sudamerica_mascara_':
            DATA_POLYGON = DATA_HUAQUILLAS_VERDES;
            break;

        case 'peru_distritos_frontera_':
            DATA_POLYGON = DATA_FRONTERA_POLYGON;
            break;

        case 'peru_departamento_distinct_fronterizo_':
            DATA_POLYGON = DATA_FRONTERIZA_POLYGON;
            break;

        case 'peru_pnfa':
            DATA_POLYGON = DATA_PNFA;
            break;
    }

    oFiltroUbigeo =
    {
        type: 'FeatureCollection',
        name: 'GeoPerú',
        crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        features: [{ properties: { cod: 'ambitos' }, geometry: JSON.parse(DATA_POLYGON), type: "Feature" }]
    }

    filtroUbigeo = L.geoJSON(oFiltroUbigeo,
        {
            style: ubigeoStyle
        });

    if (!layerGroup.hasLayer(filtroUbigeo))
        layerGroup.addLayer(filtroUbigeo);
}

//Función para habilitar el botón de reportes
const $btnReportePrincipal = document.querySelector('#btnReportePrincipal');
const $btnReporteCEMSC = document.querySelector('#btnReporteCEMSC');
const $btnReporteGasto = document.querySelector('#btnReporteGasto');
const $btnReporteViolencia = document.querySelector('#btnReporteViolencia');
const $btnReporteInversion = document.querySelector('#btnReporteInversion');
const $btnReporteInversion2 = document.querySelector('#btnReporteInversion2');
const $btnReporteObservaciones = document.querySelector('#btnReporteObservaciones');

$btnReportePrincipal.addEventListener('click', verReporteIndicador);
$btnReporteCEMSC.addEventListener('click', verReporteCEMSC);
$btnReporteGasto.addEventListener('click', verReporteGasto);
$btnReporteViolencia.addEventListener('click', verReporteViolencia);
$btnReporteInversion.addEventListener('click', verReporteInversion);
$btnReporteObservaciones.addEventListener('click', verReporteObservaciones);
$btnReporteInversion2.addEventListener('click', verReporteInversion2);

function toggleOptionReport(_ubigeo, _disabled = true) {

    if (_disabled) {
        //Agregamos la clase disabled al botón del reporte
        $optionReport.classList.add('disabledOption');
        $btnReportSmall.classList.add('disabledOption');
    }
    else {
        //Removemos la clase disabled al botón del reporte
        $optionReport.classList.remove('disabledOption');
        $btnReportSmall.classList.remove('disabledOption');

        //Agregamos clase para que se muestre los botones de los reportes
        $btnReportePrincipal.classList.add('displayBlock');
        // $btnReporteGasto.classList.add('displayBlock'); //Deshabilitamos a solicitud de Josué el 24/03/2021
        $btnReporteInversion.classList.add('displayBlock');
        $btnReporteCEMSC.classList.add('displayBlock');

        //Agregamos visibilidad al botón de Violencia de Género, sólo a nivel distrital
        if (_ubigeo.length === 6) $btnReporteViolencia.classList.add('displayBlock');
        else $btnReporteViolencia.classList.remove('displayBlock');

        if (codSubsistemaCurrent === 'A00018' || codSubsistemaCurrent === '') $btnReporteCEMSC.classList.add('displayBlock');
        else $btnReporteCEMSC.classList.remove('displayBlock');

        if (codSubsistemaCurrent === 'A09022' || codSubsistemaCurrent === 'A00023') {
            $optionReport.classList.remove('disabledOption');
            $optionReport.classList.add('displayBlock');

            $btnReporteInversion.classList.remove('displayBlock');
            $btnReporteInversion2.classList.add('displayBlock');
        }
    }

    if (_ubigeo === 'M1')
        $btnReporteInversion.classList.remove('displayBlock');
}

function verReporteIndicador() {

    if (NUEVOS_DISTRITOS.includes(ubigeoFiltro.toString())) {
        alertCustom('Estamos trabajando para tener los reportes de este nuevo distrito.');
        return;
    }

    if (ubigeoFiltro.trim().length === 0) {
        alertCustom('Primero seleccione un gobierno regional o local.');
        return;
    }

    if (codSubsistemaCurrent.indexOf('M') >= 0) window.open(`${URL_REPORTE_INDICADORES}${codSubsistemaCurrent}`, '_blank');
    else window.open(URL_REPORTE_INDICADORES + ((ubigeoFiltro.length !== 0) ? ubigeoFiltro.toString() : ''), '_blank');
}
function verReporteCEMSC() {
    if (codSubsistemaCurrent === 'A00018' || codSubsistemaCurrent === '') window.open(`${URL_REPORTE_CEMSC}?ubigeo=${ubigeoFiltro}&anio=2022`, '_blank');
}
function verReporteGasto() {
    window.open(URL_REPORTE_GASTOS + ((ubigeoFiltro.length !== 0) ? ubigeoFiltro.toString() : ''), '_blank');
}
function verReporteViolencia() {
    if (ubigeoFiltro.trim().length === 0) {
        alertCustom('Primero seleccione un gobierno regional o local.');
        return;
    }

    window.open(URL_REPORTE_VIOLENCIA + ((ubigeoFiltro.length !== 0) ? ubigeoFiltro.toString() : ''), '_blank');
}
function verReporteInversion() {
    if (codSubsistemaCurrent === 'A09022') {
        window.open(URL_REPORTE_INVERSION + 'filter/fronterizo', '_blank');
    }
    else if (codSubsistemaCurrent === 'A00023') {
        window.open(URL_REPORTE_INVERSION + 'historico/?amb=pb', '_blank');
    }
    else {
        if (ubigeoFiltro.trim().length === 0) {
            alertCustom('Primero seleccione un gobierno regional o local.');
            return;
        }

        if (codSubsistemaCurrent.indexOf('M') >= 0) window.open(`${URL_REPORTE_INDICADORES}${codSubsistemaCurrent}`, '_blank');
        else window.open(URL_REPORTE_INVERSION + ((ubigeoFiltro.length !== 0) ? ubigeoFiltro.toString() : ''), '_blank');
    }
}

function verReporteInversion2() {
    if (codSubsistemaCurrent === 'A00023') {
        window.open(URL_REPORTE_INVERSION + 'historico/?amb=pb', '_blank');
    }
    else {
        if (ubigeoFiltro.trim().length === 0) {
            alertCustom('Primero seleccione un gobierno regional o local.');
            return;
        }

        if (codSubsistemaCurrent.indexOf('M') >= 0) window.open(`${URL_REPORTE_INDICADORES}${codSubsistemaCurrent}`, '_blank');
        else window.open(URL_REPORTE_INVERSION + ((ubigeoFiltro.length !== 0) ? ubigeoFiltro.toString() : ''), '_blank');
    }
}

function verReporteObservaciones() {
    if (codSubsistemaCurrent === 'A00002' || codSubsistemaCurrent === 'A00027') window.open('https://visor.geoperu.gob.pe/reportespyact/observaciones', '_blank');
    else alertCustom('Subsistema no permitido para visualizar este reporte.');
}

//Convertir zoom a escala
function zoomToScale() {
    const $textEscale = document.querySelector('#textEscale');
    let CenterOfMap = map.getSize().y / 2;

    let RealWorlMetersPer100Pixels = map.distance(
        map.containerPointToLatLng([0, CenterOfMap]),
        map.containerPointToLatLng([100, CenterOfMap])
    );
    let ScreenMetersPer100Pixels = _pxTOmm(100) / 1000;
    let scaleFactor = RealWorlMetersPer100Pixels / ScreenMetersPer100Pixels;
    $textEscale.value = scaleFactor.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Función que calcula los pixeles de un div
function _pxTOmm(px = 0) {
    var heightRef = document.createElement('div');
    heightRef.style = 'height:1mm;display:none';
    heightRef.id = 'heightRef';
    document.body.appendChild(heightRef);

    heightRef = document.getElementById('heightRef');
    var pxPermm = $('#heightRef').height();

    heightRef.parentNode.removeChild(heightRef);
    return px / pxPermm;
}

const $lblLng = document.querySelector('#lblLng');
const $lblLat = document.querySelector('#lblLat');
const $lblUtm = document.querySelector('#lblUtm');
const $lblEst = document.querySelector('#lblEst');
const $lblNrt = document.querySelector('#lblNrt');

//Función para obtener las coordenadas según la posición del cursor.
function onMouseMove(e) {
    if (e.latlng == undefined) return;

    let c = map.getCenter();
    c.lat = L.Util.formatNum(e.latlng.lat, 5);
    c.lng = L.Util.formatNum(e.latlng.lng, 5);
    let oZoneBand = c.utm();

    $lblLat.innerHTML = `Latitud: ${c.lat}`;
    $lblLng.innerHTML = `GCS Longitud: ${c.lng}`;
    $lblUtm.innerHTML = `UTM Zona: ${oZoneBand.zone} ${oZoneBand.band}`;
    $lblEst.innerHTML = `Este: ${numberWithCommas(oZoneBand.x.toFixed(2))}m`;
    $lblNrt.innerHTML = `Norte: ${numberWithCommas(oZoneBand.y.toFixed(2))} m`;
}

//Función para colocar la coma de miles
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//función para llamar FETCH ASYNC que retorna JSON
async function ASYNC_FETCH_JSON(_url) {
    let respFetch = await fetch(_url);
    let respJson = await respFetch.json();
    return respJson;
}

const $toast__custom = document.querySelector('.toast__custom');
const $spanCustom = document.querySelector('#spanCustom');

const $spanInfo = document.querySelector('#spanInfo');
const $spanCategory = document.querySelector('#spanCategory');
const $spanSubcategory = document.querySelector('#spanSubcategory');
const $spanDefinition = document.querySelector('#spanDefinition');

const $cellEscale = document.querySelector('#cellEscale');
const $cellFrecuency = document.querySelector('#cellFrecuency');
const $cellUpdate = document.querySelector('#cellUpdate');
const $cellWebsite = document.querySelector('#cellWebsite');
const $cellSource = document.querySelector('#cellSource');
const $cellYear = document.querySelector('#cellYear');
const $cellMetadato = document.querySelector('#cellMetadato');
const $cellDownload = document.querySelector('#cellDownload');
const $cellPolitica = document.querySelector('#cellPolitica');
const $cellLineamiento = document.querySelector('#cellLineamiento');

// Función para administrar los controles según escala
function controlMaxMinScale() {
    // let zoom_found = ZOOM_LEVELS.find(i => i.zoom_level == map.getZoom());
    let zoom_found = ZOOM_LEVELS.find(i => i.zoom_level == Math.round(map.getZoom() * 100) / 100);
    if (zoom_found != undefined) {
        mLayer.forEach(function (it) {
            let oLayerCurrent = it;
            let $checkboxCurrent = document.querySelector('#chkLayer_' + oLayerCurrent.id);
            let $labelCurrent = document.querySelector('#label_' + oLayerCurrent.id);

            if ($checkboxCurrent === null) return;
            if ($labelCurrent === null) return;

            let $currentRange = $checkboxCurrent.parentElement.querySelector('input[type="range"]');

            //Si la escala es menor que el zoom actual, desactivamos los controles
            if (oLayerCurrent.escala_maxima > 0 && oLayerCurrent.escala_maxima < parseInt(document.getElementById('textEscale').value.replace(/,/g, ''))) {

                $checkboxCurrent.setAttribute('disabled', 'disabled');
                $labelCurrent.classList.add('disabled');
                $labelCurrent.setAttribute('title', 'Para activar esta capa tiene que acercar el mapa.');

                if ($currentRange) $currentRange.setAttribute('disabled', 'disabled');

                //Si está seleccionado lo removemos.
                if ($checkboxCurrent.checked) {
                    $checkboxCurrent.checked = false;
                    removeLegend($checkboxCurrent);

                    let currentControlLayer = allCapas[oLayerCurrent.capaxml];
                    if (!currentControlLayer) allCapas[oLayerCurrent.alias];
                    if (currentControlLayer)
                        layerGroup.removeLayer(currentControlLayer)
                }
            }
            else {
                $checkboxCurrent.removeAttribute('disabled');
                $labelCurrent.classList.remove('disabled');
                $labelCurrent.removeAttribute('title');
                $currentRange.removeAttribute('disabled');
            }
        });
        // for (var i = 0; i < mLayer.length; i++) {

        // let oLayerCurrent = mLayer[i];
        // let $checkboxCurrent = document.querySelector('#chkLayer_' + oLayerCurrent.id);
        // let $labelCurrent = document.querySelector('#label_' + oLayerCurrent.id);

        // if ($checkboxCurrent === null) return;
        // if ($labelCurrent === null) return;

        // //Si la escala es menor que el zoom actual, desactivamos los controles
        // if (oLayerCurrent.escala_maxima > 0 && oLayerCurrent.escala_maxima < zoom_found.scale_round) {

        //     $checkboxCurrent.setAttribute('disabled', 'disabled');
        //     $labelCurrent.classList.add('disabled');
        //     $labelCurrent.setAttribute('title', 'Para activar esta capa tiene que acercar el mapa.');

        //     //Si está seleccionado lo removemos.
        //     if ($checkboxCurrent.checked) {
        //         $checkboxCurrent.checked = false;
        //         layerGroup.removeLayer(layerGroup.removeLayer(allCapas[oLayerCurrent.capaxml]));
        //         removeLegend($checkboxCurrent);
        //     }
        // }
        // else {
        //     $checkboxCurrent.removeAttribute('disabled');
        //     $labelCurrent.classList.remove('disabled');
        //     $labelCurrent.removeAttribute('title');

        // }
        // }
    }
}

// Función para mostrar la información de la capa
$modalInfo = document.querySelector('#modalInfo');
async function showInformacion(_layerXML) {
    let respJson = await ASYNC_FETCH_JSON(URL_GET_INFO + _layerXML);

    if (respJson === null) return;
    if (respJson === undefined) return;
    if (respJson.length <= 0) return;

    let oInformacion = respJson[0];

    $spanInfo.innerHTML = `Información de capa temática: ${oInformacion.capa}`;
    $spanCategory.innerHTML = oInformacion.tematico_descripcion;
    $spanSubcategory.innerHTML = (oInformacion.subtematico_descripcion.trim().length > 0) ? oInformacion.subtematico_descripcion : '-';
    $spanDefinition.innerHTML = oInformacion.definicion;

    rowsControlTableInfo($cellEscale, oInformacion.escala, false);
    rowsControlTableInfo($cellFrecuency, oInformacion.frecuencia, false);
    rowsControlTableInfo($cellUpdate, oInformacion.fec_actualizacion, false);
    rowsControlTableInfo($cellWebsite, oInformacion.website, true);
    rowsControlTableInfo($cellSource, oInformacion.fuente, false);
    rowsControlTableInfo($cellYear, oInformacion.annio, false);
    rowsControlTableInfo($cellMetadato, oInformacion.metadato, true);
    rowsControlTableInfo($cellDownload, oInformacion.descarga, true);
    rowsControlTableInfo($cellPolitica, oInformacion.politica, false);
    rowsControlTableInfo($cellLineamiento, oInformacion.lineamiento, false);

    if (!$modalInfo.classList.contains('displayBlock'))
        $modalInfo.classList.add('displayBlock');

    var dataGetFiles = new FormData();
    dataGetFiles.append('idcapa', _layerXML)

    let infoFilesInfo = await fetch(URL_FILES_INFO, { method: 'POST', body: dataGetFiles });
    let respGetFilesJson = await infoFilesInfo.json();
    if (respGetFilesJson === null) return;
    if (respGetFilesJson === undefined) return;

    let $lnkInfoFile_1 = document.querySelector('#lnkInfoFile_1');
    let $lnkInfoFile_2 = document.querySelector('#lnkInfoFile_2');
    let $lnkInfoFile_3 = document.querySelector('#lnkInfoFile_3');

    if (respGetFilesJson.filter(i => i.item === 1)[0] !== undefined) {
        $lnkInfoFile_1.classList.remove('displayNone');
        $lnkInfoFile_1.innerHTML = DOMPurify.sanitize(respGetFilesJson.filter(i => i.item === 1)[0].nombre);
        $lnkInfoFile_1.href = respGetFilesJson.filter(i => i.item === 1)[0].url_file
    }
    else
        $lnkInfoFile_1.classList.add('displayNone');

    if (respGetFilesJson.filter(i => i.item === 2)[0] !== undefined) {
        $lnkInfoFile_2.classList.remove('displayNone');
        $lnkInfoFile_2.innerHTML = DOMPurify.sanitize(respGetFilesJson.filter(i => i.item === 2)[0].nombre);
        $lnkInfoFile_2.href = respGetFilesJson.filter(i => i.item === 2)[0].url_file
    }
    else
        $lnkInfoFile_2.classList.add('displayNone');

    if (respGetFilesJson.filter(i => i.item === 3)[0] !== undefined) {
        $lnkInfoFile_3.classList.remove('displayNone');
        $lnkInfoFile_3.innerHTML = DOMPurify.sanitize(respGetFilesJson.filter(i => i.item === 3)[0].nombre);
        $lnkInfoFile_3.href = respGetFilesJson.filter(i => i.item === 3)[0].url_file
    }
    else
        $lnkInfoFile_3.classList.add('displayNone');

}


async function showInformacionIdLayer(_layerXML) {
    let respJson = await fetch(URL_GET_INFO_LAYER + _layerXML).then(resp => resp.json());
    if (respJson === null) return;
    if (respJson === undefined) return;
    if (respJson.length <= 0) return;

    let oInformacion = respJson[0];

    $spanInfo.innerHTML = DOMPurify.sanitize(`Información de capa temática: ${oInformacion.capa}`);
    $spanCategory.innerHTML = DOMPurify.sanitize(oInformacion.tematico_descripcion);
    $spanSubcategory.innerHTML = DOMPurify.sanitize((oInformacion.subtematico_descripcion.trim().length > 0) ? oInformacion.subtematico_descripcion : '-');
    $spanDefinition.innerHTML = DOMPurify.sanitize(oInformacion.definicion, { ADD_ATTR: ['target'] });

    rowsControlTableInfo($cellEscale, oInformacion.escala, false);
    rowsControlTableInfo($cellFrecuency, oInformacion.frecuencia, false);
    rowsControlTableInfo($cellUpdate, oInformacion.fec_actualizacion, false);
    rowsControlTableInfo($cellWebsite, oInformacion.website, true);
    rowsControlTableInfo($cellSource, oInformacion.fuente, false);
    rowsControlTableInfo($cellYear, oInformacion.annio, false);
    rowsControlTableInfo($cellMetadato, oInformacion.metadato, true);
    rowsControlTableInfo($cellDownload, oInformacion.descarga, true);
    rowsControlTableInfo($cellPolitica, oInformacion.politica, false);
    rowsControlTableInfo($cellLineamiento, oInformacion.lineamiento, false);

    if (!$modalInfo.classList.contains('displayBlock'))
        $modalInfo.classList.add('displayBlock');

    var dataGetFiles = new FormData();
    dataGetFiles.append('idcapa', _layerXML)

    let infoFilesInfo = await fetch(URL_FILES_INFO, { method: 'POST', body: dataGetFiles });
    let respGetFilesJson = await infoFilesInfo.json();

    if (respGetFilesJson === null) return;
    if (respGetFilesJson === undefined) return;

    let $lnkInfoFile_1 = document.querySelector('#lnkInfoFile_1');
    let $lnkInfoFile_2 = document.querySelector('#lnkInfoFile_2');
    let $lnkInfoFile_3 = document.querySelector('#lnkInfoFile_3');

    if (respGetFilesJson.filter(i => i.item === 1)[0] !== undefined) {
        $lnkInfoFile_1.classList.remove('displayNone');
        const oDataFile = respGetFilesJson.filter(i => i.item === 1)[0];
        $lnkInfoFile_1.innerHTML = DOMPurify.sanitize(oDataFile.nombre);

        $lnkInfoFile_1.addEventListener('click', async () => {
            alertCustom('Espero un momento mientras abrimos el enlace...');
            if (Number(_layerXML) === 1183 || Number(_layerXML) === 1187) window.open(oFileInfo.url_file, '_blank');
            else {
                window.open(oDataFile.url_file, '_blank');
                // const fData = new FormData();
                // fData.append('ubigeo', oDataFile.ubigeo);
                // fData.append('layer', oDataFile.nombre_capa);
                // fData.append('archivo', oDataFile.nombre);
                // const oDataDownloadSigned = await fetch(URL_GET_DOWNLOAD_INFO_FILE, { method: 'POST', body: fData }).then(resp => resp.json());

                // if (oDataDownloadSigned === undefined) return;
                // if (oDataDownloadSigned === null) return;

                // if (Number(oDataDownloadSigned.response_status) > 0)
                //     window.open(oDataDownloadSigned.response_message, '_blank');
            }
        });
    }
    else
        $lnkInfoFile_1.classList.add('displayNone');

    if (respGetFilesJson.filter(i => i.item === 2)[0] !== undefined) {
        $lnkInfoFile_2.classList.remove('displayNone');
        const oDataFile = respGetFilesJson.filter(i => i.item === 2)[0];
        $lnkInfoFile_2.innerHTML = DOMPurify.sanitize(oDataFile.nombre);

        $lnkInfoFile_2.addEventListener('click', async () => {
            alertCustom('Espero un momento mientras abrimos el enlace...');
            window.open(oDataFile.url_file, '_blank');
            // const fData = new FormData();
            // fData.append('ubigeo', oDataFile.ubigeo);
            // fData.append('layer', oDataFile.nombre_capa);
            // fData.append('archivo', oDataFile.nombre);
            // const oDataDownloadSigned = await fetch(URL_GET_DOWNLOAD_INFO_FILE, { method: 'POST', body: fData }).then(resp => resp.json());

            // if (oDataDownloadSigned === undefined) return;
            // if (oDataDownloadSigned === null) return;

            // if (Number(oDataDownloadSigned.response_status) > 0)
            //     window.open(oDataDownloadSigned.response_message, '_blank');
        })
    }
    else
        $lnkInfoFile_2.classList.add('displayNone');

    if (respGetFilesJson.filter(i => i.item === 3)[0] !== undefined) {
        $lnkInfoFile_3.classList.remove('displayNone');
        const oDataFile = respGetFilesJson.filter(i => i.item === 3)[0];
        $lnkInfoFile_3.innerHTML = DOMPurify.sanitize(oDataFile.nombre);

        $lnkInfoFile_3.addEventListener('click', async () => {
            alertCustom('Espero un momento mientras abrimos el enlace...');
            window.open(oDataFile.url_file, '_blank');

            // const fData = new FormData();
            // fData.append('ubigeo', oDataFile.ubigeo);
            // fData.append('layer', oDataFile.nombre_capa);
            // fData.append('archivo', oDataFile.nombre);
            // const oDataDownloadSigned = await fetch(URL_GET_DOWNLOAD_INFO_FILE, { method: 'POST', body: fData }).then(resp => resp.json());

            // if (oDataDownloadSigned === undefined) return;
            // if (oDataDownloadSigned === null) return;

            // if (Number(oDataDownloadSigned.response_status) > 0)
            //     window.open(oDataDownloadSigned.response_message, '_blank');
        })
    }
    else
        $lnkInfoFile_3.classList.add('displayNone');
}

//Función que controla la visibilidad de los campos de la tabla de información
function rowsControlTableInfo(_$control, _value, _isURL = false) {
    let $rowControl = document.querySelector('#' + _$control.id.replace('cell', 'row'));
    _$control.innerHTML = DOMPurify.sanitize(((_isURL) ? `<a target="_blank" href="${((_value.indexOf('http')) >= 0 ? '' : '//')}${_value}">` : '') + _value + ((_isURL) ? `</a>` : ''));
    if (_value.trim().length > 0) $rowControl.style.display = 'table-row';
    else $rowControl.style.display = 'none';
}

//Función para enviar mensajes de alerta.
function alertCustom(_message) {
    $spanCustom.innerHTML = DOMPurify.sanitize(_message);
    $toast__custom.classList.add('displayBlock');

    setTimeout(() => {
        $toast__custom.classList.remove('displayBlock');
    }, 3000);
}

const $modals = document.querySelectorAll('.modal');
$modals.forEach(function ($el) {
    $el.addEventListener('mousedown', modalMouseDown);
    let $imgCloseCurrent = $el.getElementsByTagName('img')[0];
    $imgCloseCurrent.addEventListener('click', closeModal);
});

const $modalsOption = document.querySelectorAll('.modal__options');
$modalsOption.forEach(function ($el) {
    $el.addEventListener('mousedown', modalMouseDown);
});

//Función para cerrar los modales, esta función quita los estilos asignados
function closeModal() {
    let $currentModal = document.getElementById(this.dataset.modal);
    $currentModal.removeAttribute('style');
    $currentModal.classList.remove('displayBlock');
}

let isResizing = false;

//Función que detecta cuando el mouse está encima del modal (Efecto de arrastre)
function modalMouseDown(e) {
    let $currentModal = document.getElementById(this.id);
    window.addEventListener('mousemove', modalMouseMove);
    window.addEventListener('mouseup', modalMouseUp);

    let prevX = e.clientX;
    let prevY = e.clientY;
    function modalMouseMove(e) {
        if (!isResizing) {
            let newX = prevX - e.clientX;
            let newY = prevY - e.clientY;

            const rect = $currentModal.getBoundingClientRect();
            $currentModal.style.margin = '0px';
            $currentModal.style.left = rect.left - newX + 'px';
            $currentModal.style.top = rect.top - newY + 'px';

            prevX = e.clientX;
            prevY = e.clientY;
        }
    }

    function modalMouseUp() {
        window.removeEventListener('mousemove', modalMouseMove);
        window.removeEventListener('mouseup', modalMouseUp);
    }
}

const $resizers = document.querySelectorAll('.resizer');
let currentResizer;
$resizers.forEach(function ($el) {
    $el.addEventListener('mousedown', resizeMouseDown);
});

//Función para poder cambiar el tamaño el modal
function resizeMouseDown(e) {

    let idCurrent = (this.id.length === 0) ? this.parentElement.parentElement.id : this.id;

    let currentMinWidth = 200;
    let currentMinHeight = Math.round((window.innerHeight * 0.8) - 80, 0);
    if (this.parentElement.parentElement.id === 'modalInfo') {
        currentMinHeight = Math.round((window.innerHeight * 0.99), 0);
        currentMinWidth = Math.round((window.innerWidth * 0.99), 0);
    }

    let $currentModal = document.getElementById(idCurrent);
    currentResizer = e.target;
    isResizing = true;

    let prevX = e.clientX;
    let prevY = e.clientY;

    window.addEventListener('mousemove', resizeMouseMove);
    window.addEventListener('mouseup', resizeMouseUp);

    function resizeMouseMove(e) {
        const rect = $currentModal.getBoundingClientRect();
        let widthCurrent = rect.width - (prevX - e.clientX);
        let heightCurrent = rect.height - (prevY - e.clientY);

        if (currentMinWidth >= widthCurrent || currentMinHeight >= heightCurrent) {
            // resizeMouseUp();
            return;
        }

        $currentModal.style.width = rect.width - (prevX - e.clientX) + 'px';
        $currentModal.style.height = rect.height - (prevY - e.clientY) + 'px';

        prevX = e.clientX;
        prevY = e.clientY;
    }

    function resizeMouseUp() {
        window.removeEventListener('mousemove', resizeMouseMove);
        window.removeEventListener('mouseup', resizeMouseUp);
        isResizing = false;
    }
}

$divMobile = document.querySelector('.section__mobile');
$btnLayerMobile = document.querySelector('#btnLayerMobile');
$btnLayerMobile.addEventListener('click', toggleLayersMobile);
$btnLegendMobile = document.querySelector('#btnLegendMobile');
$btnLegendMobile.addEventListener('click', toggleLayersMobile);

$imgCloseMobile = document.querySelector('.close__mobile');
$imgCloseMobile.addEventListener('click', toggleLayersMobile);

//Función del mobile para switchear que ventana abrimos (Capas o Leyendas)
function toggleLayersMobile(e) {

    $divMobile.classList.toggle('displayBlock');

    if ($divMobile.classList.contains('displayBlock')) {
        if (e.target.id === 'btnLayerMobile') {
            $navMobileLegend.classList.remove('displayBlock');
            $navMobileLayer.classList.add('displayBlock');
            $mobileTitle.innerHTML = 'Capas'
        }
        else {
            $navMobileLayer.classList.remove('displayBlock');
            $navMobileLegend.classList.add('displayBlock');
            $mobileTitle.innerHTML = 'Leyendas'
        }
    }
}

const $modalsOptions = document.querySelectorAll('.modal__options');

// Función para cerrar los modales de herramientas
function closeOptionModal(_modal) {
    let $modalCurrent = document.querySelector(`#${_modal}`);
    if ($modalCurrent === undefined) return;
    if ($modalCurrent === null) return;

    if ($modalCurrent.classList.contains('displayBlock'))
        $modalCurrent.classList.remove('displayBlock');
}

const $optionGPS = document.querySelector('#optionGPS');

const $modalReporte = document.querySelector('#modalReporte');
const $optionReport = document.querySelector('#optionReport');

const $modalBase = document.querySelector('#modalBase');
const $optionBase = document.querySelector('#optionBase');

const $modalUpload = document.querySelector('#modalUpload');
const $optionUpload = document.querySelector('#optionUpload');

const $modalDraw = document.querySelector('#modalDraw');
const $optionDraw = document.querySelector('#optionDraw');

const $modalDownload = document.querySelector('#modalDownload');
const $optionDownload = document.querySelector('#optionDownload');

const $modalCustom = document.querySelector('#modalCustom');
const $optionCustom = document.querySelector('#optionCustom');

const $modalPrint = document.querySelector('#modalPrint');
const $optionPrint = document.querySelector('#optionPrint');

const $modalShare = document.querySelector('#modalShare');
const $optionShare = document.querySelector('#optionShare');

$optionGPS.addEventListener('click', toggleGPS);
$optionReport.addEventListener('click', toggleModalOption);
$optionBase.addEventListener('click', toggleModalOption);
$optionUpload.addEventListener('click', toggleModalOption);
$optionDraw.addEventListener('click', toggleModalOption);
$optionDownload.addEventListener('click', toggleModalOption);
$optionCustom.addEventListener('click', toggleModalOption);
$optionPrint.addEventListener('click', toggleModalOption);
$optionShare.addEventListener('click', toggleModalOption);

const $btnReportSmall = document.querySelector('#btnReportSmall');
const $btnBaseSmall = document.querySelector('#btnBaseSmall');
const $btnCustomSmall = document.querySelector('#btnCustomSmall');
const $btnShareSmall = document.querySelector('#btnShareSmall');

$btnReportSmall.addEventListener('click', toggleModalOption);
$btnBaseSmall.addEventListener('click', toggleModalOption);
$btnCustomSmall.addEventListener('click', toggleModalOption);
$btnShareSmall.addEventListener('click', toggleModalOption);

// Función que cierra los modales de herramientas
function closeAllModalOptions(_currentOption) {
    let currentModal = _currentOption.replace('option', 'modal');
    let $modalsOptions = document.querySelectorAll('.modal__options');
    $modalsOptions.forEach(function ($el) {
        if ($el.id !== currentModal) {
            $el.classList.remove('displayBlock');
        }
    });
}

// Función que controla la apertura de las modales de herramientas
function toggleModalOption() {
    //Agregamos la condición que si es subsistema de PROYECTOS ESTRATÉGICOS, saltamos la condición
    if (codSubsistemaCurrent !== 'A00002' && codSubsistemaCurrent !== 'A09022' && codSubsistemaCurrent !== 'A00023' && codSubsistemaCurrent !== 'A00027') {
        if (this.id === 'optionReport' || this.id === 'btnReportSmall') {
            if (ubigeoFiltro.length === 0 && codSubsistemaCurrent.indexOf('M') < 0) {
                return;
            }
        }
    }
    closeAllModalOptions(this.id);

    let $modalCurrent = document.getElementById(this.dataset.modal);
    $modalCurrent.classList.toggle('displayBlock');
    $modalCurrent.removeAttribute('style'); //Removemos el atributo style para que inicie en su posición original
}

var onGPS = false;  //ariable para controlar el estado del GPS
//Función switch para la geolocalización
function toggleGPS() {
    if (!onGPS) getLocation();
    else removeLocation();

    onGPS = !onGPS;
}

// PARA SERVICIOS
$btnTipoServicio = document.querySelector('#btnTipoServicio');
$spanTipoServicio = $btnTipoServicio.querySelector('span');
$optTipoServicio = document.querySelector('#optTipoServicio');
$optionsTipoServicio = $optTipoServicio.querySelectorAll('span');
$btnTipoServicio.addEventListener('click', openTipoServicio);
var optionTipoServicioCurrent = '';

//Función para mostrar las opciones del Tipo de Servicio
function openTipoServicio() {
    $optTipoServicio.classList.add('displayBlock');
}

//Función para ocultar las opciones del Tipo de Servicio
function closeTipoServicio() {
    $optTipoServicio.classList.remove('displayBlock');
}

//Función para binder el evento click a las opciones
$optionsTipoServicio.forEach(function (el) {
    el.addEventListener('click', selectedTipoServicio);
});

//Función que se ejecuta al seleccionar una opción de tipo de servicio
function selectedTipoServicio() {
    optionTipoServicioCurrent = this.dataset.id;
    $optTipoServicio.dataset.value = optionTipoServicioCurrent;
    $spanTipoServicio.textContent = this.textContent;
    closeTipoServicio();
}

// PARA ARCHIVOS
$btnTipoArchivo = document.querySelector('#btnTipoArchivo');
$spanTipoArchivo = $btnTipoArchivo.querySelector('span');
$optTipoArchivo = document.querySelector('#optTipoArchivo');
$optionsTipoServicio = $optTipoArchivo.querySelectorAll('span');
$btnTipoArchivo.addEventListener('click', openTipoArchivo);
var optionTipoArchivoCurrent = '';

//Función para mostrar las opciones del Tipo de Archivo
function openTipoArchivo() {
    $optTipoArchivo.classList.add('displayBlock');
}

//Función para ocultar las opciones del Tipo de Archivo
function closeTipoArchivo() {
    $optTipoArchivo.classList.remove('displayBlock');
}

//Función para binder el evento click a las opciones
$optionsTipoServicio.forEach(function (el) {
    el.addEventListener('click', selectedTipoArchivo);
});

//Función que se ejecuta al seleccionar una opción de tipo de archivo
function selectedTipoArchivo() {
    optionTipoArchivoCurrent = this.dataset.id;
    $optTipoArchivo.dataset.value = optionTipoArchivoCurrent;
    $spanTipoArchivo.textContent = this.textContent;
    closeTipoArchivo();

    addRequeriments(optionTipoArchivoCurrent);
}

//Data que tiene los requerimientos por archivos Shape, KML, CSV, GeoJSON
var optionsArchivos = [
    {
        id: '1',
        type: 'shape',
        requeriments: ` - Los archivos Shape deben estar comprimidos en formato zip. 
                        - Comprimir archivos de 60MB como máximo. 
                        - El archivo comprimido no debe sobrepasar los 15MB.`
    },
    {
        id: '2',
        type: 'json',
        requeriments: `- El archivo no debe sobrepasar los 15MB.`
    },
    {
        id: '3',
        type: 'kml',
        requeriments: `- El archivo no debe sobrepasar los 15MB.`
    },
    {
        id: '4',
        type: 'csv',
        requeriments: ` - Para georreferenciar <b>coordenadas geográficas</b> el archivo debe contener las columnas "lat" (latitud) y "lng" (longitud). 
                        - Para georreferenciar <b>coordenadas UTM</b> el archivo debe tener los campos "x", "y" y "zona". 
                        - Los campos que se incluyan deben estar separados por ";" (punto y coma).`
    }
]

const $listRequeriments = document.querySelector('#listRequeriments');

//Función para añadir requerimientos según tió de archivo
function addRequeriments(_id) {
    let currentType = optionsArchivos.find(i => i.id === _id);
    let arrayRequeriments = currentType.requeriments.split('-');

    $listRequeriments.textContent = '';
    arrayRequeriments.forEach(function (el) {
        if (el.trim().length === 0) return;
        let currentOption = `<li>${el}</li>`
        $listRequeriments.insertAdjacentHTML('beforeend', currentOption);
    });
}

$btnUploadService = document.querySelector('#btnUploadService');
$btnUploadFile = document.querySelector('#btnUploadFile');

$btnUploadService.addEventListener('click', toggleSectionUpload);
$btnUploadFile.addEventListener('click', toggleSectionUpload);

$sectionService = document.querySelector('#sectionService');
$sectionFile = document.querySelector('#sectionFile');
$sectionUploaded = document.querySelector('#sectionUploaded');
$sectionService.classList.add('displayBlock');

//Función para controlar que modal se hará visible
function toggleSectionUpload(_default = false) {

    $sectionUploaded.classList.remove('displayBlock');
    $divOptionsUpload.classList.remove('displayNone');

    if (_default === true || this.dataset.section === 'sectionService') {
        $btnUploadFile.classList.remove('button__upload--active');
        $btnUploadFile.classList.add('button__upload');

        $btnUploadService.classList.add('button__upload--active');
        $btnUploadService.classList.remove('button__upload');

        $sectionService.classList.add('displayBlock');
        $sectionFile.classList.remove('displayBlock');
    }
    else {
        $btnUploadService.classList.remove('button__upload--active');
        $btnUploadService.classList.add('button__upload');

        $btnUploadFile.classList.remove('button__upload');
        $btnUploadFile.classList.add('button__upload--active');

        $sectionService.classList.remove('displayBlock');
        $sectionFile.classList.add('displayBlock');
    }
}

$irAdministrar = document.getElementsByName('irAdministrar');
$backAdministrar = document.getElementsByName('backAdministrar');
$divOptionsUpload = document.querySelector('#divOptionsUpload');

$irAdministrar.forEach(function (el) {
    el.addEventListener('click', verLayersUploaded);
});
$backAdministrar.forEach(function (el) {
    el.addEventListener('click', backLayersUploaded);
});

//Función para cambiar la sección a layers subidos por servicios o archivos
function verLayersUploaded() {
    $sectionService.classList.remove('displayBlock');
    $sectionFile.classList.remove('displayBlock');

    //Quitamos también los botones superiores
    $divOptionsUpload.classList.add('displayNone');
    $sectionUploaded.classList.add('displayBlock');
}
//Función para regresar al estado inicial de la sección
function backLayersUploaded() {
    $sectionUploaded.classList.remove('displayBlock');
    toggleSectionUpload(true);
}

const $modalListaWMS = document.querySelector('#modalListaWMS');
const $btnListaWMS = document.querySelector('#btnListaWMS');
$btnListaWMS.addEventListener('click', openModalListaWMS);

const $btnListaWFS = document.querySelector('#btnListaWFS');
$btnListaWFS.addEventListener('click', openModalListaWFS);

//Función para abrir el modal de Lista de WMS
function openModalListaWMS() {
    loadServicioExterno();
    $modalListaWMS.classList.toggle('displayBlock');
}

//Función para abrir el modal de Lista de WFS
function openModalListaWFS() {
    loadServicioExternoWFS();
    $modalListaWMS.classList.toggle('displayBlock');
}

var dataServicioExterno = '';
var template_row_externo = `<tr>
                                <td>ITEM_NRO</td>
                                <td>NOMB_EXTERNO</td>
                                <td>FUEN_EXTERNO</td>
                                <td>
                                    BUTTON_EXTERNO
                                </td>
                            </tr>`

//Función para cargar los WMS a la tabla
function loadServicioExterno() {
    fetch(URL_GET_SERVICIO_EXTERNO + '/0')
        .then(respServicioExterno => { return respServicioExterno.json(); })
        .then(respServicioExternoJSON => {
            dataServicioExterno = respServicioExternoJSON;
            if (dataServicioExterno !== null && dataServicioExterno !== undefined) {
                loadTablaServicioExterno(dataServicioExterno);
            }
        });
}

//Función para cargar los WFS a la tabla
function loadServicioExternoWFS() {
    fetch(URL_GET_SERVICIO_EXTERNO + '/0')
        .then(respServicioExterno => { return respServicioExterno.json(); })
        .then(respServicioExternoJSON => {
            dataServicioExterno = respServicioExternoJSON;
            if (dataServicioExterno !== null && dataServicioExterno !== undefined) {
                loadTablaServicioExterno(dataServicioExterno, 2);
            }
        });
}

const $tblServicioExterno = document.querySelector('#tablaWMS');
//Función que llena los registros a la tabla de WMS
function loadTablaServicioExterno(_data, _idTipoServicio = 1) {
    deleteRowsTable($tblServicioExterno);
    let i = 0;
    _data.forEach(function (el) {
        if (el.id_tiposervicio != _idTipoServicio) return;
        i += 1;
        let newRow = template_row_externo
            .replace(/ITEM_NRO/g, i.toString())
            .replace(/NOMB_EXTERNO/g, el.nombre)
            .replace(/FUEN_EXTERNO/g, el.fuente)
            .replace(/URL_EXTERNO/g, el.url)
            .replace(/TIPO_EXTERNO/g, el.tiposervicio)
            .replace(/ITEM_ID/g, el.id)
            .replace(/BUTTON_EXTERNO/g, (el.id_tiposervicio === 1) ? `<button data-id="${el.id}" class="button__secondary copy_url">Copiar</button>` : `<button data-id="${el.id}" class="button__secondary download_url">Descargar</button>`);

        $tblServicioExterno.insertAdjacentHTML('beforeend', newRow);
    });
    let $copyButtons = document.querySelectorAll('.copy_url');
    $copyButtons.forEach(function ($el) {
        $el.addEventListener('click', copyToClipboard);
    });
    let $downloadButtons = document.querySelectorAll('.download_url');
    $downloadButtons.forEach(function ($el) {
        $el.addEventListener('click', downloadWFS);
    });
}
const regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/

const $btnCargarService = document.querySelector('#btnCargarService');
//Agregamos el evento al botón cargar para leer los servicios externos
$btnCargarService.addEventListener('click', function () {

    let externalURL = $txtWMS.value;

    //Evaluamos si existe URL ingresada
    if (!regexp.test(externalURL)) {
        alertCustom('La URL ingresada no es válida.')
        return;
    }

    //Debemos evaluar el tipo de servicio seleccionado.
    if ($optTipoServicio.dataset.value === 'WMS')
        readWMS(externalURL);
    else if ($optTipoServicio.dataset.value === 'WFS')
        readWFS(externalURL);
    else {
        alertCustom('Debe especificar el tipo de servicio');
        return;
    }
})

$txtWMS = document.querySelector('#txtWMS');
// Función para copiar al portapapeles
function copyToClipboard() {
    let currentSelectedWMS = dataServicioExterno.find(i => i.id == this.dataset.id);
    if (currentSelectedWMS === undefined) return;

    let inputCopy = document.createElement('textarea');
    inputCopy.value = currentSelectedWMS.url;
    document.body.appendChild(inputCopy);
    inputCopy.select();
    inputCopy.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(inputCopy);
    alertCustom('Enlace copiado al portapapeles')

    $txtWMS.innerHTML = DOMPurify.sanitize(currentSelectedWMS.url);
    readWMS(currentSelectedWMS.url);
}

function downloadWFS() {
    let currentSelectedWMS = dataServicioExterno.find(i => i.id == this.dataset.id);
    if (currentSelectedWMS === undefined) return;

    window.open(currentSelectedWMS.url, '_blank').focus();
}

const $searchWMS = document.querySelector('#searchWMS');
$searchWMS.addEventListener('keyup', filterWMS);

function filterWMS() {
    let textFiltro = $searchWMS.value;
    if (textFiltro.length === 0 || textFiltro.trim() === '') loadServicioExterno(dataServicioExterno);
    else {
        textFiltro = textFiltro.toLowerCase()
            .replace('á', 'a')
            .replace('é', 'e')
            .replace('í', 'i')
            .replace('ó', 'o')
            .replace('ú', 'u');

        let dataFiltroWms = [];
        for (var i = 0; i < dataServicioExterno.length; i++) {
            let wmsObjectTemporal;
            wmsObjectTemporal = dataServicioExterno[i];
            if (wmsObjectTemporal.fuente_abreviado.toString().toLowerCase()
                .replace('á', 'a')
                .replace('é', 'e')
                .replace('í', 'i')
                .replace('ó', 'o')
                .replace('ú', 'u')
                .indexOf(textFiltro) >= 0
                ||
                wmsObjectTemporal.fuente.toLowerCase()
                    .replace('á', 'a')
                    .replace('é', 'e')
                    .replace('í', 'i')
                    .replace('ó', 'o')
                    .replace('ú', 'u').indexOf(textFiltro) >= 0) {
                dataFiltroWms.push(wmsObjectTemporal);
            }
        }

        //Llenar la tabla nuevamente
        loadTablaServicioExterno(dataFiltroWms);
    }
}

// MODAL DRAW
const $svgBorders = document.querySelectorAll('.draw__border');
$svgBorders.forEach(function ($el) {
    $el.addEventListener('click', borderSelected);
});

// Función que selecciona el borde de la paleta
function borderSelected() {
    $svgBorders.forEach(function ($el) {
        $el.classList.remove('draw__border--active');
    });
    this.classList.add('draw__border--active');
}

const $color__draw = document.querySelector('.color__draw');
const $buttonsColors = $color__draw.querySelectorAll('button');
$buttonsColors.forEach(function ($el) {
    $el.addEventListener('click', colorSelected);
});

// Función que selecciona el color de la paleta
function colorSelected() {
    $buttonsColors.forEach(function ($el) {
        $el.classList.remove('draw__color--active');
    });
    this.classList.add('draw__color--active');
}

// Template de la tabla de descarga
var template_row_capa_descarga = `<tr>
                                    <td>NOMB_CAPA</td>
                                    <td>
                                        <a href="DATA_URL" target="_blank" class="button__download">Descargar</a>
                                </td>
                            </tr>`

// Función que obtiene la capas disponible para descargar                            
function getCapaDescarga() {
    fetch(URL_GET_CAPA_DESCARGA)
        .then(respDownload => {
            return respDownload.json();
        })
        .then(respDownloadJSON => {
            let $tblTemporal = document.querySelector('#tablaDescarga');
            deleteRowsTable($tblTemporal);

            respDownloadJSON.forEach(function (el, it) {
                let newRow = template_row_capa_descarga
                    .replace(/ID_CAPA/g, el.id)
                    .replace(/DATA_URL/g, el.url_drive)
                    .replace(/NOMB_CAPA/g, el.nombre_capa);

                $tblTemporal.insertAdjacentHTML('beforeend', newRow);
            })

            if (codSubsistemaCurrent === 'A00002' || codSubsistemaCurrent === 'A00027') buildButtonsPIPParalizados();
        });
}

// Función para eliminar las filas del body de una tabla
function deleteRowsTable(_$table) {

    let $bodyTemporal = _$table.querySelectorAll('tbody')
    $bodyTemporal.forEach(function ($el) {
        while ($el.hasChildNodes()) {
            $el.removeChild($el.firstChild);
        }
    });
}

function buildButtonsPIPParalizados() {
    let $tblTemporal = document.querySelector('#tablaDescarga').parentElement;
    $tblTemporal.insertAdjacentHTML('beforeend', `  <div class="pipp__content">
                                                        <div class="pipp__head">
                                                            <span>Descarga lista de PIP Paralizados</span>
                                                        </div>
                                                        <div class="pipp__body">
                                                            <a target="_blank" href="https://cdn.geoperu.gob.pe/visor/descargas/proyectos/pip_gn_paralizado.xlsx">Nacional</a>
                                                            <a target="_blank" href="https://cdn.geoperu.gob.pe/visor/descargas/proyectos/pip_gr_paralizado.xlsx">Regional</a>
                                                            <a target="_blank" href="https://cdn.geoperu.gob.pe/visor/descargas/proyectos/pip_gl_paralizado.xlsx">Local</a>
                                                        </div>
                                                    </div>
    `)

    toggleOptionReport('000000', false);
    $btnReporteObservaciones.classList.remove('displayNone');
    $btnReporteObservaciones.classList.add('displayBlock');
}


// INIT CUSTOM

const $btnOpenAllCustom = document.querySelector('#btnOpenAllCustom');
$btnOpenAllCustom.addEventListener('click', toggleModalCustomList);
const $modalListaCustom = document.querySelector('#modalListaCustom');
const $btnSaveCustom = document.querySelector('#btnSaveCustom');
$btnSaveCustom.addEventListener('click', saveCollection);
const $txtCustom = document.querySelector('#txtCustom');
const $btnClearCustomList = document.querySelector('#btnClearCustomList');
$btnClearCustomList.addEventListener('click', clearAllCollection);
const layersCustom = 'customGeoPeru';

//Función que guarda la colección
async function saveCollection() {
    //Extraemos el nombre de la colección
    let idCustom = generateUUID();
    let nombreCustom = $txtCustom.value;
    if (nombreCustom.length <= 0) {
        alertCustom('Por favor ingrese un nombre.')
        return;
    }
    let customCollectionStr = localStorage.getItem(layersCustom);
    if (customCollectionStr === null)
        customCollectionStr = '';
    let customCollection = [];
    let flagCollection = false;
    if (customCollectionStr !== null) {
        customCollection = customCollectionStr.split('|');

        customCollection.forEach(function (item) {
            let itemCollection = item.split(';');
            if (itemCollection[0] === nombreCustom) {
                alertCustom('El nombre especificado ya existe.')
                flagCollection = true;
            }
        });

        if (flagCollection)
            return;
    }
    let fechaCustom = new Date().getDate() + '/' + (parseInt(new Date().getMonth()) + 1).toString() + '/' + new Date().getFullYear();
    let capasSeleccionadas = await getLayersSelected();
    let customCurrent = `${nombreCustom};${capasSeleccionadas};${fechaCustom};${idCustom}|`
    localStorage.setItem(layersCustom, customCollectionStr + customCurrent);

    alertCustom('El mapa se ha guardado en su colección');
    $txtCustom.value = '';

    if (!$modalListaCustom.classList.contains('displayBlock'))
        $modalListaCustom.classList.add('displayBlock');
    verCollection();
}

//Función para guardar los layers seleccionados
async function getLayersSelected(_separator = ',') {

    let layersChecked = '';
    //Extraemos las capas dependiendo de la resolución
    let $layersInput = document.getElementsByName('checkbox')
    $layersInput.forEach(function (el) {
        if (el.checked)
            layersChecked += el.dataset.name + '&' + el.id + _separator;
    });

    return layersChecked;
}

//Función para eliminar un mapa personalizado
function deleteCustomMap() {
    let currentCustomId = this.parentElement.id;

    //Lo eliminamos del objeto
    let customCollectionStr = localStorage.getItem(layersCustom);
    if (customCollectionStr === null)
        customCollectionStr = '';
    let customCollection = [];
    let customCollectionNew = '';
    if (customCollectionStr !== null) {
        customCollection = customCollectionStr.split('|');
        customCollection.forEach(function (item) {
            let itemCollection = item.split(';');
            if (itemCollection[3] !== currentCustomId.replace('collection_', '')) {
                customCollectionNew += (item + '|');
            }
        });
        localStorage.setItem(layersCustom, customCollectionNew);
    }

    verCollection();
}

//Función para generar un ID
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

//Función para ver la colección de mapas personalizados
async function verCollection() {

    let $div__custom = document.querySelector('.div__custom');
    $div__custom.innerHTML = '';

    let template = `<div class="collection__group" id="COLLECTION_ID" data-code="CODE_CUSTOM">
                    <div class="collection__image">
                        <img alt="" src="images/options/map_satelital.png">
                    </div>
                    <div class="collection__description"  data-code="CODE_CUSTOM">
                        <span class="collection__title">Nombre: </span>
                        <span class="collection__content" id="nameCollection">NAME_CUSTOM</span><br />
                        <span class="collection__title">Fecha de guardado: </span>
                        <span class="collection__content">DATE_CUSTOM</span><br />
                        <span class="collection__title">Capas que contiene: </span><br />
                        <div class="collection__list">
                            LIST_CUSTOM_COLLECTION
                        </div>
                    </div>
                    <svg width="24" height="24" viewBox="0 0 12 15" fill="none" class="collection__delete">
                        <path d="M10 4.66669H2V14H10V4.66669Z" fill="#E0E0E0" stroke="#545454" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6.20337 6.22363V12.2156" stroke="#545454" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3.8053 6.22363V12.2156" stroke="#545454" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8.60193 6.22363V12.2156" stroke="#545454" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.6667 2.66669H1.33337V4.66669H10.6667V2.66669Z" fill="#E0E0E0" stroke="#545454" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7.33329 1.33331H4.66663V2.66665H7.33329V1.33331Z" fill="#E0E0E0" stroke="#545454" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    </div>`

    let customCollectionStr = localStorage.getItem(layersCustom);
    if (customCollectionStr === null)
        customCollectionStr = '';
    let customCollection = [];
    if (customCollectionStr !== null) {
        customCollection = customCollectionStr.split('|');

        let customCode = 0;
        customCollection.forEach(function (item) {
            customCode++;
            // customCode = generateUUID();
            if (item === '') return;
            let itemCollection = item.split(';');
            if (itemCollection.length > 1) {
                let customCodeCollection = `collection_${itemCollection[3]}`
                let nameCustom = itemCollection[0];
                let layersCollection = itemCollection[1].split(',');
                let dateCustom = itemCollection[2];

                let layersAlias = [];
                let layersCode = '';
                layersCollection.forEach(function (lyr) {
                    if (lyr === null) return;
                    if (lyr === undefined) return;
                    if (lyr === '') return;

                    let temporalLayer = lyr.split('&');
                    if (temporalLayer.length > 0) {
                        layersAlias.push(temporalLayer[0]);
                        layersCode += temporalLayer[1] + ','
                    }
                });
                let listCustom = '';
                layersAlias.forEach(function (alias) {
                    listCustom += `<span class="collection__content">${alias}</span><br />`
                })


                let template_custom = template.replace(/COLLECTION_ID/g, customCodeCollection)
                    .replace(/NAME_CUSTOM/g, nameCustom)
                    .replace(/DATE_CUSTOM/g, dateCustom)
                    .replace(/CODE_CUSTOM/g, layersCode)
                    .replace(/LIST_CUSTOM_COLLECTION/g, listCustom)
                $div__custom.insertAdjacentHTML('beforeend', template_custom);

                let currentCustom = document.getElementById(customCodeCollection);
                let currentCustomDelete = currentCustom.querySelector('.collection__delete');
                currentCustomDelete.addEventListener('click', deleteCustomMap);
            }
        });

        let allCollection__group = document.querySelectorAll('.collection__group');
        allCollection__group.forEach(function (el) {
            el.addEventListener('click', customMapSelected);
        })
    }
}

//Función que se ejecuta al seleccionar un mapa personalizado
function customMapSelected() {
    alertCustom('Espere unos segundos por favor.');
    switchLoader(true);
    let allLayersChecked = document.getElementsByName('checkbox');
    allLayersChecked.forEach(function ($el) {
        if ($el.checked) {
            $el.checked = false;
            toggleStateCheckLayer($el);
        }
    })

    addLayerFromCustomMap(this.dataset.code)
    switchLoader(false);
    alertCustom('Mapa cargado.');

    if (window.matchMedia('(max-width: 767px)').matches) {
        //Si es móvil, cerramos los modales
        if ($modalListaCustom.classList.contains('displayBlock'))
            $modalListaCustom.classList.remove('displayBlock');

        if ($modalCustom.classList.contains('displayBlock'))
            $modalCustom.classList.remove('displayBlock')
    }
}

//Función que agrega los layers de un custom map
function addLayerFromCustomMap(_layers) {
    let allLayersFromCustom = _layers.split(',');
    allLayersFromCustom.forEach(function (el) {
        if (el.length === 0) return;
        let $chkLayerStr = document.getElementById(el);
        $chkLayerStr.checked = true;
        toggleStateCheckLayer($chkLayerStr);
    });
}

// Función que abre/cierra el modal de mapas personalizados
function toggleModalCustomList() {
    $modalListaCustom.classList.toggle('displayBlock');
    if ($modalListaCustom.classList.contains('displayBlock'))
        verCollection();
}

// Función para eliminar toda la colección de mapas
function clearAllCollection() {
    localStorage.setItem(layersCustom, '');
    verCollection();
    alertCustom('Se ha limpiado la lista de mapas personalizados.');
}

// END CUSTOM

const $optSizePrint = document.querySelector('#optSizePrint');
const $optOrientationPrint = document.querySelector('#optOrientationPrint');
const $optQualityPrint = document.querySelector('#optQualityPrint');
const $optMarginPrint = document.querySelector('#optMarginPrint');
const $optEscalePrint = document.querySelector('#optEscalePrint');

//Llamamos la función para traer las opciones de impresión
getOptionsPrint();

//Función que llena las opciones de impresión
function getOptionsPrint() {
    addOptionToControl('size', $optSizePrint);
    addOptionToControl('orientation', $optOrientationPrint)
    addOptionToControl('quality', $optQualityPrint);
    addOptionToControl('margin', $optMarginPrint);
    addOptionToControl('escale', $optEscalePrint);
}

//Función para agregar opciones del control de impresión
function addOptionToControl(_type, _$control) {
    let optionsCurrentPrint = PRINT_OPTIONS.filter(i => i.type === _type);
    optionsCurrentPrint.forEach(function (el) {
        if (el.estado === 1) {
            let currentOption = `<span data-id="${el.id}" class="print__option">${el.description}</span>`;
            _$control.insertAdjacentHTML('beforeend', currentOption);

            if (el.default) {
                _$control.dataset.value = el.id;
                let $currentButtonParent = document.getElementById(_$control.id.replace('opt', 'btn'));
                let $spanCurrentSelected = $currentButtonParent.querySelector('span');
                $spanCurrentSelected.textContent = el.description;
            }
        }
    });
}


$btnSizePrint = document.querySelector('#btnSizePrint');
$btnOrientationPrint = document.querySelector('#btnOrientationPrint');
$btnQualityPrint = document.querySelector('#btnQualityPrint');
$btnMarginPrint = document.querySelector('#btnMarginPrint');
$btnEscalePrint = document.querySelector('#btnEscalePrint');

$btnSizePrint.addEventListener('click', openOptionsPrint);
$btnOrientationPrint.addEventListener('click', openOptionsPrint);
$btnQualityPrint.addEventListener('click', openOptionsPrint);
$btnMarginPrint.addEventListener('click', openOptionsPrint);
$btnEscalePrint.addEventListener('click', openOptionsPrint);

//Función que despliega las opciones de la impresión según sea el botón pulsado
function openOptionsPrint() {
    let modalOptionCurrent = this.id.replace('btn', 'opt');
    let $controlOptionCurrent = document.getElementById(modalOptionCurrent);
    closeAllOptionsPrint();

    $controlOptionCurrent.classList.add('displayBlock');
}

//Función que cierra todos las opciones de impresión
function closeAllOptionsPrint() {
    $optSizePrint.classList.remove('displayBlock');
    $optOrientationPrint.classList.remove('displayBlock');
    $optQualityPrint.classList.remove('displayBlock');
    $optMarginPrint.classList.remove('displayBlock');
    $optEscalePrint.classList.remove('displayBlock');
}

const $optsSizePrint = document.querySelectorAll('.print__option');
$optsSizePrint.forEach(function ($el) {
    $el.addEventListener('click', selectedOptionPrint)
});

//Método para seleccionar la opción de impresión
function selectedOptionPrint() {
    let optionSelectedCurrent = this.dataset.id;
    let $currentParent = document.getElementById(this.parentElement.id);
    let $currentButtonParent = document.getElementById(this.parentElement.id.replace('opt', 'btn'));
    let $spanCurrentSelected = $currentButtonParent.querySelector('span');
    $currentParent.dataset.value = optionSelectedCurrent;
    $spanCurrentSelected.textContent = this.textContent;
    $currentParent.classList.remove('displayBlock');
}

const $textURLCompartir = document.querySelector('#textURLCompartir');
const $btnCopyShare = document.querySelector('#btnCopyShare');
$btnCopyShare.addEventListener('click', copyToShare);

//Función para obtener todas las variables del mapa
function getAllPropertiesMap() {

    //Extraemos las capas
    let layersChecked = '';
    let $layersInput = [];

    $layersInput = document.getElementsByName('checkbox')
    $layersInput.forEach(function (el) {
        if (el.checked) {
            layersChecked += el.id.replace('chkLayer_', '') + ',';
        }
    });

    //Extraemos el mapa base
    let mapabaseCurrent = (currentMapaBase === undefined) ? 0 : currentMapaBase;

    //Extraemos el centro
    let centerCurrent = map.getCenter();

    //Extraemos el nivel de zoom
    let zoomLevelCurrent = map.getZoom();

    let urlAttributes = `&base=${mapabaseCurrent}&lat=${centerCurrent.lat}&lng=${centerCurrent.lng}&zoom=${zoomLevelCurrent}&layers=${layersChecked}`
    let currentUrl = window.location.href.replace('#', '');
    currentUrl = currentUrl.indexOf('?') > 0 ? currentUrl : `${currentUrl}?`

    urlShare = `${DOMPurify.sanitize(currentUrl + '' + urlAttributes)}`;
    $textURLCompartir.innerHTML = urlShare;
    return urlShare;
}

// Función para copiar la URL para compartir
function copyToShare() {
    let inputCopy = document.createElement('textarea');
    inputCopy.value = $textURLCompartir.value;
    document.body.appendChild(inputCopy);
    inputCopy.select();
    inputCopy.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(inputCopy);
    alertCustom('Enlace copiado al portapapeles')
}

// const URL_PROXY = 'https://geocors.herokuapp.com/';
//const URL_PROXY = 'https://proxy.geoperu.gob.pe/';
const $capasUploaded = document.querySelector('#capasUploaded');

//Función para cargar un WMS
var allWMSExternal = {};
async function readWMS(_url) {
    //Evaluamos si la URL contiene lo necesario para considerarse un WMS
    // if (_url.toLowerCase().indexOf('service=wms') < 0 || _url.toLowerCase().indexOf('&request=GetCapabilities') < 0) {
    //     alertCustom('La URL especificada no es considerada un WMS').
    //         return;
    // }
    strUrl = '' + _url;
    if (strUrl.indexOf('?') <= 0) strUrl += '?';
    if (strUrl.toLowerCase().indexOf('service=wms') <= 0) strUrl += '&service=WMS';
    if (strUrl.toLowerCase().indexOf('request=getcapabilities') <= 0) strUrl += '&request=GetCapabilities';

    switchLoader(true);

    try {
        let urlSSL = strUrl.indexOf('https') >= 0 ? true : false;
        //let urlProxy = urlSSL ? strUrl : `${URL_PROXY}${strUrl}`

        let respURL = await fetch(strUrl, { method: 'GET' })
        let respURLText = await respURL.text();
        let respURLXML = (new window.DOMParser()).parseFromString(respURLText, 'text/xml')

        let strAllLayer = '';
        let xmlPadre = respURLXML.querySelector('Layer')
        let layersWMS = xmlPadre.getElementsByTagName('Layer');

        for (var i = 0; i < layersWMS.length; i++) {
            if (layersWMS[i] === undefined) continue;
            if (layersWMS[i] === null) continue;

            let tagNameLayer = layersWMS[i].getElementsByTagName('Name')[0].textContent;
            let tagTitleLayer = layersWMS[i].getElementsByTagName('Title')[0].textContent;
            let tagStyleLayer = layersWMS[i].getElementsByTagName('Style')[0];

            if (tagNameLayer === undefined) continue;
            if (tagTitleLayer === undefined) tagTitleLayer = tagNameLayer;

            if (tagStyleLayer === undefined) continue;
            if (tagStyleLayer.getElementsByTagName('OnlineResource')[0] === undefined) continue;
            let tagLegendLayer = tagStyleLayer.getElementsByTagName('OnlineResource')[0].getAttribute('xlink:href');

            if (!urlSSL) tagLegendLayer = tagLegendLayer.replace('https', 'http').replace(':443', '');

            if (tagNameLayer === 'default' || tagNameLayer === 'Raster') continue;

            strAllLayer += tagNameLayer + '|' + tagTitleLayer + '|' + tagLegendLayer + ',';
        };

        if (strAllLayer.length > 0) {

            //Formateamos la variable
            strAllLayer = strAllLayer.replace('MS,', '');
            strAllLayer = strAllLayer.substring(0, strAllLayer.length - 1);

            //Con las capas depuradas debemos recorrer para crear el control y ponerlos en un objeto.
            let arrayLayers = strAllLayer.split(',');
            for (var i = 0; i < arrayLayers.length; i++) {
                let currentCapaWMS = arrayLayers[i].split('|');
                let idCurrentCapaWMS = currentCapaWMS[0].toString().replace(':', '_');
                let nameCurrentCapaWMS = currentCapaWMS[1].toString().replace(':', '_');
                let urlLegendCapaWMS = currentCapaWMS[2].toString().replace(':', '_');

                // Get the size of an object
                var cantElementos = Object.getOwnPropertyNames(allWMSExternal).length;
                let identificador = cantElementos.toString();

                //Verificamos si existe en el Objeto
                if (allWMSExternal[identificador] != undefined)
                    continue;

                //Agregamos una nueva propiedad al objeto
                let urlExternalService = _url.substr(0, _url.indexOf('?'));
                //let urlCurrentService = urlExternalService.indexOf('https') ? urlExternalService : `${URL_PROXY}${urlExternalService}`
                Object.defineProperty(allWMSExternal, identificador, {
                    value: L.tileLayer.betterWms(`${urlExternalService}`, { layers: idCurrentCapaWMS, format: 'image/png', transparent: true, version: '1.0', crs: L.CRS.EPSG4326, opacity: 1.0, pane: 'defaultPane', nombre: nameCurrentCapaWMS, urlLegend: urlLegendCapaWMS })
                });
                let controlIdTemporal = `WMSTemporal_${identificador}`;
                let currentControlCheck = ` <div>
                                        <input class="checkbox__class" type="checkbox" name="WMS" id="${controlIdTemporal}" data-source="${idCurrentCapaWMS}" data-id="${identificador}">
                                        <label class="label__checkbox" for=${controlIdTemporal}>${nameCurrentCapaWMS}</label>                                   
                                    </div><br />`
                $capasUploaded.insertAdjacentHTML('beforeend', currentControlCheck);

                //Agregamos el evento del nuevo control al ser checkeado
                alertCustom('Servicio cargado');
                let $controlTemporal = document.querySelector('#' + controlIdTemporal);
                $controlTemporal.addEventListener('change', toggleCheckExterno);
                verLayersUploaded();
            }
        }
        switchLoader(false);
    } catch (error) {
        alertCustom('No se ha podido leer el WMS');
        console.log(error);
        switchLoader(false);
    }
}

//Función para cargar un WFS
var allWFSExternal = {};
async function readWFS(_url) {
    //Evaluamos si la URL contiene lo necesario para considerarse un WMS
    if (_url.toLowerCase().indexOf('service=wfs') < 0 || _url.toLowerCase().indexOf('&request=GetCapabilities') < 0) {
        alertCustom('La URL especificada no es considerada un WFS').
            return;
    }
    switchLoader(true);
    try {
        let urlSSL = _url.indexOf('https') > 0 ? true : false;
        //let urlProxy = urlSSL ? _url : `${URL_PROXY}${_url}`

        let respURL = await fetch(_url, { method: 'GET' })
        let respURLText = await respURL.text();
        let respURLXML = (new window.DOMParser()).parseFromString(respURLText, 'text/xml')

        let strAllLayer = '';
        let layersWFS = respURLXML.getElementsByTagName('FeatureType');

        for (var i = 0; i < layersWFS.length; i++) {
            let wsNameStr = '';
            let wsWFS = '', nameWFS = '', titleWFS = '', descriptionWFS = '';
            wsNameStr = (layersWFS[i].getElementsByTagName('Name')[0] !== undefined) ? layersWFS[i].getElementsByTagName('Name')[0].textContent : '';
            wsWFS = (wsNameStr.split(':')[0] !== undefined) ? wsNameStr.split(':')[0] : '';
            nameWFS = (wsNameStr.split(':')[1] !== undefined) ? wsNameStr.split(':')[1] : '';
            titleWFS = (layersWFS[i].getElementsByTagName('Title')[0] !== undefined) ? layersWFS[i].getElementsByTagName('Title')[0].textContent : '';
            descriptionWFS = (layersWFS[i].getElementsByTagName('Abstract')[0] !== undefined) ? layersWFS[i].getElementsByTagName('Abstract')[0].textContent : '';

            strAllLayer += wsWFS + '|' + nameWFS + '|' + titleWFS + '|' + descriptionWFS + '&&';
        }

        if (strAllLayer.length > 0) {

            //Formateamos la variable
            strAllLayer = strAllLayer.substring(0, strAllLayer.length - 1);

            //Con las capas depuradas debemos recorrer para crear el control y ponerlos en un objeto.
            let arrayLayers = strAllLayer.split('&&');
            for (var i = 0; i < arrayLayers.length; i++) {
                let currentCapaWMS = arrayLayers[i].split('|');
                let idCurrentCapaWFS = `${currentCapaWMS[0]}__${currentCapaWMS[1]}`
                let nameCurrentCapaWMS = currentCapaWMS[2];
                let titleCurrentCapaWMS = currentCapaWMS[3];

                Object.defineProperty(allWFSExternal, idCurrentCapaWFS, {
                    value: new L.WFS({
                        url: _url.indexOf('espacialg.geoperu.gob.pe') < 0 ? `${_url.substr(0, _url.indexOf('?') + 1)}` : `${_url.substr(0, _url.indexOf('?') + 1)}`,
                        // _url.indexOf('espacialg.geoperu.gob.pe') < 0 ? `${_url.substr(0, _url.indexOf('?') + 1)}` : `${URL_PROXY}${_url.substr(0, _url.indexOf('?') + 1)}`,
                        typeNS: currentCapaWMS[0],
                        typeName: currentCapaWMS[1],
                        crs: L.CRS.EPSG4326,
                        geometryField: 'Shape',
                        pane: 'defaultPane',
                        opacity: 1,
                        showExisting: true,
                        style: function (layer) {
                            return {
                                color: 'black',
                                weight: 1
                            }
                        },
                        nombre: nameCurrentCapaWMS,
                        urlLegend: `${_url.substr(0, _url.indexOf('?') + 1)}service=WMS&request=GetLegendGraphic&format=image/png&width=20&height=20&layer=${idCurrentCapaWFS.replace('__', ':')}`
                    })

                });
                let controlIdTemporal = `WFSTemporal_${idCurrentCapaWFS}`;
                let currentControlCheck = ` <div class="layers__wfs">
                                                <input class="checkbox__class" type="checkbox" name="WFS" id="${controlIdTemporal}" data-source="${idCurrentCapaWFS}" data-id="${idCurrentCapaWFS}">
                                                <label class="label__checkbox" for=${controlIdTemporal} title="${titleCurrentCapaWMS}">${nameCurrentCapaWMS}</label>                                   
                                                <img alt="Descargar" src="./images/options/download.svg" >
                                            </div><br />`
                $capasUploaded.insertAdjacentHTML('beforeend', currentControlCheck);

                //Agregamos el evento del nuevo control al ser checkeado
                alertCustom('Servicio cargado');
                let $controlTemporal = document.querySelector('#' + controlIdTemporal);
                $controlTemporal.addEventListener('change', toggleCheckExterno);
                verLayersUploaded();
            }
            switchLoader(false);
        }
        else {
            alertCustom('No se han encontrado capas válidas para ser cargadas');
            return;
        }
        switchLoader(false);

    } catch (error) {
        alertCustom('No se ha podido leer el WMS');
        console.log(error);
        switchLoader(false);
    }
}

const $lblFileExternal = document.querySelector('#lblFileExternal');
const $txtFileExternal = document.querySelector('#txtFileExternal');
const $fileExternal = document.querySelector('#fileExternal');
const $btnCargarUpload = document.querySelector('#btnCargarUpload');

$lblFileExternal.addEventListener('click', () => {
    let currentOptionSelected = $optTipoArchivo.dataset.value;
    if (currentOptionSelected === undefined || currentOptionSelected === null || currentOptionSelected === '-1') {
        alertCustom('Elija el tipo de archivo a cargar.');
        return;
    }
    $fileExternal.click();
})
$fileExternal.addEventListener('change', uploadExternalFile);

function uploadExternalFile() {
    let currentFile = this.files[0];

    if (currentFile === undefined) return;
    if (currentFile === null) return;

    $txtFileExternal.value = currentFile.name;
}

$btnCargarUpload.addEventListener('click', loadExternalFile);
//Función para cargar el archivo extenro
function loadExternalFile() {
    let currentFile = $fileExternal.files[0];

    let fileSizeMB = currentFile / 1024 / 1024
    if (fileSizeMB > 15) {
        alertCustom('El archivo es muy pesado. El límite es 15MB');
        return;
    }

    let tipoFile = $optTipoArchivo.dataset.value;

    switch (tipoFile) {
        case '1':
            readShape(currentFile);
            break;

        case '2':
            readGeojson(currentFile);
            break;

        case '3':
            readKml(currentFile);
            break;

        case '4':
            readCsv(currentFile);
            break;

        default:
            alertCustom('Tipo de archivo no permitido.')
            return;
    }
}

var allShapeExternal = {};
// Función para leer el Shape
async function readShape(_file) {
    var reader = new FileReader();
    reader.onload = function () {

        let controlIdTemporal = `${_file.name.substr(0, _file.name.indexOf('.'))}`;
        let buffer = reader.result;
        shp(buffer).then(function (jsonShape) {

            let objectShapeTemporal = L.shapefile(jsonShape, {
                onEachFeature: function (_feature, _layer) {
                    if (_feature.properties) {
                        _layer.bindPopup(Object.keys(_feature.properties).map(function (_k) {
                            return _k + ": " + _feature.properties[_k];
                        }).join('<br />'), {
                            maxHeight: 200
                        });
                    }
                }
            });

            Object.defineProperty(allShapeExternal, controlIdTemporal, {
                value: objectShapeTemporal, checked: false
            });

            let currentControlCheck = ` <div>
                                            <input class="checkbox__class" type="checkbox" name="SHAPE" id="${controlIdTemporal}" data-source="${controlIdTemporal}" data-id="${controlIdTemporal}">
                                            <label class="label__checkbox" for=${controlIdTemporal}>${controlIdTemporal}</label>                                   
                                        </div><br />`
            $capasUploaded.insertAdjacentHTML('beforeend', currentControlCheck);

            //Agregamos el evento del nuevo control al ser checkeado
            alertCustom('Servicio cargado');
            let $controlTemporal = document.querySelector('#' + controlIdTemporal);
            $controlTemporal.addEventListener('change', toggleCheckExterno);
            verLayersUploaded();
        });
    }

    reader.readAsArrayBuffer(_file);
}

var iconCustonGJ = '';
function createCustomIcon(feature, latlng) {

    let myIcon = L.icon({
        iconUrl: iconCustonGJ,
        iconSize: [25, 25], // width and height of the image in pixels
        shadowSize: [35, 20], // width, height of optional shadow image
        iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
        shadowAnchor: [12, 6],  // anchor point of the shadow. should be offset
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
    })
    return L.marker(latlng, { icon: myIcon })
}

let myLayerOptions = {
    pointToLayer: createCustomIcon
}


// function createCustomIconUrl(feature, latlng) {
//     let myIcon = L.icon({
//         iconUrl: './css/leaflet/images/marker-icon.svg',
//         iconSize: [25, 25], // width and height of the image in pixels
//         shadowSize: [35, 20], // width, height of optional shadow image
//         iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
//         shadowAnchor: [12, 6],  // anchor point of the shadow. should be offset
//         popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
//     })
//     return L.marker(latlng, { icon: myIcon })
// }

// let myLayerOptionsIcon = {
//     pointToLayer: createCustomIconUrl()
// }

var allJsonExternal = {};
// Función para leer el GeoJson
async function readGeojson(_file) {
    var reader = new FileReader();
    reader.onload = function () {
        let geojsonText = reader.result;
        let controlIdTemporal = `${_file.name.substr(0, _file.name.indexOf('.'))}`;
        let oGeoJSON = JSON.parse(geojsonText);
        if (oGeoJSON.features[0].properties.tipo_costo !== undefined) {
            Object.defineProperty(allJsonExternal, controlIdTemporal, {
                value: L.geoJson(oGeoJSON,
                    {
                        onEachFeature: function (feature, layer) {
                            if (feature.properties) {
                                layer.bindPopup(Object.keys(feature.properties).map(function (k) {
                                    return k + ": " + feature.properties[k];
                                }).join("<br />"), {
                                    maxHeight: 200
                                });
                            }
                        },
                        pointToLayer: createCustomIcon
                    }
                )
            });
        }
        else {
            Object.defineProperty(allJsonExternal, controlIdTemporal, {
                value: L.geoJson(oGeoJSON,
                    {
                        onEachFeature: function (feature, layer) {
                            if (feature.properties) {
                                layer.bindPopup(Object.keys(feature.properties).map(function (k) {
                                    return k + ": " + feature.properties[k];
                                }).join("<br />"), {
                                    maxHeight: 200
                                });
                            }
                        }
                    }
                )
            });
        }


        let currentControlCheck = ` <div>
                                        <input class="checkbox__class" type="checkbox" name="JSON" id="${controlIdTemporal}" data-source="${_file.name}" data-id="${controlIdTemporal}">
                                        <label class="label__checkbox" for=${controlIdTemporal}>${_file.name}</label>                                   
                                    </div><br />`
        $capasUploaded.insertAdjacentHTML('beforeend', currentControlCheck);

        //Agregamos el evento del nuevo control al ser checkeado
        alertCustom('Servicio cargado');
        let $controlTemporal = document.querySelector('#' + controlIdTemporal);
        $controlTemporal.addEventListener('change', toggleCheckExterno);
        verLayersUploaded();
    }
    reader.readAsText(_file);
}

var allKmlExternal = {};
// Función para leer el KML
async function readKml(_file) {
    var reader = new FileReader();
    reader.onload = function () {
        let controlIdTemporal = `${_file.name.substr(0, _file.name.indexOf('.'))}`;
        let kmltext = reader.result;
        let parser = new DOMParser();

        //Obtenemos la posición en caso tenga íconos por defecto
        let intiIcon = kmltext.indexOf('<Icon>');
        let endIcon = kmltext.indexOf('</Icon>');
        let endKml = kmltext.indexOf('</kml>')

        //Debemos eliminar si tiene ícono por defecto
        if (intiIcon > 0 && endIcon > 0 && endKml > 0)
            kmltext = kmltext.substr(0, intiIcon) + '' + kmltext.substr(endIcon, kmltext.indexOf('</kml>')).replace('</Icon>', '');

        //Reemplazamos las etiquetas grandes por etiquetas más pequeñas
        let kml = parser.parseFromString(kmltext.replace('<h2>', '<h5>').replace('</h2>', '</h5>'), 'text/xml');

        let layerKmlTemporal = new L.KML(kml, { icon: '../css/leaflet/images/marker-icon.png' });

        Object.defineProperty(allKmlExternal, controlIdTemporal, {
            value: layerKmlTemporal
        });

        let currentControlCheck = ` <div>
                                    <input class="checkbox__class" type="checkbox" name="KML" id="${controlIdTemporal}" data-source="${_file.name}" data-id="${controlIdTemporal}">
                                    <label class="label__checkbox" for=${controlIdTemporal}>${_file.name}</label>                                   
                                </div><br />`
        $capasUploaded.insertAdjacentHTML('beforeend', currentControlCheck);

        //Agregamos el evento del nuevo control al ser checkeado
        alertCustom('Servicio cargado');
        let $controlTemporal = document.querySelector('#' + controlIdTemporal);
        $controlTemporal.addEventListener('change', toggleCheckExterno);
        verLayersUploaded();
    }
    reader.readAsText(_file);
}

var allCsvExternal = {};
// Función para leer el CSV
async function readCsv(_file) {
    var reader = new FileReader();
    var csv = L.geoCsv(null, {
        firstLineTitles: true,
        onEachFeature: function (feature, layer) {
            var popup = '';
            for (var clave in feature.properties) {
                var title = csv.getPropertyTitle(clave);
                popup += '<b>' + title + '</b><br />' + feature.properties[clave] + '<br /><br />';
            }
            layer.bindPopup(popup);
        }
    });
    reader.onload = function () {
        let controlIdTemporal = `${_file.name.substr(0, _file.name.indexOf('.'))}`;
        var csv_string = reader.result;
        // var cluster = new L.MarkerClusterGroup();
        let lngValid = csv_string.indexOf('lng') > 0 ? true : false;
        let latValid = csv_string.indexOf('lat') > 0 ? true : false;

        //Si no tenemos coordendas geográficas, buscamos las coordenadas UTM
        if (!lngValid || !latValid) {
            //Tomaremos fila por fila y tomaremos los valores UTM por Lat y Lng
            let pos_x = -1, pos_y = -1, por_z = -1;
            let pos_lng = -1, pos_lat = -1;
            var csv_array = csv_string.split("\n");
            var csv_modified = '';
            for (var i = 0; i < csv_array.length; i++) {
                if (csv_array[i] === undefined) continue;
                if (csv_array[i] === "") continue;

                let row_csv = csv_array[i].split(';');
                pos_lng = row_csv.length;
                pos_lat = row_csv.length + 1;

                //Como es cabecera, verificamos la posición de las variables UTM
                if (i === 0) {
                    for (var j = 0; j < row_csv.length; j++) {
                        switch (row_csv[j]) {
                            case 'x': pos_x = j; break;
                            case 'y': pos_y = j; break;
                            case 'zona': pos_z = j; break;
                        }
                    }

                    row_csv[pos_lng] = 'lng';
                    row_csv[pos_lat] = 'lat';
                    csv_modified = row_csv.join(';');
                }
                else {
                    try {
                        let coord_x = 0, coord_y, zona = 0;
                        coord_x = parseInt(row_csv[pos_x]);
                        coord_y = parseInt(row_csv[pos_y]);
                        zona = parseInt(row_csv[pos_z]);
                        let item = L.utm({ x: coord_x, y: coord_y, zone: zona, band: 'M' });
                        let coord = item.latLng();
                        row_csv[pos_lng] = coord.lng;
                        row_csv[pos_lat] = coord.lat;

                        csv_modified += '\n';
                        csv_modified += row_csv.join(';');

                    } catch (error) {
                        console.log(`Error: No se pudo obtener las coordenadas.`);
                        return;
                    }
                }
            }
            csv_string = csv_modified;
        }
        csv.addData(csv_string);

        Object.defineProperty(allCsvExternal, controlIdTemporal, {
            value: csv
        })

        let currentControlCheck = ` <div>
                                        <input class="checkbox__class" type="checkbox" name="CSV" id="${controlIdTemporal}" data-source="${_file.name}" data-id="${controlIdTemporal}">
                                        <label class="label__checkbox" for=${controlIdTemporal}>${_file.name}</label>                                   
                                    </div><br />`
        $capasUploaded.insertAdjacentHTML('beforeend', currentControlCheck);

        //Agregamos el evento del nuevo control al ser checkeado
        alertCustom('Servicio cargado');
        let $controlTemporal = document.querySelector('#' + controlIdTemporal);
        $controlTemporal.addEventListener('change', toggleCheckExterno);
        verLayersUploaded();
    }
    reader.readAsText(_file);
}

//Función que se activa al hacer click sobre una capa externa (Modal Upload)
function toggleCheckExterno() {

    let idExternalLayer = this.dataset.id;
    let currentLayerExternal = {};
    if (this.name === 'WMS')
        currentLayerExternal = allWMSExternal[idExternalLayer];
    else if (this.name === 'WFS')
        currentLayerExternal = allWFSExternal[idExternalLayer];
    else if (this.name === 'JSON')
        currentLayerExternal = allJsonExternal[idExternalLayer];
    else if (this.name === 'SHAPE')
        currentLayerExternal = allShapeExternal[idExternalLayer];
    else if (this.name === 'KML')
        currentLayerExternal = allKmlExternal[idExternalLayer];
    else if (this.name === 'CSV')
        currentLayerExternal = allCsvExternal[idExternalLayer];

    if (currentLayerExternal === null) return;
    if (currentLayerExternal === undefined) return;

    let goToHome = false;
    if (this.name === 'WMS' || this.name === 'WFS') goToHome = true;

    switchLoader(true);
    if (layerGroup.hasLayer(currentLayerExternal)) {
        layerGroup.removeLayer(currentLayerExternal);
    }
    else {
        layerGroup.addLayer(currentLayerExternal);
        if (goToHome) resetHome();
    }
    switchLoader(false);
}

// INIT DRAW

var optionColorDraw = '01';
var optionColorSelected = '#333333';
var optionWeightSelected = '3';
var pointFlag = false, lineFlag = false, polilineFlag = false, rectangleFlag = false, circleFlag = false, eraserFlag = false;
var point;
var line;
var poliline;
var rectangle;
var circle;
var erase;

// const $drawOptions = document.getElementsByName('optionDraw');
const $drawOptions = document.querySelectorAll('.optionDraw');
const $optionWeight = document.querySelectorAll('.draw__border');
const $optionColor = document.getElementsByName('optionColor');

//Agregamos el evento click al seleccionar el elemento a dibujar
$drawOptions.forEach(function ($el) {
    $el.addEventListener('click', enableDraw);
});

//Agregamos el evento click al seleccionar el peso
$optionWeight.forEach(function ($el) {
    $el.addEventListener('click', setWeight);
});

//Agregamos el evento click al seleccionar el color
$optionColor.forEach(function ($el) {
    $el.addEventListener('click', setColor);
});

//Función para asignar el borde de las líneas
function setWeight() {
    optionWeightSelected = this.dataset.weight;
    $optionWeight.forEach(function ($el) {
        $el.classList.remove('draw__border--active');
    });
    this.classList.add('draw__border--active');
}

//Función para asignar el color del dibujo
function setColor() {
    optionColorSelected = `#${this.dataset.color}`;
    optionColorDraw = this.dataset.code;
    $optionWeight.forEach(function ($el) {
        $el.classList.remove('draw__color--active');
    });
    this.classList.add('draw__color--active');
}

//Función que evalúa el tipo de dibujo y habilita el control
function enableDraw() {
    let currentOptionDraw = this.dataset.option;
    // let currentOptionDraw = 'rectangle';
    if (currentOptionDraw === 'point') {
        if (!pointFlag) {
            point = new L.Draw.Marker(map, {});
            point.enable();
        }
        else point.disable();
        pointFlag = !pointFlag;
    }
    else if (currentOptionDraw === 'line') {
        if (!lineFlag) {
            line = new L.Draw.Polyline(map, {});
            line.enable();
        }
        else line.disable();
        lineFlag = !lineFlag;
    }
    else if (currentOptionDraw === 'polyline') {
        if (!polilineFlag) {
            poliline = new L.Draw.Polygon(map, {});
            poliline.enable();
        }
        else poliline.disable();
        polilineFlag = !polilineFlag;
    }
    else if (currentOptionDraw === 'rectangle') {
        if (!rectangleFlag) {
            rectangle = new L.Draw.Rectangle(map, {});
            rectangle.enable();
        }
        else rectangle.disable();
        rectangleFlag = !rectangleFlag;
    }
    else if (currentOptionDraw === 'circle') {
        if (!circleFlag) {
            circle = new L.Draw.Circle(map, {});
            circle.enable();
        }
        else circle.disable();
        circleFlag = !circleFlag;
    }
    else if (currentOptionDraw == 'erase') {
        if (!eraserFlag) {
            erase = new L.EditToolbar.Delete(map, {
                featureGroup: drawnItems
            });
            erase.enable();
        }
        else erase.disable();
        eraserFlag = !eraserFlag;
    }
}

//Función para deshabilitar el dibujo
function disabledDraw() {
    if (point !== undefined) point.disable();
    if (line !== undefined) line.disable();
    if (poliline !== undefined) poliline.disable();
    if (rectangle !== undefined) rectangle.disable();
    if (circle !== undefined) circle.disable();
    if (erase !== undefined) erase.disable();
}

// END DRAW


// INIT SHARE

$btnFacebook = document.querySelector('#btnFacebook');
$btnFacebook.addEventListener('click', shareFacebook);
$btnLinkedin = document.querySelector('#btnLinkedin');
$btnLinkedin.addEventListener('click', shareLinkedin);
$btnWhatsApp = document.querySelector('#btnWhatsApp');
$btnWhatsApp.addEventListener('click', shareWhatsApp);
$btnTwitter = document.querySelector('#btnTwitter');
$btnTwitter.addEventListener('click', shareTwitter);
$btnMail = document.querySelector('#btnMail');
$btnMail.addEventListener('click', shareMail);

function shareFacebook(e) {
    e.preventDefault();
    window.open(this.dataset.href, 'fbShareWindow', `height=350, width=350, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`);
    return false;
}

function shareLinkedin(e) {
    e.preventDefault();
    window.open(this.dataset.href, 'fbShareWindow', `height=350, width=350, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`);
    return false;
}

function shareWhatsApp(e) {
    e.preventDefault();
    if (window.matchMedia('(max-width: 480px)').matches)
        this.dataset.href = `whatsapp://send?text=${encodeURIComponent(urlShare)}`
    else
        this.dataset.href = `https://web.whatsapp.com/send?text=${encodeURIComponent(urlShare)}`

    window.open(this.dataset.href, 'fbShareWindow', `height=350, width=350, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`);
    return false;
}

function shareTwitter() {
    // e.preventDefault();
    window.open(this.dataset.href, 'fbShareWindow', `height=350, width=350, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`);
    return false;
}


function shareMail(e) {
    e.preventDefault();
    window.open(this.dataset.href, `height=350, width=350, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`);
    return false;
}

// END SHARE

// INIT DYNAMIC CONTENT
const $modalDynamicContent = document.querySelector('#modalDynamicContent');

function galeriaDynamicModalTemplate(param) {

    const OBJECTID = param;
    const images = DATA_PVL_PCA[OBJECTID];
    let template = '';
    if (images === undefined) {
        //console.log(OBJECTID);
        template = '<h3>La capa seleccionada no cuenta con foto disponible.</h3>';
    }
    else {
        //console.log(OBJECTID)
        //console.log(images)
        //console.log(images.split(','))
        let arrImages = []
        if (images) {
            arrImages = images.split(',');
        }

        template = `
                <div class="content__gallery">
                        ${arrImages.map(element => {
            return `<div class="gallery__item"><img src="${element}" /></div>`
        }).join("")}
                </div>`
    }

    return template;
}

function showDynamicModal(type, title, params) {

    const templates = {
        'galeria': (params) => galeriaDynamicModalTemplate(params)
    };
    const htmlContent = templates[type](params);
    $modalDynamicContent.querySelector('.modal__header #spanInfo').textContent = title
    $modalDynamicContent.querySelector('.modal__body #contentDynamic').innerHTML = htmlContent
    toggleModalDynamicContent();
}
function toggleModalDynamicContent() {
    $modalDynamicContent.classList.toggle('displayBlock');
}
// END DYNAMIC CONTENT

// INIT PRINT

const $btnImprimir = document.querySelector('#btnImprimir');
$btnImprimir.addEventListener('click', enviarImpresion);

//Función para enviar a imprimir
var printLoading = false;
async function enviarImpresion() {
    await printMapFish();
}

//Función que envía la impresión por Mapfish
async function printMapFish() {

    //Verificamos si existe impresión pendiente
    if (printLoading) {
        alertCustom('Ya hay un impresión en curso, por favor espere.');
        return;
    }

    let currentEscala = document.querySelector('#optEscalePrint').dataset.value;
    // if (currentEscala === undefined) {
    //     alertCustom('Escala inválida');
    //     return;
    // }

    //Capturamos y formatemaos la escala
    let escala = (currentEscala !== undefined && currentEscala !== "-1") ? currentEscala.trim().replace(/\,/g, '') : '';
    // let reg = new RegExp('^[0-9]+$')

    // // Validamos la escala
    // if (!reg.test(escala) && escala != "") {
    //     alertCustom('Escala inválida');
    //     return;
    // }

    swithcLoaderPrint(true);
    alertCustom('Preparando la impresión.');

    //Activamos la variable que indica si existe una impresión pendiente
    printLoading = true;

    let orientationPrint = document.querySelector('#optOrientationPrint').dataset.value === 'l' ? 'horizontal' : 'vertical';
    let sizePrint = document.querySelector('#optSizePrint').dataset.value;
    let qualityPrint = document.querySelector('#optQualityPrint').dataset.value;
    let tipoPrint = escala === "" ? 'extent' : 'scale';
    let titlePrint = document.querySelector('#txtTitulo').value;

    layout = `${sizePrint}_${orientationPrint}_${tipoPrint}`.toUpperCase()

    // ESCALADO?
    let scaled = escala !== "";
    var m = Mfprint.init(map,
        {
            title: titlePrint,
            layout: layout,
            customLegends: mLayer,
            dpi: qualityPrint,
            scale: parseInt(escala),
            scaled: scaled,
            format: 'pdf'
        });

    try {
        await m.print2()
    } catch (err) {
        alertCustom('Ocurrió un error.');
        console.log(err);
    }

    printLoading = false
    swithcLoaderPrint(false);
}

// END PRINT

$btnDatum = document.querySelector('#btnDatum');
$btnDatum.addEventListener('click', verModalDatum);
$modalDatum = document.querySelector('#modalDatum');

//Función para abrir/cerrar el modal de Datum
function verModalDatum() {
    if (window.matchMedia('(max-width: 480px)').matches) {
        $modalDatum.style.left = `0px`
        $modalDatum.style.right = `0px`
        $modalDatum.style.margin = `auto`;
    }
    else {
        let rect = this.getBoundingClientRect();
        $modalDatum.style.margin = `0px`;
        $modalDatum.style.left = `${rect.x - (rect.width / 2)}px`;
        $modalDatum.style.top = `${rect.y - 394}px`;
    }

    if ($modalDatum.classList.contains('displayBlock'))
        $modalDatum.classList.remove('displayBlock');
    else
        $modalDatum.classList.add('displayBlock');
}

$textEscale = document.querySelector('#textEscale');
$textEscale.addEventListener('keypress', keyPressEscale);

//Función para detectar la tecla presionada en el control de escala
function keyPressEscale(e) {
    if (e.which == 13) interpolarZoom($(this).val());
    else
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57))
            alertCustom('Ingrese sólo dígitos por favor.')

}

//Función para encontrar el zoom según la escala
function interpolarZoom(_valor) {
    let scaleUser = _valor;
    let zoomFound = 0;
    let interpolarMin = {}, interpolarMax = {}, interpolarIgual = {};
    interpolarIgual = ZOOM_LEVELS.find(item => item.scale_value == scaleUser);

    if (interpolarIgual == undefined) {
        for (var i = 0; i < ZOOM_LEVELS.length; i++) {
            if (ZOOM_LEVELS[i].scale_value < scaleUser) {
                interpolarMin = ZOOM_LEVELS[i];

                //Encontramos al menor, por tanto el anterior es el mayor i - 1
                if ((i - 1) > 0) interpolarMax = ZOOM_LEVELS[i - 1];
                else interpolarMax = ZOOM_LEVELS[0];
                break;
            }
        }

        //Interpolamos
        interpolarIgual = interpolarMin;
        zoomFound = interpolarMin.zoom_level;
        if (interpolarIgual != undefined) {
            let valueStr = interpolarIgual.scale_round.toString()
            $textEscale.value = addCommas(valueStr.toString());
        }
    }

    map.setZoom(zoomFound);
}

//Función para agregar comas al número de entrada
function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

$menu__help = document.querySelector('.menu__help');
$menu__help.addEventListener('click', toggleModalHelp);
$modalHelp = document.querySelector('#modalHelp');

//Función para abrir y cerrar el modal de Ayuda
function toggleModalHelp() {
    if ($modalHelp.classList.contains('displayBlock')) $modalHelp.classList.remove('displayBlock');
    else $modalHelp.classList.add('displayBlock')
}

const $btnTerms = document.querySelector('#btnTerms');
const $modalTerms = document.querySelector('#modalTerms');
const $btnContinue = document.querySelector('#btnContinue');
$btnTerms.addEventListener('click', toggleModalTerms);
$btnContinue.addEventListener('click', toggleModalTerms);

//Función para controlar el modal de términos de uso
function toggleModalTerms() {
    if ($modalHelp.classList.contains('displayBlock')) $modalHelp.classList.remove('displayBlock');

    if ($modalTerms.classList.contains('displayBlock')) $modalTerms.classList.remove('displayBlock');
    else $modalTerms.classList.add('displayBlock')
}

const $btnTermsMobile = document.querySelector('#btnTermsMobile');
$btnTermsMobile.addEventListener('click', toggleModalTermsMobile);

//Función para llamar al modal de términos de uso
function toggleModalTermsMobile() {
    $modalTerms.classList.add('displayBlock')
}

const $btnTutorialPrimary = document.querySelector('#btnTutorialPrimary');
const $btnTutorialSecondary = document.querySelector('#btnTutorialSecondary');
$btnTutorialPrimary.addEventListener('click', tutorial1);
$btnTutorialSecondary.addEventListener('click', tutorial2);

const $tooltip__custom = document.querySelector('.tooltip__custom');
const $spanTooltip = document.querySelector('#spanTooltip');

//Función para mostrar el tooltip
function hover(e) {
    let tooltip = e.dataset.tooltip;

    if (tooltip === undefined) return;
    if (tooltip === null) return;

    $spanTooltip.innerHTML = tooltip.replace('--', '').replace('__', '');
    let rectControl = e.getBoundingClientRect();
    $tooltip__custom.style.top = `${rectControl.top + 5}px`;
    if (tooltip.substr(0, 2) === '--') {
        $tooltip__custom.style.left = `auto`;
        $tooltip__custom.style.right = `55px`;
    }
    else if (tooltip.substr(0, 2) === '__') {
        $tooltip__custom.style.left = `auto`;
        $tooltip__custom.style.right = `285px`;
    }
    else {
        $tooltip__custom.style.left = `${rectControl.left + 50}px`;
        $tooltip__custom.style.right = `auto`;
    }

    //Ponemos el settimeout para ocultar el efecto de desplazamiento
    setTimeout(() => { $tooltip__custom.style.visibility = 'visible' }, 200);
}

//Función para ocultar el tooltip
function unhover(e) {
    setTimeout(() => {
        $tooltip__custom.style.visibility = 'hidden';
    }, 200);
}
