import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  CardElement,
  CardSort,
  getNotificationStatusLabelAndColor,
  Notification,
  ItemCard,
  NotificationStatus,
  Item,
  Sort,
  StatusTooltip,
  CardAction,
} from '@pagopa-pn/pn-commons';

import * as routes from '../../navigation/routes.const';
import { getNewNotificationBadge } from '../NewNotificationBadge/NewNotificationBadge';
import MobileNotificationsSort from './MobileNotificationsSort';
import FilterNotifications from './FilterNotifications';

type Props = {
  notifications: Array<Notification>;
  /** Card sort */
  sort?: Sort;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort) => void;
};

const MobileNotifications = ({ notifications, sort, onChangeSorting }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation('notifiche');

  const cardHeader: [CardElement, CardElement] = [
    {
      id: 'sentAt',
      label: t('table.data'),
      getLabel(value: string) {
        return getNewNotificationBadge(value);
      },
    },
    {
      id: 'notificationStatus',
      label: t('table.status'),
      getLabel(value: string) {
        const { label, tooltip, color } = getNotificationStatusLabelAndColor(
          value as NotificationStatus
        );
        return <StatusTooltip label={t(label)} tooltip={t(tooltip)} color={color}></StatusTooltip>;
      },
    },
  ];

  const cardBody: Array<CardElement> = [
    {
      id: 'senderId',
      label: t('table.mittente'),
      getLabel(value: string) {
        return value;
      },
    },
    {
      id: 'subject',
      label: t('table.oggetto'),
      getLabel(value: string) {
        return value.length > 65 ? value.substring(0, 65) + '...' : value;
      },
    },
    {
      id: 'iun',
      label: t('table.iun'),
      getLabel(value: string) {
        return value;
      },
    },
  ];

  const cardData: Array<Item> = notifications.map((n, i) => ({
    ...n,
    id: i.toString(),
  }));

  const sortFields: Array<CardSort> = [
    { id: 'sentAt', label: t('table.data') },
    { id: 'senderId', label: t('table.mittente') },
  ].reduce((arr, item) => {
    /* eslint-disable functional/immutable-data */
    arr.push(
      {
        id: `${item.id}-asc`,
        label: `${item.label} ${t('sort.asc')}`,
        field: item.id,
        value: 'asc',
      },
      {
        id: `${item.id}-desc`,
        label: `${item.label} ${t('sort.desc')}`,
        field: item.id,
        value: 'desc',
      }
    );
    /* eslint-enable functional/immutable-data */
    return arr;
  }, [] as Array<CardSort>);

  // Navigation handlers
  const handleRowClick = (row: Item) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
  };

  // TODO: sostituire con button naked
  const cardActions: Array<CardAction> = [
    {
      id: 'go-to-detail',
      component: <Button endIcon={<ArrowForwardIcon />}>{t('table.show-detail')}</Button>,
      onClick: handleRowClick,
    },
  ];

  return (
    <Fragment>
      <Grid container direction="row">
        <Grid item xs={6}>
          <FilterNotifications />
        </Grid>
        <Grid item xs={6} textAlign="right">
          {sort && onChangeSorting && (
            <MobileNotificationsSort
              sortFields={sortFields}
              sort={sort}
              onChangeSorting={onChangeSorting}
            />
          )}
        </Grid>
      </Grid>
      <ItemCard
        cardHeader={cardHeader}
        cardBody={cardBody}
        cardData={cardData}
        cardActions={cardActions}
      />
    </Fragment>
  );
};

export default MobileNotifications;
