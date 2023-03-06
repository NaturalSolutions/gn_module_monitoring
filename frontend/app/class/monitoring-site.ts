// TODO: voir si colonnes doivent être définies depuis le fichier de config site_group
export enum columnNameSite {
  base_site_name = "Nom",
  last_visit = "Dernière visite",
  nb_visits = "Nb. visites",
  base_site_code = "Code",
  altitude_max = "Alt.max",
  altitude_min = "Alt.min",
}

export const extendedDetailsSite = {
  ...columnNameSite,
  base_site_description: "Description",
};
