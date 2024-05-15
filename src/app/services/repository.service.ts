import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ReponseBase } from "../models/base.model";

@Injectable({ providedIn: 'root' })
export class RepositoryService{
    private readonly _baseApiUrl = environment.backendApi;

    constructor(
        private _httpClient: HttpClient,
    ){}

    get<T>(path: string){
        return this._httpClient.get<ReponseBase<T>>(`${this._baseApiUrl}/${path}`)
    }
    post<T>(path: string, data: any){
        return this._httpClient.post<ReponseBase<T>>(`${this._baseApiUrl}/${path}`, data)
    }
    put<T>(path: string, data: any){
        return this._httpClient.put<ReponseBase<T>>(`${this._baseApiUrl}/${path}`, data)
    }
    delete<T>(path: string){
        return this._httpClient.delete<ReponseBase<T>>(`${this._baseApiUrl}/${path}`)
    }
}