import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  calculatePages,
  CustomPagination,
  PaginationData,
  useIsMobile,
  ApiErrorWrapper,
} from '@pagopa-pn/pn-commons';
import { Box, Button, Typography } from '@mui/material';
import * as routes from '../navigation/routes.const';
import { RootState } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setPagination } from '../redux/dashboard/reducers';
import { trackEventByType } from '../utils/mixpanel';
import { TrackEventType } from '../utils/events';
import {ESTIMATE_ACTIONS, getAllEstimate} from "../redux/usageEstimation/actions";
import HistoryTable from './components/UsageEstimates/historyTable/HistoryTable';
import MobileNotifications from './components/UsageEstimates/historyTable/HistoryTable';

export function EstimatePage ()  {
  const dispatch = useAppDispatch();
  const historyEstimates = useAppSelector(state => state.usageEstimateState.historyEstimates.history.content);
  const pagination = useAppSelector((state: RootState) => state.usageEstimateState.pagination);
  const navigate = useNavigate();

  const isMobile = useIsMobile();
  const { t } = useTranslation(['estimate']);
  const totalElements =
      pagination.page *
      (pagination.tot);
  const pagesToShow: Array<number> = calculatePages(
      pagination.page,
      totalElements,
      Math.min(pagination.tot, 3),
      pagination.page + 1
  );



  const goToDetail = () => {
    trackEventByType(TrackEventType.ESTIMATE_GO_TO_DETAIL);
    navigate(routes.ESTIMATE_DETAIL);
  };



  //  need change
  const fetchHistory= useCallback( () => {
    const params = {
      paId:"",
      page: pagination.page,
      tot: pagination.tot,
    };
    void dispatch(getAllEstimate(
        {
          ...params,
          page: pagination.page,
          tot: pagination.tot,
        }));
  },[pagination.page, pagination.tot]);




  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleEventTrackingCallbackPageSize = (pageSize: number) => {
    trackEventByType(TrackEventType.HISTORY_TABLE_PAGINATION, {pageSize});
  };

  const handleChangePage = (paginationData: PaginationData) => {
    trackEventByType(TrackEventType.HISTORY_TABLE_PAGINATION);
    dispatch(setPagination({ size: paginationData.size, page: paginationData.page }));
  };

  return (
      <Box p={3}>
        <Typography variant="h4" mb={isMobile ? 3 : undefined}>
          {t('title-history')}
        </Typography>
        <Box display={isMobile ? 'block' : 'flex'} justifyContent="space-between" alignItems="center">
          <Typography variant="body1" sx={{ marginBottom: isMobile ? 3 : undefined }}>
            {t('subtitle-history')}
          </Typography>
          <Button
              variant="contained"
              onClick={goToDetail}
              data-testid="edit-button-lable"
              sx={{ marginBottom: isMobile ? 3 : undefined }}
          >
            {t('edit-button-lable')}
          </Button>
        </Box>
        <ApiErrorWrapper apiId={ESTIMATE_ACTIONS.GET_ALL_ESTIMATE} reloadAction={() => fetchHistory()} mt={3}>
          {isMobile ? (
              <MobileNotifications
                  estimates={historyEstimates}
              />
          ) : (
              <HistoryTable
                  estimates={historyEstimates}
              />
          )}
          {historyEstimates.length > 0 && (
              <CustomPagination
                  paginationData={{
                    size: pagination.tot,
                    page: pagination.page,
                    totalElements,
                  }}
                  onPageRequest={handleChangePage}
                  eventTrackingCallbackPageSize={handleEventTrackingCallbackPageSize}
                  pagesToShow={pagesToShow}
                  sx={{ padding: '0 10px' }}
              />
          )}
        </ApiErrorWrapper>
      </Box>
  );
};
  export default HistoryTable;
