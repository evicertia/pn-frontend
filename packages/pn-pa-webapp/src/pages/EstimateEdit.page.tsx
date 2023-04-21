import {Box, Typography, Grid, Stack} from "@mui/material";
import {PnBreadcrumb, TitleBox, useErrors, useIsMobile} from "@pagopa-pn/pn-commons";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {Fragment, useCallback, useEffect} from "react";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import * as routes from "../navigation/routes.const";
import {EstimateStatusEnum} from "../models/UsageEstimation";
import {ESTIMATE_ACTIONS, getDetailEstimate} from "../redux/usageEstimation/actions";
import {EstimateForm} from "./components/UsageEstimates/form/estimate/Estimate.form";


export function EstimateEditPage() {
  const selectedEstimate = useAppSelector(state => state.usageEstimateState.selected);
  const isMobile = useIsMobile();
  const { t } = useTranslation(['estimate']);
  const navigate = useNavigate();
  const { hasApiErrors } = useErrors();
  const dispatch = useAppDispatch();

  const direction = isMobile ? 'column-reverse' : 'row';
  const spacing = isMobile ? 3 : 0;

  const hasUpdateEstimateApiError = hasApiErrors(ESTIMATE_ACTIONS.UPDATE_ESTIMATE);

  const navigateToEstimate = () => {
    navigate(routes.ESTIMATE);
    console.log("navigateToEstimate");
  };

  const fetchDetail = useCallback(() => {
    void dispatch(getDetailEstimate({paId: "12345ADS", referenceMonth: "MAR-2023"}));
  }, []);

  useEffect(() => {
    setTimeout( fetchDetail, 1000);
  }, []);

  if (!selectedEstimate || selectedEstimate.status !== EstimateStatusEnum.DRAFT) {
    navigateToEstimate();
    console.log("navigateToEstimate");
  }


  const properBreadcrumb = (
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

  const breadcrumb = (
    <Fragment>
      {properBreadcrumb}
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
    <>
      {!hasUpdateEstimateApiError && (
        <Box sx={{ p: { xs: 3, lg: 0 } }}>
          {isMobile && breadcrumb}
          <Grid
            container
            direction={direction}
            spacing={spacing}
          >
          <Grid item lg={12} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
            {!isMobile && breadcrumb}
            <Stack sx={{ marginTop: 3}} spacing={3}>
              {selectedEstimate && <EstimateForm selected={selectedEstimate}/>}
            </Stack>
          </Grid>
        </Grid>
        </Box>
      )}
    </>
  );
}