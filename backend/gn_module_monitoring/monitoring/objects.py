from .repositories import MonitoringObject
from .geom import MonitoringObjectGeom
from geonature.utils.errors import GeoNatureError
from geonature.utils.env import DB
from geonature.core.gn_commons.models import TModules


class MonitoringModule(MonitoringObject):
    def get(self, param_value=None, param_name=None, depth=0):
        """
        pour récupérer le module sans l'id_module mais avec le module_code
        """
        if not param_name:
            param_name = "module_code"
            if not param_value:
                param_value = self._module_code
        MonitoringObject.get(self, param_value, param_name, depth)
        self._id = self._model.id_module
        return self


class MonitoringSite(MonitoringObjectGeom):
    """
    PATCH
    pour pouvoir renseigner la table cor_site_module
    avec la méthode from_dict
    """

    def preprocess_data(self, data):
        module_ids = [module.id_module for module in self._model.modules]
        id_module = int(data["id_module"])
        if id_module not in module_ids:
            module_ids.append(id_module)

        data["modules"] = module_ids


class MonitoringIndividual(MonitoringObject):
    """
    PATCH
    pour pouvoir renseigner la table cor_individual_module
    avec la méthode from_dict
    """

    def get_value_specific(self, param_name):
        # DO NOT LOAD data here
        pass

    def preprocess_data(self, data):
        module_ids = [module.id_module for module in self._model.modules]
        id_module = int(data["id_module"])
        if id_module not in module_ids:
            module_ids.append(id_module)

        data["modules"] = module_ids

    def delete(self):
        # Soft delete
        if not self._id:
            raise GeoNatureError("Monitoring : delete object has no id")

        try:
            self.get()
            monitoring_object_out = self.serialize(1)

            self._model.active = False
            DB.session.commit()

            return monitoring_object_out

        except Exception as e:
            raise GeoNatureError("Delete {} raise error {}".format(self, str(e)))
