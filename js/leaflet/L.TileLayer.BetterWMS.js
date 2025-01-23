// let dataAll = '';
let oHeadData = [];
let dataSplit = [];
let oDataOrdenamiento = new Object();
// let mDataOrden = [];

L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({

  onAdd: function (map) {
    // Triggered when the layer is added to a map.
    //   Register a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onAdd.call(this, map);
    // map.on('click', this.getFeatureInfo, this);
  },

  onRemove: function (map) {
    // Triggered when the layer is removed from a map.
    //   Unregister a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onRemove.call(this, map);
    // map.off('click', this.getFeatureInfo, this);
  },

  getFeatureInfo: function (evt) {
    var mostrarPopup = true;
    if (clicks >= 2) {
      mostrarPopup = false;
      return false;
    }

    // Make an AJAX request to the server and hope for the best
    var url = this.getFeatureInfoUrl(evt.latlng),
      showResults = L.Util.bind(this.showGetFeatureInfo, this);
    var latlngAux = evt.latlng;

    dataAll = '';
    oHeadData = [];
    mDataOrden = [];
    $.ajax({
      url: url,
      success: function (data, status, xhr) {
        console.log(status)
        var urlParams = new URLSearchParams(this.url);
        var capaXML = urlParams.get('QUERY_LAYERS');
        oDataOrdenamiento = new Object();
        var ordenCurrent = 0;
        for (var i = 0; i < mCapaTree.length; i++) {
          if (mCapaTree[i].capaxml == capaXML) {
            ordenCurrent = mCapaTree[i].ordencapa;
            break;
          }
        }

        oDataOrdenamiento.orden = ordenCurrent;

        var err = typeof data === 'string' ? null : data;
        //Limpiamos la data
        var respLoad = data;
        if (respLoad.toString().length <= 0)
          return;
        var indiceBodyIni = respLoad.indexOf('<table>');
        var sbstrLoad = respLoad.substr(indiceBodyIni, respLoad.toString().length - indiceBodyIni);
        var indiceBodyFin = sbstrLoad.indexOf('</table>');

        //Obtenemos el Head 
        // let tematicaTemp = sbstrLoad.substr(sbstrLoad.indexOf('<h6>') + 4, sbstrLoad.indexOf('</h6>') - 16);
        let  tematicaTemp = sbstrLoad.substr(sbstrLoad.indexOf('<h6>') + 4, sbstrLoad.indexOf('</h6>') - sbstrLoad.indexOf('<h6>') - 4)
        var panelHead = '';
        panelHead = '<h6>' + tematicaTemp + '</h6><div class="row"><div class="col s8" style="margin: -10px 0px;"><div class="divider"></div></div></div>';
        sbstrLoad = '' + panelHead + sbstrLoad.substr(0, indiceBodyFin + 8).replace('<h6>' + tematicaTemp + '</h6>', '') + '' + '<br />';
        oDataOrdenamiento.cuerpo = sbstrLoad;

        //Verificamos si existe el registro en el arreglo
        for (var i = 0; i < mDataOrden.length; i++) {
          if (mDataOrden[i].orden == ordenCurrent) {
            mDataOrden = mDataOrden.filter(function (elem) {
              return elem.orden != oDataOrdenamiento.orden
            });
          }
        }

        mDataOrden.push(oDataOrdenamiento);
        mDataOrden.sort(function (a, b) { return a.orden - b.orden });

        //Si existe data, eliminamos el último </div> porque es el que cierra el DIV principal y la nueva tabla debe estar dentro de él
        if (dataAll.length > 0)
          dataAll = dataAll.substring(0, dataAll.length - 6);

        dataAll = '<div class="row modal-scroll" id="rowMetadataTable" style="margin: 0px 0px;">';
        for (var i = 0; i < mDataOrden.length; i++) {
          dataAll = dataAll + mDataOrden[i].cuerpo;
        }
        dataAll = dataAll + `<br /><a id="btnDownloadMetadata" style="bottom: 0% !important;" href="#" onclick="descargarMetadata();" data-tag="buttonDownload"><img alt="Descargar" src="../../images/icons/salida/modal_print/print.png"></a></div>`;

        showResults(err, evt.latlng, dataAll);
      },
      error: function (xhr, status, error) {
        showResults(error);
      }
    });
  },


  getFeatureInfoUrl: function (latlng) {
    // Construct a GetFeatureInfo request URL given a point
    var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
      size = this._map.getSize(),
      params = {
        request: 'GetFeatureInfo',
        service: 'WMS',
        srs: 'EPSG:4326',
        // crs: 'EPSG:4326',
        styles: this.wmsParams.styles,
        transparent: this.wmsParams.transparent,
        version: this.wmsParams.version,
        format: this.wmsParams.format,
        bbox: this._map.getBounds().toBBoxString(),
        height: size.y,
        width: size.x,
        layers: this.wmsParams.layers,
        query_layers: this.wmsParams.layers,
        info_format: 'text/html'
      };
    params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
    params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;
    return this._url + L.Util.getParamString(params, this._url, true);
  },
  showGetFeatureInfo: function (err, latlng, content) {

    if (err) { console.log(err); return; } // do nothing if there's an error
    var anchoMax = (screen.width - 150 > 800) ? 800 : screen.width - 150;
    // Otherwise show the content in a popup, or something.

    if (cancelMetadata) {
      cancelMetadata = false;
      return;
    }
    openMetadata(content);
    // L.popup({ maxWidth: anchoMax, minWidth: 400, maxHeight: 200 })
    //   .setLatLng(latlng)
    //   .setContent(content)
    //   .openOn(this._map);
  }
});

L.tileLayer.betterWms = function (url, options) {
  return new L.TileLayer.BetterWMS(url, options);
};