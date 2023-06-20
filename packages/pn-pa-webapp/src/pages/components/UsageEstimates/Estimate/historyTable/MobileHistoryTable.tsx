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
import {EstimateStatusChip} from "../../Common/statusChip/index";
import {getFormattedDateTime, localeStringReferenceMonth} from "../../../../../utils/utility";


type Props = {
  estimates: Array<EstimateHistory>;
};

export const MobileHistoryTable = (
  { estimates}: Props) => {
  const { t } = useTranslation(['estimate'], {keyPrefix: "estimate-history"});
  const navigate = useNavigate();


  const cardHeader: [CardElement, CardElement] = [
    //  Parameters with only value but not description
    {
      id: 'referenceMonth',
      label: t('history-table.reference-month'),
      getLabel(value: string) {
        return localeStringReferenceMonth(value);
      },
      gridProps: {
        xs: 12,
        sm: 5,
      },
    },
    {
      id: 'status',
      label: t('history-table.status'),
      getLabel(value: EstimateStatusEnum) {
        return <EstimateStatusChip data={value}/>;
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
      label: t('history-table.last-modified-date'),
      getLabel(value: string) {
        return getFormattedDateTime(value);
      },
      notWrappedInTypography: true,
    },
    {
      id: 'deadlineDate',
      label: t('history-table.deadline-date'),
      getLabel(value: string) {
        return getFormattedDateTime(value);
      },
    },

  ];

  // Navigation handlers
  const handleRowClick = (row: Item) => {
    if (row?.status && row.status === EstimateStatusEnum.VALIDATED) {
      navigate(routes.GET_DETAIL_ESTIMATE_PATH(row.id as string));
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
    },
  ];

  const cardData: Array<Item> = estimates.map((n: EstimateHistory) => ({
    ...n,
    id: n.referenceMonth,
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
