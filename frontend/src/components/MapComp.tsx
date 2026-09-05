import { useActionState, useEffect, useState } from "react"
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import type { Points } from '../../interface/test';
import { URL } from "../../config";

import 'leaflet-contextmenu'
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';

import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';




function MapComp(){

const [mess,setMess] = useState<string|number>();
const [massiv,setMassiv] = useState<Points[]>([]);
const [trigger,setTrigger] = useState(0)

async function DelPoint(Point_id:number){
    console.log('попытка')
    let result = await fetch(`${URL}/users/delPoint`,
    {
        method:'delete',
        headers:{
        'Authorization':'Bearer '+localStorage.getItem('token'),
        'Content-Type': 'application/json'},
        body: JSON.stringify({Point_id:Point_id}),
    })
    setTrigger(a=>a+1)
    console.log(trigger)

}

async function addPoint(lat:number,lng:number) {
console.log('попытка добавить')
let result = await fetch(`${URL}/users/addPoint`,
    {
        method:'POST',
        headers:{
        'Authorization':'Bearer '+localStorage.getItem('token'),
        'Content-Type': 'application/json'},
        body: JSON.stringify({lat:lat,lng:lng})
    })
let data = await result.json()
console.log(data.message)
setTrigger(a=>a+1)

    
}


useEffect(() => {
    console.log('massiv обновился:', massiv);
}, [massiv]); // пусть пока будет чтобы следить за данными которые у меня есть


useEffect(()=> // подрузка данных
{
    const get = async() =>
    {
        let result = await fetch(`${URL}/users/usertask`,{headers:{'Authorization':'Bearer '+localStorage.getItem('token')}})
        if (!result.ok)
        {
            setMess('что то пошло не так')
            return
        }
        let data = await result.json()
        setMassiv(data.result)
    }
    get()

},[trigger])

useEffect(()=>{   // карта

var map = L.map('map', {
    // @ts-ignore
	contextmenu: true,
    // @ts-ignore
    contextmenuWidth: 140,
	contextmenuItems: [ {
        text:'добавить',
        callback: add
    }
]}).setView([51.505, -0.09], 13);


function add()
{
map.once('mousemove',(e) =>{
    addPoint(e.latlng.lat,e.latlng.lng)
})




}



massiv.forEach(a=>{
    let marker = L.marker([a.lat,a.lng]).addTo(map);
    if (a.description === null)
    {
        marker.bindPopup('empty')
    }
    else
    {
        marker.bindPopup(`${a.description}`)
    }

}
)


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

return () =>  
{
    map.remove()
}
},[massiv])



const [otobr, setOtoabr] = useState(null);

const handleToggle = (id:any) => {
    setOtoabr(a => a === id ? null : id);
};
return(
        <div className="main_map">
            <div id="map"></div>

            <div>
                <ul className="ul_points">
                    {massiv.map((a, index) => (
                    <li className="li_points" onClick={() => handleToggle(a.point_id)} key={a.point_id}>
                        <h2 style={{margin: '10px'}}>{index + 1} айди точки {a.point_id}</h2>
                        <div className={`h2_dropdown ${otobr === a.point_id ? 'open' : ''}`}>
                            <p>меню для точки {a.point_id}</p>
                            <button className="dropdown_btn" onClick={(e) => {e.stopPropagation(),DelPoint(a.point_id)}}>пись</button>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}


export default MapComp;