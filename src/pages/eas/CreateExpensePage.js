import { useNavigate } from "react-router-dom";
import { Container, Card, CardHeader, CardContent, Avatar } from '@mui/material';
import { List as ListIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import PaidIcon from '@mui/icons-material/Paid';
import { useTranslation } from "react-i18next";
import CreateExpenseForm from '../../components/easComponents/createExpenseComponents/CreateExpenseForm';
import Breadcrumbs from '../../components/standarComponents/Breadcrumbs';

const CreateExpensePage = (props)=>{
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();

    return <Container maxWidth="xl">
        <Breadcrumbs
            items={[
                {
                    label: t("expenses-list"),
                    Icon: <ListIcon fontSize="small"/>,
                    onClick: ()=>navigate("/eas")
                },
                {
                    label: t("create-expense"),
                    color: "primary"
                }
            ]}
        />
        <Card>
            <CardHeader 
                avatar={
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        <PaidIcon/>
                    </Avatar>
                }
                title={<Typography variant="h6">{t("create-expense")}</Typography>} 
                sx={{ textTransform: "capitalize" }}
            />
            <CardContent>
                <CreateExpenseForm/>
            </CardContent>
        </Card>
    </Container>;
};

export default CreateExpensePage;