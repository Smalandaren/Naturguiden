'use client'
import React from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import "../node_modules/leaflet/dist/leaflet.css"
//import 'leaflet-defaulticon-compatibility';

const Map = () => {
    if(typeof window === 'undefined'){
        return <></>
    }

    return (
      
        <div>
            <MapContainer center={[51.505, -0.09]} zoom={12} scrollWheelZoom={false} className="h-100 w-full justify-self-center px-10 m-0 z-0 rounded-xl border">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[51.505, -0.09]}icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})} >
                  <Popup>
                    This is a popup
                  </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}

export default Map;