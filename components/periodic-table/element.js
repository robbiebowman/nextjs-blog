import React from 'react';
import styles from './element.module.css';

const Element = ({ atomicNumber, symbol, fullName, hexColor, customValue }) => {
  const getBlendedTextColor = (hexColor) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Determine base color (black or white) based on luminance
    const baseColor = luminance > 0.5 ? [0, 0, 0] : [255, 255, 255];

    // Blend the base color with the background color
    const blendFactor = 0.3; // Adjust this value to control the blending intensity
    const blendedR = Math.round(baseColor[0] * (1 - blendFactor) + r * blendFactor);
    const blendedG = Math.round(baseColor[1] * (1 - blendFactor) + g * blendFactor);
    const blendedB = Math.round(baseColor[2] * (1 - blendFactor) + b * blendFactor);

    // Convert blended RGB back to hex
    return `#${(1 << 24 | blendedR << 16 | blendedG << 8 | blendedB).toString(16).slice(1)}`;
  };

  const textColor = getBlendedTextColor(hexColor);
  return (
    <div className={styles.element} style={{ backgroundColor: hexColor }}>
      <div className={styles.atomicNumber} style={{ color: textColor }}>{atomicNumber}</div>
      <div className={styles.symbol} style={{ color: textColor }}>{symbol}</div>
    </div>
  );
};

export default Element;
