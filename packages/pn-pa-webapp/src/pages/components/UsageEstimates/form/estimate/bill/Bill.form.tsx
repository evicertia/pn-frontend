import {
  Grid,
  TextField,
  Card,
  Stack,
  Typography,
  Radio,
  FormControlLabel, FormLabel, FormControl, RadioGroup
} from "@mui/material";
import * as React from "react";
import {useIsMobile} from "@pagopa-pn/pn-commons";
import {useTranslation} from "react-i18next";
import {Fragment} from "react";
import {EstimateFormProps} from "../props/Estimate.props";


export function BillForm({formikInstance}: EstimateFormProps){
  const isMobile = useIsMobile();
  const { t } = useTranslation(['estimate']);

  const handleTextInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    formikInstance.handleChange(event);
    await formikInstance.setFieldTouched(event.target.id, true);
  };

  const handleRadioInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    formikInstance.handleChange(event);
    await formikInstance.setFieldValue("splitPayment", event.target.value === 'Y');
  };

  const getRadioValue = () => {
    if(formikInstance.values.splitPayment) {
        return "Y";
    } else {
        return "N";
    }
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
            variant="h6"
          >
            {t("edit-estimate.form.bill-title")}
          </Typography>
        </Grid>

        <Stack direction={"row"}>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              <Typography variant="body2" fontWeight={"600"} mt={1.5}>
                {t('edit-estimate.form.split-payment')}
              </Typography>
            </FormLabel>
          </FormControl>
          <FormControl>
            <RadioGroup
              id="splitPayment"
              name="radio-buttons-group"
              row
              aria-labelledby="demo-radio-buttons-group-label"
              onChange={handleRadioInputChange}
              defaultChecked={formikInstance.values.splitPayment}
              defaultValue={t('edit-estimate.label.radio-split-payment-no')}
              value={getRadioValue()}
              sx={{ marginLeft: '30px'}}
              data-testid={"bill-radio"}
            >
              <FormControlLabel value={"Y"} control={<Radio data-testid={"bill-radio-yes"} />} label={t('edit-estimate.label.radio-split-payment-yes')} />
              <FormControlLabel value={"N"} control={<Radio data-testid={"bill-radio-no"} sx={{marginLeft: '30px'}} />} label={t('edit-estimate.label.radio-split-payment-no')} />
            </RadioGroup>
          </FormControl>
        </Stack>

        <Stack direction={"column"} spacing={3} mt={2}>
          <TextField
            id="mailAddress"
            value={formikInstance.values.mailAddress}
            onChange={handleTextInputChange}
            label={t('edit-estimate.form.mailAddress')}
            placeholder={t('edit-estimate.form.mailAddress-placeholder')}
            name="mailAddress"
            required
            error={formikInstance.touched.mailAddress && Boolean(formikInstance.errors.mailAddress)}
            helperText={formikInstance.touched.mailAddress && formikInstance.errors.mailAddress}
            size="small"
            fullWidth={isMobile}
            data-testid={"bill-textfield-email-address"}
          />
          <Stack direction={"column"}>
          <TextField
            id="description"
            value={formikInstance.values.description}
            onChange={handleTextInputChange}
            label={t('edit-estimate.form.description-other-info')}
            name="description"
            error={formikInstance.touched.description && Boolean(formikInstance.errors.description)}
            helperText={formikInstance.touched.description && formikInstance.errors.description}
            size="small"
            fullWidth={isMobile}
            data-testid={"bill-textfield-description"}
          />
          <Typography variant="body2" sx={{marginBottom: isMobile ? '20px' : '0', marginLeft: '10px', fontSize: '12px', fontColor: '#5C6F82'}} >
            {t('edit-estimate.form.description-placeholder')}
          </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  </Fragment>;
}