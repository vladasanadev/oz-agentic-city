import { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';

export default function SplineCanvas({ splineUrl, className, onLoaded }) {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const appRef = useRef(null);
  const loadAttemptRef = useRef(0);
  const renderedRef = useRef(false);

  useEffect(() => {
    let timeoutId;
    let checkReadyIntervalId;
    
    // Function to check if the scene is completely ready
    const checkAndNotifyReady = () => {
      if (isLoaded || !appRef.current) return;
      
      // If rendered and more than 2 seconds have passed since load attempt, consider it ready
      if (renderedRef.current && loadAttemptRef.current > 0 && Date.now() - loadAttemptRef.current > 2000) {
        window.clearInterval(checkReadyIntervalId);
        setIsLoaded(true);
        if (onLoaded) onLoaded();
      }
    };
    
    if (canvasRef.current) {
      const app = new Application(canvasRef.current);
      appRef.current = app;
      
      // Load the Spline scene
      loadAttemptRef.current = Date.now();
      app.load(splineUrl).then(() => {
        // Start checking readiness every 200ms
        checkReadyIntervalId = window.setInterval(checkAndNotifyReady, 200);
        
        // Failsafe - if nothing happens after 5 seconds, consider it loaded
        timeoutId = window.setTimeout(() => {
          if (!isLoaded) {
            window.clearInterval(checkReadyIntervalId);
            setIsLoaded(true);
            if (onLoaded) onLoaded();
          }
        }, 5000);
      });
      
      // Add rendered event listener as a backup loading detection method
      app.addEventListener('rendered', () => {
        renderedRef.current = true;
        
        // Mark as ready after a short delay following render
        if (!isLoaded) {
          timeoutId = window.setTimeout(() => {
            window.clearInterval(checkReadyIntervalId);
            setIsLoaded(true);
            if (onLoaded) onLoaded();
          }, 800);
        }
      });
    }
    
    return () => {
      // Clean up timeouts and app on unmount
      window.clearTimeout(timeoutId);
      window.clearInterval(checkReadyIntervalId);
      
      if (appRef.current) {
        try {
          appRef.current.dispose();
        } catch (e) {
          // Silently handle disposal errors
        }
      }
    };
  }, [splineUrl, onLoaded, isLoaded]);

  const canvasClass = className ? className : "w-full h-[100px]";

  return <canvas ref={canvasRef} className={canvasClass} />;
} 