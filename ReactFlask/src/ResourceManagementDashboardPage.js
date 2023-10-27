import React, { useState } from 'react';
import './ResourceManagementDashboardPage.css';

function App() {
  const [hwSets, setHwSets] = useState([
    { name: 'HW Set 1', capacity: '100', available: '50', request: '0' },
    { name: 'HW Set 2', capacity: '200', available: '150', request: '0' }
  ]);

  const handleInputChange = (e, index, field) => {
    const newHwSets = [...hwSets];
    newHwSets[index][field] = e.target.value;
    setHwSets(newHwSets);
  };

  const checkIn = (index, val) => {
    if (val) {
      const parsedVal = parseInt(val, 10);
      if (!isNaN(parsedVal) && parsedVal > 0) {
        const newHwSets = [...hwSets];
        const currentAvailable = parseInt(newHwSets[index].available, 10);
        const capacity = parseInt(newHwSets[index].capacity, 10);
        const newAvailable = currentAvailable + parsedVal;
        newHwSets[index].available = newAvailable <= capacity ? newAvailable.toString() : capacity.toString();
        setHwSets(newHwSets);
      }
    }
  };

  const checkOut = (index, val) => {
    if (val) {
      const parsedVal = parseInt(val, 10);
      if (!isNaN(parsedVal) && parsedVal > 0) {
        const newHwSets = [...hwSets];
        const currentAvailable = parseInt(newHwSets[index].available, 10);
        const newAvailable = currentAvailable - parsedVal;
        newHwSets[index].available = newAvailable >= 0 ? newAvailable.toString() : '0';
        setHwSets(newHwSets);
      }
    }
  };

  const handleCheckIn = (index) => {
    checkIn(index, hwSets[index].request);
  };

  const handleCheckOut = (index) => {
    checkOut(index, hwSets[index].request);
  };

  const renderRow = (set, index) => (
    <div className="row" key={index}>
      <div className="cell name">{set.name}</div>
      <div className="cell"><input type="text" value={set.capacity} onChange={(e) => handleInputChange(e, index, 'capacity')} /></div>
      <div className="cell"><input type="text" value={set.available} onChange={(e) => handleInputChange(e, index, 'available')} /></div>
      <div className="cell"><input type="text" value={set.request} onChange={(e) => handleInputChange(e, index, 'request')} /></div>
      <div className="cell"><button onClick={() => handleCheckIn(index)}>Check In</button></div>
      <div className="cell"><button onClick={() => handleCheckOut(index)}>Check Out</button></div>
    </div>
  );

  return (
    <div className="container">
      <h1>Resource Management</h1>
      <div className="header">
        <div className="cell name"></div>
        <div className="cell">Capacity</div>
        <div className="cell">Available</div>
        <div className="cell">Request</div>
        <div className="cell"></div>
        <div className="cell"></div>
      </div>
      {hwSets.map((set, index) => renderRow(set, index))}
    </div>
  );
}

export default App;