import { 
    AttachFile as AttachFileIcon,
    PictureAsPdf as PictureAsPdfIcon,
    Image as ImageIcon
} from '@mui/icons-material';

const mimeTypes = [
    {
        mimeType: "application/pdf",
        Icon: <PictureAsPdfIcon/>
    },
    {
        mimeType: "image/jpeg",
        Icon: <ImageIcon/>
    },
];

const IconFileSelected = ({mimeType})=>{
    const mimeTypeIcon = mimeTypes.find(m=>m.mimeType == mimeType);
    if(mimeTypeIcon){
        return mimeTypeIcon.Icon;
    }
    return <AttachFileIcon/>;
};

export default IconFileSelected;