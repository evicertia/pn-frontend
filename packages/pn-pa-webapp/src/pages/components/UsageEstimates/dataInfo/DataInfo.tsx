import {Grid, Typography} from "@mui/material";
import {ReactNode} from "react";




export interface RowDataInfo {
  id: string;
  label: string;
  render: (data: any) => ReactNode;

}

export interface DataInfoProps {
  data: any;
  rows: Array<RowDataInfo>;
}

export function DataInfo(props: DataInfoProps){

  return <Grid item container spacing={1} data-testid={'dataInfo'}>
    {
      props.rows.map(row => (
        <Grid key={row.id} item container direction="row" width="1">
          <Grid item width="50%">
            <Typography>
              {row.label}
            </Typography>
          </Grid>
          <Grid item width="50%">
            {row.render(props.data)}
          </Grid>
        </Grid>
      ))
    }
  </Grid>;
}