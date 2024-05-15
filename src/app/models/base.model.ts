import { StatusEntity } from "./global.enum";
import { NotifyStatus } from "./global.type";

export interface ReponseBase<T>{
    success: boolean;
    message: string;
    data: T;
}

export interface BaseEntity{
    id: number;
    status: StatusEntity
}

export interface NotifyVM{
    status: NotifyStatus;
    message: string;
}