// LocationList.js
import React, { useState } from 'react';
import locationsData from '../../data/locationsData';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const LocationList = ({ onSelect, onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleLocationChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedLocation(selectedIndex);
    onSelect(selectedIndex);
    onLocationSelect(locationsData[0][selectedIndex][1]);
  };

  return (
    <div>
      {/* <h2>Location List</h2>
      <FormControl fullWidth>
        <InputLabel id="location-selector-label">Select a Location</InputLabel>
        <Select
          labelId="location-selector-label"
          id="location-selector"
          value={selectedLocation}
          onChange={handleLocationChange}
        >
          {locationsData[0].map((location, index) => (
            <MenuItem key={index} value={index}>
              {location[1].addressName} - {location[1].cityTown}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}

      {/* Hover Table */}
      <TableContainer component={Paper} style={{ maxHeight: '400px', overflow: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow> 
              <TableCell>Name</TableCell>
              <TableCell>Address Name</TableCell>
              <TableCell>City/Town</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locationsData[0].map((location, index) => (
              <TableRow
                key={index}
                hover
                onClick={() => {
                  setSelectedLocation(index);
                  onSelect(index);
                  onLocationSelect(location[1]);
                }}
                style={{ cursor: 'pointer', backgroundColor: index === selectedLocation ? '#e0e0e0' : 'inherit' }}
              >
                <TableCell>{location[0][0]}</TableCell>
                <TableCell>{location[1].addressName}</TableCell>
                <TableCell>{location[1].cityTown}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LocationList;