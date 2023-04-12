import {Grid, Select, TextareaAutosize, TextField, Button} from "@mui/material";
import * as Yup from "yup";
import {Formik, Form} from "formik";
import {LoadingButton} from "@mui/lab";
import {useIsMobile} from "@pagopa-pn/pn-commons";
import {EstimateDetail, BillingDetail} from "../../../../models/UsageEstimation";



interface BillProps {
  initialBilling: BillingDetail | undefined;
  initialEstimate: EstimateDetail | undefined;
}


export function BillingForm(props: BillProps){
  const isMobile = useIsMobile();
  const spacing = isMobile ? 3 : 0;

  return <Grid item container spacing={spacing} >
    <Formik
      initialValues={getInitialValue(props.initialBilling, props.initialEstimate)}
      validationSchema={Yup.object({
        sdiCode: Yup.string().required("Obbligatorio"),
        splitPayment: Yup.string()
          .oneOf(
            ["Sì", "No"],
            "Split payment non selezionato"
          )
          .required("Obbligatorio"),
        email: Yup.string()
          .email("Indirizzo email non valido`")
          .required("Obbligatorio"),
      })
    }
    onSubmit={async (values, { setSubmitting }) => {
      await new Promise(r => setTimeout(r, 500));
      setSubmitting(false);
      alert(JSON.stringify(values, null, 2));
    }}>
      <Form>
        <TextField
          label="Codice SDI"
          name="sdiCode"
          type="text"
          placeholder="Codice SDI"
        />
        <Select label="Split payment" name="splitPayment">

        </Select>
        <TextField
          label="Indirizzo email"
          name="email"
          type="text"
          placeholder="Indirizzo email amministrativo"
        />
        <TextareaAutosize
          name="description"
          placeholder="Max 256 caratteri"
        />
        <Button variant="outlined">Annulla</Button>
        <LoadingButton variant="contained" >Consolida</LoadingButton>
      </Form>
    </Formik>
  </Grid>;
}

const getInitialValue = (billing?: BillingDetail, estimate?: EstimateDetail) => {
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
