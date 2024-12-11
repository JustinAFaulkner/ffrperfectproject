export interface WikiUpdateGroup {
  key: string;
  items: {
    submissionId: string;
    songId: string;
    title: string;
  }[];
}