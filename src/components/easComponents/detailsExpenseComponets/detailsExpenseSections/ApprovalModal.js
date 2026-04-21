import { useState, useId } from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import {
    Box,
    Button,
    TextField,
    Stack,
    Divider,
    
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import {
    Flaky as FlakyIcon,
    FileUpload as FileUploadIcon,
    Payment as PaymentIcon,
    CloudUpload as CloudUpload,
    Cancel as Cancel,
    Rotate90DegreesCcw as Rotate90DegreesCcw
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from "react-i18next";
import ModalComponent from '../../../standarComponents/ModalComponent';
import { getLocalStorage } from '../../../../utils/browserStorage/browserStorage';
import InputUploadFiles from '../../../standarComponents/InputUploadFile';
import ApprovalSection from './approvalSection/ApprovalSection';
import CancelButton from './approvalSection/CancelButton';

const ApprovalModal = ({expense, treasurers})=>{
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [comeFrom, setComeFrom] = useState('');
    const [uploadFiles, setUploadFiles] = useState([]);
    const commentId = useId();
    let currentUserIsTreasurer = false;
    
    let buttonToShow = { //@todo, mejorar
        PBAC: {
            label: `${t("approve")}/${t("reject")}`,
            showButton: ()=>{
                const user = getLocalStorage("auth-user", true);
                return user.employee?.id == expense.pending_by_id;//@todo, realizar por user_id
            },
            Button: <ModalButton Icon={()=><FlakyIcon/>} setShowModal={setShowModal} label={`${t("approve")}/${t("reject")}`} setComeFrom={setComeFrom} showRejectReturnBtn = {false}/>
        },
        RFLOD: {
            label: t("upload-proof"),
            showButton: ()=>{
                const user = getLocalStorage("auth-user", true);
                return user.id == expense.user_id;
            },
            Button: <ModalButton Icon={()=><FileUploadIcon/>} setShowModal={setShowModal} label={t("upload-proof")} setComeFrom={setComeFrom} showRejectReturnBtn = {false}/>
        },
        PRBT: {
            
            label: t("upload-proof-of-payment"),
            showButton: ()=>{
                const user = getLocalStorage("auth-user", true);
                return treasurers.find(t=>t.user_id == user.id) != undefined;
            },
            Button: <ModalButton Icon={()=><PaymentIcon/>} setShowModal={setShowModal} label={t("upload-proof-of-payment")} setComeFrom={setComeFrom} showRejectReturnBtn = {true}/>
        }
    };

    
    if( (!buttonToShow[expense.status_code]) || (!buttonToShow[expense.status_code].showButton())){
        return <Box sx={{ width: "100%" }}><CancelButton expense={expense}/></Box>;
    }

    return <>
        <Stack direction="column" spacing={1} divider={<Divider/>} sx={{ width: "100%" }}>
            <CancelButton expense={expense}/>
            {buttonToShow[expense.status_code].Button}
        </Stack>
        <ModalComponent show={showModal} setShow={setShowModal} title={buttonToShow[expense.status_code].label}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid xs={12}>
                    <Box>
                        <Grid container spacing={1}>
                            <Grid xs={12} display="flex" justifyContent="center">
                                <TextField
                                    id={commentId}
                                    label={t("comment")}
                                    placeholder={t("comment")}
                                    sx={{ width: "80%" }}
                                    multiline
                                />
                            </Grid>
                            <Grid xs={12} display="flex" justifyContent="center">
                                <Box sx={{ width: "80%" }}>
                                    <InputUploadFiles
                                        uploadFiles={uploadFiles}
                                        setUploadFiles={setUploadFiles}
                                    />
                                </Box>
                            </Grid>
                            <Grid xs={12} display="flex" justifyContent="center">
                                <Box sx={{ width: "80%" }}>
                                    <ApprovalSection 
                                        expense={expense}
                                        commentId={commentId}
                                        uploadFiles={uploadFiles}
                                        comeFrom={comeFrom}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </ModalComponent>
    </>;
};

const ModalButton = ({Icon, label, setShowModal, setComeFrom, showRejectReturnBtn})=>{//@todo, mejorar
    const { t } = useTranslation();
    const BootstrapTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} arrow classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
          color: theme.palette.common.black,
        },
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: theme.palette.common.black,
        },
      }));   
    // Se mostraran los 3 botones cuando sea el tesorero.  
    if (showRejectReturnBtn){
        return(
            <div>
                <Box>
                    <Box margin={"10px"}>
                        <BootstrapTooltip title={t("btn-upload-proof-of-payment-tool")} placement="left">
                            <Button
                                variant="contained" 
                                color="primary" 
                                startIcon={<CloudUpload/>} 
                                sx={{ width: "100%" }}
                                onClick={()=>{
                                    setComeFrom('uploadProof')
                                    setShowModal(true)
                                }}
                            >
                                {label}
                            </Button>
                        </BootstrapTooltip>
                    </Box>
                    <Box margin={"10px"}>
                        <BootstrapTooltip title={t("btn-reject-expense")} placement="left">
                            <Button
                                variant="contained" 
                                color="error" 
                                startIcon={<Icon/>} 
                                sx={{ width: "100%" }}
                                onClick={()=>{
                                    setComeFrom('reject')
                                    setShowModal(true)
                                }}
                            >
                            {t("btn-reject-expense")}
                            </Button>
                        </BootstrapTooltip>
                    </Box>
                    <Box margin={"10px"}>
                        <BootstrapTooltip title={t("btn-return-expense")} placement="left">
                            <Button
                                variant="contained" 
                                color="warning"
                                startIcon={<Icon/>} 
                                sx={{ width: "100%" }}
                                onClick={()=>{
                                    setComeFrom('return')
                                    setShowModal(true)
                                }}
                            >
                                {t("btn-return-expense")}
                            </Button>
                        </BootstrapTooltip>
                    </Box>
                </Box>
            </div>
        )
    }else{
        return(
            <div>
                <Box>
                    <BootstrapTooltip title={t("upload-proof-of-payment")} placement="left">
                        <Button
                            variant="contained" 
                            color="primary" 
                            startIcon={<Icon/>} 
                            sx={{ width: "100%" }}
                            onClick={()=>{
                                setComeFrom('approval_reject')
                                setShowModal(true)
                            }}
                        >
                            {label}
                        </Button>
                    </BootstrapTooltip>
                </Box>
            </div>

        )
    }
 
};

export default ApprovalModal;