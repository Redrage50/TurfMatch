import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Custom pin icon (turf-green) built as inline SVG data URL — no external asset needed.
const pinSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
  <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" fill="#2F9E44"/>
  <circle cx="15" cy="15" r="6" fill="#F5F5F0"/>
</svg>`);

const pinIcon = new L.Icon({
  iconUrl: `data:image/svg+xml,${pinSvg}`,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -36],
});

export default function TurfMap({ turfs, center, onSelect, selectedId }) {
  return (
    <div className="map-wrap">
      <MapContainer center={[center.lat, center.lng]} zoom={11} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {turfs.map((t) => (
          <Marker
            key={t.id}
            position={[t.lat, t.lng]}
            icon={pinIcon}
            eventHandlers={{ click: () => onSelect && onSelect(t) }}
          >
            <Popup>
              <div className="map-popup-title">{t.name}</div>
              <div className="map-popup-meta">{t.area} • ₹{t.pricePerHour}/hr • ⭐ {t.rating}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
