const map_options = {
    renderer: L.canvas(),
    zoomSnap: 0.25,
    zoomDelta: 0.25,
    scrollWheelZoom: false,
    smoothWheelZoom: true,
    smoothSensitivity: 1
}

var map = L.map('map', map_options).setView([-34.6173459,-58.4531727], 12);

map.scrollWheelZoom = true;


var coord_casa = L.latLng(-34.6792407, -58.5161018) //Casa fer
const radio_caminata = 500



L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.marker([-34.6173459,-58.4531727]).addTo(map);


let punto = null

var popup = L.popup();

function onMapClick(e) {
    let coord_clickeada = e.latlng
    const lat = coord_clickeada.lat
    const lng = coord_clickeada.lng

    coord_clickeada = {lat: lat, lng: lng}
    console.log("CLICK", coord_clickeada)

    mostrar_lineas_cerca_de(coord_clickeada)
}

map.on('click', onMapClick);


const ZoomViewer = L.Control.extend({
    onAdd() {
        const container = L.DomUtil.create('div');
        const gauge = L.DomUtil.create('div');
        container.style.width = '200px';
        container.style.background = 'rgba(255,255,255,0.5)';
        container.style.textAlign = 'left';
        map.on('zoomstart zoom zoomend', (ev) => {
            gauge.innerHTML = `Zoom level: ${map.getZoom()}`;
        });
        container.appendChild(gauge);
        return container;
    }
});

const zoomViewerControl = (new ZoomViewer()).addTo(map);



let circle = null;



function mostrar_lineas_cerca_de(latlng) {
    
    if (circle != null) {
        circle.remove()
    }
    
    circle = L.circle(latlng, {radius: radio_caminata})
    circle.addTo(map)
    dibujar_punto(latlng)

    const lineas_cerca = []

    

    for (const [linea, paradas_linea] of Object.entries(paradas)) {
        for (const parada of paradas_linea) {
            if (L.latLng(parada).distanceTo(latlng) < radio_caminata) {
                lineas_cerca.push(linea)
                break
            }
        }
    }

    mostrar_lineas(lineas_cerca)
}



const polylines = {}
function cargar_recorridos_lineas(json) {
    for (const [key, latlngs] of Object.entries(json)) {
        const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
        const polyline = L.polyline(latlngs, {smoothFactor:0.1, color:randomColor, weight:2})
        polylines[key] = polyline;
    }
}

function mostrar_todas_las_lineas() {
    for (const polyline of Object.values(polylines)) {
        polyline.addTo(map)
    }

    mostrar_paradas_de_todas_las_lineas()
}

function ocultar_todas_las_lineas() {
    for (const polyline of Object.values(polylines)) {
        polyline.remove();
    }

    ocultar_paradas_de_todas_las_lineas()
}

function mostrar_lineas(lineas) {
    ocultar_todas_las_lineas()
    for (const linea of lineas) {
        polylines[linea].addTo(map)
    }

    mostrar_paradas_de_lineas(lineas)
}

const paradas = {}
const gui_paradas = {}
function cargar_paradas(json) {
    for (const [key, latlngs] of Object.entries(json)) {
        const paradas_linea = latlngs;
        paradas[key] = paradas_linea;

        gui_paradas[key] = []
        for (const latlng of paradas_linea) {
            const parada = crear_nuevo_punto(latlng)
            gui_paradas[key].push(parada)
        }
    }
}

function mostrar_paradas_de_todas_las_lineas() {
    for (const paradas_linea of Object.values(gui_paradas)) {
        for (const parada of paradas_linea) {
            parada.addTo(map)
        }
    }
} 

function ocultar_paradas_de_todas_las_lineas() {
    for (const paradas_linea of Object.values(gui_paradas)) {
        for (const parada of paradas_linea) {
            parada.remove()
        }
    }
}

function mostrar_paradas_de_lineas(lineas) {
    ocultar_paradas_de_todas_las_lineas()
    for (const linea of lineas) {
        for (const parada of gui_paradas[linea]) {
            parada.addTo(map)
        }
    }
}

    
    // for (const [key, latlngs] of Object.entries(json)) {

        // var esquipear_linea = true

        // for (const lat_long of latlngs) {
        //     if (L.latLng(lat_long).distanceTo(coord_casa) < radio_caminata) {
        //         esquipear_linea = false
        //         break
        //     }
        // }

        // if (esquipear_linea) {
        //     continue
        // }

        // polylines.push(L.polyline(latlngs, {color:"red"}).bindPopup("linea"))
        // polyline.setOffset(2)

        // for (const lat_long of latlngs) {
        //     // dibujar_punto(lat_long)
        // }
    // }




function dibujar_colectivos_geojson(geojson) {
    L.geoJSON(geojson, {
        onEachFeature: function (feature, layer) {
            return
        }
    }).bindPopup(function (layer) {
        return layer.feature.properties.LINEA;
    }).addTo(map);

    const tileIndex = geojsonvt(geojson)

    const options = {
        maxZoom: 24,  // max zoom to preserve detail on; can't be higher than 24
        // tolerance: 3, // simplification tolerance (higher means simpler)
        // extent: 4096, // tile extent (both width and height)
        // buffer: 64,   // tile buffer on each side
        // debug: 0,     // logging level (0 to disable, 1 or 2)
        // lineMetrics: false, // whether to enable line metrics tracking for LineString/MultiLineString features
        // promoteId: null,    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
        // generateId: false,  // whether to generate feature ids. Cannot be used with `promoteId`
        // indexMaxZoom: 5,       // max zoom in the initial tile index
        // indexMaxPoints: 100000 // max number of points per tile in the index
    }

    // var vrLayer = L.geoJson.vt(geojson, options)

    // vrLayer.bindPopup(function (layer) {
    //     return layer.feature.properties.LINEA;
    // })

    // vrLayer.addTo(map)

    // console.log(tileIndex)
}

function dibujar_colectivos_geojson_vector(geojson) {
    L.vectorGrid.slicer(geojson).addTo(map)
}





// fetch('./lineasbusrmbajurisdiccionnacional.geojson')
//     .then((response) => response.json())
//     .then(dibujar_colectivos_geojson);

// fetch('./lineasbusrmbajurisdiccionmunicipal.geojson')
//     .then((response) => response.json())
//     .then(dibujar_colectivos_geojson);

// fetch('./lineasbusrmbajurisdiccionprovincial.geojson')
//     .then((response) => response.json())
//     .then(dibujar_colectivos_geojson);
    

// const delay = ms => new Promise(res => setTimeout(res, ms));
// await delay(5000);

console.log("CARGANDO PARADAS")
await fetch('./gtfs/paradas.json')
    .then((response) => response.json())
    .then(cargar_paradas)

console.log("CARGANDO RECORRIDOS")
await fetch('./gtfs/recorridos.json')
    .then((response) => response.json())
    .then(cargar_recorridos_lineas)
    .then(mostrar_todas_las_lineas)

console.log("CARGADO TERMINADO")


function crear_nuevo_punto(latlng) {
    const nuevoPunto = L.circle(latlng, {radius:4,
        color:"black",
        fillOpacity:1})

    return nuevoPunto
}


function dibujar_punto(latlng) {
    if (punto != null) {
        punto.remove()
    }

    punto = L.circle(latlng, {radius:4,
        color:"black",
        fillOpacity:1}).addTo(map)

    return punto
}
