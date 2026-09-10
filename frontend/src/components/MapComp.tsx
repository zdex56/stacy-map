import { useActionState, useEffect, useRef, useState } from "react"
import "leaflet/dist/leaflet.css";
import L, { Map } from 'leaflet';
import type { Points } from '../../interface/test';
import { URL } from "../../config";

import 'leaflet-contextmenu'
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';

import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';




function MapComp(){
const mapref = useRef<L.Map | null>(null);
const [mess,setMess] = useState<string|number>();
const [massiv,setMassiv] = useState<Points[]>([]);
const [trigger,setTrigger] = useState(0)
const [description, setDescription] = useState('')
const [otobr, setOtoabr] = useState({id:0,desc:false});


async function DelPoint(Point_id:number){
    let result = await fetch(`${URL}/users/delPoint`,
    {
        method:'delete',
        headers:{
        'Authorization':'Bearer '+localStorage.getItem('token'),
        'Content-Type': 'application/json'},
        body: JSON.stringify({Point_id:Point_id}),
    })
    setTrigger(a=>a+1)
}

async function addPoint(lat:number,lng:number) {
let result = await fetch(`${URL}/users/addPoint`,
    {
        method:'POST',
        headers:{
        'Authorization':'Bearer '+localStorage.getItem('token'),
        'Content-Type': 'application/json'},
        body: JSON.stringify({lat:lat,lng:lng})
    })
setTrigger(a=>a+1)
}

function FindPoint(point_id:number)
{
    let ifindpoint = massiv.filter(a => a.point_id===point_id)
    mapref.current?.setView([ifindpoint[0].lat,ifindpoint[0].lng],15 ,{animate:true})
}

function addDesctription(point_id:number,description:string)
{
let result = fetch(`${URL}/users/description`,
    {
        method:'POST',
        headers: {        
        'Authorization':'Bearer '+localStorage.getItem('token'),
        'Content-Type': 'application/json'},
        body: JSON.stringify({point_id:point_id,description:description})
    }
)
setOtoabr({id:0,desc:false})
setTrigger(a=>a+1) // нормальная практика ваще ?
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

    const saved = localStorage.getItem('mapcoord');
    let center: [number, number] = [51.505, -0.09]; 
    let zoom = 13;
    
    if (saved) {
        const coords = JSON.parse(saved);
        center = [coords.lat, coords.lng];
        zoom = coords.zoom;
    }
    

var map = L.map('map', {
    // @ts-ignore
	contextmenu: true,
    // @ts-ignore
    contextmenuWidth: 140,
	contextmenuItems: [ {
        text:'добавить',
        callback: add
    }
]}).setView([center[0],center[1]],zoom);

mapref.current = map

function add(e:any)
{
addPoint(e.latlng.lat,e.latlng.lng)
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

    map.on('moveend', () => {
        const center = map.getCenter();
        localStorage.setItem('mapcoord', JSON.stringify({
            lat: center.lat,
            lng: center.lng,
            zoom: map.getZoom()
        }));
    });

return () =>  
{
    map.remove()
}
},[massiv])


function handlechange (e:React.ChangeEvent<HTMLInputElement>)
{
setDescription(e.target.value)
}

const handleToggle = (id:any) => {
    if (id===otobr.id)
    {
        setOtoabr({id:0,desc:false})
    }
    else
    {
        setOtoabr({id:id,desc:false})
    }
};
const descToggle = () =>
{
if (otobr.desc === true)
{
    setOtoabr(a=>({...a,desc:false}))
}
else
{
    setOtoabr(a=>({...a,desc:true}))
}
}

return(
        <div className="main_map">
            <div id="map"></div>

            <div>
                <ul className="ul_points">
                    {massiv.map((a, index) => (
                    <li className="li_points" onClick={() => handleToggle(a.point_id)} key={a.point_id}>
                        <h2 style={{margin: '10px'}}>{index + 1} айди точки {a.point_id}</h2>
                        <div className={`h2_dropdown ${otobr.id === a.point_id ? 'open' : ''}`}>
                            <p>меню для точки {a.point_id}</p>
                            <button onClick={(e) => {e.stopPropagation(),DelPoint(a.point_id)}}>удалить</button>
                            <button onClick={(e) => {e.stopPropagation(),FindPoint(a.point_id)}}>найти</button>
                            <button onClick={(e) => {e.stopPropagation(),descToggle()}}>добавить описание</button>
                            <input className={`input_desc ${otobr.desc === true ? 'open' : ''}`} 
                            onClick={(e)=>{e.stopPropagation()}} 
                            onChange={handlechange}
                            onKeyDown={(e)=>{ if (e.key === 'Enter') addDesctription(a.point_id,description)}}
                            type="text" placeholder="описание точки"/>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}


export default MapComp;