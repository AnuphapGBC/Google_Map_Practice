// App.js
import React, { useState } from 'react';
import MapComponent from './components/Map/MapComponent';
import locationsData from './data/locationsData';
import LocationList from './components/Lists/LocationList';
import { CssBaseline, Grid } from '@mui/material';

const App = () => {
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(null);

  const handleLocationSelect = (index) => {
    setSelectedLocationIndex(index);
  };

  const handleLocationDetails = (locationDetails) => {
    console.log('Selected Location Details:', locationDetails);
    // You can perform any additional actions with the location details
  };

  return (
    // console.log(selectedLocationIndex),
    <>
      <CssBaseline />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <LocationList
            locations={locationsData}
            onSelect={handleLocationSelect}
            onLocationSelect={handleLocationDetails}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <MapComponent
            locationsData={locationsData}
            selectedLocationIndex={selectedLocationIndex}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
