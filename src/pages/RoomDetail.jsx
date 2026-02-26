import React from 'react';
import { useParams } from 'react-router-dom';

const RoomDetail = () => {
  const { id } = useParams();
  return (
    <div>
      <h2>Room Detail</h2>
      <p>Viewing details for room ID: {id}</p>
    </div>
  );
};

export default RoomDetail;
