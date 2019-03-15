import { PodcastFeed } from "../utility/types";

export class Podcast {
  title: string;
  rssUrl: string;
  imageUrl: string;
  isSubscribed: boolean;

  constructor(
    title: string,
    rssUrl: string,
    imageUrl: string,
    isSubscribed: boolean
  ) {
    this.title = title;
    this.rssUrl = rssUrl;
    this.imageUrl = imageUrl;
    this.isSubscribed = isSubscribed;
  }

  /**
   * Converts a feed object into a podcast object.
   * @param feed Feed to convert
   */
  public static fromFeed(feed: PodcastFeed): Podcast {
    return new Podcast(feed.title, feed.link, feed.imageUrl, feed.isSubscribed);
  }

  /**
   * Returns a link to the detail section of the podcsat.
   * @param rssUrl URL to get the detail link for.
   */
  public static getDetailUrl(rssUrl: string): string {
    return window.location.pathname + "/" + encodeURIComponent(rssUrl);
  }
}
