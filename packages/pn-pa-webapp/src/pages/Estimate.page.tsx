import CardContent from '@mui/material/CardContent';
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
import {Box, Button, Typography,Card} from '@mui/material';
import * as routes from '../navigation/routes.const';
import { RootState } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setPagination } from '../redux/dashboard/reducers';
import { trackEventByType } from '../utils/mixpanel';
import { TrackEventType } from '../utils/events';
import {ESTIMATE_ACTIONS, getAllEstimate} from "../redux/usageEstimation/actions";
import HistoryTable from './components/UsageEstimates/historyTable/HistoryTable';
import MobileHistoryTable from "./components/UsageEstimates/historyTable/MobileHistoryTable";
import {EstimateStatusChip} from "./components/UsageEstimates/statusChip";



export function EstimatePage ()  {
  const dispatch = useAppDispatch();
  const historyEstimates = useAppSelector(state => state.usageEstimateState.historyEstimates);
  const pagination = useAppSelector((state: RootState) => state.usageEstimateState.pagination);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);

  const navigate = useNavigate();

  const isMobile = useIsMobile();
  const { t } = useTranslation(['estimate'], {keyPrefix: "estimate-history"});



  const goToDetail = () => {
    trackEventByType(TrackEventType.ESTIMATE_GO_TO_DETAIL);
    navigate(routes.GET_DETAIL_ESTIMATE_PATH("GIU-2023"));
  };


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

        {
          (historyEstimates?.actual?.referenceMonth) ?

            <Card sx={{ minWidth: 275 }}>
              <CardContent>

                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  {historyEstimates.actual.referenceMonth}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Data ultima modifica
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  {historyEstimates.actual.lastModifiedDate}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Data di scadenza
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  {historyEstimates.actual.deadlineDate}
                </Typography>

                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  <EstimateStatusChip data= {historyEstimates.actual.status} />
                </Typography>

              </CardContent>
            </Card>

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
