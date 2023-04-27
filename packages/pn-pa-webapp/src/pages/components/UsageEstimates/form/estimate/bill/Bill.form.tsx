import {
  Grid,
  TextareaAutosize,
  TextField,
  Card,
  Stack,
  Typography,
  Checkbox, FormGroup, FormControlLabel, FormLabel
} from "@mui/material";
import {useIsMobile} from "@pagopa-pn/pn-commons";
import {useTranslation} from "react-i18next";
import {ChangeEvent, Fragment} from "react";
import {EstimateFormProps} from "../props/Estimate.props";


export function BillForm({formikInstance}: EstimateFormProps){
  const isMobile = useIsMobile();
  const { t } = useTranslation(['estimate']);
  const direction = isMobile ? 'column' : 'row';
  const spacing = isMobile ? 3 : 0;

  const handleChangeTouched = async (e: ChangeEvent) => {
    formikInstance.handleChange(e);
    await formikInstance.setFieldTouched(e.target.id, true, false);
  };

  return <Fragment>
    <Card
      sx={{
        width: 1,
        padding: "1rem 2rem",
        backgroundColor: "background.paper",
        mb: 2
      }}>
      <Stack sx={{width: 1}} spacing={spacing}>
        <Grid item container>
          <Typography
            color="text.primary"
            variant="overline"
            fontWeight={700}
            textTransform="uppercase"
            fontSize={14}
          >
            {t("edit-estimate.form.bill-title")}
          </Typography>
        </Grid>

        <Grid container direction={direction} mt={1}>
          <Grid item xs={8} lg={8} mt={1} mr={10}>
            <TextField
              id="mailAddress"
              value={formikInstance.values.mailAddress}
              onChange={handleChangeTouched}
              label={t('edit-estimate.form.mailAddress')}
              placeholder={t('edit-estimate.form.mailAddress-placeholder')}
              name="mailAddress"
              required
              error={formikInstance.touched.mailAddress && Boolean(formikInstance.errors.mailAddress)}
              helperText={formikInstance.touched.mailAddress && formikInstance.errors.mailAddress}
              size="small"
              fullWidth={isMobile}
              sx={{ marginBottom: isMobile ? '20px' : '0', width: "100%"}}
            />
          </Grid>
          <Grid item xs={3} lg={3}>
            <FormGroup>
              <FormControlLabel
                label={
                  <Typography variant="body2" fontWeight={"bold"} fontSize={14} >
                    {t('edit-estimate.form.split-payment')}
                  </Typography>
                }
                control={
                  <Checkbox
                    id="splitPayment"
                    name="splitPayment"
                    onChange={handleChangeTouched}
                    checked={formikInstance.values.splitPayment}
                    size="small"
                    sx={{ marginBottom: isMobile ? '20px' : '0' }}
                  />
                }
              />
            </FormGroup>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} mt={1}>
          <FormGroup>
            <FormLabel component="legend" sx={{ fontWeight: 'bolder', fontSize: '14px'}}>
              {t('edit-estimate.form.description-other-info')}
            </FormLabel>
            <TextareaAutosize
              id="description"
              value={formikInstance.values.description}
              onChange={handleChangeTouched}
              placeholder={t('edit-estimate.form.description-placeholder')}
              name="description"
              minRows={4}
              maxLength={256}
              style={{ width: "100%", marginTop: "0.2%"}}
            />
          </FormGroup>
        </Grid>
      </Stack>
    </Card>
  </Fragment>;
}