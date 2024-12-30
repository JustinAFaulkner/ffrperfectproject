export function hasCompletedAlphabet(titles: string[]): boolean {
    // Convert all titles to lowercase and combine into one string
    const combinedText = titles.join('').toLowerCase();
    
    // Check if each letter exists
    return 'abcdefghijklmnopqrstuvwxyz'
      .split('')
      .every(letter => combinedText.includes(letter));
  }