import { useState, useId } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { useTranslation } from "react-i18next";


const ReponsabilityAcceptanceDialog = ({
    open,
    handleClose,
    handleAcceptDisclamerAction
})=>{
    const { t } = useTranslation();
    const id = useId();
    const [disabledAgreeButton, setDisabledAgreeButton] = useState(false);
    return <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
    >
        <DialogTitle id={`${id}-title`}>
            {t("acceptance-of-responsibility-and-compliance")}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id={`${id}-description`}>
                {t("acceptance-of-responsibility-and-compliance-content")}
                <br/>
                <br/>
                {t("acceptance-of-responsibility-and-compliance-content-1")}
                <br/>
                <br/>
                {t("acceptance-of-responsibility-and-compliance-content-2")}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>{t("disagree")}</Button>
            <Button 
                onClick={()=>{
                    setDisabledAgreeButton(true);
                    handleAcceptDisclamerAction();
                }} 
                autoFocus 
                disabled={disabledAgreeButton}
            >
                { t("agree") }
            </Button>
        </DialogActions>
    </Dialog>;
};

export default ReponsabilityAcceptanceDialog;