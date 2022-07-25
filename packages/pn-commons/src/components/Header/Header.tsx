import { AppBar } from '@mui/material';
import {
  HeaderAccount,
  RootLinkType,
  HeaderProduct,
  ProductEntity,
  PartyEntity,
  JwtUser,
  UserAction,
} from '@pagopa/mui-italia';

import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import { pagoPALink } from '../../utils/costants';

type HeaderProps = {
  /** Assistance email for the user */
  assistanceEmail?: string;
  /** List of available products */
  productsList: Array<ProductEntity>;
  /** Current product */
  productId?: string;
  /** List of available parties */
  partyList?: Array<PartyEntity>;
  /** Logout/exit action to apply */
  onExitAction?: () => void;
  /** current logged user */
  loggedUser: JwtUser;
  /** Enable user dropdown */
  enableDropdown?: boolean;
  /** Actions linked to user dropdown */
  userActions?: Array<UserAction>;
};

const pagoPAHeaderLink: RootLinkType = {
  ...pagoPALink(),
  label: 'PagoPA S.p.A.',
  title: getLocalizedOrDefaultLabel('common', 'header.pago-pa-link', 'Sito di PagoPA S.p.A.')
};

const Header = ({
  onExitAction = () => window.location.assign(''),
  assistanceEmail,
  productsList,
  productId,
  partyList,
  loggedUser,
  enableDropdown,
  userActions,
}: HeaderProps) => {
  const handleProductSelection = (product: ProductEntity) => {
    if (product.productUrl) {
      /* eslint-disable-next-line functional/immutable-data */
      window.location.href = product.productUrl;
    }
  };

  const enableHeaderProduct = productsList && productsList.length > 0 || partyList && partyList.length > 0;
  
  return (
    <AppBar sx={{ boxShadow: 'none', color: 'inherit' }} position="relative">
      <HeaderAccount
        rootLink={pagoPAHeaderLink}
        loggedUser={loggedUser}
        enableLogin={loggedUser.id !== ''}
        onAssistanceClick={() => {
          if (assistanceEmail) {
            /* eslint-disable-next-line functional/immutable-data */
            window.location.href = `mailto:${assistanceEmail}`;
          }
        }}
        onLogout={onExitAction}
        enableDropdown={enableDropdown}
        userActions={userActions}
      />
      {enableHeaderProduct && (
        <HeaderProduct
          productId={productId}
          productsList={productsList}
          partyList={partyList}
          onSelectedProduct={handleProductSelection}
        />
      )}
    </AppBar>
  );
};

export default Header;
