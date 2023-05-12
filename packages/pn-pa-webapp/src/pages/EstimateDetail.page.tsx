import {ApiError, PnBreadcrumb, useIsMobile} from "@pagopa-pn/pn-commons";
import {Fragment, useCallback, useEffect} from "react";
import EmailIcon from "@mui/icons-material/Email";
import {useTranslation} from "react-i18next";
import {Box, Stack, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import * as routes from "../navigation/routes.const";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {getDetailEstimate} from "../redux/usageEstimation/actions";
import {RootState} from "../redux/store";
import {localeStringReferenceMonth} from "../utils/utility";
import {DataInfo} from "./components/UsageEstimates/dataInfo/DataInfo";
import {
  usageBillingDataPA,
  usageEstimations,
  usageInfoPA,
  usagePeriod
} from "./components/UsageEstimates/dataInfo/rows";


export function EstimateDetailPage(){
  const { t } = useTranslation(['estimate', 'common', 'notifiche']);
  const isMobile = useIsMobile();
  const {detail, error} = useAppSelector(state => state.usageEstimateState);
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const {referenceMonth} = useParams();


  const fetching = useCallback(() => {
    void dispatch(getDetailEstimate({
      paId: loggedUser.organization?.id,
      referenceMonth: referenceMonth || ""
    }));
  }, []);


  useEffect(() => {
    fetching();
  }, [fetching]);


  const breadcrumb = (
    <PnBreadcrumb
      linkRoute={routes.ESTIMATE}
      linkLabel={
        <Fragment>
          <EmailIcon sx={{ mr: 0.5 }} />
          {t('label.estimate-root', { ns: 'estimate' })}
        </Fragment>
      }
      currentLocationLabel={t('label.estimate-detail', { ns: 'estimate' })}
      goBackLabel={t('button.indietro', { ns: 'common' })}
    />
  );

  const header = (<Fragment>
    {breadcrumb}
    <Box display={isMobile ? 'block' : 'flex'}
         justifyContent="space-between"
         mb={3}
         alignItems="center">
      <Typography variant="h5" fontWeight={"600"} mt={1}>
        {t('label.estimate-detail-info', { ns: 'estimate' }) + localeStringReferenceMonth((referenceMonth) || "")}
      </Typography>
      {

      }

    </Box>
  </Fragment>);


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
              <DataInfo title={t("period-title")}
                        data={detail}
                        rows={usagePeriod}/>

              <DataInfo title={t("usage-estimate-title")}
                        data={detail.estimate}
                        rows={usageEstimations}/>

              <DataInfo title={t("billing-title")}
                        data={detail.billing}
                        rows={usageBillingDataPA}/>

              <DataInfo title={t("pa-info-title")}
                        data={detail.paInfo}
                        rows={usageInfoPA}/>
            </Fragment>
            : null
        }
      </Stack>

    </Box>
  </Fragment>;
}