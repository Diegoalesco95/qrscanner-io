import { Component } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  constructor(
    private barcodeScanner: BarcodeScanner,
    private storageService: StorageService
  ) {}

  onScan() {
    this.barcodeScanner
      .scan()
      .then((barcodeData) => {
        if (!barcodeData.cancelled) {
          this.storageService.saveRecord(barcodeData.format, barcodeData.text);
        }
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }

  ionViewDidEnter() {
    this.onScan();
  }
}
