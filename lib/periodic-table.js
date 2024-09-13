// Number to chemical symbol lookup table
export const symbolLookup = {
    1: 'H', 2: 'He', 3: 'Li', 4: 'Be', 5: 'B', 6: 'C', 7: 'N', 8: 'O', 9: 'F', 10: 'Ne',
    11: 'Na', 12: 'Mg', 13: 'Al', 14: 'Si', 15: 'P', 16: 'S', 17: 'Cl', 18: 'Ar',
    19: 'K', 20: 'Ca', 21: 'Sc', 22: 'Ti', 23: 'V', 24: 'Cr', 25: 'Mn', 26: 'Fe', 27: 'Co', 28: 'Ni', 29: 'Cu', 30: 'Zn',
    31: 'Ga', 32: 'Ge', 33: 'As', 34: 'Se', 35: 'Br', 36: 'Kr', 37: 'Rb', 38: 'Sr', 39: 'Y', 40: 'Zr', 41: 'Nb', 42: 'Mo', 43: 'Tc', 44: 'Ru', 45: 'Rh', 46: 'Pd', 47: 'Ag', 48: 'Cd',
    49: 'In', 50: 'Sn', 51: 'Sb', 52: 'Te', 53: 'I', 54: 'Xe', 55: 'Cs', 56: 'Ba', 57: 'La', 58: 'Ce', 59: 'Pr', 60: 'Nd', 61: 'Pm', 62: 'Sm', 63: 'Eu', 64: 'Gd', 65: 'Tb', 66: 'Dy', 67: 'Ho', 68: 'Er', 69: 'Tm', 70: 'Yb', 71: 'Lu',
    72: 'Hf', 73: 'Ta', 74: 'W', 75: 'Re', 76: 'Os', 77: 'Ir', 78: 'Pt', 79: 'Au', 80: 'Hg',
    81: 'Tl', 82: 'Pb', 83: 'Bi', 84: 'Po', 85: 'At', 86: 'Rn', 87: 'Fr', 88: 'Ra', 89: 'Ac', 90: 'Th', 91: 'Pa', 92: 'U', 93: 'Np', 94: 'Pu', 95: 'Am', 96: 'Cm', 97: 'Bk', 98: 'Cf', 99: 'Es', 100: 'Fm', 101: 'Md', 102: 'No', 103: 'Lr',
    104: 'Rf', 105: 'Db', 106: 'Sg', 107: 'Bh', 108: 'Hs', 109: 'Mt', 110: 'Ds', 111: 'Rg', 112: 'Cn',
    113: 'Nh', 114: 'Fl', 115: 'Mc', 116: 'Lv', 117: 'Ts', 118: 'Og'
};

// Function to get the row and column for each element
export const getPosition = (atomicNumber) => {
    if (atomicNumber <= 2) return { row: 1, col: atomicNumber === 1 ? 1 : 18 };
    if (atomicNumber <= 4) return { row: 2, col: atomicNumber - 2 };
    if (atomicNumber <= 10) return { row: 2, col: atomicNumber + 8 };
    if (atomicNumber <= 12) return { row: 3, col: atomicNumber - 10 };
    if (atomicNumber <= 18) return { row: 3, col: atomicNumber };
    if (atomicNumber <= 20) return { row: 4, col: atomicNumber - 18 };
    if (atomicNumber <= 36) return { row: 4, col: atomicNumber - 18 };
    if (atomicNumber <= 38) return { row: 5, col: atomicNumber - 36 };
    if (atomicNumber <= 54) return { row: 5, col: atomicNumber - 36 };
    if (atomicNumber <= 56) return { row: 6, col: atomicNumber - 54 };
    if (atomicNumber <= 71) return { row: 8, col: atomicNumber - 54 };
    if (atomicNumber <= 86) return { row: 6, col: atomicNumber - 68 };
    if (atomicNumber <= 88) return { row: 7, col: atomicNumber - 86 };
    if (atomicNumber <= 103) return { row: 9, col: atomicNumber - 86 };
    if (atomicNumber <= 118) return { row: 7, col: atomicNumber - 100 };

    // Default position for any unexpected atomic numbers
    return { row: 1, col: 1 };
};

// Function to interpolate between two hex colors
export const interpolateColor = (color1, color2, factor) => {
    if (factor < 0) factor = 0;
    if (factor > 1) factor = 1;

    // Convert hex to RGB
    const rgb1 = parseInt(color1.slice(1), 16);
    const rgb2 = parseInt(color2.slice(1), 16);

    // Extract RGB components
    const r1 = (rgb1 >> 16) & 255;
    const g1 = (rgb1 >> 8) & 255;
    const b1 = rgb1 & 255;

    const r2 = (rgb2 >> 16) & 255;
    const g2 = (rgb2 >> 8) & 255;
    const b2 = rgb2 & 255;

    // Interpolate
    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));

    // Convert back to hex
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

export const getElementColor = (categories, rangeMin, rangeMax, answerValue) => {
    if (rangeMin && rangeMax) {
        return interpolateColor(rangeMin, rangeMax, answerValue);
    } else if (answerValue) {
        return categories.find(cat => cat.name === answerValue).hexColour;
    } else {
        return "#FFFFFF";
    }
};

export const getContrastColor = (hexColor) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? '#000000AA' : '#FFFFFFCC';
  };