import { useFormik } from 'formik';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { Alert, Box, Grid, TextField, Typography } from '@mui/material';
import { dataRegex } from '@pagopa-pn/pn-commons';
import { ButtonNaked, IllusSimplify } from '@pagopa/mui-italia';

import { DigitalAddress, LegalChannelType } from '../../models/contacts';
import CancelVerificationModal from './CancelVerificationModal';
import DigitalContactElem from './DigitalContactElem';
import DigitalContactsCard from './DigitalContactsCard';

type Props = {
  recipientId: string;
  legalAddresses: Array<DigitalAddress>;
};

const EviNoticeContactsList = ({ recipientId, legalAddresses }: Props) => {
  const { t, i18n } = useTranslation(['common', 'recapiti']);
  const digitalElemRef = useRef<{ editContact: () => void }>({ editContact: () => {} });
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const title = useMemo(
    () => (
      <Grid container spacing={1} alignItems="flex-end" direction="row">
        <Grid item xs="auto">
          {t('en-contacts.subtitle-2', { ns: 'recapiti' })}
        </Grid>
      </Grid>
    ),
    [i18n.language]
  );
  const defaultAddress = useMemo(
    () => legalAddresses.find((a) => a.senderId === 'default' && a.channelType === LegalChannelType.EVINOTICE && a.codeValid === true),
    [legalAddresses]
  );

  const verifyingAddress = useMemo(
    () => legalAddresses.find((a) => a.senderId === 'default' && a.channelType === LegalChannelType.EVINOTICE && a.codeValid === false),
    [legalAddresses]
  );

  const hasAnyEviNotice = useMemo(
    () => legalAddresses.find((a) => a.senderId === 'default' && a.channelType === LegalChannelType.EVINOTICE),
    [legalAddresses]
  );

  const validationSchema = yup.object({
    eviNotice: yup
      .string()
      .required(t('legal-contacts.valid-en', { ns: 'recapiti' }))
      .max(254, t('common.too-long-field-error', { ns: 'recapiti', maxLength: 254 }))
      .matches(dataRegex.email, t('legal-contacts.valid-en', { ns: 'recapiti' })),
  });

  const initialValues = {
    eviNotice: defaultAddress?.value || '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    /** onSubmit validate */
    onSubmit: () => {},
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleEditConfirm = (status: 'validated' | 'cancelled') => {
    if (status === 'cancelled') {
      formik.resetForm({ values: initialValues });
    }
  };

  const handleEviNoticeValidationCancel = () => {
    setCancelDialogOpen(true);
  };

  return (
    <>
      <CancelVerificationModal
        open={cancelDialogOpen}
        handleClose={() => setCancelDialogOpen(false)}
      />
      <DigitalContactsCard
        sectionTitle={t('en-contacts.title', { ns: 'recapiti' })}
        title={title}
        subtitle={t('en-contacts.description', { ns: 'recapiti' })}
        avatar={<IllusSimplify />}
      >
        {!verifyingAddress && hasAnyEviNotice && (
          <Box mt="20px" data-testid="legalContacts">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                digitalElemRef.current.editContact();
              }}
            >
              <Typography mb={1} sx={{ fontWeight: 'bold' }} id="associatedEviNotice">
                {t('legal-contacts.en-added', { ns: 'recapiti' })}
              </Typography>
              <DigitalContactElem
                recipientId={recipientId}
                senderId="default"
                contactType={LegalChannelType.EVINOTICE}
                fields={[
                  {
                    id: `legalContacts`,
                    key: 'legalContactValue',
                    component: (
                      <TextField
                        id="eviNotice"
                        fullWidth
                        name="eviNotice"
                        label="Internet"
                        variant="outlined"
                        size="small"
                        value={formik.values.eviNotice}
                        onChange={handleChangeTouched}
                        error={formik.touched.eviNotice && Boolean(formik.errors.eviNotice)}
                        helperText={formik.touched.eviNotice && formik.errors.eviNotice}
                      />
                    ),
                    isEditable: true,
                    size: 'auto',
                  },
                ]}
                saveDisabled={!formik.isValid}
                removeModalTitle={
                  legalAddresses.length > 1
                    ? t('legal-contacts.block-remove-en-title', { ns: 'recapiti' })
                    : t('legal-contacts.remove-en-title', { ns: 'recapiti' })
                }
                removeModalBody={
                  legalAddresses.length > 1
                    ? t('legal-contacts.block-remove-en-message', { ns: 'recapiti' })
                    : t('legal-contacts.remove-en-message', {
                        value: formik.values.eviNotice,
                        ns: 'recapiti',
                      })
                }
                value={formik.values.eviNotice}
                onConfirmClick={handleEditConfirm}
                blockDelete={legalAddresses.length > 1}
                resetModifyValue={() => handleEditConfirm('cancelled')}
                ref={digitalElemRef}
              />
            </form>
          </Box>
        )}
        {verifyingAddress && hasAnyEviNotice && (
          <Box mt="20px" data-testid="legalContacts">
            <Typography mb={1} sx={{ fontWeight: 'bold' }}>
              {t('legal-contacts.en-validating', { ns: 'recapiti' })}
            </Typography>
            <Box display="flex" flexDirection="row" mt={2.5}>
              <Box display="flex" flexDirection="row" mr={1}>
                <WatchLaterIcon fontSize="small" />
                <Typography id="validationEviNoticeProgress" fontWeight="bold" variant="body2" ml={1}>
                  {t('legal-contacts.validation-in-progress', { ns: 'recapiti' })}
                </Typography>
              </Box>
              <ButtonNaked
                color="primary"
                onClick={handleEviNoticeValidationCancel}
                data-testid="cancelValidation"
              >
                {t('legal-contacts.cancel-en-validation', { ns: 'recapiti' })}
              </ButtonNaked>
            </Box>
          </Box>
        )}
        <Alert
          tabIndex={0}
          role="banner"
          aria-label={t('legal-contacts.disclaimer-message', { ns: 'recapiti' })}
          sx={{ mt: 4 }}
          severity="info"
        >
          <Typography
            role="banner"
            component="span"
            variant="body1"
            data-testid="legal-contact-disclaimer"
          >
            {t('legal-contacts.disclaimer-message', { ns: 'recapiti' })}{' '}
          </Typography>
        </Alert>
      </DigitalContactsCard>
    </>
  );
};

export default EviNoticeContactsList;

