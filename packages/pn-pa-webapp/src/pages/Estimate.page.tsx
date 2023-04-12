import {Box, Typography, Grid, Stack, Button} from "@mui/material";
import {useIsMobile} from "@pagopa-pn/pn-commons";
import {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {getDetailEstimate} from "../redux/usageEstimation/actions";
import {EstimatePeriod} from "../models/UsageEstimation";
import {DataInfo} from "./components/UsageEstimates/dataInfo/DataInfo";
import {
  usageBillingDataPA,
  usageEstimations,
  usageInfoPA,
  usagePeriod
} from "./components/UsageEstimates/dataInfo/rows";
import {EstimateForm} from "./components/UsageEstimates/form/EstimateForm";


export function EstimatePage() {
  const isMobile = useIsMobile();
  const { t } = useTranslation(['estimate']);
  const usageEstimateState = useAppSelector(state => state.usageEstimateState);
  const dispatch = useAppDispatch();
  
  const direction = isMobile ? 'column-reverse' : 'row';
  const spacing = isMobile ? 3 : 0;
  
  const fetchDetail = useCallback(() => {
    void dispatch(getDetailEstimate({paId: "12345ADS", referenceMonth: "Giugno-2023"}));
  }, []);
  
  useEffect(() => {
    setTimeout( fetchDetail, 1000);
  }, []);

  return  <Box sx={{ p: { xs: 3, lg: 0 } }}>
    <Grid container
          direction={direction}
          spacing={spacing}
    >
      <Grid item lg={7} xs={12} sx={{ p: { xs: 0, lg: 3 } }}>
        <Typography variant="h4" mb={isMobile ? 3 : undefined}>
          {t('titleEstimate')}
        </Typography>
        <Box>
          <Typography variant="body1" sx={{ marginBottom: isMobile ? 3 : undefined }}>
            {t('subtitleEstimate')}
          </Typography>

          {
            (!usageEstimateState.selected && <Typography variant="body1" sx={{ marginBottom: isMobile ? 3 : undefined }}>
              {t('userInfoSelectEstimate')}
            </Typography>)
          }

          <Stack sx={{ marginTop: 3}} spacing={1}>
            {
              (usageEstimateState.selected?.paInfo && <DataInfo title={t("paInfoTitle")} data={usageEstimateState.selected.paInfo} rows={usageInfoPA}/>)
            }
            {
              (usageEstimateState.selected && <DataInfo title={t("periodTitle")} data={usageEstimateState.selected} rows={usagePeriod}/>)
            }
            {
              (usageEstimateState.selected && <DetailAndFormEstimate selected={usageEstimateState.selected}/>) 
            }

          </Stack>


        </Box>
      </Grid>
      <Grid item lg={5} xs={12}>
        <Box sx={{ backgroundColor: 'white', height: '100%', p: 3 }}>
          <Typography
            component="h5"
            color="text.primary"
            fontWeight={700}
            textTransform="uppercase"
            fontSize={14}
          >
            {t('historyEstimate')}
          </Typography>

        </Box>
      </Grid>
    </Grid>
  </Box>;
}


function DetailAndFormEstimate(props:{selected: EstimatePeriod}){
  const [edit, setEdit] = useState(false);
  const { t } = useTranslation(['estimate']);

  const detailsComponent = <>
    <DataInfo title={t("profiling-title")}
              key={"billing-data-info"}
              data={props.selected.billing}
              rows={usageBillingDataPA}/>
    
    <DataInfo title={t("usage-estimate-title")}
              key={"estimate-data-info"}
              data={props.selected.estimate} 
              rows={usageEstimations}/>

    <Grid item alignSelf={"end"}>
      {
        (props.selected.showEdit) ?
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Typography variant={"body2"}>{t('message-edit')}</Typography>
            <Button variant={"contained"} onClick={() => setEdit(true)}>Modifica</Button>
          </Stack>
          :
          <Button variant={"contained"}>Richiedi Aiuto</Button>
      }

    </Grid>

  </>;

  const formsComponent = <>
    <EstimateForm initialBilling={props.selected.billing}
                  initialEstimate={props.selected.estimate}
                  onClickEdit={(isEdit) => setEdit(isEdit)}/>
  </>;



  return <>

    {
      (edit) ? formsComponent :
        detailsComponent
    }
    
  </>;
}