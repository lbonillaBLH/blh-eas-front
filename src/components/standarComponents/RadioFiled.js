import { memo, useId } from "react"; 
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel
} from '@mui/material';

const RadioField = memo(({label, options, onChange})=>{
    const id = useId();
    return <FormControl sx={{ mx: 1, minWidth: 120, width: "100%"}}>
        <FormLabel id={id}>{label}</FormLabel>
        <RadioGroup
            row
            aria-labelledby={id}
            name={`${id}-name`}
            onChange={onChange}
        >
            {
                options.map((option, index)=><FormControlLabel value={option.value} control={<Radio />} label={option.label} key={index}/>)
            }
        </RadioGroup>
    </FormControl>;
});

export default RadioField;