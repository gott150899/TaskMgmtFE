import { BaseEntity } from "./base.model";
import { StaffInTaff } from "./staff-in-task.model";

export interface TaskVM extends BaseEntity{
    parentId: number | null;
    label: string | null;
    type: string | null;
    name: string | null;
    startDate: string | null;
    endDate: string | null;
    duration: number | null;
    progress: number | null;
    isUnscheduled: boolean | null;
}

export interface TaskVmV2{
    task: TaskVM
    staffs: StaffInTaff[]
}

export interface TaskCreateBody{
    parentId: number | null;
    label: string | null;
    type: string | null;
    name: string | null;
    startDate: string | null;
    endDate: string | null;
    duration: number | null;
    progress: number | null;
    isUnscheduled: boolean | null;
    staffIds: number[];
}

export interface TaskUpdateBody extends TaskCreateBody{
    id: number;
}