import { useId } from "react";
import { useQuery } from '@tanstack/react-query';
import { TextField, Autocomplete, Skeleton, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { fetchCountries, fetchPermissionsCountries } from "../../../utils/request/blhEasRequest";

const LoadingField = ()=>{
    return <Skeleton variant="rectangular" height={25} sx={{ my:1 }}/>;
};

const CountrySelect = ({ value, onChange, allCountries })=>{
    const id = useId();
    const { t } = useTranslation();

    const countriesResponse = useQuery({
        queryKey: ['countries'],
        queryFn: () => allCountries ? fetchCountries() : fetchPermissionsCountries()
    });

    if(countriesResponse.isPending) return <LoadingField/>;

    const countries = countriesResponse.data.data.data.filter(c => c.id);

    return <Autocomplete
        id={id}
        options={ countries.map(c=>{
            return { id: c.id, label: c.name, code3: c.code3, code2: c.code2 };
        })}
        renderInput={(params) => <TextField {...params} variant="standard" label={t("country")}/>}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderOption={(props, option)=>{
            return <Box key={option.id} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                <img
                    loading="lazy"
                    width="20"
                    srcSet={`https://flagcdn.com/w40/${option.code2.toLowerCase()}.png 2x`}
                    src={`https://flagcdn.com/w20/${option.code2.toLowerCase()}.png`}
                    alt=""
                />
                <Typography variant="caption">({option.code3}) </Typography> 
                <Typography variant="overline" sx={{ ml:0.5 }}>{option.label}</Typography>
            </Box>
        }}
        onChange={(event, value)=>{
            if(typeof onChange != "undefined"){
                onChange(value);
            }
            console.log(value);
        }}
    />;
};

export default CountrySelect;