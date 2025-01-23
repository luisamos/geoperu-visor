var UBIGEO_GENERAL = '';
function hover(element) {
    if (element.id != '')
        if ($('#' + element.id).hasClass('disabled'))
            return;
    let ulrImage = 'images/' + $(element).attr('data-file') + '/f_' + $(element).attr('data-img') + '.png';
    element.setAttribute('src', ulrImage);
}

function unhover(element) {
    if (element.id != '')
        if ($('#' + element.id).hasClass('disabled'))
            return;
    let ulrImage = 'images/' + $(element).attr('data-file') + '/' + $(element).attr('data-img') + '.png';
    element.setAttribute('src', ulrImage);
}

function enabledButtonImage(_id) {
    let element = $('#' + _id)[0];
    let ulrImage = 'images/' + $(element).attr('data-file') + '/' + $(element).attr('data-img') + '.png';
    $('#' + _id)[0].setAttribute('src', ulrImage);
    $('#' + _id).addClass('disabled');
}

function disabledButtonImage(_id) {
    let element = $('#' + _id)[0];
    let ulrImage = 'images/' + $(element).attr('data-file') + '/d_' + $(element).attr('data-img') + '.png';
    $('#' + _id)[0].setAttribute('src', ulrImage);
    $('#' + _id).addClass('disabled');
}

function alertToast(msg) {
    var toastHTML = `<span>${msg}</span>`;
    M.toast({ html: toastHTML, classes: 'rounded' });
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    // document.cookie = cname + "=" + cvalue + ";" + expires + ";path=";
    document.cookie = cname + "=" + cvalue + ";" + expires + ";domain=.geoperu.gob.pe;path=/";

}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function validarToken(_redirect = true) {
    // var mToken = localStorage.getItem('geoToken');
    var mToken = getCookie('geoToken');
    if (mToken === '') {
        if (_redirect)
            window.location.replace('/subsistema/administracion/login.html');
    }
    else {
        var decoded = jwt_decode(mToken);
        if (decoded.status !== 1)
            if (_redirect)
                window.location.replace('/subsistema/administracion/login.html');
            else
                return;
        if (!_redirect)
            window.location.replace('/subsistema/administracion/general.html');
    }
}

function validarCockie() {
    var v = document.cookie.match('(^|;) ?' + 'geoToken' + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function limpiarToken() {
    document.cookie = `geoToken" + '=; path=/;domain=.geoperu.gob.pe; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    document.cookie = `geoToken" + '=; path=/;domain=.visor.geoperu.gob.pe; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    // localStorage.removeItem('geoToken');
}

function fnLogout() {
    document.cookie = `geoToken" + '=; path=/;domain=.geoperu.gob.pe; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    // document.cookie = `geoToken" + '=; path=/;domain=.visor.geoperu.gob.pe; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    // document.cookie = `geoToken" + '=; path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    document.cookie = 'geoToken' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'geoToken' + '=; Path=/;domain=.geoperu.gob.pe; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    // localStorage.removeItem('geoToken');
    window.location.reload();
}

function setMenuByRol(_idRol) {
    if (_idRol == 1) {
        $('#mnuGeneral').show();
        $('#mnuTematica').show();
        $('#mnuCapa').show();
        $('#mnuUsuario').show();
        $('#mnuSubsistema').show();
        $('#mnuControl').show();
        $('#mnuColor').show();
        $('#mnuIcons').show();
    }
    else if (_idRol == 2) {
        $('#mnuGeneral').show();
        $('#mnuTematica').hide();
        $('#mnuCapa').hide();
        $('#mnuUsuario').show();
        $('#mnuSubsistema').show();
        $('#mnuControl').show();
        $('#mnuColor').hide();
        $('#mnuIcons').hide();
    }
    else if (_idRol == 3) {
        $('#mnuGeneral').show();
        $('#mnuTematica').show();
        $('#mnuCapa').show();
        $('#mnuUsuario').hide();
        $('#mnuSubsistema').hide();
        $('#mnuControl').hide();
        $('#mnuColor').hide();
        $('#mnuIcons').hide();
    }
    else{
        $('#mnuColor').hide();
        $('#mnuIcons').hide();
    }
}

function set_usuario_avatar() {
    // var mToken = localStorage.getItem('geoToken');
    var mToken = getCookie('geoToken');
    var decoded = jwt_decode(mToken);
    getLogo(decoded.idsubs);
    var data = new FormData();
    data.append('iduser', decoded.idusuario);
    data.append('idsubs', 0);
    fetch(GET_AVATAR, { method: 'POST', body: data })
        .then(resp => {
            return resp.json();
        })
        .then(respJson => {
            if (respJson != undefined && respJson != null) {
                let soruceFoto = '../images/photo_init.png'
                if (respJson[0].foto == null)
                    return;
                if (respJson[0].foto.length > 0)
                    soruceFoto = respJson[0].foto;
                $('#imgFotoPerfil').attr('src', soruceFoto);
            }
        })
}

function saveLog(_tabla, _idregistro, _nomb, _accion, _iduser, _idsubs) {
    var data = new FormData();
    data.append('objt', _tabla);
    data.append('objt_id', _idregistro);
    data.append('objt_nomb', _nomb);
    data.append('accion', _accion);
    data.append('iduser', _iduser);
    data.append('idsubs', _idsubs);
    fetch(SV_LOG, { method: 'POST', body: data })
        .then(resp => resp.json())
        .then(respJson => {
            console.log(`Log: ${respJson}`)
        })
        .catch(err => {
            console.log(`Error: ${err}`);
        });
}

function getLogo(_id) {
    var data = new FormData();
    data.append('idsubs', _id);
    fetch(URL_SUBSISTEMA_ID, { method: 'POST', body: data })
        .then(respLogo => {
            return respLogo.json();
        })
        .then(respLogoJson => {
            if (respLogoJson != undefined && respLogoJson != null) {
                if (respLogoJson.length > 0) {
                    UBIGEO_GENERAL = respLogoJson[0].ubigeo;
                    $('#btnBack').attr('href', respLogoJson[0].url_subsistema);
                    // $('#btnBack').attr('src', respLogoJson[0].logo)
                }
            }
        })
        .catch(err => {
            console.log(err);
            return;
        })
}

function checkCoockieInterval() {
    setInterval(function () {
        validarToken(true);
    }, 500);
}
var menuSeleccionado = '#19345C';

console.log("Bienvenidos");  