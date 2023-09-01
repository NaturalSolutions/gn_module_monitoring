import { Injectable } from '@angular/core';
import { TPermission } from '../types/permission';
import { BehaviorSubject } from 'rxjs';
import { ObjectsPermissionMonitorings } from '../enum/objectPermission';

@Injectable()
export class PermissionService {
  defaultPermission: TPermission = {
    [ObjectsPermissionMonitorings.GNM_GRP_SITES]: {
      canCreate: false,
      canRead: false,
      canUpdate: false,
      canDelete: false,
    },
    [ObjectsPermissionMonitorings.GNM_SITES]: {
      canCreate: false,
      canRead: false,
      canUpdate: false,
      canDelete: false,
    },
  };

  constructor() {}

  private permissionObject = new BehaviorSubject<TPermission>(this.defaultPermission);
  currentPermissionObj = this.permissionObject.asObservable();

  setPermissionUser(permUser: TPermission) {
    this.permissionObject.next(permUser);
  }

  setPermissionMonitorings(listObjectCruved) {
    Object.keys(this.defaultPermission).forEach((objKey) => {
      this.defaultPermission[objKey].canRead = false;
      this.defaultPermission[objKey].canCreate = false;
      this.defaultPermission[objKey].canDelete = false;
      this.defaultPermission[objKey].canUpdate = false;
      Object.keys(listObjectCruved[objKey]).forEach((action) => {
        switch (action) {
          case 'C':
            this.defaultPermission[objKey].canCreate =
              listObjectCruved[objKey][action] > 0 ? true : false;
            break;
          case 'R':
            this.defaultPermission[objKey].canRead =
              listObjectCruved[objKey][action] > 0 ? true : false;
            break;
          case 'U':
            this.defaultPermission[objKey].canUpdate =
              listObjectCruved[objKey][action] > 0 ? true : false;
            break;
          case 'D':
            this.defaultPermission[objKey].canDelete =
              listObjectCruved[objKey][action] > 0 ? true : false;
            break;
          default:
            break;
        }
      });
    });
    this.setPermissionUser(this.defaultPermission);
  }
}
