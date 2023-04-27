import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Column,
    Item,
    ItemsTable
} from '@pagopa-pn/pn-commons';

import {EstimateSearchTable, HistoryColumn} from '../../../../models/UsageEstimation';


type Props = {
    estimates: Array<EstimateSearchTable>;
};

const HistoryTable =
    ({ estimates}: Props) => {
    const { t } = useTranslation(['estimate']);



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
            label: t('history-table.lastModifiedDate'),
            width: '13%',
            sortable: false, // TODO: will be re-enabled in PN-1124
            getCellLabel(value: string) {
                return value;
            },
            disableAccessibility: true
        },
        {
            id: 'deadlineDate',
            label: t('history-table.deadlineDate'),
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
            getCellLabel(value: string) {
                return value;
            },
        }

    ];

    const rows: Array<Item> = estimates.map((n: EstimateSearchTable, i: number) => ({
        ...n,
        id: i.toString(),
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
