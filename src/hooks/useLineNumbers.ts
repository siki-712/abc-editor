export const useLineNumbers = (text: string): string => {
  const lines = text.split('\n');
  return lines.map((_, i) => i + 1).join('\n');
};
