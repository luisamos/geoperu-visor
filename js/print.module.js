var Mfprint = (function () {
    'use strict';
    //var _MASK = "http://proxy.geoperu.gob.pe/",
    var _MASK = "",
        _map,
        LEGEND_EXCEPTIONS = [
            "peru_sudamerica_mascara_",
            "peru_distritos_distinct_",
            "peru_departamentos_distinct_",
            "peru_provincias_distinct_",
            "peru_regiones_distinct_",
            "base_elevaciones"
        ],
        panes = {
            "defaultPane": 400,
            "ubigeoPane": 600
        },
        _settings = {
            "url": "",
            "layout": "",// A4H | A4V | A3H | A3V
            "dpi": "",
            "projection": "", // EPSG: format
            "legends": "",
            "title": "",
            "scale": "",
            "customLegends": ""
            //"outputFormat": "pdf"
        }

    /**
     * Constantes
     */
    //const BASE_URL = "https://espacialg.geoperu.gob.pe:3443/",
    const BASE_URL = PRINT_URL,
        //const BASE_URL = "http://localhost:5000/",
        INCHES_PER_METER = 39.3701,
        MAX_EXTENT = [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
        MAX_RESOLUTION = '156543.03390625',
        PROJECTION = 'EPSG:3857',
        UNITS = 'm',
        LEGEND_CONTAINERS = {
            A4: {
                P: 11,
                DPI: 92,
                FONTSIZE: 8
            },
            A3: {
                P: 13,
                DPI: 100,
                FONTSIZE: 9
            },
            A2: {
                P: 15,
                DPI: 110,
                FONTSIZE: 10
            },
            A1: {
                P: 17,
                DPI: 120,
                FONTSIZE: 11
            },
            A0: {
                P: 19,
                DPI: 130,
                FONTSIZE: 12
            },
        }

    /**
     * Funcion de construccion
     * @param {L.Map} mapObj 
     * @param {Object} settings
     */
    var init = (mapObj, settings = {}) => {
        // Defaults
        _settings.scale = ''
        _map = ''

        _map = jQuery.extend({}, mapObj)
        _settings.layout = settings.layout || "A4_HORIZONTAL_EXTENT"
        _settings.scale = settings.scale || ''
        _settings.scaled = settings.scaled || false
        _settings.projection = settings.projection || "EPSG:3857"
        _settings.title = settings.title || 'Geo Peru'
        _settings.dpi = settings.dpi || 90
        _settings.legends = settings.legends || true
        _settings.customLegends = settings.customLegends || []
        _settings.format = settings.format || 'pdf'
        //_settings.url = BASE_URL + "print-servlet/print/geoperu/report." + (settings.format || 'pdf')
        _settings.url = BASE_URL + "printer/"
        return Mfprint
    }

    async function _sendConfig(jsonData) {
        // METODO PERMITIDO POST
        var result;
        try {
            result = await $.ajax({
                url: _settings.url,
                type: 'POST',
                processData: false,
                dataType: 'json',
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(jsonData),
            });
        } catch (error) {
            throw new Error(400);
        }

        return result.statusURL;
    }

    //Imprimir
    async function print() {
        var jsonData = await _getJSONRequest();
        await _sendConfig(jsonData).then(async (statusURL) => {
            var statusURL = BASE_URL + statusURL
            var downloadURL = await _isReady(statusURL)

            return window.open(BASE_URL + downloadURL, "_blank");

        });
    }
    // Imprimir 2
    async function print2() {
        var jsonData = await _getJSONRequest(),
            result
        try {
            result = await $.ajax({
                url: _settings.url,
                type: 'POST',
                processData: false,
                dataType: 'json',
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(jsonData),
                // redirect: 'follow'
            });
        } catch (error) {
            console.log(error)
            throw new Error(400);
        }
        return window.open(BASE_URL + result.downloadURL.toString(), "_blank");
    }

    /*#########################################
    ## UTILS
    #########################################*/

    async function _isReady(url) {

        var res = await fetch(url);
        var data = await res.json()

        if (data.done === true && data.status === "finished") {
            return data.downloadURL;
        } else if (data.status === "error") {
            return Error(500)
        }
        else {
            return _isReady(url);
        }
    }

    /**
     * 
     * @param {L.bounds} latLngBounds 
     */
    function _createPolygonFromBounds(latLngBounds) {
        var center = latLngBounds.getCenter(),
            latlngs = [];


        latlngs.push(latLngBounds.getSouthWest());//bottom left
        latlngs.push({ lat: latLngBounds.getSouth(), lng: center.lng });//bottom center
        latlngs.push(latLngBounds.getSouthEast());//bottom right
        latlngs.push({ lat: center.lat, lng: latLngBounds.getEast() });// center right
        latlngs.push(latLngBounds.getNorthEast());//top right
        latlngs.push({ lat: latLngBounds.getNorth(), lng: map.getCenter().lng });//top center
        latlngs.push(latLngBounds.getNorthWest());//top left
        latlngs.push({ lat: map.getCenter().lat, lng: latLngBounds.getWest() });//center left

        return new L.polygon(latlngs);
    }

    /**
     * Returns proxified url or not
     * @param {String} url 
     */
    function _needsProxy(url) {
        let np = ["mapas.geoidep.gob.pe/geoidep", "visor.geoperu.gob.pe/images"],
            ns = ["google"],
            mask = _MASK

        let rurl = url
        // not conection
        for (let n in np) {
            console.log(url.indexOf(np[n]) != -1)
            if (url.indexOf(np[n]) != -1) {
                rurl = mask + url.split('//')[1]
            }
        }
        // not secure
        for (let n in ns) {
            console.log(url.indexOf(ns[n]) != -1)
            if (url.indexOf(ns[n]) != -1) {
                rurl = 'http://' + url.split('//')[1]
            }
        }

        return rurl

    }

    function _getAbsoluteUrl(url) {
        var a;

        if (L.Browser.ie) {
            a = document.createElement('a');
            a.style.display = 'none';
            document.body.appendChild(a);
            a.href = url;
            document.body.removeChild(a);
        } else {
            a = document.createElement('a');
            a.href = url;
        }

        // NEEDS PROXY
        return _needsProxy(a.href)
    }

    //** ENCODERS */
    var _encoders = {
        layers: {
            httprequest: function (layer) {
                var baseUrl = layer._url || layer._wmsUrl;

                if (baseUrl.indexOf('{s}') !== -1) {
                    baseUrl = baseUrl.replace('{s}', layer.options.subdomains[0]);
                }
                baseUrl = _getAbsoluteUrl(baseUrl);

                return {
                    baseURL: baseUrl,
                    opacity: layer.options.opacity
                };
            },
            tilelayer: function (layer) {
                var enc = _encoders.layers.httprequest.call(this, layer),
                    baseUrl = layer._url,
                    resolutions = [],
                    zoom;
                //baseUrl = layer._url.substring(0, layer._url.indexOf('{z}')) // Ver si tiene extension .png en caso de mapbox


                // If using multiple subdomains, replace the subdomain placeholder
                if (baseUrl.indexOf('{s}') !== -1) {
                    baseUrl = baseUrl.replace('{s}', layer.options.subdomains[0]);
                }

                //_map.getZoom();
                // zoomActual del Mapa
                //var maxZoom = _map.getZoom();

                for (zoom = 0; zoom <= layer.options.maxZoom; ++zoom) {
                    resolutions.push(MAX_RESOLUTION / Math.pow(2, zoom));
                }

                return L.extend(enc, {
                    // XYZ layer type would be a better fit but is not supported in mapfish plugin for GeoServer
                    // See https://github.com/mapfish/mapfish-print/pull/38
                    type: 'OSM',
                    baseURL: _needsProxy(baseUrl),
                    //extension: 'png',
                    tileSize: [layer.options.tileSize, layer.options.tileSize],
                    //maxExtent: MAX_EXTENT,
                    dpi: _settings.dpi,
                    //resolutions: resolutions,
                    //singleTile: true
                });
            },
            tilelayerwms: function (layer) {
                var enc = _encoders.layers.httprequest.call(this, layer),
                    layerOpts = layer.options,
                    p;

                L.extend(enc, {
                    type: 'WMS',
                    layers: [layerOpts.layers].join(',').split(',').filter(function (x) { return x !== ""; }), //filter out empty strings from the array
                    //format: layerOpts.format,
                    //styles: [layerOpts.styles].join(',').split(',').filter(function (x) {return x !== ""; }),
                    //singleTile: true
                });

                for (p in layer.wmsParams) {
                    if (layer.wmsParams.hasOwnProperty(p)) {
                        if ('detectretina,format,height,layers,request,service,srs,styles,version,width'.indexOf(p.toLowerCase()) === -1) {
                            if (!enc.customParams) {
                                enc.customParams = {};
                            }
                            enc.customParams[p] = layer.wmsParams[p];
                        }
                    }
                }
                // NECESARIO PARA LA RESOLUCION
                enc.customParams["DPI"] = _settings.dpi;
                enc.customParams["MAP_RESOLUTION"] = _settings.dpi;
                enc.customParams["FORMAT_OPTIONS"] = "dpi:" + _settings.dpi;

                return enc;
            },
            tilelayermapbox: function (layer) {
                var resolutions = [], zoom;

                //_map.getZoom();
                // zoomActual del Mapa
                var maxZoom = _map.getZoom();
                for (zoom = 0; zoom <= layer.options.maxZoom; ++zoom) {
                    resolutions.push(MAX_RESOLUTION / Math.pow(2, zoom));
                }

                var customParams = {};
                if (typeof layer.options.access_token === 'string' && layer.options.access_token.length > 0) {
                    customParams.access_token = layer.options.access_token;
                }

                return {
                    // XYZ layer type would be a better fit but is not supported in mapfish plugin for GeoServer
                    // See https://github.com/mapfish/mapfish-print/pull/38
                    type: 'OSM',
                    baseURL: layer.options.tiles[0].substring(0, layer.options.tiles[0].indexOf('{z}')),
                    opacity: layer.options.opacity,
                    extension: 'png',
                    tileSize: [layer.options.tileSize, layer.options.tileSize],
                    //maxExtent: L.print.Provider.MAX_EXTENT,
                    resolutions: resolutions,
                    singleTile: false,
                    customParams: customParams
                };
            },
            image: function (layer) {
                return {
                    type: 'Image',
                    opacity: layer.options.opacity,
                    name: 'image',
                    baseURL: _getAbsoluteUrl(layer._url),
                    //extent: _projectBounds(L.print.Provider.SRS, layer._bounds)
                };
            },
            vector: function (features) {
                var encFeatures = [],
                    encStyles = {},
                    opacity,
                    feature,
                    style,
                    dictKey,
                    dictItem = {},
                    styleDict = {},
                    styleName,
                    nextId = 1,
                    featureGeoJson,
                    i, l;

                for (i = 0, l = features.length; i < l; i++) {
                    feature = features[i];

                    if (feature instanceof L.Marker) {
                        var icon = feature.options.icon,
                            iconUrl = icon.options.iconUrl || L.Icon.Default.imagePath + '/marker-icon.png',
                            iconSize = L.Util.isArray(icon.options.iconSize) ? new L.Point(icon.options.iconSize[0], icon.options.iconSize[1]) : icon.options.iconSize,
                            iconAnchor = L.Util.isArray(icon.options.iconAnchor) ? new L.Point(icon.options.iconAnchor[0], icon.options.iconAnchor[1]) : icon.options.iconAnchor,
                            scaleFactor = (_settings.dpi / _settings.dpi);
                        style = {
                            symbolizers: [{
                                externalGraphic: _getAbsoluteUrl(iconUrl),
                                graphicWidth: (iconSize.x / scaleFactor),
                                graphicHeight: (iconSize.y / scaleFactor),
                                graphicXOffset: (-iconAnchor.x / scaleFactor),
                                graphicYOffset: (-iconAnchor.y / scaleFactor),
                                type: "point"
                            }]
                        };
                    } else {
                        style = _extractFeatureStyle(feature);
                    }

                    dictKey = JSON.stringify(style);

                    dictItem = styleDict[dictKey];
                    if (dictItem) {
                        styleName = dictItem;
                    } else {
                        dictKey = nextId++;
                        styleName = '_leaflet_style==' + dictKey
                        styleDict[dictKey] = styleName;
                        encStyles[styleName] = style;
                    }

                    featureGeoJson = (feature instanceof L.Circle) ? _circleGeoJSON(feature) : feature.toGeoJSON();
                    featureGeoJson.geometry.coordinates = _projectCoords(_settings.projection, featureGeoJson.geometry.coordinates);
                    featureGeoJson.properties._leaflet_style = dictKey;

					/*// All markers will use the same opacity as the first marker found
					if (opacity === null) {
						opacity = feature.options.opacity || 1.0;
					}*/

                    encFeatures.push(featureGeoJson);
                }
                /* FORMA ESTILO
                                "style": {
                                    "*": {
                                        "symbolizers": [
                                            {
                                                "strokeColor": "#d742f5",
                                                "strokeLinecap": "round",
                                                "strokeOpacity": 0.6,
                                                "stroke": true,
                                                "strokeWidth": 5,
                                                "fill": true,
                                                "type": "polygon"
                                            }
                                        ]
                                    },
                                    "version": "2"
                                },
                */
                // Especificar que el estilo es versión 2 de GEOJSON
                encStyles['version'] = '2'

                return {
                    type: 'geojson',
                    style: encStyles,
                    opacity: opacity,
                    geoJson: {
                        type: 'FeatureCollection',
                        features: encFeatures
                    }
                };
            }
        }
    }


    function _circleGeoJSON(circle) {
        var projection = circle._map.options.crs.projection;
        var earthRadius = 1, i;

        if (projection === L.Projection.SphericalMercator) {
            earthRadius = 6378137;
        } else if (projection === L.Projection.Mercator) {
            earthRadius = projection.R;
        }
        var cnt = projection.project(circle.getLatLng());
        var scale = 1.0 / Math.cos(circle.getLatLng().lat * Math.PI / 180.0);

        var points = [];
        for (i = 0; i < 64; i++) {
            var radian = i * 2.0 * Math.PI / 64.0;
            var shift = L.point(Math.cos(radian), Math.sin(radian));
            points.push(projection.unproject(cnt.add(shift.multiplyBy(circle.getRadius() * scale / earthRadius))));
        }

        console.log('Radio: ' + circle.getRadius() * scale / earthRadius)
        return L.polygon(points).toGeoJSON();
    }



    async function _getJSONRequest() {

        var request = {
            "layout": _settings.layout,
            "outputFormat": _settings.format,
            "attributes": {
                "title": _settings.title,
                "scale": _getScale(),
                "map": {
                    //"dpiSensitiveStyle": false,
                    "projection": _settings.projection,
                    "dpi": _settings.dpi,
                    "rotation": 0,
                    //"center": _projectCoords(_settings.projection, _map.getCenter()),
                    //"useAdjustBounds": true,
                    //"useNearestScale": true,
                    //"scale": _getScale(),
                    //"bbox": getProj(_settings.map),
                    "layers": _encodeLayers(),
                    "dpiSensitiveStyle": true
                },
                "overviewMap": {
                    "layers": _getOverviewMapLayer()
                },
                "legend": {
                    "name": "",
                    "classes": await _makeLegends()
                },
                "legend0": {
                    "name": "",
                    "classes": []
                },
                "legendOverflow": {
                    "name": "",
                    "classes": []
                }
            }
        }

        if (!_settings.scaled) {
            request.attributes.map['bbox'] = getProj(_settings.map)
        } else {
            request.attributes.map['center'] = _projectCoords(_settings.projection, _map.getCenter())
            request.attributes.map['scale'] = _getScale()
        }

        return request
    }


    function _getOverviewMapLayer() {
        var overviewMapLayer = []

        var baseLayer = _getLayers()
        .filter(layer => !layer.options.hasOwnProperty('pane') && !layer.hasOwnProperty('editing'))
        .map(layer => {
            if (layer instanceof L.TileLayer.WMS || layer.hasOwnProperty("_wmsUrl")) {
                return _encoders.layers.tilelayerwms.call(this, layer);
            } else if (L.mapbox && layer instanceof L.mapbox.TileLayer) {
                return _encoders.layers.tilelayermapbox.call(this, layer);
            } else if (layer instanceof L.TileLayer) {
                return _encoders.layers.tilelayer.call(this, layer);
            } else if (layer instanceof L.ImageOverlay) {
                return _encoders.layers.image.call(this, layer);
            }
        })
        

        console.log(baseLayer)

        //debuuger;
        // Incluir SIEMPRE capa departamento en minimap
        /* TODO*/
        overviewMapLayer.push(...baseLayer)

        return overviewMapLayer
    }

    /*#########################################
    ### Legend Managing
    #########################################*/

    async function _makeLegends(options = {}) {

        if (!_settings.legends) {
            return [];
        }

        var legends = [], legendReq, singlelayers, url, i;


        var layers = _getLayers(_map);
        var layer, oneLegend;

        // flag leyenda plan bi
        var hasOnePlanB = false

        for (i = 0; i < layers.length; i++) {
            layer = layers[i];

            if (layer instanceof L.TileLayer.WMS || layer.hasOwnProperty('_wmsUrl')) {
                // Si esta en excepciones, salta.
                if (LEGEND_EXCEPTIONS.indexOf(layer.options.title || layer.wmsParams.layers) !== -1) continue;


                if (_getCategoriaCustomLegend(layer.options.alias || layer.options.layers) === "TM_PLAN_BINACIONAL") {
                    if (hasOnePlanB) { continue }
                    else {
                        // Si la tematica es de plan binacional
                        hasOnePlanB = true

                        oneLegend = {
                            name: 'Plan Binacional',  // Solo si tiene nombre en la lista custom de leyenda
                            classes: [],
                            icons: [`https://visor.geoperu.gob.pe/images/${ _settings.layout.split('_')[0] == 'A4' ? 'legend_plan_binacional_small':'legend_plan_binacional_big'}.png`]
                        };
                    }
                } else {


                    //console.log(layer.options.title || layer.wmsParams.layers)
                    oneLegend = {
                        name: _nameOnCustomLegend(layer.options.title || layer.wmsParams.layers) ||
                            _nameOnCustomLegend(layer.options.alias) ||
                            layer.options.title ||
                            layer.wmsParams.layers,  // Solo si tiene nombre en la lista custom de leyenda
                        classes: []
                    };

                    // defaults
                    legendReq = {
                        'SERVICE': 'WMS',
                        'LAYER': layer.wmsParams.layers,
                        'REQUEST': 'GetLegendGraphic',
                        'VERSION': layer.wmsParams.version,
                        'FORMAT': layer.wmsParams.format === 'image/png8' ? 'image/png':layer.wmsParams.format, // Si es png8, solicitamos png
                        'STYLE': layer.wmsParams.styles,
                        'scale': 1000,
                        'LEGEND_OPTIONS': 'forceLabels:on;fontAntiAliasing:true;dpi:'
                            + LEGEND_CONTAINERS[_settings.layout.split('_')[0]]['DPI']
                            + ';fontSize:' + LEGEND_CONTAINERS[_settings.layout.split('_')[0]]['FONTSIZE'] + ';',
                        'WIDTH': LEGEND_CONTAINERS[_settings.layout.split('_')[0]]['P'],
                        'HEIGHT': LEGEND_CONTAINERS[_settings.layout.split('_')[0]]['P']
                    };

                    legendReq = L.extend(legendReq, options);
                    if (layer.hasOwnProperty("_url")) {
                        url = L.Util.template(layer._url);
                    } else if (layer.hasOwnProperty("_wmsUrl")) {
                        url = L.Util.template(layer._wmsUrl);
                    }

                    singlelayers = layer.wmsParams.layers.split(',');

                    // If a WMS layer doesn't have multiple server layers, only show one graphic
                    if (singlelayers.length === 1) {
                        oneLegend.icons = [_getAbsoluteUrl(url + L.Util.getParamString(legendReq, url, true))];
                        //oneLegend.icons = ["http://localhost:5000/static/legend_plan_binacional.jpeg"];

                    } else {
                        for (i = 0; i < singlelayers.length; i++) {
                            legendReq.LAYER = singlelayers[i];
                            oneLegend.classes.push({
                                name: singlelayers[i],
                                icons: [_getAbsoluteUrl(url + L.Util.getParamString(legendReq, url, true))]
                            });
                        }
                    }


                }




                legends.push(oneLegend);
            }
        }

        return legends;
    }

    function _nameOnCustomLegend(name) {
        if (_settings.customLegends) {
            for (let k in _settings.customLegends) {
                if (_settings.customLegends[k].capaxml === name) {
                    return _settings.customLegends[k].capa;
                }
            }
        }

        return false;
    }

    function _getCategoriaCustomLegend(name) {
        if (_settings.customLegends) {
            for (let k in _settings.customLegends) {
                if (_settings.customLegends[k].capaxml === name) {
                    return _settings.customLegends[k].tematico;
                }
            }
        }

        return false;
    }

    function _extractFeatureStyle(feature) {
        var options = feature.options;

        //Definir tipo de geometria
        var type = 'text'
        /*var gtype = feature.feature.geometry.type || undefined
        if (gtype === 'MultiPolygon' || gtype === 'Polygon') {
            type = 'polygon'
        } else if (gtype === 'Line' || gtype === 'PolyLine') {
            type = 'line'
        } else if (gtype === 'Point' || feature instanceof L.Marker) {
            type = 'point'
        } else if (feature instanceof L.tooltip) {
            type = 'tooltip'
        }*/

        if (feature instanceof L.Marker) {
            type = 'Point'
        }
        else if (feature instanceof L.tooltip) {
            type = 'Tooltip'
        }
        else if (feature instanceof L.Polygon) {
            type = 'Polygon'
        }
        else if (feature instanceof L.Circle) {
            type = 'point'
        }
        else if (feature instanceof L.Point) {
            type = 'Point'
        }
        else if (feature instanceof L.Polyline) {
            type = 'line'
        }



        var symbolizers = [];

        symbolizers.push({
            type: type,
            stroke: options.stroke,
            strokeColor: options.color || '#000',
            strokeWidth: options.weight || '0',
            strokeOpacity: options.opacity,
            strokeLinecap: 'round',
            fill: options.fill || '#000',
            fillColor: options.fillColor || options.color || "#000",
            fillOpacity: options.fillOpacity || '#000'
        })

        return {
            symbolizers
        };
    }

    /**
     * Calculate Scale from map width
     */
    function _getScale() {

        if (_settings.scaled === true) return _settings.scale

        // CAMBIAR DPI DE BASE

        var bounds = _map.getBounds(),
            inchesKm = INCHES_PER_METER * 1000,
            scales = [{ value: 5000 }, { value: 10000 }, { value: 25000 }, { value: 50000 }, { value: 100000 }, { value: 500000 }],
            sw = bounds.getSouthWest(),
            ne = bounds.getNorthEast(),
            halfLat = (sw.lat + ne.lat) / 2,
            midLeft = L.latLng(halfLat, sw.lng),
            midRight = L.latLng(halfLat, ne.lng),
            mwidth = midLeft.distanceTo(midRight),
            pxwidth = _map.getSize().x,
            kmPx = mwidth / pxwidth / 1000,
            mscale = (kmPx || 0.000001) * inchesKm * 90,
            closest = Number.POSITIVE_INFINITY,
            i = scales.length,
            diff,
            scale;

        /*console.log('Bounds:' + bounds)
        console.log('Pulgadas por KM:' + mwidth)
        console.log('Sur Oeste:' + sw)
        console.log('Nor Este: ' + ne)
        console.log('Latitud Media: ' + halfLat)
        console.log('Mitad Izquierda: ' + midLeft)
        console.log('Mitad Derecha: ' + midRight)
        console.log('Pixeles de ancho: ' + pxwidth)
        console.log('KM por PX: ' + kmPx)
        console.log('Map Scale: ' + parseInt((mscale), 10))*/

        return parseInt((mscale), 10);


        while (i--) {
            diff = Math.abs(mscale - Number(scales[i].value));
            if (diff < closest) {
                closest = diff;
                scale = parseInt(Number(scales[i].value), 10);
            }
        }
        /*var pw=650, ph=480;

        var resolution = _settings.dpi
        var width = Math.round(pw * resolution / 25.4);
        var height = Math.round(ph * resolution / 25.4);
        var size = map.getSize();
        var extent = map.getView().calculateExtent(size);*/

        return scale;
    }

    function _projectCoords(crs, coords) {
        var crsKey = crs.toUpperCase().replace(':', ''),
            crsClass = L.CRS[crsKey];

        if (!crsClass) {
            throw 'Unsupported coordinate reference system: ' + crs;
        }

        return _project(crsClass, coords);
    }

    function _project(crsClass, coords) {
        var projected,
            pt,
            i, l;

        if (typeof coords[0] === 'number') {
            coords = new L.LatLng(coords[1], coords[0]);
        }

        if (coords instanceof L.LatLng) {
            pt = crsClass.project(coords);
            return [pt.x, pt.y];
        } else {
            projected = [];
            for (i = 0, l = coords.length; i < l; i++) {
                projected.push(_project(crsClass, coords[i]));
            }
            return projected;
        }
    }

    function _getLayers() {
        var markers = [],
            vectors = [],
            tiles = [],
            imageOverlays = [],
            imageNodes,
            pathNodes,
            id;

        for (id in _map._layers) {
                //if (_map._layers[id].hasOwnProperty()) { continue; }
                var lyr = _map._layers[id];

                
                if (lyr.hasOwnProperty('wmsParams')) {
                    if (lyr.wmsParams.layers.length==0) {continue;}
                }
                //if (lyr.layers.length==0) { continue; }

                if (lyr instanceof L.TileLayer.WMS ||
                    lyr instanceof L.TileLayer ||
                    lyr.hasOwnProperty("_wmsUrl")) {
                    tiles.push(lyr);
                    
                } else if (lyr instanceof L.ImageOverlay) {
                    imageOverlays.push(lyr);
                } else if (lyr instanceof L.Marker) {
                    markers.push(lyr);
                    
                } else if (lyr instanceof L.Path && lyr.toGeoJSON) {
                    vectors.push(lyr);
                    
                } else { 
                    continue; 
                }
            
        }
        markers.sort(function (a, b) {
            return a._icon.style.zIndex - b._icon.style.zIndex;
        });

        var i;
        // Layers with equal zIndexes can cause problems with mapfish print
        for (i = 1; i < markers.length; i++) {
            if (markers[i]._icon.style.zIndex <= markers[i - 1]._icon.style.zIndex) {
                markers[i]._icon.style.zIndex = markers[i - 1]._icon.style.zIndex + 1;
            }
        }

		/*tiles.sort(function (a, b) {
            return a._map._container.style.zIndex - b._map._container.style.zIndex; // atención !! verificar si la propiedad existe en todos los objetos
        })
        .reverse();//invertimos el orden de las capas*/


        // Layers with equal zIndexes can cause problems with mapfish print
        for (i = 1; i < tiles.length; i++) {

            //Cada capa esta dentro de un pane, asi que sumamos el valor del zindex del pane al que pertenecen
            /*if ( tiles[i]._map._container.style.zIndex === "1" ) {
                tiles[i].options.zIndex = 0
                continue;
            }*/
            /*let zIndex = parseInt(tiles[i].options.zIndex)
            if(tiles[i].options.pane === 'ubigeoPane') {
                tiles[i].options.zIndex =  zIndex + 600
            } else {
                tiles[i].options.zIndex =  zIndex + 400
            }*/


            /*if ( parseInt(tiles[i].options.zIndex) <= parseInt(tiles[i - 1].options.zIndex) ) {
                tiles[i].options.zIndex = parseInt(tiles[i - 1].options.zIndex) + 1;
            }*/
            // Si la capa tiene la propiedad options
            /*if(tiles[i].hasOwnProperty("options")){
                if ( parseInt(tiles[i]._map._container.style.zIndex) <= parseInt(tiles[i - 1]._map._container.style.zIndex) ) {
                    parseInt(tiles[i]._map._container.style.zIndex) = parseInt(tiles[i - 1]._map._container.style.zIndex) + 1;
                }
            } else if (tiles[i].hasOwnProperty("_container")) { // sino usamos _container
                if ( parseInt(tiles[i]._map._container.style.zIndex) <= parseInt(tiles[i - 1]._map._container.style.zIndex) ) {
                    parseInt(tiles[i]._map._container.style.zIndex) = parseInt(tiles[i - 1]._map._container.style.zIndex) + 1;
                }
            } else { // No esperado
                throw 'No se encontró la propiedad options ni _container en capa' 
            }*/

        }
        const zIndexPane = (layer, first=true ) => {
            console.log(layer.options.layers)
            console.log(layer.options)
            let orden;
            if (layer.options.pane === 'ubigeoPane') {
                orden = layer.options.zIndex + 10000
            } else if (layer.options.pane === 'defaultPane') {
                orden = layer.options.zIndex + 1000
            } else {
                orden = 1; 
            }
            
            return orden + (first ? -1 : 0);
        }

        tiles.sort((a, b) => (zIndexPane(a) < zIndexPane(b, false)) ? 1 : -1)

        //console.log(tiles)


		/*imageNodes = [].slice.call(Mfprint, map._panes.overlayPane.childNodes);
		imageOverlays.sort(function (a, b) {
			return imageNodes.indexOf(a._image) - imageNodes.indexOf(b._image);
		});*/

        if (_map._pathRoot) {
            pathNodes = [].slice.call(this, _map._pathRoot.childNodes);
            vectors.sort(function (a, b) {
                return pathNodes.indexOf(a._container) - pathNodes.indexOf(b._container);
            });
        }

        return vectors.concat(imageOverlays).concat(markers).concat(tiles)
    }

    function _encodeLayers() {
        var enc = [],
            vectors = [],
            layer,
            i;

        var layers = _getLayers(_map);
        //console.log(layers)
        for (i = 0; i < layers.length; i++) {
            layer = layers[i];
            
            if (layer instanceof L.TileLayer.WMS || layer.hasOwnProperty("_wmsUrl")) {
                enc.push(_encoders.layers.tilelayerwms.call(this, layer));
            } else if (L.mapbox && layer instanceof L.mapbox.TileLayer) {
                enc.push(_encoders.layers.tilelayermapbox.call(this, layer));
            } else if (layer instanceof L.TileLayer) {
                enc.push(_encoders.layers.tilelayer.call(this, layer));
            } else if (layer instanceof L.ImageOverlay) {
                enc.push(_encoders.layers.image.call(this, layer));
            } else if (layer instanceof L.Marker || (layer instanceof L.Path && layer.toGeoJSON)) {
                vectors.push(layer);
            }
        }
        if (vectors.length) {
            enc.unshift(_encoders.layers.vector.call(this, vectors));
        }
        return enc;
    }

    function getProj() {
        // lng = x lat = y
        //var ruler = new CheapRuler(50.05, 'meters'); // calculations around latitude 35
        var ruler = new CheapRuler(50.05, 'meters'), // calculations around latitude 35

            bounds = _map.getBounds(),
            sw = bounds.getSouthWest(),
            ne = bounds.getNorthEast(),
            source = new proj4.Proj('WGS84'),
            dest = new proj4.Proj(_settings.projection),

            swPoint = new proj4.Point(sw.lng, sw.lat),
            nePoint = new proj4.Point(ne.lng, ne.lat),

            latlngSw = L.latLng(sw.lat, sw.lng),
            latlngNe = L.latLng(ne.lat, ne.lng),
            wichSideRelation = _map.getSize().x < _map.getSize().y,
            distanceMeters = latlngSw.distanceTo(latlngNe);

        // PANTALLAS MUY ANCHAS
        if (_map.getSize().x - _map.getSize().y > 340) {
            var mleft = distanceMeters * 0.11,
                mright = distanceMeters * -0.11
        }

        // PANTALLAS MUY ALTAS O CUADRADO
        if (_map.getSize().x - _map.getSize().y < 80) {
            var mleft = distanceMeters * -0.10
            mright = distanceMeters * 0.10
        }

        // PANTALLAS MUY ALTAS O CUADRADO
        if (_map.getSize().x - _map.getSize().y < 340) {
            var mleft = 0
            mright = 0
        }

        /*if ( _map.getSize().x - _map.getSize().y < 318 && _map.getSize().x - _map.getSize().y > 200) {
            var mleft   = 0,
            mright = 0
        } else {
            var mleft   = wichSideRelation ? distanceMeters * -0.09 : distanceMeters * 0.11,
            mright = wichSideRelation ? distanceMeters * 0.09 : distanceMeters * -0.11
        }*/


        /*var newSw = ruler.offset([swPoint.x, swPoint.y], 900000,0); 
        var newNe = ruler.offset([nePoint.x, nePoint.y], -900000,0);*/

        var newSw = ruler.offset([swPoint.x, swPoint.y], mleft, 0), // 10km east and 5km north
            newNe = ruler.offset([nePoint.x, nePoint.y], mright, 0),
            newSwPoint = new proj4.Point(newSw[0], newSw[1]),
            newNePoint = new proj4.Point(newNe[0], newNe[1]);

        /*console.log('Left:' + mleft)
        console.log('Right:' + mright)
        
        console.log('Dintancia en metros: ' + distanceMeters +'m')*/

        return [
            proj4.transform(source, dest, newSwPoint).x,
            proj4.transform(source, dest, newSwPoint).y,
            proj4.transform(source, dest, newNePoint).x,
            proj4.transform(source, dest, newNePoint).y
        ]

        /*halfLat = (sw.lat + ne.lat) / 2,
        midLeft = L.latLng(halfLat, sw.lng),
        midRight = L.latLng(halfLat, ne.lng),
        mwidth = midLeft.distanceTo(midRight),
        pxwidth = _map.getSize().x,
        kmPx = mwidth / pxwidth / 1000,*/



        //const bbox = ruler.bufferBBox([30.5, 50.5, 31, 51], 0.2);

        /*return [
            proj4.transform(source, dest, swPoint).x,
            proj4.transform(source, dest, swPoint).y,
            proj4.transform(source, dest, nePoint).x,
            proj4.transform(source, dest, nePoint).y
        ]*/

    }

    return {
        init: init, // Requerido
        getLayers: _encodeLayers,
        print: print,
        print2: print2,
        //getFile: getFile,
        legend: _makeLegends,
        getProj: getProj,
        createPolygonFromBounds: _createPolygonFromBounds
    }
    // All function and variables are scoped to this function
})();
