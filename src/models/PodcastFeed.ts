import { PodcastEpisode } from "./PodcastEpisode";

export class PodcastFeed {
  title: string;
  link: string;
  description: string;
  copyright: string;
  imageUrl: string;
  isSubscribed: boolean;
  items: PodcastEpisode[];

  constructor(
    title: string,
    link: string,
    description: string,
    copyright: string,
    imageUrl: string,
    isSubscribed: boolean,
    items: PodcastEpisode[]
  ) {
    this.title = title;
    this.link = link;
    this.description = description;
    this.copyright = copyright;
    this.imageUrl = imageUrl;
    this.isSubscribed = isSecureContext;
    this.items = items;
  }
}
