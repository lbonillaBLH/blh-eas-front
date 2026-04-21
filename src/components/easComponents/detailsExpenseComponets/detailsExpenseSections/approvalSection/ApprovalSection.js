import { memo } from "react";
import ApprovalButtons from "./ApprovalButtons";
import UploadProofButton from "./UploadProofButton.js";
import TreasurerSection from "./TreasurerSection";

const ApprovalSection = memo(({ expense, commentId, uploadFiles, comeFrom })=>{
    const attributes = {
        expenseId: expense.expense_id,
        commentId: commentId,
        uploadFiles: uploadFiles,
        comeFrom:comeFrom
    };
    switch(expense.status_code){//@todo, parametrizar valores
        case "PBAC":
            return <ApprovalButtons {...attributes}/>;
        case "RFLOD":
            return <UploadProofButton {...attributes}/>;
        case "PRBT":
            return <TreasurerSection {...attributes} countryPaidId={expense.country_id} amountRequired={expense.amount} currencyRequired={expense.currency_name}/>;
        default:
            return <></>;
    };                  
});

export default ApprovalSection;