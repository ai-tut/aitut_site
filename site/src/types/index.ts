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

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  border: string;
  input: string;
  ring: string;
}

export interface ThemeConfig {
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
}

// ... existing code ...
export interface CollectionConfig {
  id: string;
  path: string;
  toc: string;
  theme?: ThemeConfig;
  tocData?: TocData;
  pages?: PageConfig[];
}