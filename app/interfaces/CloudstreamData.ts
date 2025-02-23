// Base interface
interface LoadResponse {
  name: string;
  url: string;
  apiName: string;
  type: TvType;
  posterUrl?: string;
  year?: number;
  plot?: string;
  rating?: number; // 0-10000
  tags?: string[];
  duration?: number; // in minutes
  trailers: TrailerData[];
  recommendations?: SearchResponse[];
  actors?: ActorData[];
  comingSoon: boolean;
  syncData: Record<string, string>;
  posterHeaders?: Record<string, string>;
  backgroundPosterUrl?: string;
  contentRating?: string;
}

// Enum for TvType
enum TvType {
  Movie = 1,
  AnimeMovie,
  TvSeries,
  Cartoon,
  Anime,
  OVA,
  Torrent,
  Documentary,
  AsianDrama,
  Live,
  NSFW,
  Others,
  Music,
  AudioBook,
  CustomMedia, // Won't load the built-in player, make your own interaction
  Audio,
  Podcast,
}

// Trailer data interface
interface TrailerData {
  extractorUrl: string;
  referer?: string;
  raw: boolean;
  headers: Record<string, string>;
}

// SearchResponse interface
interface SearchResponse {
  name: string;
  url: string;
  apiName: string;
  type?: TvType;
  posterUrl?: string;
  posterHeaders?: Record<string, string>;
  id?: number;
  quality?: SearchQuality;
}

// Search quality enum
enum SearchQuality {
  Cam = 1,
  CamRip,
  HdCam,
  Telesync, // TS
  WorkPrint,
  Telecine, // TC
  HQ,
  HD,
  HDR, // high dynamic range
  BlueRay,
  DVD,
  SD,
  FourK,
  UHD,
  SDR, // standard dynamic range
  WebRip,
}

// Actor data interface
interface ActorData {
  actor: Actor;
  role?: ActorRole;
  roleString?: string;
  voiceActor?: Actor;
}

// Actor interface
interface Actor {
  name: string;
  image?: string;
}

// Actor role enum
enum ActorRole {
  Main,
  Supporting,
  Background,
}

// TvSeriesLoadResponse interface, extending LoadResponse and EpisodeResponse
interface TvSeriesLoadResponse extends LoadResponse, EpisodeResponse {
  episodes: Episode[];
  showStatus?: ShowStatus;
  nextAiring?: NextAiring;
  seasonNames?: SeasonData[];
}

// Episode interface
interface Episode {
  data: string;
  name?: string;
  season?: number;
  episode?: number;
  posterUrl?: string;
  rating?: number;
  description?: string;
  date?: number;
  runTime?: number;
}

// Show status enum
enum ShowStatus {
  Completed,
  Ongoing,
}

// Next airing interface
interface NextAiring {
  episode: number;
  unixTime: number;
  season?: number;
}

// Season data interface
interface SeasonData {
  season: number;
  name?: string;
  displaySeason?: number; // will use season if null
}

// EpisodeResponse interface
interface EpisodeResponse {
  showStatus?: ShowStatus;
  nextAiring?: NextAiring;
  seasonNames?: SeasonData[];
}

// MovieLoadResponse, adapting from Kotlin data class
interface MovieLoadResponse extends LoadResponse {
  dataUrl: string;
}

// AnimeLoadResponse, adapting from Kotlin data class
interface AnimeLoadResponse extends LoadResponse, EpisodeResponse {
  engName?: string;
  japName?: string;
  episodes: Record<DubStatus, Episode[]>;
  synonyms?: string[];
  nextAiring?: NextAiring;
}

// DubStatus enum
enum DubStatus {
  None = -1,
  Dubbed = 1,
  Subbed = 0,
}
