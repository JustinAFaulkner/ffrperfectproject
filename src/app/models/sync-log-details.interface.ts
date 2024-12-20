export interface FieldChange {
  old: any;
  new: any;
}

export interface SyncLogChange {
  id: number;
  currentTitle: string;
  added?: boolean;
  [key: string]: any;
}

export interface SongChange {
  id: string;
  currentTitle: string;
  isNewSong: boolean;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

export interface SyncLogDetails {
  timestamp: Date;
  changes: SongChange[];
}