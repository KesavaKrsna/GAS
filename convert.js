const hexToHsl = (hex) => {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return \`\${Math.round(h * 360)} \${Math.round(s * 100)}% \${Math.round(l * 100)}%\`;
};

console.log('--wine: ' + hexToHsl('#751c2b'));
console.log('--plum: ' + hexToHsl('#39121f'));
console.log('--gold: ' + hexToHsl('#fbb226'));
console.log('--orange: ' + hexToHsl('#ee6424'));
console.log('--cream: ' + hexToHsl('#fffdf7'));
console.log('--paper: ' + hexToHsl('#f8f5ed'));
console.log('--text: ' + hexToHsl('#3d2930'));
