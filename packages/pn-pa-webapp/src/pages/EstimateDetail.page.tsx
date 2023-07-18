import {ApiError, PnBreadcrumb, useDownloadDocument, useIsMobile} from "@pagopa-pn/pn-commons";
import {Fragment, useCallback, useEffect} from "react";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import {useTranslation} from "react-i18next";
import {Box, Stack, Typography} from "@mui/material";
import {Navigate, useParams} from "react-router-dom";
import * as routes from "../navigation/routes.const";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {RootState} from "../redux/store";
import {localeStringReferenceId} from "../utils/utility";
import {getDetailEstimate} from "../redux/usageEstimates/estimate/actions";
import {resetDetailState} from "../redux/usageEstimates/estimate/reducers";
import {getAllReportsFile} from "../redux/usageEstimates/filesReports/actions";
import {resetFileReportUrl} from "../redux/usageEstimates/filesReports/reducers";
import {DataInfo} from "./components/UsageEstimates/Common/dataInfo/DataInfo";
import {
  usageBillingDataPA,
  usageEstimations,
  usageInfoPA,
  usagePeriod,
  rowFilesReports
} from "./components/UsageEstimates/Common/dataInfo/model/EstimateRows";


export function EstimateDetailPage(){
  const {t} = useTranslation(['estimate'], {keyPrefix: "estimate.detail"});
  const isMobile = useIsMobile();
  const {detail, error} = useAppSelector(state => state.usageEstimateState);
  const {filesReports, fileReportUrl} = useAppSelector(state => state.fileReportsEstimateState);
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const {referenceMonth} = useParams();


  const handleClearDownloadActionUrl = () => {
    dispatch(resetFileReportUrl());
  };

  useDownloadDocument({url: fileReportUrl, clearDownloadAction: handleClearDownloadActionUrl});

  const fetching = useCallback(() => {
    void dispatch(getDetailEstimate({
      paId: loggedUser.organization?.id,
      referenceMonth: referenceMonth || ""
    }));

    void dispatch(getAllReportsFile({
      paId: loggedUser.organization?.id,
      referenceMonth: referenceMonth || ""
    }));
  }, []);


  useEffect(() => {
    fetching();
    return () => {
      dispatch(resetDetailState());
    };
  }, [fetching]);


  const breadcrumb = (
    <PnBreadcrumb
      linkRoute={routes.ESTIMATE}
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
        {t('label.month-info').concat(localeStringReferenceId((referenceMonth) || ""))}
      </Typography>
    </Box>
  </Fragment>);

  if(error && error === 404) {
    return <Navigate to={routes.ESTIMATE} />;
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
          (detail)
            ?
              <Fragment>
                <DataInfo key={"0"}
                          title={t("data-info.period-title")}
                          data={detail}
                          rows={usagePeriod}/>

                <DataInfo key={"1"}
                          title={t("data-info.usage-estimate-title")}
                          data={detail.estimate}
                          rows={usageEstimations}/>

                <DataInfo key={"2"}
                          title={t("data-info.billing-title")}
                          data={detail.billing}
                          rows={usageBillingDataPA}/>

                <DataInfo key={"3"}
                          title={t("data-info.pa-info-title")}
                          data={detail.paInfo}
                          rows={usageInfoPA}/>

                {
                  filesReports && filesReports.length > 0 &&
                  <DataInfo key={"4"}
                            title={t("data-info.files-reports-title")}
                            data={filesReports}
                            rows={rowFilesReports}/>
                }

              </Fragment>
            :
              null
        }
      </Stack>
    </Box>
  </Fragment>;
}