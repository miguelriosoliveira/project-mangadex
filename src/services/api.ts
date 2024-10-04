import axios from 'axios';

const _api = axios.create({ baseURL: import.meta.env.VITE_MANGADEX_API_URL });

interface MangaSearchResponse {
  result: string;
  response: string;
  data: MangaItem[];
  limit: number;
  offset: number;
  total: number;
}

interface MangaItem {
  id: string;
  type: string;
  attributes: Attributes;
  relationships: Relationship[];
}

interface Attributes {
  title: Title;
  altTitles: AltTitle[];
  description: Description;
  isLocked: boolean;
  links: Links;
  originalLanguage: string;
  lastVolume: string;
  lastChapter: string;
  publicationDemographic?: string;
  status: string;
  year: number;
  contentRating: string;
  tags: Tag[];
  state: string;
  chapterNumbersResetOnNewVolume: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
  availableTranslatedLanguages: string[];
  latestUploadedChapter: string;
}

interface Title {
  en: string;
}

interface AltTitle {
  ja?: string;
  ru?: string;
  sr?: string;
  hi?: string;
  bn?: string;
  th?: string;
  my?: string;
  'zh-hk'?: string;
  zh?: string;
  ko?: string;
  he?: string;
  ar?: string;
  ta?: string;
  ka?: string;
  bg?: string;
  uk?: string;
  'ja-ro'?: string;
  es?: string;
  id?: string;
  'pt-br'?: string;
  fr?: string;
  vi?: string;
  en?: string;
}

interface Description {
  bg?: string;
  en: string;
  uk?: string;
  cs?: string;
  de?: string;
  es?: string;
  fi?: string;
  fr?: string;
  id?: string;
  it?: string;
  ja?: string;
  pl?: string;
  pt?: string;
  ru?: string;
  sr?: string;
  tr?: string;
  'pt-br'?: string;
  ar?: string;
}

interface Links {
  al?: string;
  mu?: string;
  mal?: string;
  engtl?: string;
  ap?: string;
  bw?: string;
  kt?: string;
  amz?: string;
  ebj?: string;
  raw?: string;
}

interface Tag {
  id: string;
  type: string;
  attributes: Attributes2;
  relationships: any[];
}

interface Attributes2 {
  name: Name;
  description: Description2;
  group: string;
  version: number;
}

interface Name {
  en: string;
}

interface Description2 {}

interface Relationship {
  id: string;
  type: string;
  related?: string;
}

interface CoverInfoResponse {
  result: string;
  response: string;
  data: CoverData;
}

interface CoverData {
  id: string;
  type: string;
  attributes: CoverAttributes;
  relationships: CoverRelationship[];
}

interface CoverAttributes {
  volume: string;
  fileName: string;
  description: string;
  locale: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

interface CoverRelationship {
  id: string;
  type: string;
  related: string;
  attributes: CoverAttributes2;
}

interface CoverAttributes2 {}

interface CoverInfo {
  id: string;
  fileName: string;
}

export interface Manga {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  coverUrl256: string;
  coverUrl512: string;
}

export const api = {
  async getCoverInfo(coverId: string): Promise<CoverInfo> {
    const response = await _api.get<CoverInfoResponse>(`/cover/${coverId}`);

    console.log({ responseCover: response });

    return {
      id: coverId,
      fileName: response.data.data.attributes.fileName,
    };
  },

  async search(title: string): Promise<Manga[]> {
    const response = await _api.get<MangaSearchResponse>('/manga', {
      params: {
        title,
        'order[relevance]': 'desc',
      },
    });

    const coverResponses = (
      await Promise.all(
        response.data.data
          .map(manga => manga.relationships.find(re => re.type === 'cover_art')?.id)
          .map(coverId => this.getCoverInfo(coverId as string)),
      )
    ).map(coverResponse => coverResponse.fileName);

    console.log({ response, coverResponses });

    return response.data.data.map((manga, i) => ({
      id: manga.id,
      title: manga.attributes.title.en,
      description: manga.attributes.description.en,
      coverUrl: `https://uploads.mangadex.org/covers/${manga.id}/${coverResponses[i]}`,
      coverUrl256: `https://uploads.mangadex.org/covers/${manga.id}/${coverResponses[i]}.256.jpg`,
      coverUrl512: `https://uploads.mangadex.org/covers/${manga.id}/${coverResponses[i]}.512.jpg`,
    }));
  },
};
