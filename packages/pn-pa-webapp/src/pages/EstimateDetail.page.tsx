import {PnBreadcrumb, useIsMobile} from "@pagopa-pn/pn-commons";
import {Fragment, useCallback, useEffect} from "react";
import EmailIcon from "@mui/icons-material/Email";
import {useTranslation} from "react-i18next";
import {Box, Button, Stack, Typography} from "@mui/material";
import * as routes from "../navigation/routes.const";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {getDetailEstimate} from "../redux/usageEstimation/actions";
import {RootState} from "../redux/store";
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
  const {selected} = useAppSelector(state => state.usageEstimateState);
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);

  const fetching = useCallback(() => {
    void dispatch(getDetailEstimate({
      paId: loggedUser.organization?.id,
      referenceMonth: "MAR-2023"
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
    <Box display={isMobile ? 'block' : 'flex'} justifyContent="space-between" alignItems="center">
      <Typography variant="body1" mb={{ xs: 3, md: 4 }}>
        {t('label.estimate-detail-info', { ns: 'estimate' })}
      </Typography>
      <Button
        variant="contained"
        onClick={()=>{}}
        data-testid="newNotificationBtn"
        sx={{ marginBottom: isMobile ? 3 : undefined }}
      >
        {t('new-notification-button', "Modifica")}
      </Button>
    </Box>

  </Fragment>);

  return <Fragment>
    <Box p={3}>
      {header}
      <Stack spacing={3}>
        {
          (selected?.paInfo && <DataInfo title={t("pa-info-title")} data={selected.paInfo} rows={usageInfoPA}/>)
        }
        {
          (selected && <DataInfo title={t("period-title")} data={selected} rows={usagePeriod}/>)
        }
        {
          (selected?.estimate && <DataInfo title={t("usage-estimate-title")} data={selected.estimate} rows={usageEstimations}/>)
        }
        {
          (selected?.billing && <DataInfo title={t("billing-title")} data={selected.billing} rows={usageBillingDataPA}/>)
        }
      </Stack>

    </Box>
  </Fragment>;
}