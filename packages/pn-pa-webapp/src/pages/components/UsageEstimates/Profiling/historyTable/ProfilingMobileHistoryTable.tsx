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
import {EstimateStatusEnum, ProfilingHistory} from "../../../../../models/UsageEstimation";
import {EstimateStatusChip} from "../../Common/statusChip";
import {getFormattedDateTime, localeStringReferenceId} from "../../../../../utils/utility";


type Props = {
  profilings: Array<ProfilingHistory>;
};

export const ProfilingMobileHistoryTable = ({profilings}: Props) => {
  const {t} = useTranslation(['estimate'], {keyPrefix: "profiling.history.history-table"});
  const navigate = useNavigate();

  const cardHeader: [CardElement, CardElement] = [
    //  Parameters with only value but not description
    {
      id: 'referenceYear',
      label: t('reference-year'),
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
      label: t('status'),
      getLabel(value: EstimateStatusEnum) {
        return <EstimateStatusChip data={value} prefix={'profiling'}/>;
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
    },
  ];

  // Navigation handlers
  const handleRowClick = (row: Item) => {
    if (row?.status && row.status === EstimateStatusEnum.VALIDATED) {
      navigate(routes.GET_DETAIL_ESTIMATE_PATH(row.id));
    }
  };

  const cardActions: Array<CardAction> = [
    {
      id: 'referenceYear',
      component: (
        <ButtonNaked endIcon={<ArrowForwardIcon />} color="primary">
          {t('show-detail')}
        </ButtonNaked>
      ),
      onClick: handleRowClick,
    },
  ];

  const cardData: Array<Item> = profilings.map((element: ProfilingHistory) => ({
    ...element,
    id: element.referenceYear,
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
