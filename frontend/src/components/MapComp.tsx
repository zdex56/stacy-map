import { useEffect, useState } from "react"
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';


function MapComp(){
useEffect(()=>{  
var map = L.map('map').setView([51.505, -0.09], 13);

var marker = L.marker([51.5, -0.09]).addTo(map);
marker.bindPopup('ты тут дур')

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let providerSearch = new OpenStreetMapProvider();

let searchControl = new (GeoSearchControl as any)({
  provider:providerSearch,
  style: 'bar',  
})


map.addControl(searchControl)

    },[])


return(
    
        <div className="main_map">

             <div id="map"></div>
        </div>
    )
}


export default MapComp;