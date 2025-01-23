#!/bin/bash
set -e

if [[ -z ${IS_DEV} ]]; then
    echo "IS_DEV not set"
else
    sed -i "s/ IS_DEV =.*/ IS_DEV = ${IS_DEV};/" $APP_DIR/js/api.js
    sed -i "s/ IS_DEV =.*/ IS_DEV = ${IS_DEV};/" $APP_DIR/subsistema/administracion/js/url.js
fi

if [[ -z ${PROTOCOL} ]]; then
    echo "PROTOCOL not set"
else
    sed -i "s~ PROTOCOL =.*~ PROTOCOL = '${PROTOCOL}://';~" $APP_DIR/js/api.js
    sed -i "s~ PROTOCOL =.*~ PROTOCOL = '${PROTOCOL}://';~" $APP_DIR/subsistema/administracion/js/url.js
fi

if [[ -z ${DOMINIO} ]]; then
    echo "DOMINIO not set"
else
    sed -i "s~ DOMINIO =.*~ DOMINIO = '${DOMINIO}';~" $APP_DIR/js/api.js
    sed -i "s~ DOMINIO =.*~ DOMINIO = '${DOMINIO}';~" $APP_DIR/subsistema/administracion/js/url.js
fi

if [[ -z ${SUB_DOMINIO} ]]; then
    echo "SUB_DOMINIO not set"
else
    sed -i "s~ SUB_DOMINIO =.*~ SUB_DOMINIO = '${SUB_DOMINIO}';~" $APP_DIR/js/api.js
    sed -i "s~ SUB_DOMINIO =.*~ SUB_DOMINIO = '${SUB_DOMINIO}';~" $APP_DIR/subsistema/administracion/js/url.js
fi

if [[ -z ${SERVER_ESPACIAL} ]]; then
    echo "SERVER_ESPACIAL not set (ex: espacialg.geoperu.gob.pe)"
else
    sed -i "s~ SERVER_ESPACIAL =.*~ SERVER_ESPACIAL = '${SERVER_ESPACIAL}';~" $APP_DIR/js/api.js
    sed -i "s~ SERVER_ESPACIAL =.*~ SERVER_ESPACIAL = '${SERVER_ESPACIAL}';~" $APP_DIR/subsistema/administracion/js/url.js
fi

if [[ -z ${DOMINIO_ESPACIAL} ]]; then
    echo "DOMINIO_ESPACIAL not set (ex: http://espacialg.geoperu.gob.pe)"
else
    sed -i "s~ DOMINIO_ESPACIAL =.*~ DOMINIO_ESPACIAL = '${DOMINIO_ESPACIAL}';~" $APP_DIR/js/api.js
    sed -i "s~ DOMINIO_ESPACIAL =.*~ DOMINIO_ESPACIAL = '${DOMINIO_ESPACIAL}';~" $APP_DIR/subsistema/administracion/js/url.js
fi

exec "$@"