import { useRef, useState } from "react";
import {
    Box,
    TextField,
    InputAdornment,
    Button,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
    Chip,
    Stack
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
    Clear as ClearIcon,
    Search as SearchIcon,
    ManageSearch as ManageSearchIcon
} from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CountrySelect from "../../../standarComponents/select/CountrySelect";
import StatusSelect from "../../../standarComponents/select/StatusSelect";

const GeneralFilter = ({ value, setValue })=>{   
     
    const inputRef = useRef();
    const { t } = useTranslation();
    return <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <TextField
            label={t("what-do-you-want-to-look-for")} 
            variant="standard"
            inputRef={inputRef}
            defaultValue={value}
            sx={{ minWidth: "250px" }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon/>
                    </InputAdornment>
                ),
                endAdornment: <>
                    {value && <InputAdornment 
                            position="end" 
                            sx={{ cursor: "pointer" }}
                            onClick={()=>{                                
                                inputRef.current.value = '';
                                setValue(null)
                                
                            }}
                        >
                            <ClearIcon color="primary"/>
                        </InputAdornment>
                    }
                </>,
            }}
        />
        <Button
            size="small"
            sx={{ mx:1, textTransform: "capitalize" }}
            variant="outlined"
            onClick={()=>setValue(inputRef.current.value)}
        >
            <Typography variant="caption">{t("search")}</Typography>
        </Button>
    </Box>;
};

const DialogAdvanceFilter = ({ open, setOpen, onSetDataFilter })=>{
    const { t } = useTranslation();
    const idRef = useRef();
    const [country, setCountry] = useState();
    const [status, setStatus] = useState();
    const startDateRef = useRef();
    const endDateRef = useRef();
    return <Dialog
            open={open}
            maxWidth="sm"
            fullWidth={true}
        >
        <DialogTitle>
            <Box sx={{ display: "flex" }}>
                <ManageSearchIcon sx={{ mr:1, my: "auto" }}/>
                <Typography variant="title">{t("search")}</Typography>
            </Box>
        </DialogTitle>
        <DialogContent>
            <Grid container spacing={2}>
                <Grid xs={3}>
                    <TextField
                        label={t("id")}
                        variant="standard"
                        inputRef={idRef}
                    />
                </Grid>
                <Grid xs={5}>
                    <CountrySelect
                        onChange={(val)=>{
                            setCountry((val) ? val.id : null);
                        }}
                    />
                </Grid>
                <Grid xs={4}>
                    <StatusSelect onChange={(e)=>{
                        console.log(e);
                        setStatus(e.target.value)
                    }}/>
                </Grid>
                <Grid xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker 
                            label={<>{t("since")} <small><em>({t("YYYY-MM-DD")})</em></small></>}
                            inputRef={startDateRef}
                            format="YYYY-MM-DD"
                            sx={{ width: "100%" }}
                            slotProps={{ textField: { variant: "standard" } }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker 
                            label={<>{t("until")} <small><em>({t("YYYY-MM-DD")})</em></small></>}
                            inputRef={endDateRef}
                            format="YYYY-MM-DD"
                            sx={{ width: "100%" }}
                            slotProps={{ textField: { variant: "standard" } }}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button 
                onClick={()=>{
                    setOpen(false);
                }}
            >
                {t("cancel")}
            </Button>
            <Button 
                variant="contained"
                onClick={()=>{
                    // console.log(country, new Date(startDateRef.current.value).toISOString().split("T")[0]);
                    let values = {};

                    if(idRef.current.value){
                        values.id = idRef.current.value;
                    }
                    if(country){
                        values.countryId = country;
                    }
                    if(status){
                        values.statusId = status;
                    }
                    if(startDateRef.current.value){
                        values.start_date = startDateRef.current.value;
                    }
                    if(endDateRef.current.value){
                        values.end_date = endDateRef.current.value;
                    }

                    console.log(values);
                    onSetDataFilter(values);
                }}
            >
                {t("search")}
            </Button>
        </DialogActions>
    </Dialog>;
};

export { GeneralFilter, DialogAdvanceFilter };