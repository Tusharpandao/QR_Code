import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';
import QrReader from 'react-qr-reader';

const Home = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [qrCodes, setQrCodes] = useState([]);

  useEffect(() => {
    fetch('/qrcodes')
      .then(res => res.json())
      .then(data => setQrCodes(data));
  }, []);

  const handleScan = data => {
    if (data) {
      setScannedCode(data);
    }
  };

  const handleSave = () => {
    fetch('/qrcodes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: scannedCode })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setQrCodes([...qrCodes, data.qrCode]);
        }
      });
  };

  return (
    <div>
      <QrReader
        onScan={handleScan}
        delay={300}
      />
      {scannedCode && (
        <div>
          <p>Scanned QR Code: {scannedCode}</p>
          <Button onClick={handleSave}>Save</Button>
        </div>
      )}
      <List>
        {qrCodes.map(qrCode => (
          <ListItem key={qrCode.id}>
            <ListItemAvatar>
              <Avatar>
                {qrCode.content[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={qrCode.content} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Home;
