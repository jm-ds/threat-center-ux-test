import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CoreHelperService } from './core-helper.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
    providedIn: 'root'
})

export class CoreHttpService {
    constructor(private http: HttpClient,
        private coreHelperService: CoreHelperService,
        private spinner: NgxSpinnerService) {
    }

    // Http get request
    httpGetRequest<TResponse>(url: string, reqHeader?: HttpHeaders, showLoader?: boolean): Observable<TResponse> {
        return this.http.get(url, { headers: reqHeader }).pipe(
            map((res) => {
                return res as TResponse;
            }),
            catchError(this.errorHandler)
        );
    }


    // Http get with httpParams request
    httpGetWithParamsRequest<TResponse>(
        url: string,
        reqHeader?: HttpHeaders,
        params?: HttpParams,
        showLoader?: boolean
    ): Observable<TResponse> {
        return this.http.get(url, { headers: reqHeader, params }).pipe(
            map((res) => {
                return res as TResponse;
            }),
            catchError(this.errorHandler)
        );
    }


    // Http post request
    httpPostRequest<TRequest, TResponse>(url: string, data: TRequest, reqHeader?: HttpHeaders, showLoader?: boolean):
        Observable<TResponse> {
        return this.http.post(url, data, { headers: reqHeader }).pipe(
            map((res) => {
                return res as TResponse;
            }),
            catchError(this.errorHandler)
        );
    }


    // Http delete request
    httpDeleteRequest<TRequest, TResponse>(url: string, id?: TRequest, showLoader?: boolean): Observable<TResponse> {
        return this.http.delete(url, id).pipe(
            map((res) => {
                return res as TResponse;
            }),
            catchError(this.errorHandler)
        );
    }


    // Http put request
    httpPutRequest<TRequest, TResponse>(url: string, data: TRequest, reqHeader?: HttpHeaders, showLoader?: boolean): Observable<TResponse> {
        return this.http.put(url, data, { headers: reqHeader }).pipe(
            map((res) => {
                return res as TResponse;
            }),
            catchError(this.errorHandler)
        );
    }


    // Core error handle
    errorHandler = (error: HttpErrorResponse) => {
        this.spinner.hide();
        return EMPTY;
    };
}
