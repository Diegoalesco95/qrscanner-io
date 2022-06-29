export class Record {
  public format: string;
  public text: string;
  public type: string;
  public icon: string;
  public created: Date;

  constructor(format: string, text: string) {
    this.format = format;
    this.text = text;
    this.created = new Date();

    this.getType();
  }

  private getType() {
    const initText = this.text.substring(0, 4);

    switch (initText) {
      case 'http':
        this.type = 'link';
        this.icon = 'globe';
        break;
      case 'geo:':
        this.type = 'location';
        this.icon = 'pin';
        break;
      default:
        this.type = 'no type';
        this.icon = 'create';
        break;
    }
  }
}
