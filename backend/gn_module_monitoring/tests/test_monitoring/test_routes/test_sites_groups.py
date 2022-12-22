import pytest
from flask import url_for

from gn_module_monitoring.monitoring.models import TMonitoringSitesGroups
from gn_module_monitoring.monitoring.schemas import MonitoringSitesGroupsSchema
from gn_module_monitoring.tests.fixtures.site import categories, site_type, sites
from gn_module_monitoring.tests.fixtures.sites_groups import sites_groups


@pytest.mark.usefixtures("client_class", "temporary_transaction")
class TestSitesGroups:
    def test_get_sites_groups(self, sites_groups):
        r = self.client.get(url_for("monitorings.get_sites_groups"))

        assert r.json["count"] >= len(sites_groups)
        assert all([group.as_dict() in r.json["sites_groups"] for group in sites_groups.values()])

    def test_get_sites_groups_filter_name(self, sites_groups):
        name, name_not_present = list(sites_groups.keys())

        r = self.client.get(
            url_for("monitorings.get_sites_groups"), query_string={"sites_group_name": name}
        )

        assert r.json["count"] >= 1
        json_sites_groups = r.json["sites_groups"]
        assert sites_groups[name].as_dict() in json_sites_groups
        assert sites_groups[name_not_present].as_dict() not in json_sites_groups

    def test_serialize_sites_groups(self, sites_groups, sites):
        groups = TMonitoringSitesGroups.query.filter(
            TMonitoringSitesGroups.id_sites_group.in_(
                [s.id_sites_group for s in sites_groups.values()]
            )
        ).all()
        schema = MonitoringSitesGroupsSchema()
        assert [schema.dump(site) for site in groups]
