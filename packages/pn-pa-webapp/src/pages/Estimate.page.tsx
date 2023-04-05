import {Box, Typography} from "@mui/material";
import {useIsMobile} from "@pagopa-pn/pn-commons";
import {useTranslation} from "react-i18next";


export function EstimatePage() {
  const isMobile = useIsMobile();
  const { t } = useTranslation(['common', 'estimate']);



  return  <Box p={3}>
    <Typography variant="h4" mb={isMobile ? 3 : undefined}>
      {t('titleEstimate')}
    </Typography>
    <Box display={isMobile ? 'block' : 'flex'} justifyContent="space-between" alignItems="center">
      <Typography variant="body1" sx={{ marginBottom: isMobile ? 3 : undefined }}>
        {t('subtitleEstimate')}
      </Typography>
    </Box>
  </Box>;
}