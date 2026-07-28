export type ResourceCategory =
  | 'YOUTUBE'
  | 'NOTES'
  | 'PDF'
  | 'CHEAT_SHEET'
  | 'ARTICLE'
  | 'PLAYLIST'
  | 'DOCUMENTATION'
  | 'BOOK'
  | 'PRACTICE_WEBSITE';

export interface Resource {
  id: string;
  title: string;
  url: string;
  category: ResourceCategory;
  description?: string;
  thumbnailUrl?: string;
  isVerified: boolean;
  viewCount: number;
  tags?: string[];
  createdAt: string;
}
