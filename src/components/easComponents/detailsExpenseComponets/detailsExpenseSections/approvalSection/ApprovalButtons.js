import { useState } from "react";
import { Button, Box } from "@mui/material";
import {
    Block as BlockIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { getLocalStorage } from "../../../../../utils/browserStorage/browserStorage";
import { toastOptions, isValidCommentFields, showToastWarn } from "./toastValidations";
import blhEasRequest from "../../../../../utils/request/blhEasRequest";

const ApprovalButtons = ({ expenseId, commentId, uploadFiles })=>{
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [disabledButtons, setDisabledButtons] = useState(false);
    const user = getLocalStorage("auth-user", true);

    toastOptions.onClose = ()=>{
        navigate(0);
    };

    const handleReject = ()=>{
        if (!isValidCommentFields(t, commentId)) return;
        setDisabledButtons(true);

        const toastApprove = toast.loading(t("saving-data"));

        blhEasRequest({ withToken: true })
            .patch(`/api/eas/decline-eas/${expenseId}`,{
                user_id: user.id, //@todo, campo innecesario
                comment: document.getElementById(commentId).value,
                files_id: uploadFiles
            })
            .then(response=>{
                toast.update(toastApprove, {
                    render: t("expense-rejected"),
                    type: "info",
                    isLoading: false,
                    ...toastOptions
                });
            }).catch(error=>{
                toast.update(toastApprove, {
                    render: t("it-is-not-possible-save-data"),
                    type: "error",
                    isLoading: false,
                    ...toastOptions
                });
            });
    };

    const handleApprove = ()=>{
        if (!isValidCommentFields(t, commentId)) return;
        setDisabledButtons(true);

        const toastApprove = toast.loading(t("saving-data"));

        blhEasRequest({ withToken: true })
            .patch(`/api/eas/flow-approval/${expenseId}`,{
                user_id: user.id, //@todo, campo innecesario
                comment: document.getElementById(commentId).value,
                status: "approved", //@todo, campo innecesario
                files_id: uploadFiles
            })
            .then(response=>{
                toast.update(toastApprove, {
                    render: t("expense-approved"),
                    type: "info",
                    isLoading: false,
                    ...toastOptions
                });
            }).catch(error=>{
                toast.update(toastApprove, {
                    render: t("it-is-not-possible-save-data"),
                    type: "error",
                    isLoading: false,
                    ...toastOptions
                });
                console.error(error);
            });
    };

    return <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
            variant="outlined"
            color="error"
            sx={{ marginX: 1, width: "40%" }}
            startIcon={<BlockIcon/>}
            onClick={handleReject}
            disabled={disabledButtons}
        >
            {t("reject")}
        </Button>
        <Button
            variant="contained"
            color="primary"
            sx={{ marginX: 1, width: "40%" }}
            endIcon={<CheckCircleIcon/>}
            onClick={handleApprove}
            disabled={disabledButtons}
        >
            {t("approve")}
        </Button>
    </Box>;
};

export default ApprovalButtons