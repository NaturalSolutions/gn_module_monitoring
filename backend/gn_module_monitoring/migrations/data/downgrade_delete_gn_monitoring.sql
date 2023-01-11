DELETE FROM gn_commons.t_modules
WHERE module_code in ('MONITORINGS')
RETURNING *;
DELETE FROM gn_commons.bib_tables_location
WHERE schema_name in (
        't_module_complements',
        't_observations',
        't_sites_groups'
    );
-- ATTENTION DEPENDANCES PRESENTES SI MODULE INSTALLE AVEC MONITORING BIEN SUPPRIMER LES MODULES AVANT --
DROP TABLE IF EXISTS gn_monitoring.t_site_complements;
DROP TRIGGER IF EXISTS tri_meta_dates_change_t_sites_groups ON gn_monitoring.t_sites_groups;
DROP TABLE IF EXISTS gn_monitoring.t_module_complements;
DROP TABLE IF EXISTS gn_monitoring.t_sites_groups;
DROP TABLE IF EXISTS gn_monitoring.t_observation_details;
DELETE FROM gn_permissions.t_objects
WHERE code_object like 'GNM%';
DROP VIEW IF EXISTS gn_monitoring.v_synthese_chiro;
DROP TABLE IF EXISTS gn_monitoring.t_observation_complements RESTRICT;
DROP TABLE IF EXISTS gn_monitoring.t_observations RESTRICT;
DROP TABLE IF EXISTS gn_monitoring.t_visit_complements;