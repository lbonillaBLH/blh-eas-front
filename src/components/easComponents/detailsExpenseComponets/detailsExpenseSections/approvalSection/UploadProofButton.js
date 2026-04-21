import { useState } from "react";
import { Button, Box } from "@mui/material";
import {
    FileUpload as FileUploadIcon,
} from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { getLocalStorage } from "../../../../../utils/browserStorage/browserStorage";
import { toastOptions, isValidCommentFields, showToastWarn } from "./toastValidations";
import blhEasRequest from "../../../../../utils/request/blhEasRequest";

const UploadProofButton = ({ expenseId, commentId, uploadFiles })=>{
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [disabledButtons, setDisabledButtons] = useState(false);
    const user = getLocalStorage("auth-user", true);

    toastOptions.onClose = ()=>{
        navigate(0);
    };

    const handleUploadProof = ()=>{
        let invalidFields = 0;
        if (!isValidCommentFields(t, commentId)) invalidFields++;
        if(uploadFiles.length == 0){
            showToastWarn(`${t("file")} ${t("is-required")}`, invalidFields++);//@todo, mejorar validacion
        }
        if(invalidFields > 0) return;

        const toastUploadProof = toast.loading(t("saving-data"));

        blhEasRequest({ withToken: true })
            .patch(`/api/eas/upload-proof/${expenseId}`,{
                user_id: user.id, //@todo, campo innecesario
                comment: document.getElementById(commentId).value,
                files_id: uploadFiles
            })
            .then(response=>{
                toast.update(toastUploadProof, {
                    render: t("support(s)-Document-has-been-uploaded"),
                    type: "info",
                    isLoading: false,
                    ...toastOptions
                });
            }).catch(error=>{
                console.error(error);
                toast.update(toastUploadProof, {
                    render: t("it-is-not-possible-save-data"),
                    type: "error",
                    isLoading: false,
                    ...toastOptions
                });
            });
    };

    return <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
            variant="contained"
            color="primary"
            sx={{ marginX: 1, width: "40%" }}
            endIcon={<FileUploadIcon/>}
            onClick={handleUploadProof}
            disabled={disabledButtons}
        >
            {t("upload-proof")}
        </Button>
    </Box>;
};


export default UploadProofButton;