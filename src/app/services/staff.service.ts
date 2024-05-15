import { Injectable } from "@angular/core";
import { RepositoryService } from "./repository.service";
import { StaffCreateBody, StaffUpdateBody, StaffVM } from "../models/staff.model";

@Injectable({ providedIn: 'root' })
export class StaffService{
    private readonly _path = 'Staff';

    constructor(
        private _repositoryService: RepositoryService
    ){}

    get(term: string = '', status: number = 9999){
        return this._repositoryService.get<StaffVM[]>(`${this._path}?term=${term}&status=${status}`);
    }
    post(body: StaffCreateBody){
        return this._repositoryService.post<StaffVM>(this._path, body);
    }
    getById(id: number){
        return this._repositoryService.get<StaffVM>(`${this._path}/${id}`);
    }
    put(body: StaffUpdateBody){
        return this._repositoryService.put<StaffVM>(`${this._path}/${body.id}`, body);
    }
    delete(id: number){
        return this._repositoryService.delete<StaffVM>(`${this._path}/${id}`);
    }
}