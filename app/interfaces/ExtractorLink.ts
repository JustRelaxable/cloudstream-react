interface ExtractorLink extends IDownloadableMinimum {
  source: string;
  name: string;
  referer: string;
  quality: number;
  extractorData?: string;
  type: ExtractorLinkType;
}
