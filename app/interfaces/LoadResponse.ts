interface LoadResponse {
  name: string;
  url: string;
  apiName: string;
  type: string;
  posterUrl?: string;
  year?: number;
  plot?: string;
  rating?: number;
  tags?: string[];
  duration?: number;
  trailers?: any[];
  recommendations?: SearchResponse[];
  actors?: any[];
  comingSoon: boolean;
  syncData: Record<string, string>;
  posterHeaders?: Record<string, string>;
  backgroundPosterUrl?: string;
  contentRating?: string;
}
