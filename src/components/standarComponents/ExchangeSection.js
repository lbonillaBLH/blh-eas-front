import {
    Card,
    CardHeader,
    Avatar,
    Skeleton,
    Stack,
    Typography,
    Alert,
    AlertTitle
} from '@mui/material';
import { useQuery } from "@tanstack/react-query";
import { purple } from '@mui/material/colors';
import { useTranslation } from "react-i18next";
import Grid from '@mui/material/Unstable_Grid2';
import {
    AttachMoney as AttachMoneyIcon,
    CurrencyExchange as CurrencyExchangeIcon
} from '@mui/icons-material';
import { getCurrentExchange, getExchangeByDate } from '../../utils/request/blhCurrencyRequest';
import numberToCurrencyFormat from '../../utils/numberTocurrencyFormat';

const Loading = ()=>{
    return <Grid container spacing={2}>
        <Grid xs={6}>
            <Stack>
                <Skeleton variant="rounded" height={60}/>
            </Stack>
        </Grid>
        <Grid xs={6}>
            <Stack>
                <Skeleton variant="rounded" height={60}/>
            </Stack>
        </Grid>
    </Grid>;
};

const DateString = ({date})=>{
    const [year, month, day] = (date) ? new Date(date).toISOString().split("T")[0].split("-") : '';
    return <Typography variant="caption" sx={{ mx:1, mb:0 }}><small>{`${day}/${month}/${year}`}</small></Typography>;
}

const ExchangeMount = ({ countryCurrencies, currency, mount, date, label=null, cardAvatar=null })=>{
    const { t } = useTranslation();
    const currencyRatesResponse = useQuery({
        queryKey: ['currencies', date],
        queryFn: () => (date) ? getExchangeByDate(date) : getCurrentExchange()
    });

    if (!currency) return <></>;
    if(currencyRatesResponse.isPending) return <Loading/>;
    if(currencyRatesResponse.error){
        return <Alert severity="error"><AlertTitle>{t("error")}</AlertTitle>{t("it-is-not-possible-load-data")} ({t("currency")})</Alert>;
    }
    if (!countryCurrencies || !countryCurrencies.lenght == 0) return <></>;

    if(label == null) label = t("amount-in-usd");

    const rates = (date) ? currencyRatesResponse.data.data.Item.rates : currencyRatesResponse.data.data.rates;
    const { localCurrencyRate, rate } = getLocalCurrencyAndRate(countryCurrencies, rates);
    const USDMount = (rate) ? ` = ${(mount >= 0) ? numberToCurrencyFormat((mount / rate?.rate).toFixed(2)) : 0} USD` : '';
    const localMount = (rate) ? ` = ${(mount >= 0) ? numberToCurrencyFormat((mount * rate?.rate).toFixed(2)) : 0} ${localCurrencyRate.iso}` : '';

    return <Card>
        <CardHeader
            avatar={
                cardAvatar
                    ? cardAvatar
                    : <Avatar sx={{ bgcolor: purple[300] }}>
                        <AttachMoneyIcon/>
                    </Avatar>
            }
            title={
                <>
                    {label}
                    { date && <DateString date={date} />}
                </>
            }
            subheader={`${(typeof mount == "number") ? numberToCurrencyFormat(mount) : 0} ${currency.iso != "USD" ? localCurrencyRate?.iso : "USD"} ${ currency.iso != "USD" ? USDMount : localMount}`}
        />
    </Card>;
};


const getLocalCurrencyAndRate = (countryCurrencies, rates)=>{
    const localCurrencyRate = countryCurrencies.find(i=>i.iso!="USD");
    const rate = (localCurrencyRate) ? rates.find(r => r.currency == localCurrencyRate.iso) : null;
    return { localCurrencyRate, rate };
};

const ExchangeSection = ({ countryCurrencies, currency, mount, date })=>{
    //@todo, estandarizar funcion, hay otra igual en ExpenseFormModalSection
    const { t } = useTranslation();
    const currencyRatesResponse = useQuery({
        queryKey: ['currencies', date],
        queryFn: () => (date) ? getExchangeByDate(date) : getCurrentExchange()
    });

    if(currencyRatesResponse.isPending){
        return <Loading/>;
    }
    if(currencyRatesResponse.error){
        return <Alert severity="error"><AlertTitle>{t("error")}</AlertTitle>{t("it-is-not-possible-load-data")} ({t("currency")})</Alert>;
    }

    if (!countryCurrencies || !countryCurrencies.lenght == 0) return <></>;

    const rates = (date) ? currencyRatesResponse.data.data.Item.rates : currencyRatesResponse.data.data.rates;
    const { localCurrencyRate, rate } = getLocalCurrencyAndRate(countryCurrencies, rates);
    const rateConvertion = (rate) ? ` = ${numberToCurrencyFormat(rate.rate.toFixed(2))} ${(localCurrencyRate.iso) ? localCurrencyRate.iso : ' - '}` : '';

    //@todo, mejorar logica de conversion validando entre usd y moneda local

    return <Grid container spacing={2}>
        <Grid xs={6}>
            <ExchangeMount
                countryCurrencies={countryCurrencies}
                currency={currency}
                mount={mount}
                date={date}
            />
        </Grid>
        <Grid xs={6}>
            <Card>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: purple[300] }}>
                            <CurrencyExchangeIcon/>
                        </Avatar>
                    }
                    title={
                        <>
                            {t("rate")}
                            { date && <DateString date={date} />}
                        </>
                    }
                    subheader={`$1 USD ${rateConvertion}`}
                />
            </Card>
        </Grid>
    </Grid>;
};

export { ExchangeMount };
export default ExchangeSection;