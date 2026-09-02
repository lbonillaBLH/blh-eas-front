import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, TextField, Card, CardContent, CardHeader, Avatar, Stack, Skeleton, Alert, AlertTitle } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import {
    AttachMoney as AttachMoneyIcon,
    Info as InfoIcon,
    Payment as PaymentIcon,
    Payments as PaymentsIcon,
    Paid as PaidIcon
} from '@mui/icons-material';
import { lightBlue } from '@mui/material/colors';
import { useTranslation } from "react-i18next";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { ExpenseSelect } from './ExpenseFormComunComponents';
import { getCurrentExchange } from '../../../../utils/request/blhCurrencyRequest';
import InputUploadFile from '../../../standarComponents/InputUploadFile';
import ExchangeSection, { ExchangeMount } from '../../../standarComponents/ExchangeSection';
import RadioField from '../../../standarComponents/RadioFiled';

const ReviewData = ({expense})=>{
    const { t } = useTranslation();
    const theme = useTheme();
    console.log(theme);
    const ItemInfo = ({title, value})=>{
        return <Box>
            <Typography variant="h6" component="div" sx={{ textTransform: "capitalize" }}>
                {title}
            </Typography>
            <Typography sx={{ textTransform: "capitalize" }} color="text.secondary">
                {value}
            </Typography>
        </Box>;
    };

    return <Card sx={{ mb:2 }}>
        <CardHeader 
            avatar={
                <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                    <InfoIcon/>
                </Avatar>
            }
            title={
                <Typography variant="h5" sx={{ textTransform: "capitalize", color: theme.palette.info.main }}>
                    {t("expense-type-information")}
                </Typography>
            }
        />
        <CardContent>
            <Grid container spacing={1}>
                <Grid xs={4}>
                    <ItemInfo title={t("type")} value={expense.type.name}/>
                </Grid>
                <Grid xs={4}>
                    <ItemInfo title={t("cost-center")} value={expense.category.name}/>
                </Grid>
                <Grid xs={4}>
                    <ItemInfo title={t("cost-code")} value={expense.motive.name}/>
                </Grid>
                <Grid xs={4}>
                    <ItemInfo title={t("payment-country")} value={expense.countryPaid.name}/>
                </Grid>
                <Grid xs={4}>
                    <ItemInfo title={t("deductible")} value={(expense.deductible) ? t("yes") : t("no")}/>
                </Grid>
                { !expense.deductible && 
                    <Grid xs={4}>
                        <ItemInfo title={t("reason-non-deductible")} value={ expense.reasonNonDeductible }/>
                    </Grid>
                }
            </Grid>
        </CardContent>
    </Card>;
};

const LoadingFields = ()=>{
    return <Stack spacing={1}>
        <Skeleton 
            variant="rounded"
            height={200}
            sx={{ width: "100%" }}
        />
    </Stack>;
};

const CapitalField = ({ amount, capital, setCapital, countryCurrency, currency })=>{
    const {t} = useTranslation();
    if(amount == ""){
        return <></>;
    }
    return <Grid container rowSpacing={0} columnSpacing={1}>
        <Grid xs={12}>
            <Typography variant="h6" sx={{ mb:0 }}>
                {t("capital")}
            </Typography>
        </Grid>
        <Grid md={3}>
            <Box sx={{ m: 0, minWidth: 120, width: "100%", display: 'flex', alignItems: 'flex-end'}}>
                <PaidIcon sx={{ my: 0.5 }} color="primary"/>
                <TextField
                    label={t("capital")}
                    value={capital}
                    variant="standard"
                    type="Number"
                    onChange={({target})=>{
                        setCapital(parseFloat(target.value));
                    }}
                    sx={{width:"100%", mx:0.5}}
                />
            </Box>
        </Grid>
        <Grid md={3}>
            <Box sx={{ m: 0, minWidth: 120, width: "100%", display: 'flex', alignItems: 'flex-end'}}>
                <PaymentsIcon sx={{ my: 0.5 }} color="primary"/>
                <TextField
                    label={t("interest")}
                    value={amount-capital}
                    variant="standard"
                    type="Number"
                    sx={{width:"100%", mx:0.5}}
                    disabled
                />
            </Box>
        </Grid>
        <Grid md={6}>
            <ExchangeMount
                countryCurrencies={currency}
                currency={countryCurrency}
                mount={capital}
                label={t("capital-in-usd")}
                cardAvatar={
                    <Avatar sx={{ bgcolor: lightBlue[500] }}>
                        <PaidIcon/>
                    </Avatar>
                }
            />
        </Grid>
    </Grid>;
};

const Fields = ({ expense })=>{
    const { t } = useTranslation();
    const [rate, setRate] = useState(1);
    const [countryCurrency, setCountryCurrency] = useState({});
    const theme = useTheme();

    const currencyRatesResponse = useQuery({
        queryKey: ['currencies'],
        queryFn: () => getCurrentExchange()
    });

    if(currencyRatesResponse.isPending){
        return <LoadingFields/>;
    }
    if(currencyRatesResponse.error){
        return <Alert severity="error"><AlertTitle>{t("error")}</AlertTitle>{t("it-is-not-possible-load-data")} ({t("currency")})</Alert>;
    }

    const rates = currencyRatesResponse.data.data.rates;

    return <Card>
        <CardHeader 
            avatar={
                <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                    <PaymentIcon/>
                </Avatar>
            }
            title={
                <Typography variant="h5" sx={{ textTransform: "capitalize", color: theme.palette.info.main }}>
                    {t("expense-amount-and-additional-data")}
                </Typography>
            }
        />
        <CardContent>
            <Grid container spacing={2} rowSpacing={4} >
                <Grid md={2}>
                    <ExpenseSelect 
                        value={expense.currency}
                        options={
                            expense.countryPaid.currency.map(c=>{
                                return { value: c.id, label: c.name };
                            })
                        }
                        onChange={({target})=>{
                            expense.setCurrency(target.value);
                            const selectedCurrency = expense.countryPaid.currency.find(c=>c.id==target.value);
                            console.log(expense.countryPaid.currency);
                            setCountryCurrency(selectedCurrency);
                            const newRate = rates.find(r => r.currency == selectedCurrency?.iso);
                            console.log(selectedCurrency, newRate);
                            setRate((newRate) ? newRate : {rate: 1, currency: "USD"});
                        }}
                        label={t("currency")}
                    />
                </Grid>
                <Grid md={5}>
                    <Box sx={{ m: 1, minWidth: 120, width: "100%", display: 'flex', alignItems: 'flex-end'}}>
                        <AttachMoneyIcon sx={{ my: 0.5 }} color="primary"/>
                        <TextField
                            label={t("amount")}
                            value={expense.amount}
                            variant="standard"
                            type="Number"
                            onChange={({target})=>{
                                expense.setAmount(parseFloat(target.value));
                            }}
                            sx={{width:"100%"}}
                        />
                    </Box>
                </Grid>
                <Grid xs={5}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker 
                            label={<Typography sx={{ textTransform: "capitalize" }}>{t("payment-date-required")} <small><em>(YYYY-MM-DD)</em></small></Typography>} 
                            value={(expense.requiredPayDate) ? dayjs(expense.requiredPayDate) : null} 
                            onChange={(val)=>{
                                expense.setRequiredPayDate(new Date(val).toISOString().split("T")[0]);
                            }}
                            format="YYYY-MM-DD"
                            sx={{ width: "100%", m:1 }}
                            slotProps={{ textField: { variant: "standard" } }}
                        />
                    </LocalizationProvider>
                </Grid>

                <Grid md={12}>
                    <ExchangeSection
                        countryCurrencies={expense.countryPaid.currency}
                        currency={countryCurrency}
                        mount={expense.amount}
                    />
                </Grid>
                {
                    expense.motive.id == 40 &&
                    <Grid xs={12}>
                        <CapitalField
                            amount={expense.amount}
                            capital={expense.capital}
                            setCapital={expense.setCapital}
                            countryCurrency={countryCurrency}
                            currency={expense.countryPaid.currency}
                        />
                    </Grid>
                }
                <Grid xs={6}>
                    <RadioField
                        label={t("frequency")}
                        options={[
                            { value: "One-Off", label: t("one-off") },
                            { value: "Monthly", label: t("monthly") },
                            { value: "Yearly", label: t("yearly") }
                        ]}
                        onChange={({target})=>{
                            expense.setFrecuency(target.value);
                        }}
                    />
                </Grid>

                {(expense.frecuency && expense.frecuency != "One-Off") &&
                    <Grid xs={6}>
                        <RadioField
                            label={t("is-this-the-first-time-this-expense-is-required")}
                            options={[
                                { value: true, label: t("yes") },
                                { value: false, label: t("no") }
                            ]}
                            onChange={({target})=>{
                                expense.setIsFirstRegister(target.value);
                            }}
                        />
                    </Grid>
                }

                <Grid xs={12}>
                    <TextField
                        label={t("description")}
                        value={expense.description}
                        multiline
                        rows={2}
                        variant="standard"
                        onChange={({target})=>{
                            expense.setDescription(target.value);
                        }}
                        sx={{ width: "100%" }}
                    />
                </Grid>
                <Grid xs={12}>
                    <InputUploadFile
                        uploadFiles={expense.uploadFiles}
                        setUploadFiles={expense.setUploadFiles}
                    />
                </Grid>
            </Grid>
        </CardContent>
    </Card> 
};

const ExpenseFormModalSection = ({expense})=>{
    return <Box sx={{ py:2 }}>
        <ReviewData expense={expense}/>
        <Fields expense={expense}/>
    </Box>;
};

export default ExpenseFormModalSection;