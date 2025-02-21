interface ExtractorLink extends IDownloadableMinimum {
  source: string;
  name: string;
  quality: number;
  extractorData?: string;
  type: ExtractorLinkType;
}
