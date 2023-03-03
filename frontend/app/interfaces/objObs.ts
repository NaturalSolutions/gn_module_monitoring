import { endPoints } from "../enum/endpoints";
import { JsonData } from "../types/jsondata";

// type getSchemaConfig = (moduleCode: string,endPoint:string) => JsonData;
export interface IobjObs {
    properties: JsonData;
    endPoint: endPoints;
    label: string;
    addObjLabel: string;
    editObjLabel: string;
    id: string|null;
    moduleCode:string;
    schema:JsonData;
    template:{fieldNames:[], fieldLabels:JsonData}
}