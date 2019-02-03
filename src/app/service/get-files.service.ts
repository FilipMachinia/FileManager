import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Http} from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class GetFilesService {

  data;

  constructor(private http: Http) {
  }

  getRoot(url: string): Observable<any> {
    return this.http.get(url)
      .pipe(map((res) => {
          this.data = res;
        }),
        catchError((error: any) => Observable.throw(error.json().error || 'Server error')));
  }

  getChildren(url: string, id: number): Observable<any> {
    return this.http.get(url)
      .pipe(map((res) => {
          // console.log('test');
          this.data = res;
          // console.log(this.data);
        }),
        catchError((error: any) => Observable.throw(error.json().error || 'Server error')));
  }

  getData() {
    return this.data;
  }
}
