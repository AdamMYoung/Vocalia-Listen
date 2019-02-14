export interface Category {
  id: number;
  title: string;
  iconUrl: string;
}

export interface Podcast {
  title: string;
  rssUrl: string;
  imageUrl: string;
  isSubscribed: boolean;
}

export interface PodcastFeed {
  title: string;
  link: string;
  description: string;
  copyright: string;
  imageUrl: string;
  isSubscribed: boolean;
  items: PodcastEpisode[];
}

export interface PodcastEpisode {
  imageUrl: string;
  title: string;
  rssUrl: string;
  description: string;
  publishingDate: Date;
  author: string;
  content: string;
  time: number;
  isCompleted: boolean;
  storeLocally: boolean;
}

export interface MediaState {
  episode: PodcastEpisode;
  autoplay: boolean;
}

export interface Listen {
  rssUrl: string;
  episodeName: string;
  time: number;
  isCompleted: boolean;
}
