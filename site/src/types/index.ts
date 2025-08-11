export interface ModuleConfig {
  name: string;
  path: string;
  entry: string;
}

export interface PageConfig {
  slug: string;
  title: string;
  path: string;
  description?: string;
}

export interface TocChapter {
  id: string;
  title: string;
  file: string;
  description: string;
}

export interface TocData {
  title: string;
  description: string;
  author: string;
  version: string;
  chapters: TocChapter[];
}

export interface CollectionConfig {
  id: string;
  path: string;
  toc: string;
  tocData?: TocData;
  pages?: PageConfig[];
}