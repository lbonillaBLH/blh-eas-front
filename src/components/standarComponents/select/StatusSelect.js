import {
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Skeleton
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from "react-i18next";
import { fetchStatus } from '../../../utils/request/blhEasRequest';

const LoadingField = ()=>{
    return <Skeleton variant="rectangular" height={25} sx={{ my:1 }}/>;
};

const StatusSelect = ({ value, onChange })=>{
    const { t } = useTranslation();
    const { isPending, error, data } = useQuery({
        queryKey: ['eas-status'],
        queryFn: ()=> fetchStatus()
    });
    
    if(isPending){
        return <LoadingField/>;
    }

    const statusList = data.data.list.filter(s=>s.active && s.id);

    return <FormControl variant="standard" sx={{ width: "100%" }}>
        <InputLabel id="demo-simple-select-standard-label">{t("status")}</InputLabel>
        <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={value}
            onChange={onChange}
            label={t("status")}
            defaultValue={0}
        >
            <MenuItem value={0}>
                <em>None</em>
            </MenuItem>
            {statusList.map(s=><MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
        </Select>
    </FormControl>;
};

export default StatusSelect;