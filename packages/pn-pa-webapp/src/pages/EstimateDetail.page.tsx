import {ApiError, PnBreadcrumb, useIsMobile} from "@pagopa-pn/pn-commons";
import {Fragment, useCallback, useEffect} from "react";
import EmailIcon from "@mui/icons-material/Email";
import {useTranslation} from "react-i18next";
import {Box, Button, Stack, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import * as routes from "../navigation/routes.const";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {getDetailEstimate} from "../redux/usageEstimation/actions";
import {RootState} from "../redux/store";
import {EstimateStatusEnum} from "../models/UsageEstimation";
import {GET_EDIT_ESTIMATE_PATH} from "../navigation/routes.const";
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
  const {selected, error} = useAppSelector(state => state.usageEstimateState);
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
      <Typography variant="body1">
        {t('label.estimate-detail-info', { ns: 'estimate' })}
      </Typography>
      {
        referenceMonth && <ButtonsEstimateDetail status={selected?.status} referenceMonth={referenceMonth} showEdit={selected?.showEdit}/>
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
          (selected) ?
            <Fragment>
              <DataInfo title={t("pa-info-title")}
                        data={selected.paInfo}
                        rows={usageInfoPA}/>

              <DataInfo title={t("period-title")}
                        data={selected}
                        rows={usagePeriod}/>

              <DataInfo title={t("usage-estimate-title")}
                        data={selected.estimate}
                        rows={usageEstimations}/>

              <DataInfo title={t("billing-title")}
                        data={selected.billing}
                        rows={usageBillingDataPA}/>
            </Fragment>
            : null
        }
      </Stack>

    </Box>
  </Fragment>;
}

const ButtonsEstimateDetail = (params : {status?: EstimateStatusEnum; referenceMonth: string; showEdit?: boolean}) => {
  const { t } = useTranslation(['estimate', 'common', 'notifiche']);
  const navigate = useNavigate();

  if (!params.status) {
    return null;
  }

  if (params.status === EstimateStatusEnum.DRAFT ||
    (params.status === EstimateStatusEnum.VALIDATED && (params.showEdit === null || params.showEdit)) ) {
    return <>
      <Button
        variant="contained"
        onClick={()=> navigate(GET_EDIT_ESTIMATE_PATH(params.referenceMonth))}
        data-testid="editEstimateBtn"
      >
        {t('edit-estimate.button.edit', {ns: "estimate"})}
      </Button>
    </>;
  }
  
  return null;
};