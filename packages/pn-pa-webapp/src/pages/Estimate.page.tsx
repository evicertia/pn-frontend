import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  calculatePages,
  CustomPagination,
  PaginationData,
  useIsMobile,
  ApiErrorWrapper,
} from '@pagopa-pn/pn-commons';

import {Box, Typography } from '@mui/material';

import { RootState } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setPagination } from '../redux/dashboard/reducers';
import { trackEventByType } from '../utils/mixpanel';
import { TrackEventType } from '../utils/events';
import {ESTIMATE_ACTIONS, getAllEstimate} from "../redux/usageEstimation/actions";
import HistoryTable from './components/UsageEstimates/historyTable/HistoryTable';
import MobileHistoryTable from "./components/UsageEstimates/historyTable/MobileHistoryTable";
import {ActualEstimateCard} from "./components/UsageEstimates/actualEstimateCard/ActualEstimateCard";

export function EstimatePage ()  {
  const dispatch = useAppDispatch();
  const historyEstimates = useAppSelector(state => state.usageEstimateState.historyEstimates);
  const pagination = useAppSelector((state: RootState) => state.usageEstimateState.pagination);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);

  const isMobile = useIsMobile();
  const { t } = useTranslation(['estimate'], {keyPrefix: "estimate-history"});


  const fetchHistory= useCallback( () => {
    void dispatch(getAllEstimate(
        {
          paId:loggedUser.organization.id,
          ...pagination
        }));
  },[pagination]);


  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);


  const handleEventTrackingCallbackPageSize = (pageSize: number) => {
    trackEventByType(TrackEventType.ESTIMATE_HISTORY_TABLE_PAGINATION, {pageSize});
  };

  const handleChangePage = (paginationData: PaginationData) => {
    trackEventByType(TrackEventType.ESTIMATE_HISTORY_TABLE_PAGINATION);
    dispatch(setPagination({ size: paginationData.size, page: paginationData.page }));
  };



  return (
      <Box p={3}>
        <Box mb={2}>
          <Typography variant="h4" mb={isMobile ? 3 : undefined}>
            {t('title-history')}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: isMobile ? 3 : undefined }}>
            {t('subtitle-history')}
          </Typography>
        </Box>




          {

              (historyEstimates?.actual) ?
                <ActualEstimateCard data={historyEstimates.actual}/>
                : null
          }



        <ApiErrorWrapper apiId={ESTIMATE_ACTIONS.GET_ALL_ESTIMATE} reloadAction={() => fetchHistory()} mt={3}>
            {
              (historyEstimates?.history?.content) ?
                (isMobile) ? (
                  <MobileHistoryTable
                    estimates={historyEstimates.history.content}
                  />
                ) : (
                  <HistoryTable
                    estimates={historyEstimates.history.content}
                  />
                )

                : null
            }


          {historyEstimates?.history && (
              <CustomPagination
                  paginationData={{
                    size: historyEstimates.history.size,
                    page: historyEstimates.history.number,
                    totalElements: historyEstimates.history.totalElements,
                  }}
                  onPageRequest={handleChangePage}
                  eventTrackingCallbackPageSize={handleEventTrackingCallbackPageSize}
                  pagesToShow={calculatePages(
                    historyEstimates.history.number,
                    historyEstimates.history.totalElements,
                    Math.min(historyEstimates.history.size, 3),
                    historyEstimates.history.number + 1
                  )}
                  sx={{ padding: '0 10px' }}
              />
          )}
        </ApiErrorWrapper>
      </Box>
  );
}

export default HistoryTable;
