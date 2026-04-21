import { toast } from 'react-toastify';

const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
};

const isValidCommentFields = (t, commentId)=>{
    let invalidCount = 0;
    if(document.getElementById(commentId).value.trim().length == 0){
        showToastWarn(`${t("comment")} ${t("is-required")}`, invalidCount++);
    }
    return invalidCount == 0;
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

export { toastOptions, isValidCommentFields, showToastWarn };