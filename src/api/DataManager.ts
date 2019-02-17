import ApiRepository from "./ApiRepository";
import LocalRepository from "./LocalRepository";
import {
  Category,
  Podcast,
  PodcastFeed,
  Listen,
  PodcastEpisode
} from "../utility/types";

export default class DataManager {
  private api: ApiRepository = new ApiRepository();
  private local: LocalRepository = new LocalRepository();
  accessToken: string | null = null;

  lastUpdate: number = 0;

  /**
   * Gets the subscribed podcasts from the Vocalia API.
   */
  async searchPodcasts(query: string): Promise<Podcast[] | null> {
    return await this.api.searchPodcasts(query);
  }

  /**
   * Parses the RSS URL into a JSON formatted object with
   * additional usage data using the Vocalia API.
   * @param rssUrl URL to parse.
   */
  async parsePodcastFeed(rssUrl: string): Promise<PodcastFeed | null> {
    var podcast = await this.api.parsePodcastFeed(rssUrl, this.accessToken);
    if (podcast != null) {
      this.local.setFeed(podcast);
      return podcast;
    }

    return this.local.getFeed(rssUrl);
  }

  /**
   * Gets all categories from the Vocalia API.
   */
  async getCategories(): Promise<Category[] | null> {
    var categories = await this.api.getCategories();

    if (categories != null) {
      this.local.setCategories(categories);
      return categories;
    }

    return this.local.getCategories();
  }

  /**
   * Gets the top podcasts from the Vocalia API.
   */
  async getTopPodcasts(): Promise<Podcast[] | null> {
    var podcasts = null;
    try {
      podcasts == (await this.api.getTopPodcasts());
    } catch {
      return this.local.getCategoryPodcasts("top");
    }

    if (podcasts != null) {
      this.local.setCategoryPodcasts(podcasts, "top");
      return podcasts;
    }

    return this.local.getCategoryPodcasts("top");
  }

  /**
   * Gets the top podcasts from the provided category from the Vocalia API.
   * @param categoryId ID of the category to filter by.
   */
  async getPodcastByCategory(categoryId: number): Promise<Podcast[] | null> {
    var podcasts = null;
    try {
      podcasts = await this.api.getPodcastByCategory(categoryId);
    } catch {
      return this.local.getCategoryPodcasts(categoryId.toString());
    }

    if (podcasts != null) {
      this.local.setCategoryPodcasts(podcasts, categoryId.toString());
      return podcasts;
    }

    return this.local.getCategoryPodcasts(categoryId.toString());
  }

  /**
   * Gets the subscriptions belonging to the user.
   */
  async getSubscriptions(): Promise<Podcast[] | null> {
    if (this.accessToken == null)
      return this.local.getCategoryPodcasts("subscriptions");

    var subs = await this.api.getSubscriptions(this.accessToken);

    if (subs) {
      this.local.setCategoryPodcasts(subs, "subscriptions");
      return subs;
    }

    return null;
  }

  /**
   * Adds the specified podcast to the user's subscribed database.
   * @param podcast Podcast to subscribe to.
   */
  async addSubscription(podcast: Podcast) {
    if (this.accessToken)
      await this.api.addSubscription(this.accessToken, podcast);
  }

  /**
   * Rempoves the specified podcast from the user's subscribed database.
   * @param rssUrl RSS url of the podcast to unsubsribe from.
   */
  async deleteSubscription(rssUrl: string) {
    if (this.accessToken)
      await this.api.deleteSubscription(this.accessToken, rssUrl);
  }

  /**
   * Updates the listen info for the specified podcast.
   * @param listen Values to update.
   */
  async setListenInfo(listen: Listen) {
    if (this.accessToken != null && this.lastUpdate != listen.time) {
      this.lastUpdate = listen.time;
      try {
        await this.api.setListenInfo(this.accessToken, listen);
      } catch {
        this.local.setPlaybackTime(listen);
      }
    }

    this.local.setPlaybackTime(listen);
  }

  /**
   * Gets lisen info for the specified podcast.
   * @param rssUrl URL to fetch listen info for.
   */
  async getListenInfo(episodeUrl: string): Promise<Listen | null> {
    if (this.accessToken == null) return this.local.getPlaybackTime(episodeUrl);

    try {
      return await this.api.getListenInfo(this.accessToken, episodeUrl);
    } catch {
      return this.local.getPlaybackTime(episodeUrl);
    }
  }

  /**
   * Gets the current podcast from the API.
   */
  async getCurrentPodcast(): Promise<PodcastEpisode | null> {
    if (this.accessToken == null) return this.local.getCurrentPodcast();

    try {
      return await this.api.getLatestPodcast(this.accessToken);
    } catch {
      return this.local.getCurrentPodcast();
    }
  }

  /**
   * Sets the current podcast to the API.
   * @param podcast Podcast to update information for.
   */
  async setCurrentPodcast(podcast: PodcastEpisode | null) {
    this.local.setCurrentPodcast(podcast);
  }
}
