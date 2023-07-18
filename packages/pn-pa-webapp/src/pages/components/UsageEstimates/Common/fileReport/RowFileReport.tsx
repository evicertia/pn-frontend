import {ButtonNaked} from "@pagopa/mui-italia";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {Box} from "@mui/system";
import {FileReport} from "../../../../../models/UsageEstimation";
import {useAppDispatch, useAppSelector} from "../../../../../redux/hooks";
import {getReportFile} from "../../../../../redux/usageEstimates/filesReports/actions";
import {RootState} from "../../../../../redux/store";


interface RowFileReportProps {
  report: FileReport;
}
export function RowFileReport(props: RowFileReportProps) {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);

  const dispatchGetFileReport = () => {
    void dispatch(getReportFile({
      paId: loggedUser.organization?.id,
      reportKey: props.report.reportKey
    }));
  };

  return <Box>
    <ButtonNaked
      key={props.report.reportKey}
      data-testid="fileReportDownloadButtonId"
      color={'primary'}
      startIcon={<AttachFileIcon/>}
      onClick={() => dispatchGetFileReport()}>
        <Box
          sx={{
            textOverflow: 'ellipsis',
            maxWidth: {
              xs: '15rem',
              sm: '20rem',
              md: '30rem',
              lg: '24rem',
              xl: '34rem'
            },
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {props.report.reportKey}

        </Box>
    </ButtonNaked>
  </Box>;
}