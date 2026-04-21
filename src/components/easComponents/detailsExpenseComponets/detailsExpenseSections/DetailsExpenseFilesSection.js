import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
    CardHeader,
    Box,
    Avatar,
    Stack,
    Skeleton
} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { purple } from '@mui/material/colors';
import blhEasRequest, { getUrlViewFiel } from '../../../../utils/request/blhEasRequest';
import IconFileSelected from "../../../standarComponents/IconFileSelected";

const Loading = ()=>{
    return <Stack sx={{ p:2 }}>
        <Skeleton variant="text" width={80} height={40}/>
        <Stack spacing={2} direction="row">
            <Skeleton variant="rectangular" sx={{ width: "33%" }} height={60}/>
            <Skeleton variant="rectangular" sx={{ width: "33%" }} height={60}/>
        </Stack>
    </Stack>; 
};

const DetailsExpenseFilesSection = ({ expenseId })=>{
    const { t } = useTranslation();
    const { isPending, error, data } = useQuery({
        queryKey: [`expense-files`],
        queryFn: ()=> blhEasRequest({ withToken: true })
            .get(`api/eas/${expenseId}/file-list`)
            .then(resposne =>{
                return resposne;
            })
    });

    if (isPending){
        return <Loading/>;
    }

    return <Box>
        <Card variant="outline">
            <CardHeader
                title={t("files")}
            />
            <CardContent>
                <Grid container spacing={2}>
                    {data.data.list.map((file, index)=>{
                        return <Grid xs={4} key={index}>
                            <Card sx={{ cursor: 'pointer' }} onClick={()=>{
                                getUrlViewFiel(file.file_id).then(data=>{
                                    window.open(data.urlFile, "_blank");
                                });
                            }}>
                                <CardHeader
                                    avatar={
                                        <Avatar sx={{ bgcolor: purple[500] }} aria-label="recipe">
                                            <IconFileSelected mimeType={file.file.format}/>
                                        </Avatar>
                                    }
                                    title={file.file.original_name}
                                    subheader={file.file.format}
                                />
                            </Card>
                        </Grid>;
                    })}
                </Grid>
            </CardContent>
        </Card>
    </Box>;
};

export default DetailsExpenseFilesSection;