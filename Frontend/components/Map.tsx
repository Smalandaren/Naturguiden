'use client'
import React from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import "leaflet/dist/leaflet.css";
//import 'leaflet-defaulticon-compatibility';
import { Place } from "@/types/Place";

export default function Map({ place }: { place: Place }){
    return <div>
        <MapContainer center={[place.latitude, place.longitude]} zoom={10} scrollWheelZoom={false} className="h-100 w-full justify-self-center px-10 m-0 z-0 rounded-xl border">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[place.latitude, place.longitude]}>
            <Popup>
                {place.name}
                <br/>
                {/*platsförfattare?*/}
            </Popup>
            </Marker>
        </MapContainer>
    </div>
};