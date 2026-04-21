import { Card, CardContent, Avatar } from '@mui/material';
//import { List as ListIcon } from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import { useTheme } from '@mui/material/styles';
//import Typography from '@mui/material/Typography';

const ReportPage = (props)=>{
    const { t } = useTranslation();
    const theme = useTheme();


    return <>
        <Card sx={{ mb: 8 }}>
            <CardContent>
                <div class="h_iframe">
                    <iframe
                        title="Fee Adjustment Policy" 
                        width="1300" 
                        height="2300" 
                        src="https://app.powerbi.com/reportEmbed?reportId=a0bfb998-25a4-47a6-82e3-4d146d3e64d3&autoAuth=true&ctid=d25c8e65-fff0-4c8d-b71f-29fd2037f681" 
                        frameborder="0" 
                        allowFullScreen="true"
                        class="power-bi-report"
                        onload="iframeLoaded()"
                    >
                    </iframe>
                </div>               
            </CardContent>
        </Card>
    </>
};



export default ReportPage;