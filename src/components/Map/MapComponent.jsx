import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapComponent.scss';

const MapComponent = ({ locations, isCompleted = [], activeLocationIndex = null }) => {
  const mapContainerRef = useRef(null);
  let centeredLocation = []
  
  if (activeLocationIndex === null) {
    centeredLocation = [locations[0].lng, locations[0].lat]
  }

  if (activeLocationIndex !== null) {
    centeredLocation = [locations[activeLocationIndex].lng, locations[activeLocationIndex].lat]
  }

  if (activeLocationIndex === null && isCompleted.length) {
    centeredLocation = [locations[isCompleted.length - 1].lng, locations[isCompleted.length - 1].lat]
  }

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.stadiamaps.com/styles/osm_bright.json',
      center: centeredLocation,
      zoom: 15,
    });
  
    // Wait for the map's style to load before adding markers and layers
    map.on('load', () => {
      locations.forEach((location, index) => {
        const classNames = [
          isCompleted.includes(index) ? 'completed' : 'marker',
          activeLocationIndex === index ? 'selected-location' : 'marker',
        ].join(' ');

        new maplibregl.Marker({ 
          color: `rgb(56, 33, 255)`,
          className: classNames,
        }).setLngLat([location.lng, location.lat]).addTo(map);
  
        if (index < locations.length - 1) {
          const nextLocation = locations[index + 1];
          map.addLayer({
            id: `route${index}`,
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [location.lng, location.lat],
                    [nextLocation.lng, nextLocation.lat],
                  ],
                },
              },
            },
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': 'rgb(56, 33, 255)', 'line-width': 4 },
          });
        }

      });
    });
  
    return () => map.remove();
  }, [locations]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default MapComponent;
