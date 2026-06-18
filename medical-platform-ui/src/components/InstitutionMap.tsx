import { useEffect, useRef } from "react";
import L from "leaflet";

// Importujemo CSS direktno u index.css umesto ovde
// Dodajte ovo u src/index.css:
// @import 'leaflet/dist/leaflet.css';

interface Institution {
  id: number;
  naziv: string;
  adresa: string;
  grad: string;
  lat?: number;
  lng?: number;
}

interface Props {
  institutions: Institution[];
}

const DEFAULT_CENTER: [number, number] = [44.8125, 20.4612];

export default function InstitutionMap({ institutions }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const validInstitutions = institutions.filter((i) => i.lat && i.lng);
  const center: [number, number] =
    validInstitutions.length > 0
      ? [validInstitutions[0].lat!, validInstitutions[0].lng!]
      : DEFAULT_CENTER;

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Fix za Leaflet marker ikonice
    const icon = L.icon({
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    const map = L.map(mapRef.current).setView(center, 12);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    validInstitutions.forEach((inst) => {
      L.marker([inst.lat!, inst.lng!], { icon })
        .addTo(map)
        .bindPopup(`<b>${inst.naziv}</b><br>${inst.adresa}, ${inst.grad}`);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <div ref={mapRef} style={{ height: "400px", width: "100%" }} />
    </div>
  );
}