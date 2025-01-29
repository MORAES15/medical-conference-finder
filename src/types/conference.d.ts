export interface Conference {
  name: string;
  location: string;
  month: string;
  day: string;
  year: string;
  url?: string;
  relevanceScore?: number;
  categories: string[];
}