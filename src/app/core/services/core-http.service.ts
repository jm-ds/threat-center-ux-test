import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CoreHelperService } from './core-helper.service';

@Injectable({
    providedIn: 'root'
})

export class CoreHttpService {
    constructor(private http: HttpClient, private coreHelperService: CoreHelperService) {
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
        const data: { status: number; message: string } = { status: error.status, message: '' };
        if (error.status === 401) {
            this.coreHelperService.swalALertBox("Unauthorized User!", data.status.toString());
            return EMPTY;
        }
        if (typeof error.error === 'string') {
            data.message = error.error;
        } else if (!!error.error && !!error.error.reason && typeof error.error.reason === 'string') {
            data.message = error.error.reason;
        } else {
            data.message = 'Something went wrong!';
        }
        if (!!error && !!error.status) {
            this.coreHelperService.swalALertBox(data.message, data.status.toString());
        } else {
            this.coreHelperService.swalALertBox(data.message);
        }
        return EMPTY;
    };
}
