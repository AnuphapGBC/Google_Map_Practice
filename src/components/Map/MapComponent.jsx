import React, { useState } from 'react';
import { GoogleMap, LoadScript, InfoWindow, Marker } from '@react-google-maps/api';
import MarkerClusterer from 'marker-clusterer-plus';
import { Card, CardContent, Typography } from '@mui/material';

const MapComponent = ({ locationsData, selectedLocationIndex }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: 43.6532,
    lng: -79.3832,
  };

  const options = {
    gridSize: 50,
    maxZoom: 5,
    enableRetinaIcons: true,
  };

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [infoWindowContent, setInfoWindowContent] = useState(null); // State for info window content
  const [infoWindowPosition, setInfoWindowPosition] = useState(null); // State for info window position


  const onMapLoad = (map) => {
    const validMarkers = [];

    for (let i = 0; i < locationsData[0].length; i++) {
      const locationData = locationsData[0][i];
      const locationInfo = locationData[1];

      if (locationInfo && typeof locationInfo === 'object') {
        const latitude = parseFloat(locationInfo.latitude);
        const longitude = parseFloat(locationInfo.longitude);

        if (!isNaN(latitude) && !isNaN(longitude)) {
          const position = {
            lat: latitude,
            lng: longitude,
          };

          const marker = new window.google.maps.Marker({
            position,
            title: `${locationData[0][0]} ${locationData[0][1]}`,
            index: i,
          });

          validMarkers.push(marker);

          marker.addListener('click', () => {
            setSelectedMarker(i);
          });
        } else {
          console.error(`Invalid coordinates for location at index ${i}`);
          console.log('Latitude:', locationInfo ? locationInfo.latitude : 'undefined');
          console.log('Longitude:', locationInfo ? locationInfo.longitude : 'undefined');
        }
      }
    }

    const clusterStyles = [
      {
        textColor: 'white',
        url: 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2300CED1" width="40px" height="40px"><circle cx="12" cy="12" r="10" stroke="%2300CED1" stroke-width="2" fill="%2300CED1" fill-opacity="1" /></svg>',
        height: 40,
        width: 40,
      },
    ];

    const markerCluster = new MarkerClusterer(map, validMarkers, {
      options,
      styles: clusterStyles,
      zoomOnClick: false
    });

    markerCluster.addListener('clusteringend', () => {
      const clusters = markerCluster.getClusters();
      clusters.forEach((cluster, index) => {
        console.log(`Cluster ${index + 1} contains ${cluster.getMarkers().length} markers.`);
      });
    });

// Condition check when cluster is clicked, if markers are less than 10 then show the markers, else show the cluster
    markerCluster.addListener('clusterclick', (cluster) => {
      let totalLat = 0;
      let totalLng = 0; 
      const markers = cluster.getMarkers();
      console.log('Before If statement');
      if (markers.length < 10) {
        console.log('Cluster clicked');
        markers.forEach(marker => {
          totalLat += marker.getPosition().lat();
          totalLng += marker.getPosition().lng();
        });
    
        const avgLat = totalLat / markers.length;
        const avgLng = totalLng / markers.length;
    

        const markerDetails = markers.map((marker) => {
          // Assuming each marker has some information to display
          return `<div>${marker.getTitle()}</div>`; // Modify this to fit your marker data
        }).join('');

        const infowindow = new window.google.maps.InfoWindow({
          content: markerDetails,
        });
        infowindow.setPosition({ lat: avgLat, lng: avgLng });
        infowindow.setContent(markerDetails);
        infowindow.open(map, cluster);
      } else {
        map.fitBounds(cluster.getBounds());
      }
    });

    const bounds = new window.google.maps.LatLngBounds();
    validMarkers.forEach((marker) => {
      bounds.extend(marker.getPosition());
    });

    map.fitBounds(bounds);
  };

  const getLocationLink = (position) => {
    const { lat, lng } = position;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  // console.log(selectedMarker)

  return (
    <LoadScript googleMapsApiKey="">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={5}
        onLoad={onMapLoad}
      >
        {/* Render markers */}
        {locationsData[0].map((locationData, index) => (
          <Marker
            key={index}
            position={{
              lat: parseFloat(locationData[1].latitude),
              lng: parseFloat(locationData[1].longitude),
            }}
            onClick={() => setSelectedMarker(index)}
            icon={index === selectedMarker ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' : undefined}
          />
        ))}

        {/* Render InfoWindow for selected marker */}
        {selectedMarker !== null && (
          <InfoWindow
            position={{
              lat: parseFloat(locationsData[0][selectedMarker][1].latitude),
              lng: parseFloat(locationsData[0][selectedMarker][1].longitude),
            }}
            onCloseClick={() => {
              setSelectedMarker(null);
              setInfoWindowContent(null);
              setInfoWindowPosition(null);}}
          >
            <Card>
              <CardContent>
                <Typography variant="h6">{locationsData[0][selectedMarker][1].addressName}</Typography>
                <Typography>
                  <a
                    href={getLocationLink({
                      lat: parseFloat(locationsData[0][selectedMarker][1].latitude),
                      lng: parseFloat(locationsData[0][selectedMarker][1].longitude),
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Google Maps
                  </a>
                </Typography>
              </CardContent>
            </Card>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
