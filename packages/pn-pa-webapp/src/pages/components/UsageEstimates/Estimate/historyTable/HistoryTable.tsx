import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import {useNavigate} from "react-router-dom";
import {
  Column,
  Item,
  ItemsTable
} from '@pagopa-pn/pn-commons';
import {EstimateHistory, EstimateStatusEnum, EstimateHistoryColumn} from '../../../../../models/UsageEstimation';
import {EstimateStatusChip} from "../../Common/statusChip";
import {getFormattedDateTime, localeStringReferenceId} from "../../../../../utils/utility";
import * as routes from "../../../../../navigation/routes.const";


type Props = {
  estimates: Array<EstimateHistory>;
};

export const HistoryTable = ({estimates}: Props) => {
  const { t } = useTranslation(['estimate'], {keyPrefix: "estimate.history.history-table"});
  const navigate = useNavigate();

  const handleRowClick = (row: Item) => {
    if (row?.status && row.status === EstimateStatusEnum.VALIDATED) {
      navigate(routes.GET_DETAIL_ESTIMATE_PATH(row.id));
    }
  };

  const columns: Array<Column<EstimateHistoryColumn>> = [
    {
      id: 'referenceMonth',
      label: t('reference-month'),
      width: '15%',
      getCellLabel(value: string) {
        return localeStringReferenceId(value);
      },
      onClick(row: Item) {
        handleRowClick(row);
      },
      disableAccessibility: true,
    },
    {
      id: 'deadlineDate',
      label: t('deadline-date'),
      width: '15%',
      getCellLabel(value: string) {
        return getFormattedDateTime(value);
      },
      onClick(row: Item) {
        handleRowClick(row);
      },
      disableAccessibility: true,
    },
    {
      id: 'lastModifiedDate',
      label: t('last-modified-date'),
      width: '15%',
      sortable: false,
      getCellLabel(value: string) {
        return getFormattedDateTime(value);
      },
      onClick(row: Item) {
        handleRowClick(row);
      },
      disableAccessibility: true
    },
    {
      id: 'status',
      label: t('status'),
      width: '10%',
      getCellLabel(value: EstimateStatusEnum) {
        return <EstimateStatusChip data={value} prefix={'estimate'}/>;
      },
    }
  ];

  const rows: Array<Item> = estimates.map((element: EstimateHistory) => ({
    ...element,
    id: element.referenceMonth,
  }));

  return (
    <Fragment>
      {estimates && (
        <Fragment>
          {
            <ItemsTable
              columns={columns}
              rows={rows}
            />
          }
        </Fragment>
      )}
    </Fragment>
  );
};

