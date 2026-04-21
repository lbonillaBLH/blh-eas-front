import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Container, Card, CardHeader, CardContent, Avatar } from '@mui/material';
import { List as ListIcon } from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import DetailsExpense from '../../components/easComponents/detailsExpenseComponets/DetailsExpense';
import Breadcrumbs from '../../components/standarComponents/Breadcrumbs';
import { getLocalStorage, setLocalStorage } from '../../utils/browserStorage/browserStorage';

const DetailsExpensePage = (props)=>{
        
    const { t } = useTranslation();
    const theme = useTheme();
    const { expenseId } = useParams();
    const navigate = useNavigate();

    let paramsLocalStorage = getLocalStorage("paramsOfSearch");
    let paramsLocalStorageObject = JSON.parse(paramsLocalStorage);
    console.log("LO QUE SACAMOS DEL LOCALSTORAGE:",paramsLocalStorageObject);
    paramsLocalStorageObject.origin ='detail';
    setLocalStorage("paramsOfSearch", JSON.stringify(paramsLocalStorageObject));
    console.log("EL NUEVO VALOR QUE LE DAMOS:",paramsLocalStorageObject);
    
    



    return <Container maxWidth="xl">
        <Breadcrumbs
            items={[
                {
                    label: t("expenses-list"),
                    Icon: <ListIcon fontSize="small"/>,
                    onClick: () => navigate("/eas")
                },
                {
                    label: t("expense-detils"),
                    color: "primary"
                }
            ]}
        />
        <Card>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        <ListIcon/>
                    </Avatar>
                }
                title={<Typography variant="h6">{t("expense-detils")}</Typography>} 
                sx={{ textTransform: "capitalize" }}
            />
            <CardContent>
                <DetailsExpense expenseId={expenseId} />
            </CardContent>
        </Card>
    </Container>;
};

export default DetailsExpensePage;