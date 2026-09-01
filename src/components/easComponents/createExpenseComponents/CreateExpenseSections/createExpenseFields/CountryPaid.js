import {
    Alert,
    AlertTitle,
    Card,
    CardContent
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery } from '@tanstack/react-query';
import Grid from '@mui/material/Unstable_Grid2';
import { orange } from '@mui/material/colors';
import LoadingField from "./LoadingField";
import { ExpenseSelect } from "../ExpenseFormComunComponents";
import { fetchCountries } from "../../../../../utils/request/blhEasRequest";
import CountrySelect from "../../../../standarComponents/select/CountrySelect";

const CountryPaid = ({ countryPaid, setCountryPaid })=>{
    const { t } = useTranslation();

    const countriesResponse = useQuery({
        queryKey: ['countries'],
        queryFn: () => fetchCountries()
    });

    if(countriesResponse.isPending) return <LoadingField/>;
    if(countriesResponse.error){
        return <Alert severity="error"><AlertTitle>{t("error")}</AlertTitle>{t("it-is-not-possible-load-data")}</Alert>;
    }

    const countries = countriesResponse.data.data.data;

    return <Card raised={true} sx={{ border: `2px solid ${orange[500]}` }}>
        <CardContent>
            <Grid container spacing={2}>
                <Grid md={12}>
                    <Alert severity="warning">
                        <AlertTitle>{t("note")}</AlertTitle>
                        {t("country-paid-note")}
                    </Alert>
                </Grid>
                <Grid md={12}>
                    <ExpenseSelect
                        value={ countryPaid?.id } 
                        options={
                            countries.map(c=>{
                                return { value: c.id, label: c.name };
                            })
                        }
                        onChange={({target})=>{
                            setCountryPaid(countries.find(c=>c.id == target.value));
                        }}
                        label={t("country-paid")}
                    />
                </Grid>
            </Grid>
        </CardContent>
    </Card>;
};

export default CountryPaid;