import { useFormik } from 'formik';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Alert, Button, Grid, TextField, Typography } from '@mui/material';
import { dataRegex } from '@pagopa-pn/pn-commons';
import { IllusSimplify } from '@pagopa/mui-italia';

import { LegalChannelType } from '../../models/contacts';
import DigitalContactsCard from './DigitalContactsCard';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';

type Props = {
  recipientId: string;
};

const URL_EVICERTIA_INFO = "https://www.evicertia.com/it/comunicazioni-certificate";

const InsertEviNoticeContact = ({ recipientId }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const { initValidation } = useDigitalContactsCodeVerificationContext();

  const validationSchema = yup.object({
    digitalDomicileType: yup.string().required(),
    eviNotice: yup.string().when('digitalDomicileType', {
      is: LegalChannelType.EVINOTICE,
      then: yup
        .string()
        .required(t('en-contacts.valid-evinotice', { ns: 'recapiti' }))
        .max(254, t('common.too-long-field-error', { ns: 'recapiti', maxLength: 254 }))
        .matches(dataRegex.email, t('en-contacts.valid-evinotice', { ns: 'recapiti' })),
    }),
  });

  const formik = useFormik({
    initialValues: {
      digitalDomicileType: LegalChannelType.EVINOTICE,
      eviNotice: '',
    },
    validateOnMount: true,
    validationSchema,
    /** onSubmit validate */
    onSubmit: () => {
      initValidation(formik.values.digitalDomicileType, formik.values.eviNotice, recipientId, 'default');
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  return (
    <form onSubmit={formik.handleSubmit} data-testid="insertLegalContact">
      <DigitalContactsCard
        sectionTitle={t('en-contacts.title', { ns: 'recapiti' })}
        title={t('en-contacts.subtitle', { ns: 'recapiti' })}
        subtitle={t('en-contacts.description', { ns: 'recapiti' })}
        avatar={<IllusSimplify size={60} />}
      >
        <Grid container spacing={2} direction="row" mt={3}>
          <Grid item lg={8} sm={8} xs={12}>
            <TextField
              id="eviNotice"
              placeholder={t('en-contacts.link-evinotice-placeholder', { ns: 'recapiti' })}
              fullWidth
              name="eviNotice"
              value={formik.values.eviNotice}
              onChange={handleChangeTouched}
              error={formik.touched.eviNotice && Boolean(formik.errors.eviNotice)}
              helperText={formik.touched.eviNotice && formik.errors.eviNotice}
              disabled={formik.values.digitalDomicileType !== LegalChannelType.EVINOTICE}
              inputProps={{ sx: { height: '14px' } }}
            />
          </Grid>
          <Grid item lg={4} sm={4} xs={12} alignItems="right">
            <Button
              id="add-contact"
              variant="outlined"
              disabled={!formik.isValid}
              fullWidth
              type="submit"
              data-testid="addContact"
            >
              {t('button.conferma')}
            </Button>
          </Grid>
        </Grid>
        <Alert
          tabIndex={0}
          role="banner"
          aria-label={t('en-contacts.disclaimer-message', { ns: 'recapiti' })}
          sx={{ mt: 4 }}
          severity="info"
        >
          <Typography
            role="banner"
            component="span"
            variant="body1"
            data-testid="legal-contact-disclaimer"
          >
            {t('en-contacts.disclaimer-message', { ns: 'recapiti' })}<br />
            {t('en-contacts.disclaimer-message-2', { ns: 'recapiti' })}{' '}
            <a href={URL_EVICERTIA_INFO} target="_blank" rel="noopener noreferrer" >
              {t('en-contacts.evicertia-link-text', { ns: 'recapiti' })}
            </a>
          </Typography>
        </Alert>
      </DigitalContactsCard>
    </form>
  );
};

export default InsertEviNoticeContact;
