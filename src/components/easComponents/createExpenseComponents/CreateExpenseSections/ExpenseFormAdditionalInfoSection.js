import { memo, useId } from "react"; 
import { 
    Box,
    TextField
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from "react-i18next";
import { getLocalStorage } from "../../../../utils/browserStorage/browserStorage";
import CountryPaid from "./createExpenseFields/CountryPaid";
import RadioField from "../../../standarComponents/RadioFiled";

const StaticField = memo(({ label, value })=>{
    return <Box sx={{ m: 1, width: "100%", display: 'flex', alignItems: 'flex-end'}}>
        <TextField 
            label={label} 
            value={value}
            variant="standard"
            disabled
            sx={{ width: "100%" }}
        />
    </Box>;
});

const DeductibleField = ({deductible, setDeductible, reasonNonDeductible, setReasonNonDeductible})=>{
    const { t } = useTranslation();

    return <Grid container spacing={2}>
        <Grid xs={3}>
            <RadioField
                label={t("deductible")}
                options={[
                    { value: true, label: t("yes") },
                    { value: false, label: t("no") },
                ]}
                onChange={({target})=>setDeductible(target.value)}
            />
        </Grid>
        {
            (deductible === false) && <Grid xs={9}>
                <TextField
                    label={t("reason-non-deductible")}
                    value={reasonNonDeductible}
                    multiline
                    rows={2}
                    variant="standard"
                    onChange={({target})=>{
                        setReasonNonDeductible(target.value);
                    }}
                    sx={{ width: "100%" }}
                />
            </Grid>
        }
    </Grid>
}

const Fields = memo(({
    amount,
    setAmount,
    frecuency,
    setFrecuency,
    description,
    setDescription,
    deductible,
    setDeductible,
    reasonNonDeductible,
    setReasonNonDeductible,
    requiredPayDate,
    setRequiredPayDate,

    countryPaid,
    setCountryPaid
 })=>{
    const { t } = useTranslation();
    const user = getLocalStorage("auth-user", true);
    const contract = user.employee.contract[0]; //@todo, validar para seleccionar el contrato activo
    const entity = contract.entity_contract.find(e=>e.is_principal).entity;
    return <>
        <Grid xs={3}>
            <StaticField label={t("requester")} value={`${user.employee.first_name.trim()} ${user.employee.surname.trim()}`} />
        </Grid>
        <Grid xs={3}>
            <StaticField label={t("team")} value={(contract.position.department.level1 == "C") ? t("corporate") : t("operations")} />
        </Grid>
        <Grid xs={3}>
            <StaticField label={t("department")} value={contract.position.department.name} />
        </Grid>
        <Grid xs={3}>
            <StaticField label={t("country")} value={entity.country.name} />
        </Grid>

        <Grid xs={12}>
            <CountryPaid 
                countryPaid={countryPaid} 
                setCountryPaid={setCountryPaid}
            />
        </Grid>

        <Grid xs={12}>
            <DeductibleField
                deductible={deductible}
                setDeductible={setDeductible}
                reasonNonDeductible={reasonNonDeductible}
                setReasonNonDeductible={setReasonNonDeductible}
            />
        </Grid>
    </>
});

const ExpenseFormAdditionalInfoSection = ({ 
    amount,
    setAmount,
    frecuency,
    setFrecuency,
    description,
    setDescription,
    deductible,
    setDeductible,
    reasonNonDeductible,
    setReasonNonDeductible,
    requiredPayDate,
    setRequiredPayDate,
    countryPaid,
    setCountryPaid
})=>{
    return <Grid container spacing={4} sx={{ flexGrow: 1 }}>
        <Fields
            amount={amount} 
            setAmount={setAmount} 
            frecuency={frecuency}
            setFrecuency={setFrecuency}
            description={description}
            setDescription={setDescription}
            deductible={deductible}
            setDeductible={setDeductible}
            reasonNonDeductible={reasonNonDeductible}
            setReasonNonDeductible={setReasonNonDeductible}
            requiredPayDate={requiredPayDate}
            setRequiredPayDate={setRequiredPayDate}
            countryPaid={countryPaid}
            setCountryPaid={setCountryPaid}
        />
    </Grid>;
};

export default ExpenseFormAdditionalInfoSection;