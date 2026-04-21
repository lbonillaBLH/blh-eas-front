import { useState, memo, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableFooter,
    TablePagination,
    Typography,
    Dialog,
    Tooltip,
    Stack,
    Box,
    Card,
    CardHeader,
    Avatar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from "react-i18next";
import {
    CheckCircle as CheckCircleIcon,
    HighlightOff as HighlightOffIcon,
    Visibility as VisibilityIcon,
    Pending as PendingIcon,
    Face as FaceIcon
} from '@mui/icons-material';

import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import stringToColor from "../../../../utils/stringToColor";
import numberToCurrencyFormat from "../../../../utils/numberTocurrencyFormat";
import HtmlTooltip from "../../../standarComponents/HtmlTooltip";


const DialogShowDate = memo(({ open, onClose, date }) => {
    return <Dialog onClose={onClose} open={open}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateCalendar', 'DateCalendar']}>
                <DemoItem>
                    <DateCalendar defaultValue={dayjs(date)} disabled />
                </DemoItem>
            </DemoContainer>
        </LocalizationProvider>
    </Dialog>;
});

const PersonCard = memo(({ name, position, email }) => {
    const color = stringToColor(name.trim());
    const PersonCardAvatar = ()=><Avatar sx={{ width: 40, height: 40, bgcolor: color }}>
            {[name.split(" ")[0][0]]}
        </Avatar>;
    return <Box sx={{ width: 90 }}>
        <HtmlTooltip
            title={
                <Card sx={{ m:0, border: `2px solid ${color}` }}>
                    <CardHeader
                        avatar={<PersonCardAvatar/>}
                        title={name}
                        subheader={<>{email}<br/><Typography variant="caption"><em>{position}</em></Typography></>}
                    />
                </Card>
            }
            placement="top"
            followCursor
        >
            <Stack direction="column" spacing={0}>
                <Typography variant="caption" color="text.primary" align="left" noWrap sx={{ width: 90 }}>{name}</Typography>
                {email && <>
                    <Typography variant="caption" color="text.secondary" align="left" noWrap sx={{ width: 90 }}>
                        {email}
                    </Typography>
                </>}
            </Stack>
        </HtmlTooltip>
    </Box>
});

const DataTable = ({
    rows,
    totalRows,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage
}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogDate, setDialogDate] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useTheme();
    const getNameAndPosition = (treasurerData) => {
        if (treasurerData.trim().length == 0) return;
        let [name, position] = treasurerData.split("(");
        position = (position) ? position.replace(")", "").trim() : position;
        return { name, position }
    };
    const getColorByStatusCode = (statusCode)=>{
        switch(statusCode){
            case "PBAC":
                return { bgcolor: 'warning.main', color: 'warning.contrastText' }
            case "RFLOD":
                return { bgcolor: 'secondary.main', color: 'secondary.contrastText' };
            case "PRBT":
                return { bgcolor: 'primary.main', color: 'primary.contrastText' };
            case "ECOM":
                return { bgcolor: 'success.main', color: 'success.contrastText' };
            case "EDEC":
            case "ECAN":
                return { bgcolor: 'error.main', color: 'error.contrastText' };
            case "REJT":
                return { bgcolor: 'error.main', color: 'success.contrastText' };
        }
    };
    return <>
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ '.MuiTableCell-root': { px: 0.3 } }}>
                        <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                            {t("details")}
                        </TableCell>
                        <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                            {t("id")}
                        </TableCell>
                        <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                            {t("country")}
                        </TableCell>
                        <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                            {t("type")}
                        </TableCell>
                        <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                            {t("requester")}
                        </TableCell>
                        <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                            {t("description")}
                        </TableCell>
                        <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                            {t("amount-requested")}
                        </TableCell>
                        <TableCell align="center" sx={{ textTransform: "capitalize", px: 1 }}>
                            <>{t("date-submitted")}</>
                        </TableCell>
                        <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                            {t("amount-paid")}
                        </TableCell>
                        <TableCell align="center" sx={{ textTransform: "capitalize", px: 1 }}>
                            <>{t("date-paid")}</>
                        </TableCell>
                        <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                            {t("deductible")}
                        </TableCell>
                        <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                            {t("status")}
                        </TableCell>
                        <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                            {t("pending-by")}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => {
                        const dateSubmited = new Date(row.date_submitted.replace("Z", ""));// remove Z for not convert to local time automatically
                        const paidAmount = () => {
                            if (row.paid_amount) {
                                return <>
                                    <Typography variant="subtitle2">{`${numberToCurrencyFormat(row.paid_amount)} ${row.paid_currency_name}`}</Typography>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                        { row.paid_currency_name == "USD" ? `${numberToCurrencyFormat((row.paid_amount * row.paid_fx_rate_local_currency).toFixed(1)) } ${row.country_currency_name}` : `${numberToCurrencyFormat((row.paid_amount / row.paid_fx_rate).toFixed(2)) } USD` }
                                    </Typography>
                                </>;
                            }
                            return <Tooltip title={t("paid-not-recorded")} placement="top">
                                <PendingIcon color="secondary" />
                            </Tooltip>;
                        };
                        const paidDate = () => {
                            if (row.date_paid) {
                                const [year, month, day] = row.date_paid.split("T")[0].split("-");
                                return <Button
                                    size="small"
                                    onClick={() => {
                                        setDialogDate(`${year}-${month}-${day}`)
                                        setOpenDialog(true);
                                    }}
                                    sx={{ px:0 }}
                                >
                                    {`${day}/${month}/${year}`}
                                </Button>;
                            }
                            return <Tooltip title={t("paid-not-recorded")} placement="top">
                                <PendingIcon color="secondary" />
                            </Tooltip>;
                        };
                        return <TableRow key={row.expense_id} sx={{ '.MuiTableCell-root': { px: 0.8, textAlign: "center" } }}>
                            <TableCell>
                                <IconButton size="small" onClick={() => navigate(`${row.expense_id}`)} sx={{ display: "flex", justifyContent: "center"}}>
                                    <VisibilityIcon sx={{px:0}} color="primary"/>
                                </IconButton>
                            </TableCell>
                            <TableCell>
                                {row.expense_id}
                            </TableCell>
                            <TableCell>
                                {row.country_name}
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" color="text.primary">{row.type_name}</Typography>
                                <Typography variant="subtitle2" color="text.primary">{row.category_name}</Typography>
                                <Typography variant="subtitle2" color="text.secondary">{row.motive_name}</Typography>
                            </TableCell>
                            <TableCell>
                                <PersonCard
                                    name={`${row.requester_name.trim()} ${row.requester_surname.trim()}`}
                                    email={row.email}
                                />
                            </TableCell>
                            <TableCell sx={{ maxWidth: 140 }}>
                                <Box sx={{ maxWidth: "100%", overflowX: "hidden" }}>
                                    <Typography variant="subtitle2" align="center">{row.description}</Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <>
                                    <Typography variant="subtitle2">{`${numberToCurrencyFormat(row.amount)} ${row.currency_name}`}</Typography>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                        { row.currency_name == "USD" ? `${numberToCurrencyFormat((row.amount * row.fx_rate_local_currency).toFixed(1)) } ${row.country_currency_name}` : `${numberToCurrencyFormat((row.amount / row.fx_rate).toFixed(2)) } USD` }
                                    </Typography>
                                </>
                            </TableCell>
                            <TableCell sx={{ minWidth: 90, px: 0 }}>
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setDialogDate(`${dateSubmited.getFullYear()}-${String(dateSubmited.getMonth() + 1).padStart(2, '0')}-${String(dateSubmited.getDate()).padStart(2, '0')}`)
                                        setOpenDialog(true);
                                    }}
                                >
                                    {`${String(dateSubmited.getDate()).padStart(2, '0')}/${String(dateSubmited.getMonth() + 1).padStart(2, '0')}/${dateSubmited.getFullYear()}`}
                                </Button>
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                                {paidAmount()}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center", minWidth: 90, px: 1 }}>
                                {paidDate()}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                                {(row.deductible) ? <CheckCircleIcon sx={{ color: theme.palette.success.main }} /> : <HighlightOffIcon sx={{ color: theme.palette.error.main }} />}
                            </TableCell>
                            <TableCell>
                                <Box sx={{ borderRadius: 1, px: 0, py: 0, ...getColorByStatusCode(row.status_code) }}>
                                    <Typography variant="caption">{row.status_name}</Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                {row.pending_by && <>
                                    {row.pending_by.split(",").map(
                                        (p, index) => <PersonCard
                                            key={index}
                                            name={getNameAndPosition(p).name}
                                            position={row.pending_by_position_name?.split(",")[index] || "-"} 
                                            email={row.pending_by_email.split(",")[index] || "-"}
                                        />
                                    )}
                                </>}
                            </TableCell>
                        </TableRow>;
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: t("all"), value: -1 }]}
                            colSpan={13}
                            count={totalRows}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            slotProps={{
                                select: {
                                    inputProps: {
                                        'aria-label': t("rows-per-page")
                                    },
                                    native: true,
                                },
                            }}
                            onPageChange={setPage}
                            onRowsPerPageChange={setRowsPerPage}
                            labelRowsPerPage={t("rows-per-page")}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
        <DialogShowDate open={openDialog} onClose={() => setOpenDialog(false)} date={dialogDate} />
    </>;
};

export default DataTable;