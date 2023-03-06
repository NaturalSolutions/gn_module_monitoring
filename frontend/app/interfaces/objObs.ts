import { endPoints } from "../enum/endpoints";
import { JsonData } from "../types/jsondata";
import { ISite, ISitesGroup } from "./geom";

export type ObjDataType = ISite | ISitesGroup | JsonData
// type getSchemaConfig = (moduleCode: string,endPoint:string) => JsonData;
export interface IobjObs<ObjDataType> {
    properties: ObjDataType;
    endPoint: endPoints;
    label: string;
    addObjLabel: string;
    editObjLabel: string;
    id: string|null;
    moduleCode:string;
    schema:JsonData;
    template:{fieldNames:[], fieldLabels:JsonData, fieldNamesList:[], fieldDefinitions:{}},
    dataTable:{colNameObj:{}}
}