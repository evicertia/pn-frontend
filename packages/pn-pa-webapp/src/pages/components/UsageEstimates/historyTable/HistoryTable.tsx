import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Column,
    Item,
    ItemsTable
} from '@pagopa-pn/pn-commons';

import {EstimateSearchTable, EstimateStatusEnum, HistoryColumn} from '../../../../models/UsageEstimation';
import {EstimateStatusChip} from "../statusChip";


type Props = {
    estimates: Array<EstimateSearchTable>;
};

const HistoryTable =
    ({ estimates}: Props) => {
    const { t } = useTranslation(['estimate'], {keyPrefix: "estimate-history"});



    const columns: Array<Column<HistoryColumn>> = [
        {
            id: 'referenceMonth',
            label: t('history-table.reference-month'),
            width: '11%',
            getCellLabel(value: string) {
                return value;
            },
            disableAccessibility: true,
        },
        {
            id: 'lastModifiedDate',
            label: t('history-table.last-modified-date'),
            width: '13%',
            sortable: false, // TODO: will be re-enabled in PN-1124
            getCellLabel(value: string) {
                return value;
            },
            disableAccessibility: true
        },
        {
            id: 'deadlineDate',
            label: t('history-table.deadline-date'),
            width: '23%',
            getCellLabel(value: string) {
                return value;
            },
            disableAccessibility: true,
        },
        {
            id: 'status',
            label: t('history-table.status'),
            width: '20%',
            getCellLabel(value: EstimateStatusEnum) {
                return <EstimateStatusChip data={value}/>;
            },
        }

    ];

    const rows: Array<Item> = estimates.map((n: EstimateSearchTable) => ({
        ...n,
        id: n.referenceMonth,
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

export default HistoryTable;
