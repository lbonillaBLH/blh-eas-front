import { useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Button,
    Stack,
    Box,
    Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import { ExpenseFormTypeSection, ExpenseFormAdditionalInfoSection, ExpenseFormModalSection } from "./CreateExpenseSections";
import { getLocalStorage } from "../../../utils/browserStorage/browserStorage";
import { blhEasRequest } from "../../../utils/request";
import ModalComponent from "../../standarComponents/ModalComponent";
import { ReponsabilityAcceptanceDialog, ITEquipmentNotice } from "./CreateExpenseSections/disclaimers"

const CreateExpenseForm = ()=>{
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [disabledButton, setDisabledButton] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openDisclaimer, setOpenDisclaimer] = useState(false);
    const expense = {};
    [expense.type, expense.setType] = useState({});
    [expense.category, expense.setCategory] = useState({});
    [expense.motive, expense.setMotive] = useState({});
    [expense.country, expense.setCountry] = useState('');
    [expense.currency, expense.setCurrency] = useState('');
    [expense.fxRate, expense.setFxRate] = useState('');
    [expense.countryPaid, expense.setCountryPaid] = useState({});
    [expense.amount, expense.setAmount] = useState('');
    [expense.capital, expense.setCapital] = useReducer((state, action)=>{
        if (expense.amount == "" || (action > expense.amount)) return 0;
        return action;
    });
    [expense.frecuency, expense.setFrecuency] = useState('');
    [expense.isFirstRegister, expense.setIsFirstRegister] = useReducer((state, action)=>action == "true", '');
    [expense.description, expense.setDescription] = useState('');
    [expense.deductible, expense.setDeductible] = useReducer((state, action)=>action == "true", '');
    [expense.reasonNonDeductible, expense.setReasonNonDeductible] = useState('');
    [expense.requiredPayDate, expense.setRequiredPayDate] = useState('');
    [expense.uploadFiles, expense.setUploadFiles] = useState([]);

    const handleRegisterEAS = ()=>{
        
        setDisabledButton(true);

        const toastOptions = {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        };

        const saveToast = toast.loading(t("saving-data"));
        blhEasRequest({withToken: true})
            .post('/api/eas/save', {
                "user_id": getLocalStorage("auth-user", true).id,
                "motive_id": expense.motive.id,
                "amount": expense.amount,
                "paid_country_id": expense.countryPaid.id,
                "eas_frequency": expense.frecuency,
                "currency_id": expense.currency,
                "description": expense.description.trim(),
                "deductible": expense.deductible,
                "reason_non_deductible": expense.reasonNonDeductible.trim(),
                "date_requested": expense.requiredPayDate,
                "files_id": expense.uploadFiles,
                ...(expense.isFirstRegister != "" && { "is_first_register": expense.isFirstRegister }),
                ...(expense.capital != "" && { "capital": expense.capital })
            })
            .then(response=>{
                toast.update(saveToast, {
                    render: `${t("expense-has-been-created")} ${t("with-id")} ${response.data.NewEas.id}`,
                    type: "info",
                    isLoading: false,
                    onClose: ()=>{
                        navigate("/eas");
                    },
                    ...toastOptions
                });
            }).catch(error=>{
                toast.update(saveToast,{
                    render: t("it-is-not-possible-save-data"),
                    type: "error",
                    isLoading: false,
                    ...toastOptions
                });
                console.log("error", error);
            }).finally(()=>{
                setDisabledButton(false);
            });
    };

    const isValidField = (val)=>{
        if (typeof val == "number"){
            return val > 0;
        }
        if(val!="" && val != undefined){
            return val.trim().length > 0;
        }
        
    };

    const showToastWarn = (message, invalidCount)=>{
        toast.warn(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
            delay: invalidCount*200
        });
    };

    const isValidFirstSectionFields = ()=>{
        let invalidCount = 0;

        if(!expense.motive.id){
            showToastWarn(`${t("cost-code")} ${t("is-required")}`, invalidCount++);
        }
        if(!expense.countryPaid || Object.keys(expense.countryPaid).length == 0){
            showToastWarn(`${t("country")} ${t("is-required")}`, invalidCount++);
        }
        
        if(typeof expense.deductible != 'boolean'){
            showToastWarn(`${t("deductible")} ${t("is-required")}`, invalidCount++);
        }else if((expense.deductible == false) && (!isValidField(expense.reasonNonDeductible))){
            showToastWarn(`${t("reason-non-deductible")} ${t("is-required")}`, invalidCount++);
        }

        return invalidCount == 0;
    };

    //@todo, estandarizar metodos junto con validaciones de aprobacion
    const isValidSecondSectionFields = ()=>{
        console.log("Prueba...Funcion:",expense );
        let invalidCount = 0;
        if(!isValidField(expense.currency)){
            showToastWarn(`${t("currency")} ${t("is-required")}`, invalidCount++);
        }
        if(!isValidField(expense.amount)){
            showToastWarn(`${t("amount")} ${t("is-required")}`, invalidCount++);
        }
        if(!isValidField(expense.frecuency)){
            showToastWarn(`${t("frequency")} ${t("is-required")}`, invalidCount++);
        }else if(expense.frecuency != "One-Off" && typeof expense.isFirstRegister != "boolean"){
            showToastWarn(`${t("is-this-the-first-time-this-expense-is-required")} ${t("is-required")}`, invalidCount++);
        }
        if(!expense.countryPaid.id){
            showToastWarn(`${t("payment-country")} ${t("is-required")}`, invalidCount++);
        }
        if(!isValidField(expense.description)){
            showToastWarn(`${t("description")} ${t("is-required")}`, invalidCount++);
        }
        if(!isValidField(expense.requiredPayDate)){
            showToastWarn(`${t("payment-date-required")} ${t("is-required")}`, invalidCount++);
        }
        if(expense.motive.id == 40 && !isValidField(expense.capital)){
            showToastWarn(`${t("capital")} ${t("is-required")}`, invalidCount++);
        }
        if(expense.uploadFiles.length == 0 ){
            showToastWarn(`${t("upload-files")} ${t("is-required")}`, invalidCount++);
        }
        /*if(expense.uploadFiles.length == 0 && (expense.motive.id == 40 || expense.motive.id == 41 )){
            showToastWarn(`${t("upload-files")} ${t("is-required")}`, invalidCount++);
        }*/
        return invalidCount == 0;
    };

    const showModal = ()=>{
        if(!isValidFirstSectionFields()){
            return;
        }
        setOpenModal(true);
    };

    return <>
        {/* <ITEquipmentNotice/> */}
        <ExpenseFormTypeSection 
            type={expense.type}
            setType={expense.setType}
            category={expense.category}
            setCategory={expense.setCategory}
            motive={expense.motive}
            setMotive={expense.setMotive}
        />
        <ExpenseFormAdditionalInfoSection
            amount={expense.amount}
            setAmount={expense.setAmount}
            frecuency={expense.frecuency}
            setFrecuency={expense.setFrecuency}
            description={expense.description}
            setDescription={expense.setDescription}
            deductible={expense.deductible}
            setDeductible={expense.setDeductible}
            reasonNonDeductible={expense.reasonNonDeductible}
            setReasonNonDeductible={expense.setReasonNonDeductible}
            requiredPayDate={expense.requiredPayDate}
            setRequiredPayDate={expense.setRequiredPayDate}
            countryPaid={expense.countryPaid} 
            setCountryPaid={expense.setCountryPaid}
        />

        <Stack direction="row" justifyContent="center" mt={2}>
            <Button 
                variant="contained"
                endIcon={<SendIcon/>}
                onClick={showModal}
                disabled={disabledButton}
            >
                {t("continue")}
            </Button>
        </Stack>
        <ModalComponent show={openModal} setShow={setOpenModal} title={t("submit-expense-request")}>
            <ExpenseFormModalSection expense={expense}/>
            <Divider/>
            <Box sx={{ justifyContent: "center", display: "flex", py: 1 }}>
                <Button
                    variant="contained"
                    endIcon={<SendIcon/>}
                    onClick={()=>{ 
                        if(isValidSecondSectionFields())
                            setOpenDisclaimer(true) 
                    }}
                    disabled={disabledButton}
                    sx={{ width: "25%" }}
                >
                    {t("submit")}
                </Button>
            </Box>
        </ModalComponent>
        <ReponsabilityAcceptanceDialog
            open={openDisclaimer}
            handleClose={()=>{
                setOpenDisclaimer(false)
            }}
            handleAcceptDisclamerAction={handleRegisterEAS}
        />
    </>;
};

export default CreateExpenseForm;