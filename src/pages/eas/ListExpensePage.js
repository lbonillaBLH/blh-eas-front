import { Card, CardHeader, CardContent, Avatar } from '@mui/material';
import { List as ListIcon } from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListExpense from '../../components/easComponents/listExpenseComponents/ListExpense';
import { getLocalStorage, setLocalStorage } from '../../utils/browserStorage/browserStorage';




const ListExpensePage = (props)=>{
    const { t } = useTranslation();
    const theme = useTheme();


    return <>
        <Card sx={{ mb: 8 }}> 
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        <ListIcon/>
                    </Avatar>
                }
                title={<Typography variant="h6">{t("expenses-list")}</Typography>} 
                sx={{ textTransform: "capitalize" }}
            />
            <CardContent>
                    <ListExpense/>
            </CardContent>
        </Card>
    </>
};

export default ListExpensePage;