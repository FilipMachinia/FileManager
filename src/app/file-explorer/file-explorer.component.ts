import {AfterViewInit, Component, OnInit} from '@angular/core';
import {GetFilesService} from '../service/get-files.service';
import {FileModel} from '../models/fileModel';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit, AfterViewInit {
  currentFiles: any = [];
  filteredFiles: any = [];
  allFiles: any = [];
  parentFiles: FileModel[][] = [];
  clickedFile: FileModel;

  path = '';
  rootUrl = 'http://localhost:3000/getPlates';
  childrenUrl = 'http://localhost:8080/api/item/'; // 'http://localhost:8080/api/item/' + id + '/children'

  constructor(private getFilesService: GetFilesService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getFilesService.getRoot(this.rootUrl).subscribe((data) => {
      // console.log('OMG', this.getFilesService.getData()._body);
      this.currentFiles.push(JSON.parse(this.getFilesService.getData()._body).main[0]);
      this.filteredFiles.push(JSON.parse(this.getFilesService.getData()._body).main[0]);
      this.allFiles.push(JSON.parse(this.getFilesService.getData()._body).main[0]);
    });
  }

  navigate(entry) {

    if (entry.type === 'folder') {
      (document.getElementById('goUp') as HTMLInputElement).disabled = false;
      this.parentFiles = this.parentFiles.concat(this.currentFiles);
      this.filteredFiles.length = 0;
      this.filteredFiles = [...entry.children];
      // this.getFilesService.getChildren(this.childrenUrl + entry.id + '/children', entry.id).subscribe(() => {
      //   this.currentFiles.length = 0;
      //   this.currentFiles.push(JSON.parse(this.getFilesService.getData()._body).data);
      //   this.filteredFiles.length = 0;
      //   this.filteredFiles.push(JSON.parse(this.getFilesService.getData()._body).data);
      this.path = this.path + '/' + entry.name;
      //   console.log(this.filteredFiles);

      // });
    }
  }

  goUp() {
    this.currentFiles.length = 0;
    this.filteredFiles.length = 0;
    this.currentFiles.push(this.parentFiles[this.parentFiles.length - 1]);
    this.filteredFiles.push(this.parentFiles[this.parentFiles.length - 1]);

    this.parentFiles.pop();
    this.path = this.path.substring(0, this.path.lastIndexOf('/'));

    if (this.path === 'Folders') {
      (document.getElementById('goUp') as HTMLInputElement).disabled = true;
    }
  }

  searchFiles(input: string) {
    if (!input) {
      this.filteredFiles = Object.assign([], this.currentFiles);
    }

    this.filteredFiles = this.currentFiles.filter(entry =>
      entry.name.toLowerCase().indexOf(input.toLowerCase()) > -1
    );
  }

  openMenu($event: MouseEvent, entry) {
    this.clickedFile = entry;
    event.preventDefault();
    document.getElementById('ctxmenu').className = 'show';
    document.getElementById('ctxmenu').style.top = $event.clientY + 'px';
    document.getElementById('ctxmenu').style.left = $event.clientX + 'px';

    window.event.returnValue = false;
  }

  addNewFile(type: string) {
    const temp: FileModel = {name: 'test', id: '1', type, parentId: ''};
    this.filteredFiles.push(temp);
  }

  removeFileExtension() {
    this.filteredFiles.forEach(entry => {
      if (entry.type !== 'folder') {
        if (entry.name.includes('.')) {
          entry.name = entry.name.substring(0, entry.name.lastIndexOf('.'));
        } else {
          entry.name = entry.name + '.' + entry.path.slice(-3);
        }
      }
    });
  }

  hideCtxMenu() {
    document.getElementById('ctxmenu').className = 'hide';
  }

  deleteFile() {
    this.filteredFiles = this.filteredFiles.filter(item => item.name !== this.clickedFile.name);
    document.getElementById('ctxmenu').className = 'hide';

  }

  renameFile() {
    const newName = ((document.getElementById('newName') as HTMLInputElement).value);

    const itemIndex = this.filteredFiles[0].findIndex(x => x.id === this.clickedFile.id);
    this.filteredFiles[0][itemIndex].name = newName;

    document.getElementById('ctxmenu').className = 'hide';
    $('#renameModal').modal('hide');
  }
}
