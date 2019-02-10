import {AfterViewInit, Component, OnInit} from '@angular/core';
import {GetFilesService} from '../service/get-files.service';
import {FileModel} from '../models/fileModel';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit, AfterViewInit {
  currentFiles: FileModel[][] = [];
  filteredFiles: FileModel[][] = [];
  parentFiles: FileModel[][] = [];

  path: string = 'Folders';
  rootUrl: string = 'http://localhost:8080/api/top/children';
  childrenUrl: string = 'http://localhost:8080/api/item/'; //'http://localhost:8080/api/item/' + id + '/children'

  constructor(private getFilesService: GetFilesService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getFilesService.getRoot(this.rootUrl).subscribe(() => {
      this.currentFiles.push(JSON.parse(this.getFilesService.getData()._body).data);
      this.filteredFiles.push(JSON.parse(this.getFilesService.getData()._body).data);
    });
  }

  navigate(entry) {
    if (entry.type == 'FOLDER') {
      (<HTMLInputElement> document.getElementById('goUp')).disabled = false;
      this.parentFiles = this.parentFiles.concat(this.currentFiles);

      this.getFilesService.getChildren(this.childrenUrl + entry.id + '/children', entry.id).subscribe(() => {
        this.currentFiles.length = 0;
        this.currentFiles.push(JSON.parse(this.getFilesService.getData()._body).data);
        this.filteredFiles.length = 0;
        this.filteredFiles.push(JSON.parse(this.getFilesService.getData()._body).data);
        this.path = this.path + '/' + entry.name;
        console.log(this.filteredFiles);

      });
    }
  }

  goUp() {
    this.currentFiles.length = 0;
    this.filteredFiles.length = 0;
    this.currentFiles.push(this.parentFiles[this.parentFiles.length - 1]);
    this.filteredFiles.push(this.parentFiles[this.parentFiles.length - 1]);

    this.parentFiles.pop();
    this.path = this.path.substring(0, this.path.lastIndexOf('/'));

    if (this.path == 'Folders') {
      (<HTMLInputElement> document.getElementById('goUp')).disabled = true;
    }
  }

  searchFiles(input: string) {
    if (!input) {
      this.filteredFiles = Object.assign([], this.currentFiles);
    }

    this.filteredFiles[0] = this.currentFiles[0].filter(entry =>
      entry.name.toLowerCase().indexOf(input.toLowerCase()) > -1
    );
  }

  openMenu($event: MouseEvent) {
    event.preventDefault();
    document.getElementById('ctxmenu').className = 'show';
    document.getElementById('ctxmenu').style.top = $event.clientY + 'px';
    document.getElementById('ctxmenu').style.left = $event.clientX + 'px';

    window.event.returnValue = false;
  }

  addNewFile(type: string) {
    let temp: FileModel = {name: 'test', id: '1', type: type, parentId: ''};
    this.filteredFiles[0].push(temp);
  }

  removeFileExtension() {
    this.filteredFiles[0].forEach(entry => {
      if (entry.name.includes('.')) {
        entry.name = entry.name.substring(0, entry.name.lastIndexOf('.'));
      }
    });
  }

  hideCtxMenu() {
    document.getElementById('ctxmenu').className = 'hide';
  }
}
