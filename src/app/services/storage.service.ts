import { Injectable } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Record } from 'src/app/models/record.model';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
// import { File } from '@awesome-cordova-plugins/file/ngx';

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
    private platform: Platform,
    private file: File
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
        this.navCtrl.navigateForward(`/tabs/tab2/map/${record.text}`);
        break;
      default:
        break;
    }
  }

  sendEmail() {
    const valuesTemp = [];
    const titles = 'Type, Format, Created at, Text\n';

    valuesTemp.push(titles);
    this.savedRecords.forEach((record) => {
      valuesTemp.push(
        `${record.type}, ${record.format}, ${
          record.created
        }, ${record.text.replace(',', ' ')}\n`
      );
    });

    // this.buildCsv(valuesTemp.join(''));
  }

  // private buildCsv(content: string) {
  //   this.file
  //     .checkFile(this.file.dataDirectory, 'records.csv')
  //     .then((success) => {
  //       this.writeInFile(content);
  //     })
  //     .catch((err1) => {
  //       this.file
  //         .createFile(this.file.dataDirectory, 'records.csv', false)
  //         .then((success) => {
  //           this.writeInFile(content);
  //         })
  //         .catch((err2) => {
  //           console.log('Error creating file');
  //         });
  //     });
  // }

  // private async writeInFile(content: string) {
  //   await this.file.writeExistingFile(
  //     this.file.dataDirectory,
  //     'records.csv',
  //     content
  //   );
  // }

  private openInBrowser(url: string) {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const browser = this.iab.create(url, '_system');
      browser.show();
    }
    window.open(url, '_blank');
  }
}
