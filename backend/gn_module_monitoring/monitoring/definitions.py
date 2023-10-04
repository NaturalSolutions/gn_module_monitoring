from geonature.core.gn_monitoring.models import TMarkingEvent

from .models import (
    TMonitoringModules,
    TMonitoringSites,
    TMonitoringVisits,
    TMonitoringObservations,
    TMonitoringObservationDetails,
    TMonitoringSitesGroups
)
from .objects import MonitoringModule, MonitoringSite, MonitoringIndividual

from .base import monitoring_definitions
from .repositories import MonitoringObject
from .geom import MonitoringObjectGeom


"""
    MonitoringModels_dict :
    Fait le lien entre les monitoring_objects
    et les modèles sqlalchemy
"""

MonitoringModels_dict = {
    "module": TMonitoringModules,
    "site": TMonitoringSites,
    "visit": TMonitoringVisits,
    "observation": TMonitoringObservations,
    "observation_detail": TMonitoringObservationDetails,
    "sites_group": TMonitoringSitesGroups,
    "individual": TMarkingEvent,
}

MonitoringObjects_dict = {
    "module": MonitoringModule,  # besoin pour retrouver le module depuis module_code à voir si on peux faire sans
    "site": MonitoringSite,
    "visit": MonitoringObject,
    "observation": MonitoringObject,
    "observation_detail": MonitoringObject,
    "sites_group": MonitoringObjectGeom,
    "individual": MonitoringIndividual,
}

MonitoringPermissions_dict = {
    "site": "GNM_SITES",
    "sites_group": "GNM_GRP_SITES",
    "visite": "GNM_VISITES",
    "observation": "GNM_OBSERVATIONS",
    "module": "GNM_MODULES",
}

MonitoringPermissionObjectLabel_dict = {
    "ALL": "objets (sites, visites, observations, etc...)",
    "GNM_SITES": "sites",
    "GNM_OBSERVATIONS": "observations",
    "GNM_VISITES": "visites",
    "GNM_GRP_SITES": "groupes de sites",
    "GNM_MODULES": "modules",
}


monitoring_definitions.set(MonitoringObjects_dict, MonitoringModels_dict)
