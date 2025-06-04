'use client'
import React from "react";
import { Button } from "@/components/ui/button";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import "../node_modules/leaflet/dist/leaflet.css"
//import 'leaflet-defaulticon-compatibility';
import { Place } from "@/types/Place";
import { Link } from "lucide-react";
import MapMarker from "@/siteImages/MapMarker.png"

export default function FullMap({ places }: { places: Place[] }){
    return <>
        <MapContainer center={[55.983250, 13.544403]} zoom={8} scrollWheelZoom={true} className="w-full justify-self-center px-10 m-0 z-0 rounded-xl border h-100   
                    sm:transition-height sm:duration-500 sm:ease-in-out sm:h-50 sm:transform sm:hover:h-90">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {places.map((place) => (
                <Marker position={[place.latitude, place.longitude]}icon={new Icon({iconUrl: MapMarker.src, iconSize: [25, 41], iconAnchor: [12, 41]})} key={place.id}>
                    <Popup>
                        <div>
                            <h1 className="text-xl">{place.name}</h1>
                            <br/>
                            <a href={`/place/${place.id}`} key={place.id}>
                                <Button >Öppna plats</Button>
                            </a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    </>
};