import {AfterViewInit, Component, OnInit} from '@angular/core';
import {GetFilesService} from '../service/get-files.service';
import {FileModel} from '../models/fileModel';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit, AfterViewInit {
  response: FileModel[] = [];
  filteredResponse: FileModel[] = [];
  parentFiles: FileModel[] = [];

  path: string = 'Folders';
  rootUrl = 'http://localhost:8080/api/top/children';
  childrenUrl = 'http://localhost:8080/api/item/'; //'http://localhost:8080/api/item/' + id + '/children'

  constructor(private getFilesService: GetFilesService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getFilesService.getRoot(this.rootUrl).subscribe(() => {
      this.response = this.response.concat(JSON.parse(this.getFilesService.getData()._body).data);
      this.filteredResponse = this.filteredResponse.concat(JSON.parse(this.getFilesService.getData()._body).data);
      console.log(this.response);
    });
  }

  navigate(entry) {
    if (entry.type == 'FOLDER') {
      console.log(entry.id);

      // this.parentFiles.length = 0;
      // this.parentFiles = this.response.slice();
      this.parentFiles = this.parentFiles.concat(this.response.slice());
      this.getFilesService.getChildren(this.childrenUrl + entry.id + '/children', entry.id).subscribe(() => {
        this.response.length = 0;
        this.response = this.response.concat(JSON.parse(this.getFilesService.getData()._body).data);
        this.filteredResponse.length = 0;
        this.filteredResponse = this.filteredResponse.concat(JSON.parse(this.getFilesService.getData()._body).data);
        this.path = this.path + '/' + entry.name;
        console.log('NAVIGATE');
        console.log(this.parentFiles);
      });
    }
  }

  goBack() {
    console.log('BACK');
    // console.log(this.response);
    this.response.length = 0;
    this.filteredResponse.length = 0;
    this.response = this.parentFiles.slice();
    this.filteredResponse = this.parentFiles.slice();
    console.log(this.parentFiles);
    this.parentFiles.length = 0;
    // this.parentFiles.pop();
    this.path = this.path.substring(0, this.path.indexOf('/'));
  }

  searchFiles(input: string) {
    if (!input) {
      this.filteredResponse = Object.assign([], this.response);
    }
    this.filteredResponse = Object.assign([], this.response).filter(
      item => item.name.toLowerCase().indexOf(input.toLowerCase()) > -1
    );
  }


}
