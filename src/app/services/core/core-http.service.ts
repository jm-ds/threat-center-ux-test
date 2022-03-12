import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { CoreErrorHelperService } from '@app/services/core/core-error-helper.service';

@Injectable({
  providedIn: 'root'
})

export class CoreHttpService {
  constructor(private http: HttpClient, private coreErrorHelperService: CoreErrorHelperService) { }

  /** HTTP GET request */
  httpGetRequest<T>(url: string, headers?: HttpHeaders): Observable<T> {
    return this.http
      .get(url, { headers })
      .pipe(
        map(response => response as T),
        catchError(
          this.coreErrorHelperService.errorHandler.bind(this, 'CoreHttpService#httpGetRequest')
        )
      );
  }

  /** HTTP GET with params request */
  httpGetWithParamsRequest<T>(url: string, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
    return this.http
      .get(url, { headers, params })
      .pipe(
        map(response => response as T),
        catchError(
          this.coreErrorHelperService.errorHandler.bind(this, 'CoreHttpService#httpGetWithParamsRequest')
        )
      );
  }

  /** HTTP POST request */
  httpPostRequest<TRequest, T>(url: string, data: TRequest, headers?: HttpHeaders, showLoader?: boolean):
    Observable<T> {
    return this.http
      .post(url, data, { headers })
      .pipe(
        map(response => response as T),
        catchError(
          this.coreErrorHelperService.errorHandler.bind(this, 'CoreHttpService#httpPostRequest')
        )
      );
  }

  /** HTTP DELETE request */
  httpDeleteRequest<TRequest, T>(url: string, id?: TRequest): Observable<T> {
    return this.http
      .delete(url, id)
      .pipe(
        map(response => response as T),
        catchError(
          this.coreErrorHelperService.errorHandler.bind(this, 'CoreHttpService#httpDeleteRequest')
        )
      );
  }

  /** HTTP PUT request */
  httpPutRequest<TRequest, T>(url: string, data: TRequest, headers?: HttpHeaders): Observable<T> {
    return this.http
      .put(url, data, { headers })
      .pipe(
        map(response => response as T),
        catchError(
          this.coreErrorHelperService.errorHandler.bind(this, 'CoreHttpService#httpPutRequest')
        )
      );
  }
}
