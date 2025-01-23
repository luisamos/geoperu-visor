
const $loaderLogin = document.querySelector('.loader');

const $userName = document.querySelector('#user_usuario');
const $userPass = document.querySelector('#pass_usuario');
const $btnProcced = document.querySelector('#btnProcced');
const $toast__custom = document.querySelector('.toast__custom');
const $spanCustom = document.querySelector('#spanCustom');
const $imgLoginSubsistema = document.querySelector('#imgLoginSubsistema');

var COOKIE_NAME = 'tokenVisor'
var subsistemaURL = '';
var subsistemaURLStr = '';

$btnProcced.addEventListener('click', validarLogin);
$userName.addEventListener('keydown', keyDownUsername);
$userPass.addEventListener('keydown', keyDownPassword);

//Función que controla la tecla presioanda del TextBox de usuario
function keyDownUsername(e) {
    if (e.keyCode == 13)
        $userPass.focus();
}

//Función que controla la tecla presioanda del TextBox de contraseña
function keyDownPassword(e) {
    if (e.keyCode == 13)
        $btnProcced.click();
}

//Función que valida que los input contengan información
function validarLogin() {
    if ($userName.value.trim().length <= 0) {
        alertCustom('Ingrese su usuario');
        $userName.focus();
        return;
    }

    if ($userPass.value.trim().length <= 0) {
        alertCustom('Ingrese su contraseña');
        $userPass.focus();
        return;
    }

    geoLogin($userName.value.trim(), $userPass.value.trim());
}

async function geoLogin(_user, _pass) {

    $loaderLogin.classList.add('displayBlock');

    var formDataLogin = new FormData();
    formDataLogin.append('user', _user);
    formDataLogin.append('pass', _pass);
    formDataLogin.append('subs', subsistemaURL);

    let response = await fetch(FN_LOGIN_VISOR, { method: 'POST', body: formDataLogin });
    let responseJson = await response.json();

    if (responseJson.status === 1) {

        setCookie(`${COOKIE_NAME}_${subsistemaURL}`, responseJson.token, 1);
        validarToken(subsistemaURLStr, false);
    }
    else {
        alertCustom('Usuario y/o contraseña incorrectos');
        $loaderLogin.classList.remove('displayBlock');
        return;
    }

    $loaderLogin.classList.remove('displayBlock');
}

//Función para mostrar los mensajes de alerta
function alertCustom(_message) {
    $spanCustom.innerHTML = _message;
    $toast__custom.classList.add('displayBlock');

    setTimeout(() => {
        $toast__custom.classList.remove('displayBlock');
    }, 3000);
}

(function () {
    const queryString = new URL(window.location.href);
    subsistemaURLStr = queryString.searchParams.get('subsistema');
    if (subsistemaURLStr !== null) {
        mSubsistemaURL = subsistemaURLStr.split('-');
        subsistemaURL = mSubsistemaURL[mSubsistemaURL.length - 1];
        COOKIE_NAME = `${COOKIE_NAME}_${subsistemaURL}`;

        if (subsistemaURL === 'A00027') {
            document.querySelector('.controls__logo').classList.add('displayNone');
            document.querySelector('.controls__vraem').classList.remove('displayNone');
        }
        else {
            document.querySelector('.controls__logo').classList.remove('displayNone');
            document.querySelector('.controls__vraem').classList.add('displayNone');
        }

        //Agregamos el título
        const $lblTitle = document.querySelector('#lblTitle');
        $lblTitle.innerText = subsistemaURLStr.replace(/-/g, ' ').replace(`${subsistemaURL}`, '');
        $lblTitle.classList.add('capitalize');

        //Agregamos la imagen
        let formDataImage = new FormData();
        formDataImage.append('ubigeo', subsistemaURL);

        fetch(URL_LOGIN_IMAGE, { method: 'POST', body: formDataImage })
            .then(response => { return response.json(); })
            .then(responseImageJson => {

                let imageCurrent = responseImageJson[0].imglogin;
                if (imageCurrent.trim().length !== 0) {
                    $imgLoginSubsistema.src = imageCurrent;
                    $imgLoginSubsistema.style.width = '380px';
                    $imgLoginSubsistema.style.height = '510px';
                }
                else {
                    $imgLoginSubsistema.src = './images/login/login.png';
                }
            })
    }
})();