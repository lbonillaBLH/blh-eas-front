import { useId, memo } from "react";
import { MenuItem, FormControl, InputLabel, Select, Alert, AlertTitle } from '@mui/material';
import { useTranslation } from "react-i18next";

const ErrorAlert = memo(
    ()=>{
        const { t } = useTranslation();
        return <Alert severity="error">
        <AlertTitle>{t("error")}</AlertTitle>
            {t("it-is-not-possible-load-data")}
        </Alert>
    }
);

const ExpenseSelect = memo(({value, options, onChange, label})=>{
    const id = useId();
    return <FormControl variant="standard" sx={{ m: 1, minWidth: 120, width: "100%"}}>
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select
            labelId={`${id}-label`}
            id={id}
            value={value}
            onChange={onChange}
            label={label}
        >
            <MenuItem value={0}>
                <em>None</em>
            </MenuItem>

            {options.map(item => <MenuItem
                key={item.value}
                value={item.value}
            >
                {item.label}
            </MenuItem>)}
        </Select>
    </FormControl>
});

export {
    ExpenseSelect,
    ErrorAlert
};