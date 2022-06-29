import { Component } from '@angular/core';
import { Record } from 'src/app/models/record.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  constructor(public storageService: StorageService) {}

  sendEmail() {
    this.storageService.sendEmail();
  }

  openRecord(record: Record) {
    this.storageService.openRecord(record);
  }
}
