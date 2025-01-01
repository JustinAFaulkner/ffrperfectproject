  export function hasCompletedAlphabet(titles: string[]): boolean {
    // Convert all titles to lowercase and combine into one string
    const combinedText = titles.join('').toLowerCase();
    
    // Check if each letter exists
    return 'abcdefghijklmnopqrstuvwxyz'
      .split('')
      .every(letter => combinedText.includes(letter));
  }

  export function hasTripletNoteCount(arrows: number): boolean {
    const arrowStr = arrows.toString();
    return arrowStr.length >= 3 && 
      arrowStr[0] === arrowStr[1] && 
      arrowStr[1] === arrowStr[2];
  }
  
  export function hasAllMonths(dates: Date[]): boolean {
    const months = new Set(dates.map(date => date.getMonth()));
    return months.size === 12;
  }
  
  export function countUniqueGenres(genres: string[]): number {
    return new Set(genres).size;
  }
  
  export function getTotalNoteCount(arrows: number[]): number {
    return arrows.reduce((sum, count) => sum + count, 0);
  }
  
  export function getTotalSeconds(seconds: number[]): number {
    return seconds.reduce((sum, count) => sum + count, 0);
  }
  
  export function countStepArtistMatches(stepArtists: string[], pattern: string): number {
    const regex = new RegExp(pattern, 'i');
    return stepArtists.filter(artist => regex.test(artist)).length;
  }