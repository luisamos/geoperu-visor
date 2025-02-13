
/*! leaflet.nontiledlayer - v1.0.8 - 2019-12-20 */


!function (a) {
    if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = a();
    else if ("function" == typeof define && define.amd)
        define([], a);
    else {
        var b; b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this,
            (b.L || (b.L = {})).NonTiledLayer = a()
    }
}(function () {
    return function () { 
        function a(b, c, d) { 

            function e(g, h) { 
                if (!c[g]) { if (!b[g]) { 
                    var i = "function" == typeof require && require; 
                    if (!h && i) 
                        return i(g, !0); 
                    if (f) 
                        return f(g, !0); 
                    var j = new Error("Cannot find module '" + g + "'"); 
                    throw j.code = "MODULE_NOT_FOUND", j 
                } 
                
                var k = c[g] = { exports: {} }; 
                b[g][0].call(k.exports, function (a) { return e(b[g][1][a] || a) }, k, k.exports, a, b, c, d) } 
                return c[g].exports 
            } 
            
            for (var f = "function" == typeof require && require, g = 0; g < d.length; g++)
                e(d[g]); 
            return e 
        } 
        return a 
    }()({
        1: [function (a, b, c) {
            (function (a) {
                "use strict"; var c = "undefined" != typeof window ? window.L : void 0 !== a ? a.L : null; c.NonTiledLayer.WMS = c.NonTiledLayer.extend({
                    defaultWmsParams: { service: "WMS", request: "GetMap", version: "1.1.1", layers: "", styles: "", format: "image/jpeg", transparent: !1 }, options: { crs: null, uppercase: !1 }, 
                    
                    initialize: function (a, b) { 
                        this._wmsUrl = a; var d = c.extend({}, this.defaultWmsParams); for (var e in b) c.NonTiledLayer.prototype.options.hasOwnProperty(e) || c.Layer && c.Layer.prototype.options.hasOwnProperty(e) || (d[e] = b[e]); this.wmsParams = d, c.setOptions(this, b) },
                    
                    onAdd: function (a) {
                        this._crs = this.options.crs || a.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version); 
                        var b = this._wmsVersion >= 1.3 ? "crs" : "srs"; 
                        this.wmsParams[b] = this._crs.code, c.NonTiledLayer.prototype.onAdd.call(this, a)
                    }, 
                    
                    getImageUrl: function (a, b, d) { 
                        var e = this.wmsParams; e.width = b, e.height = d; 
                        var f = this._crs.project(a.getNorthWest()), 
                        g = this._crs.project(a.getSouthEast()), 
                        h = this._wmsUrl, 
                        i = i = (this._wmsVersion >= 1.3 && this._crs === c.CRS.EPSG4326 ? [g.y, f.x, f.y, g.x] : [f.x, g.y, g.x, f.y]).join(","); 
                        return h + c.Util.getParamString(this.wmsParams, h, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + i 
                    }, 

                    setParams: function (a, b) { 
                            return c.extend(this.wmsParams, a), b || this.redraw(), this 
                    }
                }), 
                
                c.nonTiledLayer.wms = function (a, b) { 
                    return new c.NonTiledLayer.WMS(a, b) 
                }, 
                
                b.exports = c.NonTiledLayer.WMS
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}], 2: [function (a, b, c) {
            (function (a) {
                "use strict"; var c = "undefined" != typeof window ? window.L : void 0 !== a ? a.L : null; c.NonTiledLayer = (c.Layer || c.Class).extend({
                    includes: c.Evented || c.Mixin.Events, emptyImageUrl: "data:image/gif;base64,R0lGODlhAQABAHAAACH5BAUAAAAALAAAAAABAAEAAAICRAEAOw==", options: { attribution: "", opacity: 1, zIndex: void 0, minZoom: 0, maxZoom: 18, pointerEvents: null, errorImageUrl: "data:image/gif;base64,R0lGODlhAQABAHAAACH5BAUAAAAALAAAAAABAAEAAAICRAEAOw==", bounds: c.latLngBounds([-85.05, -180], [85.05, 180]), useCanvas: void 0, detectRetina: !1 }, key: "", initialize: function (a) { c.setOptions(this, a) },
                    onAdd: function (a) { 
                        this._map = a, void 0 === this._zoomAnimated && (this._zoomAnimated = c.DomUtil.TRANSITION && c.Browser.any3d && !c.Browser.mobileOpera && this._map.options.zoomAnimation), c.version < "1.0" && this._map.on(this.getEvents(), this), this._div || (this._div = c.DomUtil.create("div", "leaflet-image-layer"), this.options.pointerEvents && (this._div.style["pointer-events"] = this.options.pointerEvents), void 0 !== this.options.zIndex && (this._div.style.zIndex = this.options.zIndex), void 0 !== this.options.opacity && (this._div.style.opacity = this.options.opacity)), this.getPane().appendChild(this._div); var b = !!window.HTMLCanvasElement; void 0 === this.options.useCanvas ? this._useCanvas = b : this._useCanvas = this.options.useCanvas, this._useCanvas ? (this._bufferCanvas = this._initCanvas(), this._currentCanvas = this._initCanvas()) : (this._bufferImage = this._initImage(), this._currentImage = this._initImage()), this._update() }, getPane: function () { return c.Layer ? c.Layer.prototype.getPane.call(this) : (this.options.pane ? this._pane = this.options.pane : this._pane = this._map.getPanes().overlayPane, this._pane) },

                    getFeatureInfo: function (evt) {
                        // Make an AJAX request to the server and hope for the best
                        var url = this.getFeatureInfoUrl(evt.latlng),
                            showResults = L.Util.bind(this.showGetFeatureInfo, this);
                        $.ajax({
                            url: url,
                            success: function (data, status, xhr) {
                                var err = typeof data === 'string' ? null : data;
                                showResults(err, evt.latlng, data);
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

                        // Otherwise show the content in a popup, or something.
                        L.popup({ maxWidth: 800 })
                            .setLatLng(latlng)
                            .setContent(content)
                            .openOn(this._map);
                    },

                    onRemove: function (a) {
                        c.version < "1.0" && this._map.off(this.getEvents(), this), 
                        this.getPane().removeChild(this._div), 
                        this._useCanvas ? (this._div.removeChild(this._bufferCanvas), this._div.removeChild(this._currentCanvas)) : (this._div.removeChild(this._bufferImage), this._div.removeChild(this._currentImage))
                    }, 
                    addTo: function (a) { 
                        return a.addLayer(this), 
                        this 
                    }, 
                    _setZoom: function () { 
                        this._useCanvas ? (this._currentCanvas._bounds && this._resetImageScale(this._currentCanvas, !0), this._bufferCanvas._bounds && this._resetImageScale(this._bufferCanvas)) : (this._currentImage._bounds && this._resetImageScale(this._currentImage, !0), this._bufferImage._bounds && this._resetImageScale(this._bufferImage)) }, getEvents: function () { var a = { moveend: this._update }; return this._zoomAnimated && (a.zoomanim = this._animateZoom), c.version >= "1.0" && (a.zoom = this._setZoom), a }, getElement: function () { return this._div }, setOpacity: function (a) { return this.options.opacity = a, this._div && c.DomUtil.setOpacity(this._div, this.options.opacity), this }, setZIndex: function (a) { return a && (this.options.zIndex = a, this._div && (this._div.style.zIndex = a)), this }, bringToFront: function () { return this._div && this.getPane().appendChild(this._div), this }, bringToBack: function () { return this._div && this.getPane().insertBefore(this._div, this.getPane().firstChild), this }, getAttribution: function () { return this.options.attribution }, _initCanvas: function () { var a = c.DomUtil.create("canvas", "leaflet-image-layer"); return this._div.appendChild(a), a._image = new Image, this._ctx = a.getContext("2d"), this._map.options.zoomAnimation && c.Browser.any3d ? c.DomUtil.addClass(a, "leaflet-zoom-animated") : c.DomUtil.addClass(a, "leaflet-zoom-hide"), c.extend(a._image, { onload: c.bind(this._onImageLoad, this), onerror: c.bind(this._onImageError, this) }), a }, _initImage: function () { var a = c.DomUtil.create("img", "leaflet-image-layer"); return this._div.appendChild(a), this._map.options.zoomAnimation && c.Browser.any3d ? c.DomUtil.addClass(a, "leaflet-zoom-animated") : c.DomUtil.addClass(a, "leaflet-zoom-hide"), c.extend(a, { galleryimg: "no", onselectstart: c.Util.falseFn, onmousemove: c.Util.falseFn, onload: c.bind(this._onImageLoad, this), onerror: c.bind(this._onImageError, this) }), a }, redraw: function () { return this._map && this._update(), this }, _animateZoom: function (a) { this._useCanvas ? (this._currentCanvas._bounds && this._animateImage(this._currentCanvas, a), this._bufferCanvas._bounds && this._animateImage(this._bufferCanvas, a)) : (this._currentImage._bounds && this._animateImage(this._currentImage, a), this._bufferImage._bounds && this._animateImage(this._bufferImage, a)) }, _animateImage: function (a, b) { if (void 0 === c.DomUtil.setTransform) { var d = this._map, e = a._scale * d.getZoomScale(b.zoom), f = a._bounds.getNorthWest(), g = a._bounds.getSouthEast(), h = d._latLngToNewLayerPoint(f, b.zoom, b.center), i = d._latLngToNewLayerPoint(g, b.zoom, b.center)._subtract(h), j = h._add(i._multiplyBy(.5 * (1 - 1 / e))); a.style[c.DomUtil.TRANSFORM] = c.DomUtil.getTranslateString(j) + " scale(" + e + ") " } else { var d = this._map, e = a._scale * a._sscale * d.getZoomScale(b.zoom), f = a._bounds.getNorthWest(), g = a._bounds.getSouthEast(), h = d._latLngToNewLayerPoint(f, b.zoom, b.center); c.DomUtil.setTransform(a, h, e) } a._lastScale = e }, _resetImageScale: function (a, b) { var d = new c.Bounds(this._map.latLngToLayerPoint(a._bounds.getNorthWest()), this._map.latLngToLayerPoint(a._bounds.getSouthEast())), e = a._orgBounds.getSize().y, f = d.getSize().y, g = f / e; a._sscale = g, c.DomUtil.setTransform(a, d.min, g) }, _resetImage: function (a) { var b = new c.Bounds(this._map.latLngToLayerPoint(a._bounds.getNorthWest()), this._map.latLngToLayerPoint(a._bounds.getSouthEast())), d = b.getSize(); c.DomUtil.setPosition(a, b.min), a._orgBounds = b, a._sscale = 1, this._useCanvas ? (a.width = d.x, a.height = d.y) : (a.style.width = d.x + "px", a.style.height = d.y + "px") }, _getClippedBounds: function () { var a = this._map.getBounds(), b = a.getSouth(), d = a.getNorth(), e = a.getWest(), f = a.getEast(), g = this.options.bounds.getSouth(), h = this.options.bounds.getNorth(), i = this.options.bounds.getWest(), j = this.options.bounds.getEast(); b < g && (b = g), d > h && (d = h), e < i && (e = i), f > j && (f = j); var k = new c.LatLng(d, e), l = new c.LatLng(b, f); return new c.LatLngBounds(k, l) }, _getImageScale: function () { return this.options.detectRetina && c.Browser.retina ? 2 : 1 }, _update: function () { var a, b = this._getClippedBounds(), d = this._map.latLngToContainerPoint(b.getNorthWest()), e = this._map.latLngToContainerPoint(b.getSouthEast()), f = e.x - d.x, g = e.y - d.y; if (this._useCanvas ? (this._bufferCanvas._scale = this._bufferCanvas._lastScale, this._currentCanvas._scale = this._currentCanvas._lastScale = 1, this._bufferCanvas._sscale = 1, this._currentCanvas._bounds = b, this._resetImage(this._currentCanvas), a = this._currentCanvas._image, c.DomUtil.setOpacity(a, 0)) : (this._bufferImage._scale = this._bufferImage._lastScale, this._currentImage._scale = this._currentImage._lastScale = 1, this._bufferImage._sscale = 1, this._currentImage._bounds = b, this._resetImage(this._currentImage), a = this._currentImage, c.DomUtil.setOpacity(a, 0)), this._map.getZoom() < this.options.minZoom || this._map.getZoom() > this.options.maxZoom || f < 32 || g < 32) return this._div.style.visibility = "hidden", a.src = this.emptyImageUrl, this.key = a.key = "<empty>", void (a.tag = null); this.fire("loading"), f *= this._getImageScale(), g *= this._getImageScale(), this.key = b.getNorthWest() + ", " + b.getSouthEast() + ", " + f + ", " + g, this.getImageUrl ? (a.src = this.getImageUrl(b, f, g), a.key = this.key) : this.getImageUrlAsync(b, f, g, this.key, function (b, c, d) { a.key = b, a.src = c, a.tag = d }) }, _onImageError: function (a) { this.fire("error", a), c.DomUtil.addClass(a.target, "invalid"), a.target.src !== this.options.errorImageUrl && (a.target.src = this.options.errorImageUrl) }, _onImageLoad: function (a) { (a.target.src === this.options.errorImageUrl || (c.DomUtil.removeClass(a.target, "invalid"), a.target.key && a.target.key === this.key)) && (this._onImageDone(a), this.fire("load", a)) }, _onImageDone: function (a) { if (this._useCanvas) this._renderCanvas(a); else { c.DomUtil.setOpacity(this._currentImage, 1), c.DomUtil.setOpacity(this._bufferImage, 0), this._addInteraction && this._currentImage.tag && this._addInteraction(this._currentImage.tag); var b = this._bufferImage; this._bufferImage = this._currentImage, this._currentImage = b } "<empty>" !== a.target.key && (this._div.style.visibility = "visible") }, _renderCanvas: function (a) { this._currentCanvas.getContext("2d").drawImage(this._currentCanvas._image, 0, 0, this._currentCanvas.width, this._currentCanvas.height), c.DomUtil.setOpacity(this._currentCanvas, 1), c.DomUtil.setOpacity(this._bufferCanvas, 0), this._addInteraction && this._currentCanvas._image.tag && this._addInteraction(this._currentCanvas._image.tag); var b = this._bufferCanvas; this._bufferCanvas = this._currentCanvas, this._currentCanvas = b }
                }), c.nonTiledLayer = function () { return new c.NonTiledLayer }, b.exports = c.NonTiledLayer
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}]
    }, {}, [2, 1])(2)
});
//# sourceMappingURL=NonTiledLayer.js.map