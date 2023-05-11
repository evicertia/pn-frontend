import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useTranslation} from "react-i18next";

interface SendEstimateDialogProps {
  open: boolean;
  title: string;
  message: string;
  onClickNegative ?: () => void;
  onClickPositive : () => void;
}

export function SendEstimateDialog(props: SendEstimateDialogProps){
  const { t } = useTranslation(['estimate']);

  return <>
    <Dialog open={props.open} onClose={props.onClickNegative} data-testid={'send-estimate-dialog'}>
      <DialogTitle sx={{mt: 2}}>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{mb: 2, mr: 2, ml: 2}} >
        <Button variant={"outlined"} onClick={props.onClickNegative}>{t('edit-estimate.button.abort-edit')}</Button>
        <Button variant={"contained"} onClick={props.onClickPositive} autoFocus>{t('edit-estimate.button.send-edit')}</Button>
      </DialogActions>
    </Dialog>
  </>;
}