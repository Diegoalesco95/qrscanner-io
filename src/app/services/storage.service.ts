import { Injectable } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Record } from 'src/app/models/record.model';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  savedRecords: Record[] = [];
  private localStorage: Storage | null = null;

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private iab: InAppBrowser,
    private platform: Platform
  ) {
    this.init();
  }

  async init() {
    this.localStorage = await this.storage.create();
    await this.loadRecords();
  }

  async loadRecords() {
    try {
      this.savedRecords = (await this.storage.get('records')) || [];
    } catch (error) {
      console.log(error);
    }
  }

  saveRecord(format: string, text: string) {
    const record = new Record(format, text);
    this.savedRecords.unshift(record);
    this.localStorage.set('records', this.savedRecords);
    this.navCtrl.navigateForward(`/tabs/tab2`);
    this.openRecord(record);
  }

  openRecord(record: Record) {
    switch (record.type) {
      case 'link':
        this.openInBrowser(record.text);
        break;
      case 'location':
        this.openInBrowser(record.text);
        break;
      default:
        break;
    }
  }

  private openInBrowser(url: string) {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const browser = this.iab.create(url, '_system');
      browser.show();
    }
    window.open(url, '_blank');
  }
}
