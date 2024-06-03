import React, { useState, useEffect } from 'react';
// import { Button, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';
import { Button, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';

import Webcam from 'react-webcam'; // Import react-webcam
import { BrowserMultiFormatReader } from '@zxing/library'; // Import @zxing/library

const Home = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [qrCodes, setQrCodes] = useState([]);
  const webcamRef = React.useRef(null); // Reference to the webcam component

  useEffect(() => {
    fetch('/http://localhost:3001/qrcodes')
      .then((res) => res.json())
      .then((data) => setQrCodes(data));
  }, [qrCodes]);

  const handleScan = () => {
    // Access the webcam using react-webcam
    const webcam = webcamRef.current.video;

    // Create a BrowserMultiFormatReader
    const codeReader = new BrowserMultiFormatReader();

    // Decode from the webcam stream
    codeReader.decodeFromVideoDevice(undefined, webcam, (result, err) => {
      if (result) {
        setScannedCode(result.getText());
      }
      if (err) {
        console.error(err);
      }
    });
  };

  const handleSave = () => {
    fetch('/qrcodes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: scannedCode }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setQrCodes([...qrCodes, data.qrCode]);
        }
      });
  };

  return (
    <div>
      <Webcam ref={webcamRef} />
      <Button onClick={handleScan}>Scan QR Code</Button>
      {scannedCode && (
        <div>
          <p>Scanned QR Code: {scannedCode}</p>
          <Button onClick={handleSave}>Save</Button>
        </div>
      )}
      <List>
        {qrCodes.map((qrCode) => (
          <ListItem key={qrCode.id}>
            <ListItemAvatar>
              <Avatar>{qrCode.content[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={qrCode.content} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Home;
