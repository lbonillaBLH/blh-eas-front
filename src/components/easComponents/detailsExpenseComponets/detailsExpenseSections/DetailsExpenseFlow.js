import { useQuery } from "@tanstack/react-query";
import { Stack, Skeleton, Box, Stepper, Step, StepLabel, Typography, Paper, Avatar } from "@mui/material";
import { blue, blueGrey, deepPurple, green } from '@mui/material/colors';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import { blhEasRequest } from '../../../../utils/request';
import '../../../../assets/styles/scrollbar.css';

const Loading = ()=>{
    return <Stack space={1}>
        <Skeleton variant="rectangular" sx={{ width: "100%" }} height={60} />
    </Stack>;
};

const StepItemContent = ({ index, label, code, color, date=null, icon })=>{
    return <StepLabel sx={{ border: `1px solid ${color}`, borderRadius: 1, p:0.5 }} StepIconComponent={icon}>
            <Stack direction="column" spacing={0}>
                <Typography variant="caption" color="text" align="left">
                    {label}
                </Typography>
                <Typography variant="caption" color="text.secondary">{date}</Typography>
            </Stack>
    </StepLabel>;
};

const DetailsExpenseFlow = ({ expenseId })=>{
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: [`expense-flow`],
        queryFn: ()=> blhEasRequest({ withToken: true })
            .get(`api/eas/approver-flow/${expenseId}`)
    });
    if(isPending || isFetching){
        return <Loading/>;
    }

    let finalStatus = [];
    let listStep = [];

    //SE MUESTRA LA DATA DE LOS ESTATUS DEL EXPENSE:
    
    //Conseguimos el estatus actual.
    const currentStatus = data.data.find((element) => element.currently);
    
    if (currentStatus.code =="PBAC"){
        listStep = data.data.filter(s=>( ['PBAC', 'ACC','PRBT', 'RBTC'].includes(s.code) ));
        finalStatus.push(data.data.find((elem) => elem.code == 'ECOM'));
    } 

    if (currentStatus.code =="ECOM"){
        listStep = data.data.filter(s=>( !s.is_final && s.code != 'RFLOD' && s.code != 'DRBTU' ));
        finalStatus.push(data.data.find((elem) => elem.code == 'ECOM'));
    } 
    if (currentStatus.code =="EDEC" || currentStatus.code =="ECAN" ){
        listStep = data.data.filter(s=>( s.code == 'PBAC' ));
        finalStatus.push(data.data.find((elem) => elem.code == currentStatus.code));
    } 
    if (currentStatus.code =="PRBT" ){//if EAS it's pending by Treasury
        listStep = data.data.filter(s=>( ['PBAC', 'ACC','PRBT', 'RBTC'].includes(s.code) ));
        finalStatus.push(data.data.find((elem) => elem.code == 'ECOM'));
    } 
    if (currentStatus.code =="RFLOD" ){//if EAS it's Returned For Lack Of Documentation
        listStep = data.data.filter(s=>( ['PBAC', 'ACC','PRBT', 'RFLOD', 'RBTC' ].includes(s.code) ));
        finalStatus.push(data.data.find((elem) => elem.code == 'ECOM'));
    } 
    if (currentStatus.code =="REJT" ){//if EAS it's Returned For Lack Of Documentation
        listStep = data.data.filter(s=>( ['PBAC', 'ACC','PRBT'].includes(s.code) ));
        finalStatus.push(data.data.find((elem) => elem.code == 'REJT'));
    } 


    /*PROCESO ORIGINAL
    if (currentStatus.is_final == true && currentStatus.code !="ECOM" ){
        finalStatus.push(currentStatus);
        listStep.push(data.data.find((elem) => elem.code == 'PBAC'));
    }
    // De lo Contrario se mostrara la lista completa de pasos
    else{
        listStep = data.data.filter(s=>(!s.is_final &&  s.code != 'RFLOD' && s.code != 'DRBTU' ));
        finalStatus.push(data.data.find((elem) => elem.code == 'ECOM'));
    }*/

    const activeIndex = data.data.findIndex(s=>s.currently);
    const getColorItem = (index) => (activeIndex >= index) ? blue[300] : blueGrey[300];
    const getColorFinalItem = (index) => (activeIndex >= index) ? green[300] : blueGrey[300];
    return <Box>
        <Stepper activeStep={activeIndex}>
            {listStep.map((s,index)=><Step key={s.id}>
                <StepItemContent
                    index={index}
                    label={s.name}
                    code={s.code}
                    color={getColorItem(index)}
                    date={s.eas_status_log && s.eas_status_log[s.eas_status_log.length-1]?.update_at.split("T")[0]}
                />
            </Step>)}
            { finalStatus.map((s, index) =><Step key={s.id}>
                <StepItemContent
                    index={listStep.length+index}
                    label={s.name}
                    code={s.code}
                    color={getColorFinalItem(listStep.length+index)}
                    date={s.eas_status_log && s.eas_status_log[s.eas_status_log.length-1]?.update_at.split("T")[0]}
                    icon={
                        ()=><Avatar sx={{ bgcolor: getColorFinalItem(listStep.length+index), width: 30, height: 30 }}>
                            <CreditScoreIcon/>
                        </Avatar>
                    }
                />
            </Step>)}
        </Stepper>
    </Box>;
};

export default DetailsExpenseFlow;