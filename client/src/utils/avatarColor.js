export function getAvatarColor(name) {
    // const colors = [
    //   "#F87171", "#FBBF24", "#34D399",
    //   "#60A5FA", "#A78BFA", "#F472B6"
    // ];
    // const index = name.charCodeAt(0) % colors.length;
    // return colors[index];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    // Hue: 0–360
    const hue = Math.abs(hash) % 360;
    // Fixed saturation & lightness for better contrast
    const saturation = 65; // %
    const lightness = 55; // %
  
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  