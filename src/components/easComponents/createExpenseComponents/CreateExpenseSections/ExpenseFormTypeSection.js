import { memo } from "react"; 
import { Skeleton } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from "react-i18next";
import blhEasRequest from "../../../../utils/request/blhEasRequest";
import { ErrorAlert, ExpenseSelect } from "./ExpenseFormComunComponents";

const MotiveFields = memo(({
    type,
    setType,
    category,
    setCategory,
    motive,
    setMotive,
    expenseTypes
})=>{
    const { t } = useTranslation();
    //const [type, setType] = useState('');
    //const [category, setCategory] = useState('');
    return <><Grid xs={4}>
        <ExpenseSelect 
            label={t("type")}
            value={(type.id) ? type.id : 0}
            options={expenseTypes.map((item)=>{
                return {value: item.id, label: item.name};
            })}
            onChange={({target})=>{
                const newType = expenseTypes.find(i=>i.id == target.value);
                setType(
                    (newType) ? newType : {}
                );
                setCategory({});
                setMotive({});
            }}
        />
        
    </Grid>
    {
        (type.id) && <Grid xs={4}> 
            <ExpenseSelect
                label={<label style={{ textTransform: "capitalize" }}>{t("cost-center")}</label>}
                value={(category.id) ? category.id : 0}
                options={
                    expenseTypes
                        .find(e=>e.id==type.id)
                        .eas_category
                        .map((item)=>{
                            return {value: item.id, label: item.name};
                    })
                }
                onChange={({target})=>{
                    const newCategory = type.eas_category.find(i=>i.id == target.value);
                    setCategory(
                        (newCategory) ? newCategory : {}
                    );
                    setMotive({});
                }}
            />
        </Grid>
    }
    {
        (category.id) && <Grid xs={4}> 
            <ExpenseSelect 
                label={<label style={{ textTransform: "capitalize" }}>{t("cost-code")}</label>}
                value={motive.id ? motive.id : 0}
                options={
                    category
                        .eas_motive
                        .map((item)=>{
                            return {value: item.id, label: item.name};
                        })
                }
                onChange={({target})=>{
                    const newMotive = category.eas_motive.find(m=>m.id == target.value);
                    setMotive(
                        (newMotive) ? newMotive : {}
                    );
                }}
            />
        </Grid>
    }
    </>
});

const LoadingSection = memo(()=>{
    return <Grid container spacing={2} sx={{ flexGrow: 1, py: 1 }}>
        <Grid xs={4}>
            <Skeleton variant="rectangular" height={25}/>
        </Grid>
        <Grid xs={4}>
            <Skeleton variant="rectangular" height={25}/>
        </Grid>
        <Grid xs={4}>
            <Skeleton variant="rectangular" height={25}/>
        </Grid>
    </Grid>;
});

const ExpenseFormTypeSection = ({ 
    type,
    setType,
    category,
    setCategory,
    motive,
    setMotive
})=>{
    const { isPending, error, data } = useQuery({
        queryKey: ['expense-types'],
        queryFn: () => blhEasRequest({ withToken: true })
            .get("/api/type/type-full-data")
            .then(response => {
                return response;
            })
    });

    if(isPending) return <LoadingSection/>;
    if(error) return <ErrorAlert/>;

    return <Grid container spacing={4} sx={{ flexGrow: 1 }}>
        <MotiveFields 
            type={type}
            setType={setType}
            category={category}
            setCategory={setCategory}
            motive={motive}
            setMotive={setMotive}
            expenseTypes={data.data.data}
        />
    </Grid>;
};

export default ExpenseFormTypeSection;