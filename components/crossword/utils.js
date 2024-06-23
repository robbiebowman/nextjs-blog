import React, { useState, useRef, useEffect } from 'react';

export const getPuzzleId = (puzzle) => {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(JSON.stringify(puzzle)).digest('hex')
}

export const FlexWrapDetector = ({ children, onWrap, className }) => {
  const [isWrapped, setIsWrapped] = useState(false);
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const checkForWrap = () => {
      if (containerRef.current && itemsRef.current.length > 1) {
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const isWrapped = itemsRef.current.some(
          item => item.getBoundingClientRect().top > containerTop + 1
        );
        
        setIsWrapped(isWrapped);
        if (onWrap) onWrap(isWrapped);
      }
    };

    checkForWrap();
    window.addEventListener('resize', checkForWrap);

    return () => window.removeEventListener('resize', checkForWrap);
  }, [onWrap]);

  return (
    <div ref={containerRef} style={{ display: 'flex', flexWrap: 'wrap' }} className={className}>
      {React.Children.map(children, (child, index) => (
        <div ref={el => (itemsRef.current[index] = el)}>{child}</div>
      ))}
    </div>
  );
};