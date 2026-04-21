
import { useState } from "react";
import { AlertTitle, Alert, Button, Stack, Divider, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import { useTranslation } from "react-i18next";

const ITEquipmentNotice = ()=>{
    const { t } = useTranslation();
    const [ visible, setVisible ] = useState(true);
    if(!visible) return;
    return <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert
            severity="warning" 
            onClose={() => {
                setVisible(false);
            }}
        >
            <AlertTitle>
                {t("it-equipment-notice-title")}
            </AlertTitle>
            <Divider variant="fullWidth"/>
            <Typography variant="body2">{t("it-equipment-notice-paragraph-1")}</Typography>
            <List dense>
                <ListItem>
                    <ListItemIcon>
                        <LabelImportantIcon/>
                    </ListItemIcon>
                    <ListItemText primary={t("it-equipment-notice-item-1")}/>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <LabelImportantIcon/>
                    </ListItemIcon>
                    <ListItemText primary={t("it-equipment-notice-item-2")}/>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <LabelImportantIcon/>
                    </ListItemIcon>
                    <ListItemText primary={t("it-equipment-notice-item-3")}/>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <LabelImportantIcon/>
                    </ListItemIcon>
                    <ListItemText primary={t("it-equipment-notice-item-4")}/>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <LabelImportantIcon/>
                    </ListItemIcon>
                    <ListItemText primary={t("it-equipment-notice-item-5")}/>
                </ListItem>
            </List>
            <Typography variant="body2">{t("it-equipment-notice-paragraph-2")}</Typography>
        </Alert>
    </Stack>
};

export default ITEquipmentNotice;