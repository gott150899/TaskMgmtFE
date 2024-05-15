import { BaseEntity } from "./base.model";

export interface StaffVM extends BaseEntity{
    fullName: string;
    shortName: string;
}

export interface StaffCreateBody{
    fullName: string;
    shortName: string;
}

export interface StaffUpdateBody extends StaffCreateBody{
    id: number;
}