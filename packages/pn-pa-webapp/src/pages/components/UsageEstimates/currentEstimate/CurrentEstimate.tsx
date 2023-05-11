import { Card, CardContent, Button, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow } from '@mui/material';


const DEFAULT_VALUE = 'Da inserire';
const  ROW_DATA= [DEFAULT_VALUE,DEFAULT_VALUE,DEFAULT_VALUE];
const COLUMN_LABELS = ['Digitali', 'Analogiche con 890', 'Analogiche con raccomandata'];
const SUBTEXT = 'Modificabile fino al';
const BUTTON_TEXT = 'Crea stima ';


//aggiungere le props
//aggiungere l'if per lo stato e cambiare il rendering dei bottoni e dell'evidenziazione tasto in basso a sx
//aggiornare il routing
//aggiungere il translate

type Props = {
    actual : string;
};



const CurrentEstimate = ({actual}: Props) => {

    return (
        <div>
            <Card>
                <CardContent style={{ overflow: 'hidden' }}>
                    <Typography variant="h4"
                                color="textPrimary"
                                style={{
                                    padding: '4px',
                                    textAlign: 'left',
                                    fontSize: '16px',
                                    color: 'gray'
                                }}>
                        {actual }
                    </Typography>
                    <TableContainer style={{ maxWidth: '95%' }}>
                        <Table style={{ tableLayout: 'auto', borderCollapse: 'collapse', borderSpacing: '0' }}>
                            <TableHead>
                                <TableRow>
                                    {COLUMN_LABELS.map((label, index) => (
                                        <TableCell key={index}
                                                   style={ {
                                                       padding: '4px',
                                                       textAlign: 'left',
                                                       lineHeight: '1',
                                                       fontSize: '16px',
                                                       color: 'gray'
                                                   } }>
                                            {label}
                                        </TableCell>

                                        ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    {ROW_DATA.map((data, index) => (
                                        <TableCell key={index}
                                                   style={{
                                                       padding: '4px',
                                                       textAlign: 'left',
                                                       lineHeight: '1',
                                                       fontSize: '16px',
                                                       color: 'gray'
                                                   }}>
                                            <Typography variant="h5" color="primary">
                                                {data}
                                            </Typography>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px' }}>
                        <Typography variant="body2" color="textSecondary" style={{
                            fontSize: '12px',
                            color: '#888888',
                            fontWeight: 'bold'}}>
              <span style={{ backgroundColor: 'yellow', padding: '2px' }}>
                <span style={{ color: '#000000' }}>
                    {SUBTEXT}</span>
              </span>
                        </Typography>
                        <Button variant="contained" color="primary" size="small">
                            {BUTTON_TEXT}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CurrentEstimate;
