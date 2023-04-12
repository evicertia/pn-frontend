import {Grid, Typography, Card} from "@mui/material";
import {ReactNode} from "react";
import {useTranslation} from "react-i18next";




export interface RowDataInfo<T> {
  id: string;
  label: string;
  labelWeight ?: "normal" | "bold" ;
  render: (data: T) => ReactNode;

}

export interface DataInfoProps<T> {
  title: string;
  data: T;
  rows: Array<RowDataInfo<T>>;
}

export function DataInfo<T>(props: DataInfoProps<T>){
  const { t } = useTranslation(["estimate"]);

  return (
    <Card
      sx={{
        width: 1,
        padding: "1rem 2rem",
        backgroundColor: "background.paper",
      }}>
        <Grid container>
          <Typography
            color="text.primary"
            variant="overline"
            fontWeight={700}
            textTransform="uppercase"
            fontSize={14}
          >
            {props.title}
          </Typography>
        </Grid>
        <Grid container data-testid={'dataInfo'} mt={1}>
          {
            props.rows.map(row => (
              <Grid key={row.id} container alignItems={"center"} width="1" mt={1}>
                <Grid item lg={6} xs={12}>
                  <Typography variant="body2" fontWeight={(row?.labelWeight) ? row.labelWeight : "normal"} >
                    {t(row.label, row.label)}
                  </Typography>
                </Grid>
                <Grid item lg={6} xs={12}>
                  {row.render(props.data)}
                </Grid>
              </Grid>
            ))
          }
        </Grid>
    </Card>
  );
}