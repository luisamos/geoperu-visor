const IS_DEV = false;
const PROTOCOL = 'https://'
const DOMINIO = 'geoperu.gob.pe'
const SUBDOMINIO = `visor.${DOMINIO}`
const DOMINIO_ESPACIAL = `https://espacialg.geoperu.gob.pe`
const SERVER = '127.0.0.1'
const PORT_APP = '5000'
const PORT_SEG = '5001'
const PORT_UPL = '5002'
const PORT_GEO = '5003'
// visor.geoperu.gob.pe = 200.48.76.102	
const SERVER_PROD = `${SUBDOMINIO}/api/pro/`;
const SERVER_SEG = `${SUBDOMINIO}/api/seg/`;
const SERVER_UPL = `${SUBDOMINIO}/api/upl/`;
const SERVER_GEO = `${SUBDOMINIO}/api/geo/`;
const SERVER_PORT_APP = PROTOCOL + ((IS_DEV) ? SERVER + ':' + PORT_APP : SERVER_PROD);
const SERVER_PORT_SEG = PROTOCOL + ((IS_DEV) ? SERVER + ':' + PORT_SEG : SERVER_SEG);
const SERVER_PORT_UPL = PROTOCOL + ((IS_DEV) ? SERVER + ':' + PORT_UPL : SERVER_UPL);
const SERVER_PORT_GEO = PROTOCOL + ((IS_DEV) ? SERVER + ':' + PORT_GEO : SERVER_GEO);

const PATH_IMAGES_GEOSERVER = `${DOMINIO_ESPACIAL}/geoserver/www/images/`;

const GET_SUBSISTEMA = `${SERVER_PORT_APP}/subsistema/`;
const GET_USUARIO_X_ROL = SERVER_PORT_APP + '/usuario_by_rol/'
const URL_UBIGEO_ALL = SERVER_PORT_APP + '/Ubigeo/'
const FN_SUBSISTEMA = SERVER_PORT_APP + '/funcion_subsistema/'
const URL_LAYER_GENERAL = `${SERVER_PORT_APP}/layer-nacional/`
const TGL_SUBSISTEMA = SERVER_PORT_APP + '/toggle_subsistema/'
const GET_SUBSISTEMA_ALL = SERVER_PORT_APP + '/subsistema_all/'
const URL_SUBSISTEMA_ID = SERVER_PORT_APP + '/get_subsistema_id/'
const EDT_LOGO = SERVER_PORT_APP + '/change_logo/'
const CLR_LOGO = SERVER_PORT_APP + '/clear_logo/'

const GET_TEMATICO = SERVER_PORT_APP + '/tematico_subsistema/'
const FN_TEMATICO = SERVER_PORT_APP + '/funcion_tematica/'
const DLT_TEMATICO = SERVER_PORT_APP + '/eliminar_tematica/'
const ORDN_TEMATICO = SERVER_PORT_APP + '/change_orden_tematica/'

const GET_SUBTEMATICO = SERVER_PORT_APP + '/subtematico_subsistema/'
const FN_SUBTEMATICO = SERVER_PORT_APP + '/funcion_subtematica/'
const DLT_SUBTEMATICO = SERVER_PORT_APP + '/eliminar_subtematica/'
const ORDN_SUBTEMATICO = SERVER_PORT_APP + '/change_orden_subtematica/'

const GET_NOTICIA = SERVER_PORT_APP + '/noticia_all/'

const GET_ALL_LAYERS = SERVER_PORT_APP + '/All_layers/'
const FN_LAYER = SERVER_PORT_APP + '/function_layer/'
const TGL_LAYER = SERVER_PORT_APP + '/toggle_layer/'
const DLT_LAYER = SERVER_PORT_APP + '/delete_layer/'
const GET_ORDEN = SERVER_PORT_APP + '/get_orden/'
const ORDN_LAYER = SERVER_PORT_APP + '/change_orden_layer/'

const GET_INFO_GENERAL = SERVER_PORT_APP + '/get_info_general/'
const GET_INFO_LAYER_GENERAL = SERVER_PORT_APP + '/get_info_general_layer/'
const GET_FRECUENCIA = SERVER_PORT_APP + '/frecuencia/'
const GET_INFO_LAYER = SERVER_PORT_APP + '/get_info_by_capa/'
const GET_INFO_IDLAYER = SERVER_PORT_APP + '/get_info_by_idcapa/'
const FN_INFO_SAVE = SERVER_PORT_APP + '/save_informacion/'
const FN_INFO_INSERT = SERVER_PORT_APP + '/save_informacion_insert/'
const GET_CAPA_POR_CODIGO = SERVER_PORT_APP + '/layers_default/'

const GET_DICCIONARIO = SERVER_PORT_APP + '/vista_definicion_all/'
const FN_DICCIONARIO = SERVER_PORT_APP + '/funcion_vista_definicion/'
const SV_DICCIONARIO = SERVER_PORT_APP + '/save_definicion/'
const GN_DICCIONARIO = SERVER_PORT_APP + '/reset_diccionario/'

const GET_TIPO_DOCUMENTO = SERVER_PORT_APP + '/tipo_documento/'
const GET_ROL = SERVER_PORT_APP + '/rol/'
const GET_USUARIO_ALL = SERVER_PORT_APP + '/usuario_all/'
const GET_AVATAR = SERVER_PORT_APP + '/get_avatar_usuario/'
const FN_USUARIO = SERVER_PORT_APP + '/funcion_usuario/'
const TGL_USER = SERVER_PORT_APP + '/toggle_usuario/'

const GET_FAQ = SERVER_PORT_APP + '/faq/'
const GET_PERFIL = SERVER_PORT_APP + '/get_perfil/'
const FN_PERFIL = SERVER_PORT_APP + '/save_perfil/'
const FN_PASSWORD = SERVER_PORT_APP + '/change_pswr/'

const SV_LOG = SERVER_PORT_APP + '/insert_log/'
const GET_LOG = SERVER_PORT_APP + '/get_log/'

const URL_REPO_CDN = `https://cdn.geoperu.gob.pe/`
const URL_REPO_HUAWEI = `https://cdn.geoperu.gob.pe.obs.la-south-2.myhuaweicloud.com/`
const UPLOAD_FILE = SERVER_PORT_UPL + '/upload-zip/'
const UPLOAD_ICON = SERVER_PORT_UPL + '/upload-icon/'
const UPLOAD_FILE_SHAPE = SERVER_PORT_UPL + '/upload-zip-overwrite/'
const UPLOAD_FILE_SLD = SERVER_PORT_UPL + '/upload-sld/'
const CREATE_FILE_SLD = SERVER_PORT_UPL + '/create-sld/'
const CREATE_FILE_STYLE = SERVER_PORT_UPL + '/create-style/'
const UPLOAD_FILE_ICON = SERVER_PORT_UPL + '/upload-icon/'
const UPLOAD_FILE_INFO = SERVER_PORT_UPL + '/upload-file-info/'
const UPLOAD_SIGNED_CDN = SERVER_PORT_UPL + 'signed-cdn/'
const UPLOAD_SIGNED_URL = SERVER_PORT_UPL + '/signedURL/'
const UPLOAD_COPY_FILE_OBS = SERVER_PORT_UPL + '/copy-obs/'
const SAVE_FILE_INFO = SERVER_PORT_APP + '/save_info_files/'
const GET_FILES_INFO = SERVER_PORT_APP + '/get_info_files/'
const DELETE_FILE_INFO = SERVER_PORT_APP + '/delete_info_files/'
const SAVE_FILE_INFO_X_ID = SERVER_PORT_APP + '/save_info_files_xId/'
const GET_FILES_INFO_X_ID = SERVER_PORT_APP + '/get_info_files_xId/'
const DELETE_FILE_INFO_X_ID = SERVER_PORT_APP + '/delete_info_files_xId/'
// const TRANSFER_FILE_ICON = SERVER_PORT_UPL + '/transfer-icon/' # Deprecated
const COPY_FILE_ICON = SERVER_PORT_UPL + '/copy-icon/'
// const READ_ICON_GALLERY = SERVER_PORT_UPL + '/read-icons/' #Deprecated
const ICONS_GEOSERVER_GALLERY = SERVER_PORT_UPL + '/icons-geoserver/'
const GET_ICON_CATEGORY = SERVER_PORT_APP + '/get_icons_category/'
const GET_ICON_GALLERY = SERVER_PORT_APP + '/get_icons_gallery/'
const READ_DBF_FILE = SERVER_PORT_UPL + '/dbf_read/'
const CREATE_FTL_FILE = SERVER_PORT_UPL + '/create_content/'
// const TRANSFER_FTL_FILE = SERVER_PORT_UPL + '/transfer_content/' #Deprecated
const COPY_FTL_FILE = SERVER_PORT_UPL + '/copy-content/'
const VERIFIY_FILE_UPLOAD = SERVER_PORT_UPL + '/upload-path-verify/'
const SAVE_CONFIG_FILE = SERVER_PORT_APP + '/save_metadata/'
const PUBLISH_LAYER = SERVER_PORT_GEO + '/publish-layer/'
const PUBLISH_SHAPE = SERVER_PORT_GEO + '/publish-shape/'
const PUBLISH_STYLE = SERVER_PORT_GEO +'/publish-style/'
const PUBLISH_STYLE_VALID = SERVER_PORT_GEO +'/publish-style-valid/'
const PUBLISH_RASTER = SERVER_PORT_GEO + '/publish-mosaic/'
const PUBLISH_GEOJSON = `${SERVER_PORT_GEO}/publish-geojson/`

const GET_CONTROLES = `${SERVER_PORT_APP}/get_controles_subsistema/`
const SET_CONTROL_SUBSISTEMA = `${SERVER_PORT_APP}/set_control_subsistema/`
const SET_CONFIGCOLOR_SUBSISTEMA = `${SERVER_PORT_APP}/set_colors_subsistema/`
const GET_CATEGORIES_SUBSISTEMA = `${SERVER_PORT_APP}/categorias_subsistema/`
const GET_SUBCATEGORIES_SUBSISTEMA = `${SERVER_PORT_APP}/subcategorias_subsistema/`
const GET_LAYER_SUBSISTEMA = `${SERVER_PORT_APP}/layers_subsistema/`

const FN_LOGUEO = SERVER_PORT_SEG + '/geo_logueo/'
const URL_PROXY = `https://proxy.geoperu.gob.pe/`

// Nuevos métodos para soportar clones a subsistemas
const GET_CATEGORY_SUBSISTEMA = SERVER_PORT_APP + '/get-categoria-subsistema/'
const ADD_CATEGORY_SUBSISTEMA = SERVER_PORT_APP + '/add-categoria-subsistema/'
const DLT_CATEGORY_SUBSISTEMA = SERVER_PORT_APP + '/delete-categoria-subsistema/'
const ORD_CATEGORY_SUBSISTEMA = SERVER_PORT_APP + '/order-category-subsistema/'
const GET_SUBCATEGORY_SUBSISTEMA = SERVER_PORT_APP + '/get-subcategoria-subsistema/'
const ADD_SUBCATEGORY_SUBSISTEMA = SERVER_PORT_APP + '/add-subcategoria-subsistema/'
const DLT_SUBCATEGORY_SUBSISTEMA = SERVER_PORT_APP + '/delete-subcategoria-subsistema/'
const ORD_SUBCATEGORY_SUBSISTEMA = SERVER_PORT_APP + '/order-subcategory-subsistema/'
const GET_LAYER_X_SUBSISTEMA = SERVER_PORT_APP + '/layer-subsistema/'
const GET_LAYER_X_SUBSISTEMA_PANEL = SERVER_PORT_APP + '/layer-subsistema-panel/'
const ADD_LAYER_SUBSISTEMA = SERVER_PORT_APP + '/add-layer-subsistema/'
const DLT_LAYER_SUBSISTEMA = SERVER_PORT_APP + '/delete-layer-subsistema/'
const ORD_LAYER_SUBSISTEMA = SERVER_PORT_APP + '/order-layer-subsistema/'
const FN_SUBSISTEMA_CLON = SERVER_PORT_APP + '/funcion_subsistema_clon/'
const FN_LAYER_CLONE = SERVER_PORT_APP + '/toggle-layer-clon/'
const FN_SUBSISTEMA_LOGIN = SERVER_PORT_APP + '/set-subsistema-login/'
const URL_LOGIN_IMAGE = `${SERVER_PORT_APP}/get-subsistema-imagelogin/`

//Métodos para campos combinados en metadata.
const GET_CAMPOCLONADO = SERVER_PORT_APP + '/get-campocombinado/'
const ADD_CAMPOCLONADO = SERVER_PORT_APP + '/add-campocombinado/'
const UPD_CAMPOCLONADO = SERVER_PORT_APP + '/upd-campocombinado/'

const CONFIG_SANITIZE = { ALLOWED_TAGS: ['tr', 'td', 'a', 'img', 'div', 'label','input', 'span'], ADD_URI_SAFE_ATTR: ['style'] }

const ICON_TEMATICA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAK1SURBVHgB7VY7bxpBEOYOg9IgX4GEeBS4ouUpUeIu5aVLF9y5i+ncGf8C8w+Mu6TCKV3hVInEw+cuXXAFJQYkIvHK9+G96HzhsYslV15pbm9nZue7mZ2ZW4/nbbzS0Dw7jEKhYAyHw9pisTDm8/mhZVl9j+JQBiboaDSqAzTJNWZrF3BdRdkFWsR8pGlaUtf1ejKZNFRseWUV3aCtVuuq2+1akUgkDvD3pFAo9LXX6/2RsScVaicoQ9tut1P5fD4+mUwuKAYtvVUJ+9ZQu88Uw+JjOp3GMZngd0Bl1bDrsqA0Th6M3zp1wD9BBM5BVRVwXQYUyyIM3pM/m83unXrgF9Pp9Fkmk/mkAq7LgDKRWLOU7e3tmQKwbwODynitArzm9/tvZcB1GVDyhTcV0Bk8PGk0GpbP5zsgQUcTR2Ei4eoy4PoGUHpz4JTBSEHwOyKr66Df/BCeM+Qp7PWAdwc1YxP4szoOBoM/HM2B2VsOh8OPiUTilzMKgUDgZjweU9eA4Z+g42g0qjWbzS+o5W8AypMHIhh14uSh7q9WegxD/+oPinaN7w8Gg892ZjP06NNl8Nk4jrA+tI8gm81eoIY7gld22V7vMb9WdKFjRpebGULwH8AzQQV49g6yU9A1AM65D57cIDJ8PeWM9XdSLBbj2X+0G4uzqz3zmB2HCiLMy7MU/A4icM2wQd4XcpMl5Nj+wAfky3Dmcrki3i/XdbOVLZOJwIRgYmBZBD2C+BusIAIlpxx1nYJRi7XMsmKGbwP9z+M1nldBl6JHl2w5gEsiKvvOvTKga4FXgBviA7YOGdCNwG5weFZxnemTAV2Pi1npDyX1W3SfOUtK8O5Yo+Ax8UyV36L01WcduNfrrXmeSk/pCqR053KDs8nInumLgFeA73zZ2+l66wDvo44/7HK9fRuvNv4Cnd1xT3w4JcAAAAAASUVORK5CYII='
const ICON_TEMATICA_FOCUS = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARnSURBVHgBpVdPaBRnFH8zmcC6h2TLZiUtxK61pYfkkCCFUsUac6ke3M3N9GC2F09qthcpKrSgUtSDEb3oKTnVnLrmYISCUdFQKOIWI7QezJKoLGyWzAaMiZnN+H5v91tm15mdif5g9vs73+/7vfe+N99qFAB/RiIRwzB6baKERrSXyzh3R6rDJvdluS9Ltn3vYLGYCbKm5keoG0aaJ404iJrC1rQcb2B8wzDGBvP5HG2WeLKjI83Fr0EJXTdA9FuiUBh3G9fdOm9Go6NcXPIibW1vp+8yGdozPU0G192g2Xacn7FMLHbJdfw90lhsjF8YJg8o0raeHmmXZmdpJpkkq1QiT/AG2Pc/ObvqFENpUNLssWPytHMdfV7KBZqWalTeoiqTsViK5f8elHThxg1aZrXhbdto67598rzk8Y21NXduom+HwuHSHysrf1fbHL2dnfGWcnmaTRL3Iy09eUL3mQSE3WfOUMfu3WS0tcm8AGY3y5a1fdA0TTG1blmpIKQAVAJburqo88ABej0/T/9fuBDU7MgHI8IpsjVt2I8UiwOLMzN1c56eOkXPLl4U0wch50STloQ0GY0m3dQ2+nR9ebmimE3tRNehQxTdtYveLCwIOdB75Yq862H2CHEW1Fnu936kWFD5EeYF1IJdQ0P09YkTQvbN+DgV2SJ+yjmiEy0/hsO/UCX3epKKUvYtxr4aGRHS/NQUvZiYoLnr1+np6dNwF32eStGnvDGYHvPj3HaLdjZ3SOefXjdSAAHkHOtgkwKv2ayIaswdePSIvjhyRGLgfn8/e82mPXfuUCtbyEu5BqGck2318FGxgcdHj9q8kNRnT560p3bsqBtDe2V+3n5rmvbigwfS/9/587LGX319tb4Cl+ulUq3u5KrLXOsu5w873c6KVGTD9PAprPGYFSGAnl+7Jn3dZ89KkKEP5pYkwRYQi1VjpOZnzib4CoXQgN/gE/gKkQoiLLDCi3Xu3y+m1kMh+vL4ccrfuiVjQIFNCx+jH0CAFR8+lPpng4OSdLAZh59NnXeVcyrGBJUksHtV5m/fFj9jDsYR3ThKCmx6KVUwYgyRrkit6nGsIovguttobkWOF7EA1CKAYNI5fpzjbd3d5AxEbNKHtEJc5o9SY28jed/Vq7IIjo0an63WWxvOaQBSRP5dnSwrC5s3I0fyUCb0QwDSXKJYvKnjS8F+HnVbxEnec+5cnU8VtvB5dipvRirQtDEp8IOk3WIYc+Rz1XFmM/QhUSCRIMIRbH6kULtRLvez2JxcBCZWV1eHQqE13s0Pbi/gGLxiYnXUEEBLnLGQMj/ZuZO2Dgz4K60gnVxauldTrMAZBdeTtNdbjcoBP5/WNs/uTC4u/qzaH3/ZC6KU/XqwUKi77Lneq4Mqf8vB98/hw5tS2pRYyKPRFOFCr2lx+jCYfKnHhf6y26DfX5g4/4UZZtOnNrEBk7Ph6IZlXcZR9ZqkUUDwnTvBH4K9VPl+44k4iHJaJfVm+Bb5bzNChXf/OsvKDSqfygAAAABJRU5ErkJggg=='

