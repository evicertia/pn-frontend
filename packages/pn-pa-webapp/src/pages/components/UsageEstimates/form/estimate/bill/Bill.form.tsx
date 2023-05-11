import {
  Grid,
  TextField,
  Card,
  Stack,
  Typography,
  Radio,
  FormControlLabel, FormLabel, FormControl, RadioGroup
} from "@mui/material";
import {useIsMobile} from "@pagopa-pn/pn-commons";
import {useTranslation} from "react-i18next";
import {ChangeEvent, Fragment} from "react";
import {EstimateFormProps} from "../props/Estimate.props";


export function BillForm({formikInstance}: EstimateFormProps){
  const isMobile = useIsMobile();
  const { t } = useTranslation(['estimate']);
  const direction = isMobile ? 'column' : 'row';

  const handleChangeTouched = async (e: ChangeEvent) => {
    formikInstance.handleChange(e);
    await formikInstance.setFieldTouched(e.target.id, true, false);
  };

  // const handleChangeCheckValue = async (e: ChangeEvent) => {
  //   const target = e.target as any;
  //   formikInstance.handleChange(e);
  //   await formikInstance.setFieldValue("splitPayment", target.checked);
  // };

  const handleInputChange = async (event: any) => {
    event.persist();
    const target = event.target as any;
    console.log(target.checked);
    console.log(target.value);
    const valueToCheck = t('edit-estimate.label.radio-split-payment-yes');

    // await formikInstance.setFieldValue("splitPayment", target.checked);
    if(event.target.value === valueToCheck) {
      formikInstance.handleChange(event);
      await formikInstance.setFieldValue("splitPayment", true);
      console.log(true);
    } else {
      await formikInstance.setFieldValue("splitPayment", false);
      console.log(false);
    }

    // console.debug(`${event.target.name}: ${event.target.value}`);
  };

  return <Fragment>
    <Card
      sx={{
        width: 1,
        padding: "1rem 2rem",
        backgroundColor: "background.paper",
        mb: 2
      }}>
      <Stack sx={{width: 1}} spacing={3}>
        <Grid item container>
          <Typography
            color="text.primary"
            variant="h4"
          >
            {t("edit-estimate.form.bill-title")}
          </Typography>
        </Grid>

        <Grid container direction={direction} mt={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                <Typography variant="subtitle1" fontWeight={"600"} >
                  {t('edit-estimate.form.split-payment')}
                </Typography>
              </FormLabel>
              <RadioGroup
                id="splitPayment"
                name="radio-buttons-group"
                row
                aria-labelledby="demo-radio-buttons-group-label"
                onChange={handleInputChange}
                defaultChecked={formikInstance.values.splitPayment}
                defaultValue={t('edit-estimate.label.radio-split-payment-no')}
              >
                <FormControlLabel value={t('edit-estimate.label.radio-split-payment-yes')} control={<Radio />} label={t('edit-estimate.label.radio-split-payment-yes')} />
                <FormControlLabel value={t('edit-estimate.label.radio-split-payment-no')} control={<Radio />} label={t('edit-estimate.label.radio-split-payment-no')} />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>

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
          sx={{ marginBottom: isMobile ? '20px' : '0', mt: 2}}
        />

        <TextField
          id="description"
          value={formikInstance.values.description}
          onChange={handleChangeTouched}
          label={t('edit-estimate.form.description-other-info')}
          // placeholder={t('edit-estimate.form.description-placeholder')}
          name="description"
          required
          error={formikInstance.touched.description && Boolean(formikInstance.errors.description)}
          helperText={formikInstance.touched.description && formikInstance.errors.description}
          size="small"
          fullWidth={isMobile}
          sx={{ marginBottom: isMobile ? '20px' : '0', mt: 1}}
        />
        <Typography variant="body2" sx={{pb: 2}} >
          {t('edit-estimate.form.description-placeholder')}
        </Typography>
      </Stack>
    </Card>
  </Fragment>;
}