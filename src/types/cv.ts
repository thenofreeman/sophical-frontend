
export interface SocialLink {
  icon: string;
  url: string;
  label: string;
}

export interface HeaderData {
  name: string;
  bio: string;
  socialLinks: SocialLink[];
}

export interface ItemWithTags {
  period?: string;
  category?: string;
  title?: string;
  description?: string;
  tags: string[];
  link?: {
    url: string;
    text: string;
  };
}

export interface CVData {
  header: HeaderData;
  overview: string;
  experience: ItemWithTags[];
  education: ItemWithTags[];
  projects: ItemWithTags[];
  skills: ItemWithTags[];
}
