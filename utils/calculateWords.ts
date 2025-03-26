export const calculateWords = (inputText: string): number => {
    return inputText.trim().split(/\s+/).filter(word => word).length;
  };