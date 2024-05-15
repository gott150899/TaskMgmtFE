import { BaseEntity } from "./base.model";

export interface StaffInTaff extends BaseEntity{
    staffId: number;
    taskId: number;
}