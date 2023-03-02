import { endPoints } from "../enum/endpoints";
import { JsonData } from "../types/jsondata";

export interface IobjObs {
    properties: JsonData;
    endPoint: endPoints;
    label: string;
    addObjLabel: string;
    editObjLabel: string;
    id: string|null;
    moduleCode:string;
}