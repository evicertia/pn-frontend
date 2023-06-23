import {Box, Typography} from "@mui/material";
import {ApiErrorWrapper, calculatePages, CustomPagination, PaginationData, useIsMobile} from "@pagopa-pn/pn-commons";
import {useTranslation} from "react-i18next";
import {useCallback, useEffect} from "react";
import {FilterRequest, HistoryProfilings} from "../models/UsageEstimation";
import {setPagination} from "../redux/usageEstimates/estimate/reducers";
import {PROFILING_ACTIONS, getAllProfiling} from "../redux/usageEstimates/profiling/actions";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {RootState} from "../redux/store";
import {ProfilingMobileHistoryTable} from "./components/UsageEstimates/Profiling/historyTable/ProfilingMobileHistoryTable";
import {ProfilingHistoryTable} from "./components/UsageEstimates/Profiling/historyTable/ProfilingHistoryTable";


export function ProfilingPage() {
  const dispatch = useAppDispatch();
  const historyProfilings = useAppSelector(state => state.profilingState.historyProfilings);
  const pagination = useAppSelector((state: RootState) => state.profilingState.pagination);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const isMobile = useIsMobile();
  const { t } = useTranslation(['estimate'], {keyPrefix: "profiling.history"});

  const fetchHistory= useCallback( () => {
    void dispatch(getAllProfiling({
        paId: loggedUser.organization.id,
        taxId: "",
        ipaId: "",
        ...pagination}));
  },[pagination]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleChangePage = (paginationData: PaginationData) => {
    const filterRequest: FilterRequest = {
      size: paginationData.size,
      page: paginationData.page + 1
    };
    dispatch(setPagination(filterRequest));
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

      <ApiErrorWrapper apiId={PROFILING_ACTIONS.GET_ALL_PROFILING} reloadAction={() => fetchHistory()} mt={3}>
        {
          (historyProfilings?.history?.content)
            ?
              getTable(isMobile, historyProfilings)
            :
              null
        }

        {historyProfilings?.history && (
          <CustomPagination
            paginationData={{
              size: historyProfilings.history.size,
              page: historyProfilings.history.number,
              totalElements: historyProfilings.history.totalElements,
            }}
            onPageRequest={handleChangePage}
            eventTrackingCallbackPageSize={() => {}}
            pagesToShow={calculatePages(
              historyProfilings.history.size,
              historyProfilings.history.totalElements,
              Math.min(historyProfilings.history.size, 3),
              historyProfilings.history.number + 1
            )}
            sx={{ padding: '0 10px' }}
          />
        )}
      </ApiErrorWrapper>
    </Box>
  );
}

function getHistoryContent(historyProfilings: HistoryProfilings) {
  return [{status: historyProfilings.actual.status,
    deadlineDate: historyProfilings.actual.deadlineDate,
    referenceYear: historyProfilings.actual.referenceYear,
    lastModifiedDate: historyProfilings.actual?.lastModifiedDate ? historyProfilings.actual.lastModifiedDate : "",
    showEdit: historyProfilings.actual.showEdit},
    ...historyProfilings.history.content];
};

function getTable(isMobile: boolean, historyProfilings: HistoryProfilings) {
  if(isMobile) {
    return <ProfilingMobileHistoryTable profilings={getHistoryContent(historyProfilings)}/>;
  } else {
    return <ProfilingHistoryTable profilings={getHistoryContent(historyProfilings)}/>;
  }
}