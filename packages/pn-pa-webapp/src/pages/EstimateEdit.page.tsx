import {Box, Typography, Grid, Stack} from "@mui/material";
import {TitleBox, Prompt, useIsMobile, PnBreadcrumb, ApiError} from '@pagopa-pn/pn-commons';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {Fragment, useEffect} from "react";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import * as routes from "../navigation/routes.const";
import {EstimateStatusEnum} from "../models/UsageEstimation";
import {getDetailEstimate} from "../redux/usageEstimation/actions";
import {trackEventByType} from "../utils/mixpanel";
import {TrackEventType} from "../utils/events";
import {RootState} from "../redux/store";
import {EstimateForm} from "./components/UsageEstimates/form/estimate/Estimate.form";


export function EstimateEditPage() {
  const {selected, error} = useAppSelector(state => state.usageEstimateState);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const isMobile = useIsMobile();
  const { t } = useTranslation(['estimate']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const direction = isMobile ? 'column-reverse' : 'row';
  const spacing = isMobile ? 3 : 0;


  const fetchDetail = (() => {
    void dispatch(getDetailEstimate({paId: loggedUser.organization.id,
      referenceMonth: (selected != null) ? selected.referenceMonth : ""}));
  });

  useEffect(() => {
    fetchDetail();
  }, []);

  useEffect(() => {
    console.log(selected);
    console.log(error);
    if ( (selected != null) && (selected.status !== EstimateStatusEnum.DRAFT) ) {
      navigate(routes.ESTIMATE);
      console.log("navigateToEstimate");
    }
  }, [selected]);

  const handleEventTrackingCallbackPromptOpened = () => {
    trackEventByType(TrackEventType.ESTIMATE_EXIT_WARNING);
  };

  const handleEventTrackingCallbackCancel = () => {
    trackEventByType(TrackEventType.ESTIMATE_EXIT_CANCEL);
  };

  const handleEventTrackingCallbackConfirm = () => {
    trackEventByType(TrackEventType.ESTIMATE_EXIT_FLOW);
  };

  const breadcrumb = (
    <PnBreadcrumb
      linkRoute={routes.ESTIMATE}
      linkLabel={
        <Fragment>
          <RequestQuoteIcon sx={{ mr: 0.5 }} />
          {t('edit-estimate.label.breadcrumb-root')}
        </Fragment>
      }
      currentLocationLabel={t('edit-estimate.label.breadcrumb-leaf')}
      goBackLabel={t('edit-estimate.button.go-back-edit')}
    />
  );

  const heading = (
    <Fragment>
      {breadcrumb}
      <TitleBox
        variantTitle="h4"
        title={t('edit-estimate.label.title')}
        sx={{ pt: 3, mb: 2 }}
        mbTitle={0}
      ></TitleBox>
      <Typography variant="body1" mb={{ xs: 3, md: 4 }}>
        {t('edit-estimate.label.abstract')}
      </Typography>
    </Fragment>
  );

  return (
    (error) ?
      <Box sx={{ p: { xs: 3, lg: 0 } }}>
        {heading}
        <ApiError onClick={() => fetchDetail()} mt={3}/>
      </Box>
    :
      <Prompt
        title={t('edit-estimate.prompt.title')}
        message={t('edit-estimate.prompt.message')}
        eventTrackingCallbackPromptOpened={handleEventTrackingCallbackPromptOpened}
        eventTrackingCallbackCancel={handleEventTrackingCallbackCancel}
        eventTrackingCallbackConfirm={handleEventTrackingCallbackConfirm}
      >
        <Box sx={{ p: { xs: 3, lg: 0 } }}>
          {isMobile && heading}
          <Grid
            container
            direction={direction}
            spacing={spacing}
          >
            <Grid item lg={12} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
              {!isMobile && heading}
              <Stack sx={{ marginTop: 3}} spacing={3}>
                {selected && <EstimateForm selected={selected}/>}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Prompt>
  );
}