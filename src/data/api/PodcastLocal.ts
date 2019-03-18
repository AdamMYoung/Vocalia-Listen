import { Podcast } from "../../models/Podcast";
import { PodcastFeed } from "../../models/PodcastFeed";
import { Listen } from "../../models/Listen";
import { PodcastEpisode } from "../../models/PodcastEpisode";
import { Category } from "../../models/Category";

import { get, set, del } from "idb-keyval";

const LISTEN_INFO = "|position";
const CURRENT = "|current";
const CATEGORIES = "|categories";
const PODCASTS = "|podcasts";
const FEED = "|feed";

export default class PodcastLocal {
  /**
   * Sets the local playback time for the provided url.
   * @param url URL to save to.
   * @param time Time to save.
   */
  async setListenInfo(listenInfo: Listen) {
    let key = listenInfo.episodeUrl + LISTEN_INFO;
    await set(key, listenInfo);
    await this.updateFeed(listenInfo);
    await this.updateLocalPodcast(listenInfo);
  }

  /**
   *  Updates the info's feed with the new information.
   * @param listenInfo Listen info to update.
   */
  private async updateFeed(listenInfo: Listen) {
    var feed = await this.getFeed(listenInfo.rssUrl);
    if (feed) {
      var index = feed.items.findIndex(c => c.content == listenInfo.episodeUrl);

      var item = feed.items[index];
      item.time = listenInfo.time;
      item.isCompleted = listenInfo.isCompleted;
      item.duration = listenInfo.duration;
      feed.items[index] = item;

      await this.setFeed(listenInfo.rssUrl, feed);
    }
  }

  /**
   * Updates the locally stored podcast with new time information.
   * @param listenInfo Listen info to update
   */
  private async updateLocalPodcast(listenInfo: Listen) {
    var podcast = await this.getCurrentPodcast();
    if (podcast) {
      podcast.time = listenInfo.time;
      podcast.isCompleted = listenInfo.isCompleted;
      podcast.duration = listenInfo.duration;
    }
  }

  /**
   * Gets the playback time for the provided url from the local storage.
   * @param episodeUrl Podcast URL for querying.
   */
  async getListenInfo(episodeUrl: string): Promise<Listen | null> {
    let key = episodeUrl + LISTEN_INFO;
    return await get(key).then(x => x as Listen);
  }

  /**
   * Sets the podcast URL as the current podcast.
   * @param url Podcast to save as current.
   */
  async setCurrentPodcast(episode: PodcastEpisode | null) {
    if (episode == null) {
      await del(CURRENT);
    } else {
      await set(CURRENT, episode);
    }
  }

  /**
   * Gets the saved podcast, or null if not available.
   */
  async getCurrentPodcast(): Promise<PodcastEpisode | null> {
    return await get(CURRENT).then(x =>
      x == undefined ? null : (x as PodcastEpisode)
    );
  }

  /**
   * Stores the passed categories in the local storage.
   */
  async setCategories(categories: Category[]) {
    await set(CATEGORIES, categories);
  }

  /**
   * Gets the stored categories if available.
   */
  async getCategories(): Promise<Category[] | null> {
    return await get(CATEGORIES).then(x =>
      x == undefined ? null : (x as Category[])
    );
  }

  /**
   * Sets the podcasts belonging to the specified category.
   * @param podcasts Podcasts to store.
   * @param category Category the podcasts belong to.
   */
  async setCategoryPodcasts(podcasts: Podcast[], category: string) {
    let key = category + PODCASTS;
    await set(key, podcasts);
  }

  /**
   * Gets the podcasts belonging to the specified category.
   * @param category Category to filter podcasts by.
   */
  async getCategoryPodcasts(category: string): Promise<Podcast[] | null> {
    let key = category + PODCASTS;
    return await get(key).then(x => (x == undefined ? null : (x as Podcast[])));
  }

  /**
   * Stores the feed into local storage.
   */
  async setFeed(url: string, feed: PodcastFeed) {
    let key = url + FEED;
    await set(key, feed);
  }

  /**
   *
   * @param rssUrl Returns the feed belonging to the required URL, or null if not available.
   */
  async getFeed(rssUrl: string): Promise<PodcastFeed | null> {
    let key = rssUrl + FEED;
    return await get(key).then(x =>
      x == undefined ? null : (x as PodcastFeed)
    );
  }
}
