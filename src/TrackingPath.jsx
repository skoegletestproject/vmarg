import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const TrackingPath = ({ logsData }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  useEffect(() => {
    // Initialize the map
    mapRef.current = L.map("pathMap", {
      zoomControl: false,
    }).setView([12.890417, 77.622236], 15);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapRef.current);

    return () => {
      // Clean up the map on component unmount
      mapRef.current.remove();
    };
  }, []);
 // console.log(edate)
    // const [endHours, endMinutes, endSeconds] = endTime.split(":");
    // const etime = `${endHours.padStart(2, "0")}:${endMinutes.padStart(2, "0")}:${(endSeconds || "00").padStart(2, "0")}`;
  useEffect(() => {
    if (!mapRef.current || logsData.length === 0) return;

    // Clear existing markers and polyline
    markersRef.current.forEach((marker) => mapRef.current.removeLayer(marker));
    markersRef.current = [];
    if (polylineRef.current) {
      mapRef.current.removeLayer(polylineRef.current);
    }

    // Add markers and draw the polyline
    const latLngs = logsData.map((log) => [parseFloat(log.lat), parseFloat(log.lng)]);

    // Start point marker (Red)
    const startMarker = L.marker(latLngs[0], {
      icon: L.icon({
        iconUrl: "https://img.icons8.com/color/48/null/red-circle.png",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    })
      .bindPopup(
        `Start Point<br>Latitude: ${logsData[0].lat}<br>Longitude: ${logsData[0].lng}<br>Date: ${logsData[0].date}<br>Time: ${logsData[0].time}`
      )
      .addTo(mapRef.current);
    markersRef.current.push(startMarker);

    // End point marker (Green)
    const endMarker = L.marker(latLngs[latLngs.length - 1], {
      icon: L.icon({
        iconUrl: "https://img.icons8.com/color/48/null/green-circle.png",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    })
      .bindPopup(
        `End Point<br>Latitude: ${logsData[logsData.length - 1].lat}<br>Longitude: ${logsData[logsData.length - 1].lng}<br>Date: ${logsData[logsData.length - 1].date}<br>Time: ${logsData[logsData.length - 1].time}`
      )
      .addTo(mapRef.current);
    markersRef.current.push(endMarker);

    // Intermediate points
    logsData.forEach((log, index) => {
      const marker = L.marker([parseFloat(log.lat), parseFloat(log.lng)], {
        icon: L.icon({
          iconUrl: "https://img.icons8.com/ios-filled/50/000000/circle.png",
          iconSize: [8, 8],
          iconAnchor: [4, 4],
        }),
      })
        .bindPopup(
          `Point ${index + 1}<br>Latitude: ${log.lat}<br>Longitude: ${log.lng}<br>Date: ${log.date}<br>Time: ${log.time}`
        )
        .addTo(mapRef.current);
      markersRef.current.push(marker);
    });

    // Draw polyline
    polylineRef.current = L.polyline(latLngs, {
      color: "blue",
      weight: 3,
    }).addTo(mapRef.current);

    // Adjust the map view to fit all markers
    mapRef.current.fitBounds(polylineRef.current.getBounds());
  }, [logsData]);

  return <div id="pathMap" style={{ height: "500px", width: "100%" }}></div>;
};

export default TrackingPath;
