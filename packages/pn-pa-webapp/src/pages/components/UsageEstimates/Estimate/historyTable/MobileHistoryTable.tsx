import { Fragment} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  CardElement,
  Item,
  ItemsCard,
  CardAction,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';
import * as routes from '../../../../../navigation/routes.const';
import {EstimateHistory, EstimateStatusEnum} from "../../../../../models/UsageEstimation";
import {EstimateStatusChip} from "../../Common/statusChip";
import {getFormattedDateTime, localeStringReferenceId} from "../../../../../utils/utility";


type Props = {
  estimates: Array<EstimateHistory>;
};

export const MobileHistoryTable = ({estimates}: Props) => {
  const { t } = useTranslation(['estimate'], {keyPrefix: "estimate.history.history-table"});
  const navigate = useNavigate();

  const cardHeader: [CardElement, CardElement] = [
    //  Parameters with only value but not description
    {
      id: 'referenceMonth',
      label: t('reference-month'),
      getLabel(value: string) {
        return localeStringReferenceId(value);
      },
      gridProps: {
        xs: 12,
        sm: 5,
      },
    },
    {
      id: 'status',
      label: t('.status'),
      getLabel(value: EstimateStatusEnum) {
        return <EstimateStatusChip data={value} prefix={'estimate'}/>;
      },
      gridProps: {
        xs: 12,
        sm: 7,
      },
    },
  ];

  const cardBody: Array<CardElement> = [
    {
      id: 'lastModifiedDate',
      label: t('last-modified-date'),
      getLabel(value: string) {
        return getFormattedDateTime(value);
      },
      notWrappedInTypography: true,
    },
    {
      id: 'deadlineDate',
      label: t('deadline-date'),
      getLabel(value: string) {
        return getFormattedDateTime(value);
      },
    }
  ];

  // Navigation handlers
  const handleRowClick = (row: Item) => {
    if (row?.status && row.status === EstimateStatusEnum.VALIDATED) {
      navigate(routes.GET_DETAIL_ESTIMATE_PATH(row.id));
    }
  };

  const cardActions: Array<CardAction> = [
    {
      id: 'referenceMonth',
      component: (
        <ButtonNaked endIcon={<ArrowForwardIcon />} color="primary">
          {t('show-detail')}
        </ButtonNaked>
      ),
      onClick: handleRowClick,
    }
  ];

  const cardData: Array<Item> = estimates.map((element: EstimateHistory) => ({
    ...element,
    id: element.referenceMonth,
  }));

  return (
    <Fragment>
      <ItemsCard
        cardData={cardData}
        cardHeader={cardHeader}
        cardBody={cardBody}
        cardActions={cardActions}
        headerGridProps={{
          direction: { xs: 'column-reverse', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
        }}
      />
    </Fragment>
  );
};
