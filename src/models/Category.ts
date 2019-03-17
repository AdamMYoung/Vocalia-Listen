export class Category {
  id: number;
  title: string;
  iconUrl: string;

  constructor(id: number, title: string, iconUrl: string) {
    this.id = id;
    this.title = title;
    this.iconUrl = iconUrl;
  }
}
