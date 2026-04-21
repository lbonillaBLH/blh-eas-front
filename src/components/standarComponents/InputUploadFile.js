import { useState, memo, useId } from 'react';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { 
    Card,
    CardHeader,
    CardContent,
    Avatar,
    Typography,
    Box,
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip,
    Badge
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
    FileUpload as FileUploadIcon,
    ArrowDropDown as ArrowDropDownIcon,
    Close as CloseIcon,
    Message
} from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import '../../assets/styles/dropzone.css';
import IconFileSelected from './IconFileSelected';
import { getUrlViewFiel } from '../../utils/request/blhEasRequest';
import { indigo } from '@mui/material/colors';
import { toast } from 'react-toastify';

const UploadingComponent = memo(()=>{
    return <Box sx={{ width: '100%' }}>
        <LinearProgress/>
    </Box>;
});


  
  

const UploadedFiles = ({ filesMeta, onCancelFile })=>{
    const id = useId();
    const { t } = useTranslation();

    return <Accordion sx={{ mt:1 }}>
        <AccordionSummary
            expandIcon={<ArrowDropDownIcon/>}
            aria-controls={id}
            id={id}
        >
            <Typography sx={{ textTransform: "capitalize" }}>{`${filesMeta.length} ${t("uploaded-files")}`}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container spacing={2}>
                {filesMeta.map((fileMeta, index) => <>
                    <Grid xs={4} key={index}>
                        <Box key={"fileUploaded_"+index}>
                            <Badge
                                badgeContent={
                                    <Tooltip
                                        title={
                                            <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>{ t("cancel-file") }</Typography>
                                        } 
                                        placement="top"
                                    >
                                        <CloseIcon fontSize="small" sx={{ px:0, mx:0, cursor: "pointer" }} onClick={()=>onCancelFile(fileMeta.fileId)}/>
                                    </Tooltip>
                                }
                                color="error"
                                sx={{ width: "100%" }}
                            >
                                <Tooltip
                                    title={
                                        <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>{ t("view-file") }</Typography>
                                    }
                                    placement="top"
                                >
                                    <Card
                                        sx={{
                                            cursor: "pointer",
                                            width: "100%",
                                            transition: "all .3s linear",
                                            ':hover': {
                                                borderColor: indigo[400],
                                                boxShadow: 3
                                            },
                                            ':hover .MuiAvatar-root':{
                                                bgcolor: indigo[400]
                                            }
                                        }}
                                        onClick={()=>{
                                            toast.promise(
                                                getUrlViewFiel(fileMeta.fileId),
                                                {
                                                    pending: t("opening-file"),
                                                    error: t("it-is-not-possible-load-data"),
                                                }
                                            ).then(data=>{
                                                window.open(data.urlFile, "_blank");
                                            });
                                        }}
                                        variant="outlined"
                                    >
                                        <CardHeader
                                            avatar={
                                                <Avatar sx={{ transition: "all .3s linear" }}>
                                                    <IconFileSelected mimeType={fileMeta.type}/>
                                                </Avatar>
                                            }
                                            title={fileMeta.name}
                                            subheader={fileMeta.type}
                                        />
                                    </Card>
                                </Tooltip>
                            </Badge>
                        </Box>
                    </Grid>
                </>)}
            </Grid>
        </AccordionDetails>
    </Accordion>;
};

const InputUploadFiles = ({title, accept, uploadFiles, setUploadFiles})=>{
    const [uploading, setUploading] = useState(false);
    const [filesMeta, setFilesMeta] = useState([]);
    const [rejectedFile, setRejectedFile] = useState('')
    const [open, setOpen] = useState(true);
    const { t } = useTranslation();
    accept = (accept) ? accept : "application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.oasis.opendocument.spreadsheet,application/vnd.oasis.opendocument.text";//process.env.REACT_APP_DEFAULT_ALLOW_FILES_MIMETYPES;
    // specify upload params and url for your files
    const getUploadParams = ({ meta }) => { return { url: `${process.env.REACT_APP_BLH_EAS_API_BASE_URL}api/file/file-upload` } };


    // called every time a file's `status` changes
    const handleChangeStatus = ({ meta, file, xhr, remove}, status, name) => {
        console.log("STATUS:",status, "VARIABLE META:", meta, file);
        switch (status){
            case "done":
                const { Uploaded } = JSON.parse(xhr.response);
                setUploadFiles(Array.from([...uploadFiles, Uploaded[0].id]));
                meta.fileId = Uploaded[0].id;
                setFilesMeta(Array.from([...filesMeta, meta]));
                setUploading(false);
                remove();
                break;
            case "preparing":
                setUploading(true);
                break;
            case "error_file_size":
                
                let fileName = name[0].file.name;
                console.log("ERROR POR TAMAÑO DE ARCHIVO", fileName);
                setRejectedFile(`${fileName} ${t('validate-upload-file')}`);
                setUploading(false);
                remove();
                setOpen(true);
                break;           

                default:
                    console.log("INGRESO EN EL DEFAULT");
                 break
        }
    };
    return <Card variant="outlined" sx={{ width: "100%" }}>
        <CardHeader
            sx={{ py: 1 }}
            avatar={
                <Avatar arial-label="revipe">
                    <FileUploadIcon color="primary"/>
                </Avatar>
            }
            title={<Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{(title) ? title : t("upload-file")}</Typography>}
            
        />

        {  rejectedFile &&
            <Box sx={{ width: '95%' }}>
                <Collapse in={open}>
                    <Alert severity="warning" onClose={() => {
                        setOpen(false)
                    }}>
                      <b>{rejectedFile}</b> 
                    </Alert>
                </Collapse>
            </Box>
        }    
        <CardContent sx={{ py:1 }}>
            { uploading && <UploadingComponent/> }
            <Dropzone
                getUploadParams={getUploadParams}
                onChangeStatus={handleChangeStatus}
                accept={accept}
                maxSizeBytes="5000000"
                
            />
            <UploadedFiles
                filesMeta={filesMeta} 
                onCancelFile={(fileId)=>{
                    console.log(fileId, uploadFiles, filesMeta);
                    const fileIdIndex = uploadFiles.findIndex(f=>f==fileId);
                    const uploadedFilesArr = uploadFiles;
                    uploadedFilesArr.splice(fileIdIndex, 1);
                    const fileMetaIdIndex = filesMeta.findIndex(f=>f.fileId==fileId);
                    const filesMetaArr = filesMeta;
                    filesMetaArr.splice(fileMetaIdIndex, 1);
                    setUploadFiles(Array.from(uploadedFilesArr));
                    setUploadFiles(Array.from(filesMetaArr));
                }}
            />
        </CardContent>
    </Card>;
};

export default InputUploadFiles;