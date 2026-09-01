import { useState, memo, useId } from "react";

import { useQuery } from "@tanstack/react-query";
import { Button, Box, TextField, Card, CardHeader, Avatar, Stack, Skeleton, FormControl, InputLabel, Select, MenuItem, Alert, AlertTitle } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {
    CheckCircle as CheckCircleIcon,
    AttachMoney as AttachMoneyIcon,
    RequestQuote as RequestQuoteIcon,
    Announcement as Announcement
} from '@mui/icons-material';
import { indigo } from '@mui/material/colors';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';//@todo, hacer un standar para data picker
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { getLocalStorage } from "../../../../../utils/browserStorage/browserStorage";
import { toastOptions, isValidCommentFields, showToastWarn } from "./toastValidations";
import blhEasRequest, { fetchCountries } from "../../../../../utils/request/blhEasRequest";
import numberToCurrencyFormat from "../../../../../utils/numberTocurrencyFormat";
import ExchangeSection from "../../../../standarComponents/ExchangeSection";

const TreasurerSection = ({ expenseId, commentId, uploadFiles, comeFrom, countryPaidId, amountRequired, currencyRequired })=>{
    console.log("Estos son los Atributos", comeFrom);
    
    const { t } = useTranslation();
    const currencyId = useId();
    const totalPaidId = useId();
    const paymentDateId = useId();
    const [currency, setCurrency] = useState({});
    const [countryCurrencies, setCountryCurrencies] = useState([]);
    const [totalPaid, setTotalPaid] = useState({});
    const [paymentDate, setPaymentDate] = useState('');

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    if (comeFrom !='return' && comeFrom !='reject'){
    return <Grid container spacing={1}>
        <Grid xs={4}>
            <Box sx={{ m: 1, minWidth: 120, width: "100%", display: 'flex', alignItems: 'flex-end'}}>
                <AttachMoneyIcon sx={{ my: 0.5 }} color="primary"/>
                <TextField
                    label={t("total-paid")}
                    variant="standard"
                    type="Number"
                    sx={{ textTransform: "capitalize", width: "100%" }}
                    id={ totalPaidId }
                    onChange={({target})=>{
                        setTotalPaid(parseFloat(target.value));
                    }}
                />
            </Box>
        </Grid>
        <Grid xs={4}>
            <CurrencyField
                id={currencyId}
                countryPaidId={countryPaidId}
                setCurrency={setCurrency}
                setCountryCurrencies={setCountryCurrencies}
                currencyRequired ={currencyRequired}
                handleOpen ={handleOpen} 
            />
            <CurrencyAlert
            open={open}
            handleClose ={handleClose} 
            />
        </Grid>
        <Grid xs={4}>
            <Box sx={{ m: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        label={<>{t("payment-date")} <small><em>({t("YYYY-MM-DD")})</em></small></>} 
                        // value={dayjs((new Date()))}
                        format="YYYY-MM-DD"
                        slotProps={{
                            textField: {
                                required: true,
                                id: paymentDateId,
                                variant: "standard"
                            }
                        }}
                        disableFuture
                        onChange={(val)=>{
                            setPaymentDate(new Date(val).toISOString().split("T")[0]);
                        }}
                    />
                </LocalizationProvider>
            </Box>
        </Grid>
        <Grid xs={12}>
            <Box>
                <Grid container spacing={2}>
                    <Grid md={4} xs={12}>
                        <Card sx={{  minWidth: 220, width: "100%%" }}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ border: `2px solid ${indigo[500]}`, color: indigo[500], bgcolor: "transparent" }}>
                                        <RequestQuoteIcon/>
                                    </Avatar>
                                }
                                title={t("amount-requested")}
                                subheader={ `${numberToCurrencyFormat(amountRequired)} ${currencyRequired}` }
                            />
                        </Card>
                    </Grid>
                    <Grid md={8} xs={12}>
                        <ExchangeSection countryCurrencies={countryCurrencies} currency={currency} mount={totalPaid} date={paymentDate}/>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
        <Grid xs={12} display="flex" justifyContent="center">
            <TreasurersApproveButton
                expenseId={expenseId}
                commentId={commentId}
                uploadFiles={uploadFiles}
                totalPaidId={totalPaidId}
                currencyId={currencyId}
                paymentDateId={paymentDateId}
                comeFrom={comeFrom}
            />
        </Grid>
    </Grid>;
    }else{
        return <Grid container spacing={1}>
                    <Grid xs={12} display="flex" justifyContent="center">
                        <TreasurersApproveButton
                            expenseId={expenseId}
                            commentId={commentId}
                            uploadFiles={uploadFiles}
                            totalPaidId={totalPaidId}
                            currencyId={currencyId}
                            paymentDateId={paymentDateId}
                            comeFrom={comeFrom}
                        />
                    </Grid>
                </Grid>;
    }
};

const TreasurersApproveButton = ({ expenseId, uploadFiles, commentId, totalPaidId, currencyId, paymentDateId, comeFrom })=>{
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [disabledButtons, setDisabledButtons] = useState(false);
    const user = getLocalStorage("auth-user", true);

    const isValidTreasurerFields = (commentId, currencyId, totalPaidId, paymentDateId)=>{//@todo, estandarizar funcion
        let invalidCount = 0;
        // estos campos solo son requeridos si el modal se esta llenando desde el boton 
        // Upload Proof Payment, ya que es el unico momento en el que se muestran estos campos
        //en el modal para llenarse.
        if(comeFrom == 'uploadProof'){
            if(document.getElementById(currencyId).value.length == 0 ){
                showToastWarn(`${t("currency")} ${t("is-required")}`, invalidCount++);
            }
            if(document.getElementById(totalPaidId).value.length == 0){
                showToastWarn(`${t("total-paid")} ${t("is-required")}`, invalidCount++);
            }
            if(document.getElementById(paymentDateId).value.length == 0){
                showToastWarn(`${t("payment-date")} ${t("is-required")}`, invalidCount++);
            }
        }

        if(document.getElementById(commentId).value.length == 0){
            showToastWarn(`${t("comment")} ${t("is-required")}`, invalidCount++);
        }
        /*if(uploadFiles.length == 0){
            showToastWarn(`${t("file")} ${t("is-required")}`, invalidCount++);
        }*/
        return invalidCount == 0;
    };

    const handleSaveTreasurerData = ()=>{
        if (!isValidTreasurerFields(commentId, currencyId, totalPaidId, paymentDateId)) return;

        setDisabledButtons(true);
        const toastTreasurer = toast.loading(t("saving-data"));
        toastOptions.onClose = ()=>{
            navigate(0);
        };
        // La estrucutura del body cambiara si el proceso es upload proof payment o Reject o Return
        let url = ''
        let dataBody = {}
        if(comeFrom == 'uploadProof'){
            url = `api/eas/treasury-review/${expenseId}`
            dataBody = {
                user_id: user.id,
                comment: document.getElementById(commentId).value,
                files_id: uploadFiles,
                amount: document.getElementById(totalPaidId).value,
                currency_id: parseInt(document.getElementById(currencyId).value),
                date_paid: (new Date(document.getElementById(paymentDateId).value)).toISOString()
            }
        }
        if(comeFrom == 'reject'){
            url = `api/eas/treasury-reject/${expenseId}`
            dataBody = {
                user_id: user.id,
                comment: document.getElementById(commentId).value,
                files_id: uploadFiles
            }
        }
        if(comeFrom == 'return'){
            url = `api/eas/treasury-return/${expenseId}`
            dataBody = {
                user_id: user.id,
                comment: document.getElementById(commentId).value,
                files_id: uploadFiles
            }
        }
        
        blhEasRequest({ withToken: true })
            .patch(url,dataBody).then(response=>{
                toast.update(toastTreasurer, {
                    render: t("information-saved"),
                    type: "info",
                    isLoading: false,
                    ...toastOptions
                });
            }).catch(error=>{
                console.log("error", error);
                toast.update(toastTreasurer, {
                    render: t("it-is-not-possible-save-data"),
                    type: "error",
                    isLoading: false,
                    ...toastOptions
                });
            }).finally(()=>{
                setDisabledButtons(false);
            });
    };

    return <>
        <Button
            variant="contained"
            color="primary"
            sx={{ marginX: 1, width: "30%" }}
            endIcon={<CheckCircleIcon/>}
            onClick={handleSaveTreasurerData}
            disabled={disabledButtons}
        >
            {t("save")}
        </Button>
    </>;
};

const CurrencyField = ({ id, countryPaidId, setCurrency, setCountryCurrencies, currencyRequired, handleOpen })=>{
    const { t } = useTranslation();
    console.log(id);
    const { isPending, error, data } = useQuery({
        queryKey: ['countries'],
        queryFn: () => fetchCountries()
    });

    if (isPending){
        //@todo, estandarizar con LoadingField.js
        return <Stack spacing={1} sx={{ m:1 }}>
            <Skeleton variant="rectangular" sx={{ width: "100%" }} height={40}/>
        </Stack>;
    }
    if (error){
        return <Alert severity="error"><AlertTitle>{t("error")}</AlertTitle>{t("it-is-not-possible-load-data")}</Alert>;
    }

    const countryPaid = data.data.data.find(c => c.id == countryPaidId);
    setCountryCurrencies(countryPaid.currency);
    return <Box>
        <FormControl variant="standard" sx={{ m: 1, width: "100%"}}>
            <InputLabel id={`${id}-label`}>
                { t("currency") }
            </InputLabel>
            <Select
                labelId={`${id}-label`}
                inputProps={{id: id}}
                label={ t("currency") }
            >
                <MenuItem value={0}>
                    <em>{ t("none") }</em>
                </MenuItem>
                {
                    countryPaid.currency.map(c=><MenuItem 
                        value={c.id}
                        key={c.id}
                        onClick={({target})=>{

                            if(c.name != currencyRequired){
                                handleOpen()
                                
                            }
                            console.log("La Moneda seleccionada ES: ", c.name, "Y la requerida es:", currencyRequired);
                            
                            setCurrency(c)
                        }}
                    >
                        { c.name }
                    </MenuItem>)
                }
            </Select>
        </FormControl>
    </Box>;
};


const CurrencyAlert = ({open, handleClose}) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#ff9800',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Announcement/>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Important
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Currency selected is different to currency amount required, check this information before to make payment.
            </Typography>
          </Box>
        </Modal>
      </div>
    );
  }

export default TreasurerSection;