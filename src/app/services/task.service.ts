import { Injectable } from "@angular/core";
import { TaskCreateBody, TaskUpdateBody, TaskVM, TaskVmV2 } from "../models/task.model";
import { RepositoryService } from "./repository.service";

@Injectable({ providedIn: 'root' })
export class TaskService{
    private readonly _path = 'Task';

    constructor(
        private _repositoryService: RepositoryService
    ){}

    get(){
        return this._repositoryService.get<TaskVmV2[]>(this._path);
    }
    post(body: TaskCreateBody){
        return this._repositoryService.post<TaskVM>(this._path, body);
    }
    getById(id: number){
        return this._repositoryService.get<TaskVM>(`${this._path}/${id}`);
    }
    put(body: TaskUpdateBody){
        return this._repositoryService.put<TaskVM>(`${this._path}/${body.id}`, body);
    }
    delete(id: number){
        return this._repositoryService.delete<TaskVM>(`${this._path}/${id}`);
    }
}