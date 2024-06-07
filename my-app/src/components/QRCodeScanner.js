import React, { useEffect,useRef,useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRCodeScanner({onScanSuccess}) {
  let html5QrcodeScanner;
  const scannerRef = useRef(null);
  const [scannedData, setScannedData] = useState(null);
  
  useEffect(() => {
    // Define success and failure callback functions
    const onScanSuccessCallback = (decodedText, decodedResult) => {
      alert(`Scanned Data: ${decodedText}`);
      setScannedData(decodedText);
      onScanSuccess(decodedText); // Pass scanned data to parent component
    };

    const onScanFailure = (error) => {
      // Handle scan failure (optional)
      console.warn(`Code scan error = ${error}`);
    };

    // Create the HTML5 Qrcode Scanner instance
    html5QrcodeScanner = new Html5QrcodeScanner(
      'reader', // Element ID where the scanner will be rendered
      { fps: 10, qrbox: { width: 250, height: 250 } }, // Configuration object
      false // Verbose mode (optional)
    );

    // Render the scanner
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    return () => {
      // Cleanup and stop scanning when the component unmounts
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().then(() => {
          console.log('QR Code scanner stopped');
        }).catch((err) => {
          console.error('Error stopping QR Code scanner', err);
        });

        // Stop the camera feed directly
        const videoElement = document.querySelector('#reader video');
        if (videoElement && videoElement.srcObject) {
          const tracks = videoElement.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    };
   
  }, [onScanSuccess]);
  
  return (
    <div>
      <div id="reader"></div>
      
    </div>
  );
}

export default QRCodeScanner;
