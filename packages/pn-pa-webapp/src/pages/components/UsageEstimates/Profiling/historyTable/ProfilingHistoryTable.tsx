import {Fragment} from 'react';
import { useTranslation } from 'react-i18next';
import {useNavigate} from "react-router-dom";
import {
  Column,
  Item,
  ItemsTable
} from '@pagopa-pn/pn-commons';
import {
  ProfilingHistory,
  EstimateStatusEnum,
  ProfilingHistoryColumn
} from '../../../../../models/UsageEstimation';
import {EstimateStatusChip} from "../../Common/statusChip";
import {getFormattedDateTime, localeStringReferenceId} from "../../../../../utils/utility";
import * as routes from "../../../../../navigation/routes.const";


type Props = {
  profilings: Array<ProfilingHistory>;
};

export const ProfilingHistoryTable = ({profilings}: Props) => {
  const {t} = useTranslation(['estimate'], {keyPrefix: "profiling.history.history-table"});
  const navigate = useNavigate();

  const handleRowClick = (row: Item) => {
    if (row?.status && row.status === EstimateStatusEnum.DRAFT && row.showEdit) {
      navigate(routes.GET_EDIT_PROFILING_PATH(row.id));
    }

    // if (row?.status && row.status === EstimateStatusEnum.VALIDATED && !row.showEdit) {
    //   navigate(routes.GET_DETAIL_PROFILING_PATH(row.id));
    // }
  };

  const columns: Array<Column<ProfilingHistoryColumn>> = [
    {
      id: 'referenceYear',
      label: t('reference-year'),
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
        return <EstimateStatusChip data={value} prefix={'profiling'}/>;
      },
    }
  ];

  const rows: Array<Item> = profilings.map((element: ProfilingHistory) => ({
    ...element,
    id: element.referenceYear,
    // showEdit: element.showEdit
  }));

  return (
    <Fragment>
      {profilings && (
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

