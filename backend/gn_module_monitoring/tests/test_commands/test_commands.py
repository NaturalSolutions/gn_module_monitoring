import pytest

from flask import url_for, current_app

from sqlalchemy import select

from geonature.utils.env import DB
from geonature.core.imports.models import BibFields, Destination

from gn_module_monitoring.tests.fixtures.generic import *
from gn_module_monitoring.command.cmd import (
    cmd_remove_monitoring_module_cmd,
    cmd_process_sql,
    cmd_process_available_permission_module,
    cmd_add_module_nomenclature_cli,
)
from gn_module_monitoring.command.utils import get_protocol_data

from gn_module_monitoring.monitoring.models import TMonitoringModules


@pytest.mark.usefixtures("client_class", "temporary_transaction")
class TestCommands:
    def test_install_monitoring_module(self, install_module_test):
        # Installation du module
        # Test Installation
        result = DB.session.execute(
            select(TMonitoringModules).where(TMonitoringModules.module_code == "test")
        ).scalar_one()
        assert result.module_code == "test"

    def test_remove_monitoring_module(self, install_module_test):
        runner = current_app.test_cli_runner()

        # Suppression du module de test
        result = runner.invoke(cmd_remove_monitoring_module_cmd, ["test"])

        # Test suppression
        result = DB.session.execute(
            select(TMonitoringModules).where(TMonitoringModules.module_code == "test")
        ).scalar_one_or_none()
        assert result == None

    def test_process_all_with_module(self, install_module_test):
        runner = current_app.test_cli_runner()
        # Commande process all
        result = runner.invoke(cmd_process_sql, ["test"])
        # Pas de result juste <Result okay>
        assert result.exit_code == 0

    def test_process_all_without_module(self, install_module_test):
        runner = current_app.test_cli_runner()
        # Commande process all
        result = runner.invoke(cmd_process_sql)
        # Pas de result
        assert result.exit_code == 0

    def test_process_all_with_module(self, install_module_test):
        runner = current_app.test_cli_runner()
        # Commande process all
        # import pdb
        result = runner.invoke(cmd_process_sql, ["test"])
        # Pas de result juste <Result okay>
        assert result.exit_code == 0

    def test_process_available_permission_module_without_module(self, install_module_test):
        runner = current_app.test_cli_runner()
        # Commande process all
        result = runner.invoke(cmd_process_available_permission_module)
        # Pas de result juste <Result okay>
        assert result.exit_code == 0
        assert "Création des permissions pour test" in result.output

    def test_process_available_permission_module_with_module(self, install_module_test):
        runner = current_app.test_cli_runner()
        # Commande process all
        result = runner.invoke(cmd_process_available_permission_module, ["test"])
        # Pas de result juste <Result okay>
        assert result.exit_code == 0
        assert "Création des permissions pour test" in result.output

    def test_process_available_permission_module_bad_module(self, install_module_test):
        runner = current_app.test_cli_runner()
        # Commande process all
        result = runner.invoke(cmd_process_available_permission_module, ["bad_module"])
        # Pas de result juste <Result okay>
        assert result.exit_code == 0
        assert "le module n'existe pas" in result.output

    def test_cmd_add_module_nomenclature_cli(self, install_module_test):
        runner = current_app.test_cli_runner()
        # Commande process all
        result = runner.invoke(cmd_add_module_nomenclature_cli)
        # Pas de result juste <Result okay>
        assert result.exit_code == 2
        assert "Missing argument 'MODULE_CODE'" in result.output

    def test_cmd_add_module_nomenclature_cli(self, install_module_test):
        runner = current_app.test_cli_runner()
        # Commande add_module_nomenclature
        result = runner.invoke(cmd_add_module_nomenclature_cli, ["test"])
        # Pas de result juste <Result okay>
        assert result.exit_code == 0
        assert "nomenclature type TEST_METEO - Météo - already exist" in result.output
        assert "nomenclature METEO_M - Mauvais temps - updated" in result.output
        assert 'probleme de type avec mnemonique="TEST_UNKWONW_TYPE"' in result.output

    def test_cmd_add_module_protocol_fields(self, install_module_test):

        destination = DB.session.execute(
            select(Destination).where(Destination.code == "test")
        ).scalar_one()

        assert destination.code == "test"
        assert destination.label == "Test"

        protocol_data, entity_hierarchy_map = get_protocol_data("test", destination.id_destination)
        fields_data = []
        entities = []

        for entity_code, entity_fields in protocol_data.items():
            entities.append(entity_code)
            all_fields = entity_fields.get("generic", []) + entity_fields.get("specific", [])
            for field in all_fields:
                fields_data.append((field["name_field"], field["fr_label"]))

        fields = DB.session.execute(
            select(BibFields.name_field, BibFields.fr_label).where(
                BibFields.id_destination == destination.id_destination
            )
        ).fetchall()

        sorted_fields_data = sorted(fields_data)
        sorted_fields = sorted(fields)

        assert set(fields_data) == set(
            fields
        ), f"Expected fields {sorted_fields_data} but got {sorted_fields}"
        assert "observation" in entities
        assert "visit" in entities

        query = f"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'gn_imports' AND table_name = '{destination.table_name}');"
        result = DB.session.execute(query).scalar_one()

        assert result == True
