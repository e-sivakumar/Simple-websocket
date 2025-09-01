export function getAvatarColor(name) {
    const colors = [
      "#F87171", "#FBBF24", "#34D399",
      "#60A5FA", "#A78BFA", "#F472B6"
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }
  