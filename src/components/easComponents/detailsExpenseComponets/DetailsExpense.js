import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Grid from '@mui/material/Unstable_Grid2';
import { 
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Tab,
    Tabs,
    Stack,
    Skeleton,
    Alert,
    AlertTitle
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    MonetizationOn as MonetizationOnIcon,
    AccountCircle as AccountCircleIcon,
    HowToReg as HowToRegIcon,
    Send as SendIcon,
    RequestQuote as RequestQuoteIcon,
    Paid as PaidIcon,
    AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { purple, green, red, blueGrey, deepPurple } from '@mui/material/colors';
import { HighlightOff as HighlightOffIcon, DoNotDisturbOnTotalSilence as DoNotDisturbOnTotalSilenceIcon} from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import { DetailsExpenseLogsSection, DetailsExpenseFilesSection, ApprovalModal, DetailsExpenseFlow } from "./detailsExpenseSections";
import { blhEasRequest } from '../../../utils/request';
import numberToCurrencyFormat from "../../../utils/numberTocurrencyFormat";

const InfoContent = ({title, value, inline})=>{
    return <Box sx={{ px: 2, py: 0,'word-break':'break-all', ...(inline && {display: 'd-flex'}) }}>
        <Typography variant="subtitle1" component="div">
            {title}
        </Typography>
        <Typography sx={{  }} color="text.secondary">
            {value}
        </Typography>
    </Box>;
}

const StandarCard = ({children})=>{
    return <Card variant="outlined" sx={{ with: "100%", pb:0 }}>
        <CardContent sx={{ display: 'flex', pt:1, pb:0 }}>
            {children}
        </CardContent>
    </Card>;
};

const DetailsExpenseGeneralInfo = ({expense})=>{
    const { t } = useTranslation();
    const datePaid = expense.date_requested.split("T")[0];
    return <Box>
        <StandarCard>
            <InfoContent title={ t("id") } value={expense.expense_id}/>
            <Divider orientation="vertical" flexItem/>
            <InfoContent title={ t("status") } value={expense.status_name}/>
            <Divider orientation="vertical" flexItem/>
            <InfoContent title={ t("payment-date-required") } value={`${datePaid}`} />
            <Divider orientation="vertical" flexItem/>
            <InfoContent title={ t("frequency") } value={`${t(expense.eas_frequency.toLowerCase().replace("_","-"))}`} />
        </StandarCard>
        <StandarCard>
            <InfoContent title={ t("type") } value={expense.type_name} />
            <Divider orientation="vertical" flexItem/>
            <InfoContent title={ t("cost-center") } value={expense.category_name} />
            <Divider orientation="vertical" flexItem/>
            <InfoContent title={ t("cost-code") } value={expense.motive_name} />
            <Divider orientation="vertical" flexItem/>
            <InfoContent title={ t("payment-country") } value={expense.country_name} />
        </StandarCard>
    </Box>;
};

const ListInfo = ({expense, treasurers})=>{
    const { t } = useTranslation();
    const submittedDate = new Date(expense.date_submitted);
    return <List sx={{ width: "100%", bgcolor: 'background.paper', py: 0 }}>
        <ListItem>
            <ListItemAvatar>
                <Avatar sx={{ bgcolor: purple[400] }}>
                    <RequestQuoteIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText 
                primary={t("amount-requested")} 
                secondary={
                    <>
                        <Typography variant="subtitle1" color="text.primary">{`${numberToCurrencyFormat(expense.amount)} ${expense.currency_name}`}</Typography>
                        <Typography variant="capitalize" color="text.secondary">
                            { expense.currency_name == "USD" ? `${numberToCurrencyFormat((expense.amount * expense.fx_rate_local_currency).toFixed(2)) } ${expense.country_currency_name}` : `${numberToCurrencyFormat((expense.amount / expense.fx_rate).toFixed(2)) } USD` }
                        </Typography>
                    </>
                }
                sx={{ textTransform: "capitalize" }}
            />
        </ListItem>
        { expense.paid_amount && 
            <ListItem>
                <ListItemAvatar>
                    <Avatar sx={{ bgcolor: purple[400] }}>
                        <MonetizationOnIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={ t("amount-paid") }
                    secondary={
                        <>
                            <Typography variant="subtitle1" color="text.primary">{`${numberToCurrencyFormat(expense.paid_amount)} ${expense.paid_currency_name}`}</Typography>
                            <Typography variant="capitalize" color="text.secondary">
                                { expense.paid_currency_name == "USD" ? `${numberToCurrencyFormat((expense.paid_amount * expense.paid_fx_rate_local_currency).toFixed(2)) } ${expense.country_currency_name}` : `${numberToCurrencyFormat((expense.paid_amount / expense.paid_fx_rate).toFixed(2)) } USD` }
                            </Typography>
                        </>
                    }
                    sx={{ textTransform: "capitalize" }}
                />
            </ListItem>
        }
        { expense.capital && <>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: deepPurple[200] }}>
                            <PaidIcon/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={ t("capital") }
                        secondary={numberToCurrencyFormat(expense.capital)}
                        sx={{ textTransform: "capitalize" }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: deepPurple[200] }}>
                            <AttachMoneyIcon/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={ t("interest") }
                        secondary={numberToCurrencyFormat(expense.amount - expense.capital)}
                        sx={{ textTransform: "capitalize" }}
                    />
                </ListItem>
            </>
        }
        <ListItem>
            <ListItemAvatar>
                <Avatar sx={{ bgcolor: purple[400] }}>
                    <AccountCircleIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={t("requester")}
                secondary={`${expense.requester_name} ${expense.requester_surname}`}
            />
        </ListItem>
        <ListItem>
            <ListItemAvatar>
                <Avatar sx={{ bgcolor: purple[400] }}>
                    <HowToRegIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={t("pending-by")}
                secondary={expense.pending_by}
            />
        </ListItem>
        <ListItem>
            <ListItemAvatar>
                <Avatar sx={{ bgcolor: purple[400] }}>
                    <SendIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText 
                primary={t("submitted")}
                secondary={`${submittedDate.getFullYear()}-${submittedDate.getMonth()+1}-${submittedDate.getDate()}`}
            />
        </ListItem>
        <ListItem>
            <ApprovalModal expense={expense} treasurers={treasurers}/>
        </ListItem>
    </List>;
};

const TabInfo = ({expense})=>{
    const { t } = useTranslation();
    const [tabValue, setTabValue] = useState('1');
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const TabPanel = ({ children, value, index })=>{
        return <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>;
    };

    return <Box sx={{ width: '100%', typography: 'body1' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="lab API tabs example">
                <Tab label={t("history")} value="1" />
                <Tab label={t("files")} value="2" />
            </Tabs>
        </Box>
        <TabPanel value={tabValue} index="1">
            <DetailsExpenseLogsSection expenseId={expense.expense_id}/>
        </TabPanel>
        <TabPanel value={tabValue} index="2">
            <DetailsExpenseFilesSection expenseId={expense.expense_id}/>
        </TabPanel>
    </Box>
};

const Loading = ()=>{
    return <Grid container spacing={2}>
        <Grid xs={9}>
            <Stack direction="row" spacing={0.5} sx={{ mb: 0.5 }}>
                <Skeleton variant="rectancular" height={90} sx={{ width:"100%" }} />
            </Stack>
            <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
                <Skeleton variant="rectancular" height={90} sx={{ width:"100%" }} />
            </Stack>
            <Box>
                <Grid container spacing={1}>
                    <Grid md={4} xs={12}>
                        <Skeleton variant="rectancular" height={190} sx={{ width:"100%" }}/>
                    </Grid>
                    <Grid md={8} xs={12}>
                        <Stack direction="column" spacing={1}>
                            <Skeleton variant="rectancular" height={90} sx={{ width:"100%" }} />
                            <Skeleton variant="rectancular" height={90} sx={{ width:"100%" }} />
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
        <Grid xs={3}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Skeleton variant="rounded" height={380} sx={{ width:"100%" }} />
            </Stack>
        </Grid>
    </Grid>;
};

const DetailsExpense = ({expenseId})=>{
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isPending, error, data } = useQuery({
        queryKey: [`expense-detail`, expenseId],
        retry: (failureCount, err)=> err?.response?.status !== 404 && failureCount < 3,
        queryFn: ()=> blhEasRequest({ withToken: true })
            .get(`api/eas/detail/${expenseId}`)
            .then(resposne =>{
                return resposne;
            })
    });

    // El backend responde 404 cuando el usuario no puede ver el gasto (por ejemplo, un
    // gasto confidencial en el que ya no tiene acciones pendientes tras aprobarlo).
    const notAvailable = error?.response?.status === 404;
    useEffect(()=>{
        if (notAvailable){
            toast.info(t("expense-not-available"), { toastId: `expense-not-available-${expenseId}` });
            navigate("/eas", { replace: true });
        }
    }, [notAvailable, expenseId, navigate, t]);

    if (notAvailable){
        return <Loading/>;
    }

    if (error){
        return <Alert severity="error">
            <AlertTitle>{t("error")}</AlertTitle>
            {t("it-is-not-possible-load-data")}
        </Alert>;
    }

    if (isPending){
        return <Loading/>;
    }
    
    const DeductibleIcon = ({deductible})=>{
        return (deductible) ? <CheckCircleIcon/> : <HighlightOffIcon/>;
    };

    return <Grid container spacing={2}>
        <Grid xs={12}>
            <DetailsExpenseFlow expenseId={expenseId}/>
        </Grid>
        <Grid xs={9}>
            <Box>
                <Grid container spacing={2} rowSpacing={1}>
                    <Grid xs={12}>
                        <DetailsExpenseGeneralInfo
                            expense={data.data.dataEas}
                        />
                    </Grid>
                    <Grid md={4} xs={12}>
                        <StandarCard>
                            {/* <InfoContent title={ t("deductible") } value={<DeductibleIcon deductible={data.data.dataEas.deductible}/>} inline/> */}
                            <List sx={{p:0}}>
                                <ListItem sx={{py:0.5}}>
                                    <ListItemAvatar>
                                        <Avatar 
                                            sx={{ 
                                                bgcolor: data.data.dataEas.is_first_register == null
                                                    ? blueGrey[500]
                                                    : data.data.dataEas.is_first_register
                                                        ? green[500]
                                                        : red[500]
                                            }}
                                        >
                                            {
                                                (data.data.dataEas.is_first_register == null) 
                                                    ? <DoNotDisturbOnTotalSilenceIcon/>
                                                    : <DeductibleIcon deductible={data.data.dataEas.is_first_register}/>
                                            }
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={t("is-this-the-first-time-this-expense-is-required")} 
                                        secondary={(
                                            data.data.dataEas.is_first_register == null 
                                            ? t("does-not-apply")
                                            : data.data.dataEas.is_first_register
                                                ? t("yes")
                                                : t("no")
                                        )}

                                    />
                                </ListItem>
                                <ListItem sx={{py:0.5}}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: data.data.dataEas.deductible ? green[500]: red[500] }}>
                                            <DeductibleIcon deductible={data.data.dataEas.deductible}/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={t("deductible")} secondary={(data.data.dataEas.deductible ? t("yes"): t("no"))}/>
                                </ListItem>
                            </List>
                        </StandarCard>
                    </Grid>
                    <Grid md={8} xs={12}>
                        <Stack spacing={1}>
                            <StandarCard>
                                <InfoContent title={ t("description") } value={data.data.dataEas.description} />
                            </StandarCard>
                            <StandarCard>
                                <InfoContent title={ t("reason-non-deductible") } value={(data.data.dataEas.reason_non_deductible) ? data.data.dataEas.reason_non_deductible : " - "} />
                            </StandarCard>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
        <Grid xs={3}>
            <Box>
                <Grid container spacing={2}>
                    <Grid xs={12}>
                        <StandarCard>
                            <ListInfo expense={data.data.dataEas} treasurers={data.data.treasurers}/>
                        </StandarCard>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
        <Grid xs={12}>
            <TabInfo expense={data.data.dataEas}/>
        </Grid>
    </Grid>;
};

export default DetailsExpense;