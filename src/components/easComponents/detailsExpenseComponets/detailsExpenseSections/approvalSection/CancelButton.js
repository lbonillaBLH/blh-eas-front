import { useState, useRef } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Dialog,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
} from '@mui/material';
import {
    Block as BlockIcon,
} from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { getLocalStorage } from '../../../../../utils/browserStorage/browserStorage';
import InputUploadFiles from '../../../../standarComponents/InputUploadFile';
import blhEasRequest from "../../../../../utils/request/blhEasRequest";
import { toastOptions, showToastWarn } from './toastValidations';

const CancelDialog = ({open, setOpen, expenseId, hasCancelRol })=>{
    
    const { t } = useTranslation();
    const user = getLocalStorage("auth-user", true);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [disableButtons, setDisabledButtons] = useState(false);

    const commentRef = useRef();
    const navigate = useNavigate();
    const closeDialog = ()=>setOpen(false);
    const handleCancel = ()=>{
        if(commentRef.current.value.trim().length == 0){
            showToastWarn(`${t("comment")} ${t("is-required")}`, 0);
            return;
        }
        setDisabledButtons(true);

        const toastCancel = toast.loading(t("saving-data"));
        
        blhEasRequest({ withToken: true })
            .patch(`api/eas/cancel-eas/${expenseId}`,{
                user_id: user.id,
                comment: commentRef.current.value,
                files_id: uploadFiles,
                hasCancelRol:(hasCancelRol)?true:false
            }).then(response=>{
                toast.update(toastCancel, {
                    render: t("expense-canceled"),
                    type: "info",
                    isLoading: false,
                    onClose: ()=> navigate(0),
                    ...toastOptions
                });
            }).catch((error)=>{                
                toast.update(toastCancel, {
                    render: (error.response.status == 400) ? error.response.data.message : t("it-is-not-possible-save-data"),
                    type: "error",
                    isLoading: false,
                    onClose: ()=>setDisabledButtons(false),
                    ...toastOptions
                });
                console.log("error", error.response.status, error.response.data);
            });
    };
    return <Dialog 
            open={open}
            onClose={closeDialog}
            fullWidth
            maxWidth="sm"
        >
        <DialogContent>
            <Card>
                <CardContent>
                    <TextField
                        autoFocus
                        label={t("comment")}
                        multiline
                        rows={2}
                        variant="standard"
                        inputRef={commentRef}
                        sx={{ width: "100%" }}
                    />
                    <Box sx={{ width: "100%", mt: 2 }}>
                        <InputUploadFiles
                            uploadFiles={uploadFiles}
                            setUploadFiles={setUploadFiles}
                        />
                    </Box>
                </CardContent>
            </Card>
            <DialogActions>
                <Button disabled={disableButtons} variant="outlined" onClick={closeDialog}>{t("close")}</Button>
                <Button disabled={disableButtons} color="error" variant="outlined" onClick={handleCancel}>{t("cancel-expense")}</Button>
            </DialogActions>
        </DialogContent>
    </Dialog>;
};

const CancelButton = ({expense})=>{
    const [showDialog, setShowDialog] = useState(false);
    const { t } = useTranslation();
    const user = getLocalStorage("auth-user", true);
    //const [userHasCancelRol, setUserHasCancelRol] = useState(false);
    
    //Verificamos si  el usuario tiene el rol de cancelar gastos. 
    let hasCancelRol = null
    hasCancelRol = user.user_role.find((item)=>item.role.name == "ROL_EAS_CANCEL")
 
    
    if(
        ((expense.isFirsStep) && (expense.status_code == "PBAC") && (expense.user_id == user.id))  ||
        ((hasCancelRol) &&  (expense.status_code != "ECAN") &&  (expense.status_code != "EDEC") &&  (expense.status_code != "REJT") &&  (expense.status_code != "ECOM") )
    ){
        return <Box>
        <Button
            variant="outlined"
            color="error"
            startIcon={<BlockIcon/>}
            onClick={()=>setShowDialog(true)}
            sx={{ width: "100%" }}
        >
            <Typography variant="caption" sx={{ textTransform: "capitalize" }}>{t("cancel-expense")}</Typography>
        </Button>
        <CancelDialog open={showDialog} setOpen={setShowDialog} expenseId={expense.expense_id} hasCancelRol={hasCancelRol} />
    </Box>
    }
    else{
        return;
    }


};

export default CancelButton;