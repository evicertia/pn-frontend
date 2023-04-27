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

import { trackEventByType } from '../../../../utils/mixpanel';
import { TrackEventType } from '../../../../utils/events';
import * as routes from '../../../../navigation/routes.const';
import {EstimateSearchTable} from "../../../../models/UsageEstimation";


type Props = {
    estimates: Array<EstimateSearchTable>;
};

const MobileHistoryTable = (
    { estimates}: Props) => {
    const { t } = useTranslation(['estimate']);
    const navigate = useNavigate();


    const cardHeader: [CardElement, CardElement] = [
        //  Parameters with only value but not description
        {
            id: 'reference-month',
            label: t('history-table.reference-month'),
            getLabel(value: string) {
                return value;
            },
            gridProps: {
                xs: 12,
                sm: 5,
            },
        },
        {
            id: 'status',
            label: t('history-table.status'),
            getLabel(value: string) {
                return value;
            },
            gridProps: {
                xs: 12,
                sm: 7,
            },
        },
    ];

    const cardBody: Array<CardElement> = [
        {
            id: 'last-modified-date',
            label: t('history-table.last-modified-date'),
            getLabel(value: string) {
                return value;
            },
            notWrappedInTypography: true,
        },
        {
            id: 'deadline-date',
            label: t('history-table.deadline-date'),
            getLabel(value: string) {
                return value;
            },
        },

    ];

    // Navigation handlers
    const handleRowClick = (row: Item) => {
        navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
        trackEventByType(TrackEventType.NOTIFICATION_TABLE_ROW_INTERACTION);
    };

    const cardActions: Array<CardAction> = [
        {
            id: 'go-to-detail',
            component: (
                <ButtonNaked endIcon={<ArrowForwardIcon />} color="primary">
                    {t('table.show-detail')}
                </ButtonNaked>
            ),
            onClick: handleRowClick,
        },
    ];

    const cardData: Array<Item> = estimates.map((n: EstimateSearchTable, i: number) => ({
        ...n,
        id: i.toString(),
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

export default MobileHistoryTable;
