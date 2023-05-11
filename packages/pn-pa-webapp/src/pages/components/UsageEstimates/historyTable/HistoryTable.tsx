import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import {useNavigate} from "react-router-dom";
import {
    Column,
    Item,
    ItemsTable
} from '@pagopa-pn/pn-commons';

import {EstimateSearchTable, EstimateStatusEnum, HistoryColumn} from '../../../../models/UsageEstimation';
import {EstimateStatusChip} from "../statusChip";
import {getFormattedDateTime, localeStringReferenceMonth} from "../../../../utils/utility";
import * as routes from "../../../../navigation/routes.const";
import {trackEventByType} from "../../../../utils/mixpanel";
import {TrackEventType} from "../../../../utils/events";


type Props = {
    estimates: Array<EstimateSearchTable>;
};

const HistoryTable =
    ({ estimates}: Props) => {
    const { t } = useTranslation(['estimate'], {keyPrefix: "estimate-history"});
    const navigate = useNavigate();

    const handleRowClick = (row: Item) => {
        navigate(routes.GET_DETAIL_ESTIMATE_PATH(row.id as string));
        // log event
        trackEventByType(TrackEventType.ESTIMATE_HISTORY_TABLE_ROW_INTERACTION);
    };

    const columns: Array<Column<HistoryColumn>> = [
        {
            id: 'referenceMonth',
            label: t('history-table.reference-month'),
            width: '11%',
            getCellLabel(value: string) {
                return localeStringReferenceMonth(value);
            },
            onClick(row: Item) {
                handleRowClick(row);
            },
            disableAccessibility: true,
        },
        {
            id: 'lastModifiedDate',
            label: t('history-table.last-modified-date'),
            width: '13%',
            sortable: false, // TODO: will be re-enabled in PN-1124
            getCellLabel(value: string) {
                return getFormattedDateTime(value);
            },
            onClick(row: Item) {
                handleRowClick(row);
            },
            disableAccessibility: true
        },
        {
            id: 'deadlineDate',
            label: t('history-table.deadline-date'),
            width: '23%',
            getCellLabel(value: string) {
                return getFormattedDateTime(value);
            },
            onClick(row: Item) {
                handleRowClick(row);
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
