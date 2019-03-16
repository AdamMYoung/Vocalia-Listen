export class PodcastEpisode {
  imageUrl: string;
  title: string;
  rssUrl: string;
  description: string;
  publishingDate: Date;
  author: string;
  content: string;
  time: number;
  duration: number;
  isCompleted: boolean;
  storeLocally: boolean;

  constructor(
    imageUrl: string,
    title: string,
    rssUrl: string,
    description: string,
    publishingDate: Date,
    author: string,
    content: string,
    time: number,
    duration: number,
    isCompleted: boolean,
    storeLocally: boolean
  ) {
    this.imageUrl = imageUrl;
    this.title = title;
    this.rssUrl = rssUrl;
    this.description = description;
    this.publishingDate = publishingDate;
    this.author = author;
    this.content = content;
    this.time = time;
    this.duration = duration;
    this.isCompleted = isCompleted;
    this.storeLocally = storeLocally;
  }
}
