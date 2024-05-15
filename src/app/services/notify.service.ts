import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { NotifyVM } from "../models/base.model";

@Injectable({ providedIn: 'root' })
export class NotifyService{
    notify$ = new BehaviorSubject<NotifyVM>({status: 'success', message: ''});
}
