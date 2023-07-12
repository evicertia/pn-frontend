import {Grid, Typography, Card, Divider} from "@mui/material";
import {ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface RowDataInfo<T> {
  id: string;
  type: "DIVIDER" | "ROW" | "LIST";
  label: string | undefined;
  labelWeight ?: string;
  labelVariant ?: "body1" | "subtitle1" | "subtitle2";
  render ?: (data: T) => ReactNode;

}
export interface DataInfoProps<T> {
  title: string;
  data: T;
  rows: Array<RowDataInfo<T>>;
}
export function DataInfo<T>(props: DataInfoProps<T>){
  const {t} = useTranslation(["estimate"]);

  const getItem = (row: RowDataInfo<T>) => {
    switch (row.type) {
      case "DIVIDER":
        return <>
          <Grid key={row.id} container alignItems={"center"} width="1" mt={2}>
            <Divider key={row.id} sx={{width:"100%"}} />
          </Grid>
        </>;
      case "ROW":
        return <>
          <Grid key={row.id} container spacing={1} alignItems={"center"} width="1" mt={1}>
            <Grid item lg={6} xs={12}>
              <Typography variant={(row?.labelVariant) ? row.labelVariant : "body2"} fontWeight={(row?.labelWeight) ? row.labelWeight : "normal"} >
                {(row.label) ? t(row?.label) : "-"}
              </Typography>
            </Grid>
            <Grid item lg={6} xs={12}>
              {row?.render?.(props.data)}
            </Grid>
          </Grid>
        </>;
      case "LIST":
        return <>
          <Grid key={row.id} container spacing={1} alignItems={"center"} width="1" mt={1}>
            <Grid item >
              {row?.render?.(props.data)}
            </Grid>
          </Grid>
        </>;
      default:
        return "-";
    }
  };

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
              getItem(row)
            ))
          }
        </Grid>
    </Card>
  );
}