import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import Grid from '@mui/material/Unstable_Grid2';
import { 
    Typography,
    Divider,
    Paper,
    Stack
} from '@mui/material';
import { blue, indigo } from '@mui/material/colors';
import { Lock as LockIcon } from '@mui/icons-material';
import AuthGoogleButton from '../components/authComponents/AuthGoogleButton';
import { setLocalStorage, removeLocalStorage } from '../utils/browserStorage/browserStorage';
import { blhEasRequest } from "../utils/request";
import BLHIcon from "../components/standarComponents/BLHIcon";

export default ()=>{
    const navigate = useNavigate();
    const { t } = useTranslation();

    const login = async ({credential})=>{

        const errorMessage = ()=>{
            toast.error(t("the-user-does-not-have-access"), {
                position: "top-right",
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        };

        try{
            const response = await blhEasRequest({ withToken: false }).post("api/login/", { credential });
            if(response.status != 200 || !response.data.tokenData || !response.data.userData){
                errorMessage();
                return;
            }
            setLocalStorage("auth-token-expiration", response.data.tokenData.expirationDate, false);
            setLocalStorage("auth-token", response.data.tokenData.token, false);
            setLocalStorage("auth-user", response.data.userData, true);
            removeLocalStorage("paramsOfSearch");
            navigate("/eas");
        }catch(error){
            console.log("error", error);
            errorMessage();
        }
    };
    
    return <Paper maxWidth="xl" sx={{
                m:0, 
                p: 0, 
                overflow: "hidden", 
                position: "absolute", 
                height: "100%", 
                width: "100%", 
                backgroundImage: "url('https://storage.googleapis.com/stateless-clients-bizlatinhub/2019/12/5db35790-manhattan-336708_1920-min-copy.jpg')", 
            }}>
            <Stack spacing={1} direction="row" alignItems="center" sx={{ position: "absolute", top: "45%", transform: "translateY(-50%);", display: "flex", justifyContent: "center", width: "100%" }}>
                <BLHIcon
                    backgroundColor="transparent"
                    style={{
                        width: "50px"
                    }}
                />
                <Stack direction="column" spacing={0}>
                    <Typography variant="h4" color="#000"><strong style={{ color: "#3283c5" }}>Biz</strong> Latin Hub</Typography>
                    <Typography variant="subtitle1" color="#000">{ t("expense-approval-system-title-page") }</Typography>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ opacity: 0.6, bgcolor: "#000" }}/>
                <Grid container spacing={0} rowSpacing={2}>
                    <Grid xs={12}>
                        <Typography variant="h5" align="center" sx={{ color: blue[800], textTransform: "capitalize" }}>
                            <LockIcon fontSize="medium" sx={{ my: -0.3, mx: 0.3 }}/>
                            <strong>{t("sign-in")}</strong>
                        </Typography>
                    </Grid>
                    <Grid xs={12} display="flex" justifyContent="center" alignItems="center">
                        <AuthGoogleButton
                            onSuccess={(credentialResponse=>{ 
                                login(credentialResponse);
                            })}
                            onError={errorResponse=>{
                                console.log(errorResponse);
                            }}
                        />
                    </Grid>
                </Grid>
            </Stack>
        
    </Paper>;
}