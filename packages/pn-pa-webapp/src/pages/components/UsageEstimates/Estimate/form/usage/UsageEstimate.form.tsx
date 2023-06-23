import {
  Card, Divider,
  Grid,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import * as React from "react";
import {useTranslation} from "react-i18next";
import {useIsMobile} from "@pagopa-pn/pn-commons";
import {Fragment} from "react";
import {EstimateFormProps} from "../../../Common/formik/Formik.config";


export function UsageEstimateForm({formikInstance}: EstimateFormProps){
  const {t} = useTranslation(['estimate'], {keyPrefix: "estimate.edit"});
  const isMobile = useIsMobile();

  const handleTextInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    formikInstance.handleChange(event);
    await formikInstance.setFieldTouched(event.target.id, true);
  };

  return <Fragment>
    <Typography variant="body1">
      {t("label.mandatory-fields")}
    </Typography>
    <Card
      sx={{
        width: "100%",
        padding: "1rem 2rem",
        backgroundColor: "background.paper",
        mb: 2
      }}>
      <Stack sx={{width: 1}} spacing={3}>
        <Grid item container>
          <Typography
            color="text.primary"
            variant="h6"
          >
            {t("form.usage-estimate-title")}
          </Typography>
        </Grid>
        <TextField
          id="totalDigitalNotif"
          value={formikInstance.values.totalDigitalNotif}
          onChange={handleTextInputChange}
          label={t('form.digital-notif-estimate')}
          name="totalDigitalNotif"
          required
          error={formikInstance.touched.totalDigitalNotif && Boolean(formikInstance.errors.totalDigitalNotif)}
          helperText={formikInstance.touched.totalDigitalNotif && formikInstance.errors.totalDigitalNotif}
          size="small"
          type={"number"}
          fullWidth={isMobile}
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
          inputProps={{ inputMode: 'numeric', min: 0, pattern: '^[0-9]*?$' }}
          data-testid={"usage-textfield-digital"}
        />
        <TextField
          id="totalAnalogNotif"
          value={formikInstance.values.totalAnalogNotif}
          onChange={handleTextInputChange}
          label={t('form.analog-notif-estimate')}
          name="totalAnalogNotif"
          required
          error={formikInstance.touched.totalAnalogNotif && Boolean(formikInstance.errors.totalAnalogNotif)}
          helperText={formikInstance.touched.totalAnalogNotif && formikInstance.errors.totalAnalogNotif}
          size="small"
          type={"number"}
          fullWidth={isMobile}
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
          inputProps={{ inputMode: 'numeric', min: 0, pattern: '^[0-9]*?$' }}
          data-testid={"usage-textfield-analog-notif"}
        />
        <TextField
          id="total890Notif"
          value={formikInstance.values.total890Notif}
          inputProps={{ inputMode: 'numeric', min: 0, pattern: '^[0-9]*?$' }}
          onChange={handleTextInputChange}
          label={t('form.analog-890-notif-estimate')}
          name="total890Notif"
          required
          error={formikInstance.touched.total890Notif && Boolean(formikInstance.errors.total890Notif)}
          helperText={formikInstance.touched.total890Notif && formikInstance.errors.total890Notif}
          size="small"
          type={"number"}
          fullWidth={isMobile}
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
          data-testid={"usage-textfield-analog-890"}
        />
        <Divider variant="middle" />
        <Grid container alignItems={"center"} width="1" mt={1}>
          <Grid item lg={6} xs={12}>
            <Typography variant="body2" fontWeight={"bold"} >
              {t('form.total-notif')}
            </Typography>
          </Grid>
          <Grid item lg={6} xs={12}>
            <Typography variant="body2" fontWeight={"bold"} textAlign={"end"}>
            {
              (formikInstance.values.totalDigitalNotif as number) +
              (formikInstance.values.total890Notif as number) +
              (formikInstance.values.totalAnalogNotif as number)
            }
            </Typography>
          </Grid>
          <Grid item lg={6} xs={12} mt={2}>
            <Typography variant="body2" fontWeight={"600"} >
              {t('form.total-digital-notif')}
            </Typography>
          </Grid>
          <Grid item lg={6} xs={12} mt={2}>
            <Typography variant="body2" fontWeight={"600"} textAlign={"end"}>
            {
              formikInstance.values.totalDigitalNotif
            }
            </Typography>
          </Grid>
          <Grid item lg={6} xs={12} mt={1}>
            <Typography variant="body2" fontWeight={"600"} >
              {t('form.total-analog-notif')}
            </Typography>
          </Grid>
          <Grid item lg={6} xs={12} mt={1}>
            <Typography variant="body2" fontWeight={"600"} textAlign={"end"}>
            {
              (formikInstance.values.total890Notif as number) +
              (formikInstance.values.totalAnalogNotif as number)
            }
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </Card>
  </Fragment>;
}