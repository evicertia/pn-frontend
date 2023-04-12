import {ChangeEvent, Fragment} from "react";
import {FormikErrors, FormikState, FormikTouched, FormikValues, useFormik} from "formik";
import MenuItem from '@mui/material/MenuItem';
import {Button, Card, Grid, Stack, TextField, Typography} from "@mui/material";
import { useIsMobile} from "@pagopa-pn/pn-commons";
import {useTranslation} from "react-i18next";
import * as yup from "yup";
import {BillingDetail, EstimateDetail} from "../../../../models/UsageEstimation";


interface EstimateFormProps {
  initialEstimate: EstimateDetail;
  initialBilling: BillingDetail;
  onClickEdit: (value:boolean) => void;
}

const initialValues = (estimate?: EstimateDetail, billing?: BillingDetail): FormikValues => {
  const initBilling = (billing) ? billing : {
    sdiCode: "",
    splitPayment: false,
    email: "",
    description: ""
  };
  const initEstimate = (estimate) ? estimate : {
    totalDigitalNotif: 0,
    totalPaper890Notif: 0,
    totalPaperNationalNotif: 0,
    totalPaperInternationalNotif: 0
  };
  return {...initBilling, ...initEstimate};
};

export function EstimateForm(props: EstimateFormProps) {

  const validationSchema = yup.object({
    sdiCode: yup.string().required("Obbligatorio"),
    splitPayment: yup.string()
      .oneOf(
        ["Sì", "No"],
        "Split payment non selezionato"
      )
      .required("Obbligatorio"),
    email: yup.string()
      .email("Indirizzo email non valido`")
      .required("Obbligatorio"),
    totalDigitalNotif: yup.number()
      .required("Campo obbligatorio"),
    totalPaperNationalNotif: yup.number()
      .required("Campo obbligatorio"),
    totalPaper890Notif: yup.number().required("Campo obbligatorio")
  });
  
  const formik = useFormik({
    initialValues: initialValues(props.initialEstimate, props.initialBilling),
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return <Fragment>
    <ProfilingFieldForm formikInstance={formik} />
    <UsageEstimateFieldForm formikInstance={formik} />
    <Grid item container direction={"row"} justifyContent="space-between">

      <Button variant={"outlined"} onClick={() => props.onClickEdit(false)}>Annulla</Button>

      <Stack direction={"row"} spacing={2}>
        <Button variant={"outlined"} onClick={() => props.onClickEdit(true)}>Salva</Button>
        <Button variant={"contained"} onClick={() => props.onClickEdit(true)}>Convalida</Button>
      </Stack>

    </Grid>
  </Fragment>;
}


type Props = {
  formikInstance: {
    values: FormikValues;
    setFieldTouched: (
      field: string,
      touched?: boolean,
      shouldValidate?: boolean | undefined
    ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
    handleChange: (e: ChangeEvent<any>) => void;
    resetForm: (nextState?: Partial<FormikState<FormikValues>> | undefined) => void;
    touched: FormikTouched<FormikValues>;
    errors: FormikErrors<FormikValues>;
  };
};


function ProfilingFieldForm({formikInstance}: Props) {
  const { t } = useTranslation(["estimate"]);
  const isMobile = useIsMobile();


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
      }}>
      <Stack sx={{width: 1}} spacing={2}>
        <Grid item container>
          <Typography
            color="text.primary"
            variant="overline"
            fontWeight={700}
            textTransform="uppercase"
            fontSize={14}
          >
            {t("profiling-title")}
          </Typography>
        </Grid>
        <TextField
          id="sdiCode"
          value={formikInstance.values.sdiCode}
          onChange={handleChangeTouched}
          label={t('label.sdi-code')}
          name="sdiCode"
          required
          error={formikInstance.touched.sdiCode && Boolean(formikInstance.errors.sdiCode)}
          helperText={formikInstance.touched.sdiCode && formikInstance.errors.sdiCode}
          size="small"
          fullWidth={isMobile}
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
        />
        <TextField
          id="splitPayment"
          name="splitPayment"
          label={t('label.split-payment-profiling')}
          select
          required
          onChange={handleChangeTouched}
          value={formikInstance.values.splitPayment}
          size="small"
          fullWidth={isMobile}
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
        >
          <MenuItem value={""}>{t('label.select-split-payment')}</MenuItem>
          <MenuItem value={"true"}>{t('label.yes')}</MenuItem>
          <MenuItem value={"false"}>{t('label.none')}</MenuItem>
        </TextField>
        <TextField
          id="email"
          value={formikInstance.values.email}
          onChange={handleChangeTouched}
          label={t('label.email')}
          name="email"
          required
          error={formikInstance.touched.email && Boolean(formikInstance.errors.email)}
          helperText={formikInstance.touched.email && formikInstance.errors.email}
          size="small"
          fullWidth={isMobile}
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
        />
        <TextField
          id="description"
          value={formikInstance.values.description}
          onChange={handleChangeTouched}
          label={t('label.other-description-profiling')}
          name="description"
          error={formikInstance.touched.description && Boolean(formikInstance.errors.description)}
          helperText={formikInstance.touched.description && formikInstance.errors.description}
          size="small"
          multiline
          fullWidth={isMobile}
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
        />
      </Stack>
    </Card>
  </Fragment>;
}

function UsageEstimateFieldForm({formikInstance}: Props){
  const { t } = useTranslation(["estimate"]);
  const isMobile = useIsMobile();


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
      }}>
      <Stack sx={{width: 1}} spacing={2}>
        <Grid item container>
          <Typography
            color="text.primary"
            variant="overline"
            fontWeight={700}
            textTransform="uppercase"
            fontSize={14}
          >
            {t("usage-estimate-title")}
          </Typography>
        </Grid>
        <TextField
          id="totalDigitalNotif"
          value={formikInstance.values.totalDigitalNotif}
          onChange={handleChangeTouched}
          label={t('label.digital-notif-estimate')}
          name="totalDigitalNotif"
          required
          error={formikInstance.touched.totalDigitalNotif && Boolean(formikInstance.errors.totalDigitalNotif)}
          helperText={formikInstance.touched.totalDigitalNotif && formikInstance.errors.totalDigitalNotif}
          size="small"
          type={"number"}
          fullWidth={isMobile}
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        />
        <TextField
          id="totalPaperNationalNotif"
          value={formikInstance.values.totalPaperNationalNotif}
          onChange={handleChangeTouched}
          label={t('label.analog-notif-estimate')}
          name="totalPaperNationalNotif"
          required
          error={formikInstance.touched.totalPaperNationalNotif && Boolean(formikInstance.errors.totalPaperNationalNotif)}
          helperText={formikInstance.touched.totalPaperNationalNotif && formikInstance.errors.totalPaperNationalNotif}
          size="small"
          type={"number"}
          fullWidth={isMobile}
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        />
        <TextField
          id="totalPaperInternationalNotif"
          value={formikInstance.values.totalPaperInternationalNotif}
          onChange={handleChangeTouched}
          label={t('label.analog-inter-notif-estimate')}
          name="totalPaperInternationalNotif"
          required
          error={formikInstance.touched.totalPaperInternationalNotif && Boolean(formikInstance.errors.totalPaperInternationalNotif)}
          helperText={formikInstance.touched.totalPaperInternationalNotif && formikInstance.errors.totalPaperInternationalNotif}
          size="small"
          type={"number"}
          fullWidth={isMobile}
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]' }}
        />
        <TextField
          id="totalPaper890Notif"
          value={formikInstance.values.totalPaper890Notif}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          onChange={handleChangeTouched}
          label={t('label.analog-890-notif-estimate')}
          name="totalPaper890Notif"
          required
          error={formikInstance.touched.totalPaper890Notif && Boolean(formikInstance.errors.totalPaper890Notif)}
          helperText={formikInstance.touched.totalPaper890Notif && formikInstance.errors.totalPaper890Notif}
          size="small"
          type={"number"}
          fullWidth={isMobile}
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
        />
        <Grid container data-testid={'dataInfo'} mt={1}>
          <Grid container width="1" mt={1}>
            <Grid item lg={6} xs={12}>
              <Typography variant="body2" fontWeight={"bold"} >
                {t('label.total-digital-notif')}
              </Typography>
            </Grid>
            <Grid item lg={6} xs={12}>
              { formikInstance.values.totalDigitalNotif }
            </Grid>
            <Grid item lg={6} xs={12}>
              <Typography variant="body2" fontWeight={"bold"} >
                {t('label.total-analog-notif')}
              </Typography>
            </Grid>
            <Grid item lg={6} xs={12}>
              {

                (formikInstance.values.totalPaper890Notif as number) +
                (formikInstance.values.totalPaperNationalNotif as number)
              }
            </Grid>
            <Grid item lg={6} xs={12}>
              <Typography variant="body2" fontWeight={"bold"} >
                {t('label.total-notif')}
              </Typography>
            </Grid>
            <Grid item lg={6} xs={12}>
              {
                (formikInstance.values.totalDigitalNotif as number) +
                (formikInstance.values.totalPaper890Notif as number) +
                (formikInstance.values.totalPaperNationalNotif as number)
              }
            </Grid>
          </Grid>

        </Grid>
      </Stack>
    </Card>
  </Fragment>;
}