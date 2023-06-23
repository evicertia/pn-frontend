import {Box, Typography, Grid, Stack} from "@mui/material";
import {TitleBox, useIsMobile, PnBreadcrumb, ApiError, appStateActions} from '@pagopa-pn/pn-commons';
import {useTranslation} from "react-i18next";
import {Navigate, useParams} from "react-router-dom";
import {Fragment, useCallback, useEffect, useState} from "react";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import * as routes from "../navigation/routes.const";
import {EstimateStatusEnum} from "../models/UsageEstimation";
import {getDetailEstimate} from "../redux/usageEstimates/estimate/actions";
import {RootState} from "../redux/store";
import {getFormattedDateTimeAbstract, localeStringReferenceId} from "../utils/utility";
import {EstimateForm} from "./components/UsageEstimates/Estimate/form/Estimate.form";


export function EstimateEditPage() {
  const {formData, error} = useAppSelector(state => state.usageEstimateState);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const isMobile = useIsMobile();
  const {t} = useTranslation(['estimate'], {keyPrefix: "estimate.edit"});
  const dispatch = useAppDispatch();
  const [forcedNavigate, setForcedNavigate] = useState<string | undefined>(undefined);
  const direction = isMobile ? 'column-reverse' : 'row';
  const spacing = isMobile ? 3 : 0;
  const {referenceMonth} = useParams();

  const toastOk = useCallback(() => {
    void dispatch(appStateActions.addSuccess({
      title: t('toast-message.success.title'),
      message: t('toast-message.success.message'),
    }));
  }, []);


  const fetchDetail = (() => {
    void dispatch(getDetailEstimate({
      paId: loggedUser.organization?.id,
      referenceMonth: referenceMonth || ""
    }));
  });

  useEffect(() => {
    fetchDetail();
  }, []);

  const getTitle = () => {
    if(formData?.referenceMonth) {
      return t('label.title').concat(localeStringReferenceId(formData.referenceMonth));
    } else {
      return "";
    }
  };

  const getAbstract = () => {
    if(formData?.deadlineDate) {
      return t('label.abstract-pre').concat(getFormattedDateTimeAbstract(formData.deadlineDate, t('label.date-time-format'))).concat(t('label.abstract-post'));
    } else {
      return "";
    }
  };

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
      goBackLabel={t('button.go-back-edit')}
    />
  );

  const heading = (
    <Fragment>
      {breadcrumb}
      <TitleBox
        variantTitle="h4"
        title={getTitle()}
        sx={{ pt: 3, mb: 2 }}
        mbTitle={0}
      ></TitleBox>
      <Typography variant="body1" mb={{ xs: 3, md: 4 }}>
        {getAbstract()}
      </Typography>
    </Fragment>
  );

  if(error && error === 404) {
    return <Navigate to={routes.ESTIMATE} />;
  }

  if(formData && !formData.showEdit) {
    return <Navigate to={routes.ESTIMATE} />;
  }

  if ( formData && (formData.status === EstimateStatusEnum.VALIDATED && forcedNavigate) ) {
    toastOk();
    return <Navigate to={forcedNavigate} />;
  }

  if ( formData && (formData.status !== EstimateStatusEnum.VALIDATED && formData.status !== EstimateStatusEnum.DRAFT) ) {
    return <Navigate to={routes.ESTIMATE} />;
  }

  return (
    error
      ?
        <Box sx={{ p: 3 }}>
          {heading}
          <ApiError onClick={() => fetchDetail()} mt={3}/>
        </Box>
      :
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
                {formData && <EstimateForm detail={formData}
                                           onEstimateValidated={()=>setForcedNavigate(routes.ESTIMATE)}/>}
              </Stack>
            </Grid>
          </Grid>
        </Box>
  );
}