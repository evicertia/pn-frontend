import { Email, People, GroupWork, TrendingUp } from '@mui/icons-material';
import { SideMenuItem } from '@pagopa-pn/pn-commons';

import * as routes from '../navigation/routes.const';
import { UserRole } from '../models/user';

export const ReferenteAmministrativoMenuItems: Array<SideMenuItem> = [
  { label: 'Notifiche', icon: Email, route: routes.DASHBOARD },
  { label: 'Chiavi API', icon: TrendingUp, route: routes.API_KEYS },
  { label: 'Ruoli', icon: People, route: routes.ROLES },
  { label: 'Gruppi', icon: GroupWork, route: routes.GROUPS },
];

export const ReferenteTecnicoMenuItems: Array<SideMenuItem> = [
  { label: 'Notifiche', icon: Email, route: routes.DASHBOARD },
  { label: 'Chiavi API', icon: TrendingUp, route: routes.API_KEYS },
  { label: 'Ruoli', icon: People, route: routes.ROLES },
];

export function getMenuItems(role: UserRole) {
  switch (role) {
    case UserRole.REFERENTE_AMMINISTRATIVO:
      return ReferenteAmministrativoMenuItems;
    case UserRole.REFERENTE_OPERATIVO:
      return ReferenteTecnicoMenuItems;
  }
}

export function getHomePage(role: UserRole) {
  switch (role) {
    case UserRole.REFERENTE_AMMINISTRATIVO:
    case UserRole.REFERENTE_OPERATIVO:
      return routes.DASHBOARD;
  }
}
