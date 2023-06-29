import {useTranslation} from "react-i18next";
import {ApiError, PnBreadcrumb, useIsMobile} from "@pagopa-pn/pn-commons";
import {Navigate, useParams} from "react-router-dom";
import {Fragment, useCallback, useEffect} from "react";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import {Box, Stack, Typography} from "@mui/material";
import {RootState} from "../redux/store";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {getDetailProfiling} from "../redux/usageEstimates/profiling/actions";
import {resetDetailState} from "../redux/usageEstimates/profiling/reducers";
import * as routes from "../navigation/routes.const";
import {localeStringReferenceId} from "../utils/utility";
import {DataInfo} from "./components/UsageEstimates/Common/dataInfo/DataInfo";
import {
  profilingBillingDataPA,
  profilingInfoPA,
  profilingPeriod
} from "./components/UsageEstimates/Common/dataInfo/model/ProfilingRows";


export function ProfilingDetailPage() {
  const {t} = useTranslation(['estimate'], {keyPrefix: "profiling.detail"});
  const isMobile = useIsMobile();
  const {detail, error} = useAppSelector(state => state.profilingState);
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const {referenceYear} = useParams();

  const fetching = useCallback(() => {
    void dispatch(getDetailProfiling({
      paId: loggedUser.organization?.id,
      referenceYear: referenceYear || ""
    }));
  }, []);


  useEffect(() => {
    fetching();
    return () => {
      void dispatch(resetDetailState());
    };
  }, [fetching]);


  const breadcrumb = (
    <PnBreadcrumb
      linkRoute={routes.PROFILING}
      linkLabel={
        <Fragment>
          <RequestQuoteIcon sx={{ mr: 0.5 }} />
          {t('label.breadcrumb-root')}
        </Fragment>
      }
      currentLocationLabel={t('label.breadcrumb-leaf')}
      goBackLabel={t('button.go-back-detail')}
    />
  );

  const header = (<Fragment>
    {breadcrumb}
    <Box display={isMobile ? 'block' : 'flex'}
         justifyContent="space-between"
         mb={3}
         alignItems="center">
      <Typography variant="h5" fontWeight={"600"} mt={1}>
        {t('label.year-info').concat(localeStringReferenceId((referenceYear) || ""))}
      </Typography>
    </Box>
  </Fragment>);

  if(error && error === 404) {
    return <Navigate to={routes.PROFILING} />;
  }

  if (error) {
    return <Box p={3}>
      {header}
      <ApiError onClick={() => fetching()} mt={3}/>
    </Box>;
  }

  return <Fragment>
    <Box p={3}>
      {header}
      <Stack spacing={3}>
        {
          (detail) ?
            <Fragment>
              <DataInfo title={t("data-info.period-title")}
                        data={detail}
                        rows={profilingPeriod}/>

              <DataInfo title={t("data-info.billing-title")}
                        data={detail.profilation}
                        rows={profilingBillingDataPA}/>

              <DataInfo title={t("data-info.pa-info-title")}
                        data={detail.paInfo}
                        rows={profilingInfoPA}/>
            </Fragment>
            : null
        }
      </Stack>
    </Box>
  </Fragment>;
}