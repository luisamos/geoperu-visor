
var COOKIE_NAME = 'tokenVisor'

// Función que recibe el token y lo devuelve en json
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

//Función que crea la cookie de sesión
function setCookie(cname, cvalue, exSeg) {
    var d = new Date();
    // d.setTime(d.getTime() + (exSeg * 1000));
    let defaultHours = parseJwt(cvalue).sessionlogin;
    d.setTime(d.getTime() + ((defaultHours === 0 ? 24 : 1) * 1 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Función que obtiene la cookie de sesión
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

//Función para validar si existe cookie, en caso de existir redireccionará
async function validarToken(_subsistema = null, _redirect = true) {
    
    let ubigeoCurrent = '';
    if(_subsistema !== null){
        let mUbigeo = _subsistema.split('-');
        ubigeoCurrent = mUbigeo[mUbigeo.length - 1];
    }
    COOKIE_NAME = 'tokenVisor' + ((ubigeoCurrent != null) ? '_' + ubigeoCurrent : '');
    
    var mToken = getCookie(COOKIE_NAME);
    let urlLoginUbigeo = `/login.html${((_subsistema != null) ? '?subsistema=' + _subsistema : '')}`
    
    let urlIndexUbigeo = `/index.html${((_subsistema != null) ? '?subsistema=' + _subsistema : '')}`

    if (mToken === '') {
        if (_redirect)
            window.location.replace(urlLoginUbigeo);
    }
    else {
        var decoded = jwt_decode(mToken);
        $VAL = decoded.idusuario;
        if (decoded.status !== 1)
            if (_redirect)
                window.location.replace(urlLoginUbigeo);
            else
                return;
        if (!_redirect)
            window.location.replace(urlIndexUbigeo);
    }
}

//Función que evaluará si el token es correcto
function validarCockie() {
    var v = document.cookie.match('(^|;) ?' + COOKIE_NAME + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

//Función para limpiar la cookie
function limpiarToken() {
    document.cookie = `${COOKIE_NAME}" + '=; path=/;domain=.geoperu.gob.pe; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    document.cookie = `${COOKIE_NAME}" + '=; path=/;domain=.visor.geoperu.gob.pe; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

//Función para desloguear al usuario
function fnLogout() {
    document.cookie = `${COOKIE_NAME}" + '=; path=/;domain=.geoperu.gob.pe; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    document.cookie = COOKIE_NAME + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = COOKIE_NAME + '=; Path=/;domain=.geoperu.gob.pe; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.reload();
}
