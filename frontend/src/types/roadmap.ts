export interface RoadmapStep {
  id: string;
  stepOrder: number;
  title: string;
  description?: string;
}

export interface Roadmap {
  id: string;
  companyId?: string;
  companyName?: string;
  companySlug?: string;
  title: string;
  description?: string;
  isPublished: boolean;
  steps: RoadmapStep[];
  createdAt: string;
}
