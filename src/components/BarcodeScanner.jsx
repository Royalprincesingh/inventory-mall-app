import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';

const BarcodeScanner = ({ onScan, onClose, title = 'Scan Barcode/QR Code' }) => {
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('initializing');
  const [isRequesting, setIsRequesting] = useState(true);
  const scannerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    let html5QrCode;

    const startScanner = async () => {
      try {
        // Initialize Html5Qrcode directly instead of the wrapper UI
        html5QrCode = new Html5Qrcode("qr-reader");
        scannerRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        // Attempt to start the scanner by explicitly requesting the back camera
        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            console.log('🎉 SUCCESS:', decodedText);
            if (isMountedRef.current) {
              navigator.vibrate?.([100, 50, 100]);

              // Stop the scanner immediately upon successful scan
              html5QrCode.stop().then(() => {
                scannerRef.current = null;
                onScan(decodedText);
              }).catch((err) => {
                console.warn('Failed to stop scanner on success', err);
                onScan(decodedText);
              });
            }
          },
          (errorMessage) => {
            // Silently ignore scan failure errors that happen every frame
          }
        );

        if (isMountedRef.current) {
          setStatus('ready');
          setIsRequesting(false);
        }
      } catch (err) {
        console.error('❌ Full error:', err);
        if (!isMountedRef.current) return;

        let errorMsg = '❌ Camera failed';

        // Simplify error handling for user presentation
        if (err.message && err.message.includes('HTTPS')) {
          errorMsg = '⚠️ HTTPS required for camera access on mobile';
        } else if (err.name === 'NotAllowedError' || (err.message && err.message.includes('PermissionDeniedError'))) {
          errorMsg = '📷 Permission denied - Please allow camera access in your browser settings';
        } else if (err.name === 'NotFoundError' || (err.message && err.message.includes('device not found'))) {
          errorMsg = '📷 No camera found on this device';
        } else if (err.name === 'NotReadableError' || (err.message && err.message.includes('NotReadableError'))) {
          errorMsg = '⚠️ Camera is already in use by another application or tab';
        } else {
          errorMsg = `❌ ${err.message || 'Unknown error occurred while accessing the camera'}`;
        }

        setError(errorMsg);
        setStatus('error');
        setIsRequesting(false);
      }
    };

    // Small delay to ensure the div is painted in the DOM
    setTimeout(() => {
      if (isMountedRef.current) startScanner();
    }, 100);

    return () => {
      isMountedRef.current = false;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.warn);
      }
    };
  }, [onScan]);

  const handleRetry = () => {
    setError(null);
    setStatus('initializing');
    setIsRequesting(true);
    // Component will unmount/remount logic handles the rest, 
    // but a cleaner approach is to just remount via key if needed.
    // For now we just call onClose to force a fresh mount on the parent since
    // Html5Qrcode cleanup on retry is tricky without unmounting.
    onClose(); 
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col items-center justify-center relative bg-gray-50 dark:bg-gray-900 min-h-[400px]">
          
          {isRequesting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-gray-800/90 z-10">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Requesting Camera Access...</p>
              <p className="text-xs text-gray-500 mt-2">Please allow permissions if prompted</p>
            </div>
          )}

          {status === 'error' && (
            <div className="w-full space-y-4 px-2">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5 text-center shadow-sm">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-sm font-semibold text-red-900 dark:text-red-200">{error}</p>
              </div>
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleRetry}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-medium transition-colors shadow-sm"
                >
                  Close & Try Again
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* We always render the div, but hide it if error occurs */}
          <div className={`w-full ${status === 'error' ? 'hidden' : 'block'}`}>
            <div className="w-full max-w-[320px] mx-auto bg-black rounded-lg overflow-hidden shadow-inner ring-1 ring-gray-200 dark:ring-gray-700">
              <div
                id="qr-reader"
                style={{
                  width: '100%',
                  minHeight: '300px'
                }}
              />
            </div>
            {status === 'ready' && (
              <div className="mt-6 text-center space-y-4">
                <p className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-xs font-semibold text-blue-700 dark:text-blue-300">
                  📱 Position barcode in the green square
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel Scanning
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
