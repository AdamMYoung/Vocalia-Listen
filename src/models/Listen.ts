import { PodcastEpisode } from "./PodcastEpisode";

export class Listen {
  rssUrl: string;
  episodeUrl: string;
  episodeName: string;
  time: number;
  isCompleted: boolean;
  duration: number;

  constructor(
    rssUrl: string,
    episodeUrl: string,
    episodeName: string,
    time: number,
    isCompleted: boolean,
    duration: number
  ) {
    this.rssUrl = rssUrl;
    this.episodeUrl = episodeUrl;
    this.episodeName = episodeName;
    this.time = time;
    this.isCompleted = isCompleted;
    this.duration = duration;
  }

  /**
   * Converts a podcast episode into a listen object.
   * @param episode Episode to convert.
   */
  public static fromPodcastEpisode(episode: PodcastEpisode): Listen {
    return new Listen(
      episode.rssUrl,
      episode.content,
      episode.title,
      episode.time,
      episode.isCompleted,
      episode.duration
    );
  }
}
