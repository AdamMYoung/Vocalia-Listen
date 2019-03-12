import PodcastAPI from "./PodcastAPI";
import PodcastLocal from "./PodcastLocal";
import {
  Category,
  Podcast,
  PodcastFeed,
  Listen,
  PodcastEpisode
} from "../utility/types";

export default class DataManager {
  private api: PodcastAPI = new PodcastAPI();
  private local: PodcastLocal = new PodcastLocal();
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
  async parsePodcastFeed(
    rssUrl: string,
    callback: (feed: PodcastFeed | null) => void
  ) {
    var feed = await this.local.getFeed(rssUrl);
    callback(feed);

    var podcast = await this.api.parsePodcastFeed(rssUrl, this.accessToken);
    if (podcast) {
      await this.local.setFeed(rssUrl, podcast);
      callback(podcast);
    }
  }

  /**
   * Gets all categories from the Vocalia API.
   */
  async getCategories(callback: (categories: Category[] | null) => void) {
    callback(await this.local.getCategories());

    var categories = await this.api.getCategories();
    if (categories) {
      callback(categories);
    }
  }

  /**
   * Gets the top podcasts from the Vocalia API.
   */
  async getTopPodcasts(callback: (podcasts: Podcast[] | null) => void) {
    callback(await this.local.getCategoryPodcasts("top"));

    var podcasts = await this.api.getTopPodcasts();
    if (podcasts != null) {
      this.local.setCategoryPodcasts(podcasts, "top");
      callback(podcasts);
    }
  }

  /**
   * Gets the top podcasts from the provided category from the Vocalia API.
   * @param categoryId ID of the category to filter by.
   */
  async getPodcastByCategory(
    categoryId: number,
    callback: (podcasts: Podcast[] | null) => void
  ) {
    callback(await this.local.getCategoryPodcasts(categoryId.toString()));

    var podcasts = await this.api.getPodcastByCategory(categoryId);
    if (podcasts) {
      this.local.setCategoryPodcasts(podcasts, categoryId.toString());
      callback(podcasts);
    }
  }

  /**
   * Gets the subscriptions belonging to the user.
   */
  async getSubscriptions(callback: (podcasts: Podcast[] | null) => void) {
    callback(await this.local.getCategoryPodcasts("subscriptions"));
    if (this.accessToken != null) {
      var subs = await this.api.getSubscriptions(this.accessToken);
      if (subs) {
        this.local.setCategoryPodcasts(subs, "subscriptions");
        callback(subs);
      }
    }
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
      await this.api.setListenInfo(this.accessToken, listen);
    }

    this.local.setListenInfo(listen);
  }

  /**
   * Gets lisen info for the specified podcast.
   * @param rssUrl URL to fetch listen info for.
   */
  async getListenInfo(
    episodeUrl: string,
    callback: (info: Listen | null) => void
  ) {
    callback(await this.local.getListenInfo(episodeUrl));

    if (this.accessToken) {
      var listen = await this.api.getListenInfo(this.accessToken, episodeUrl);

      if (listen) {
        this.local.setListenInfo(listen);
        callback(listen);
      }
    }
  }

  /**
   * Gets the current podcast from the API.
   */
  async getCurrentPodcast(callback: (episode: PodcastEpisode | null) => void) {
    callback(await this.local.getCurrentPodcast());

    if (this.accessToken) {
      var latest = await this.api.getLatestPodcast(this.accessToken);

      if (latest) {
        this.local.setCurrentPodcast(latest);
        callback(latest);
      }
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
