export const navigationEngine = {
  nextIndex({ currentIndex, total }) {
    if (currentIndex + 1 >= total) return currentIndex;
    return currentIndex + 1;
  },

  prevIndex({ currentIndex }) {
    if (currentIndex - 1 < 0) return 0;
    return currentIndex - 1;
  },

  jumpIndex({ index, total }) {
    if (index < 0) return 0;
    if (index >= total) return total - 1;
    return index;
  },

  getCurrentQuestion({ questions, currentIndex }) {
    return questions?.[currentIndex] || null;
  },
};
