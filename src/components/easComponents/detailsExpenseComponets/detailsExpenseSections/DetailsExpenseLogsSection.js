import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
    CardHeader,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    Skeleton
} from "@mui/material";
import { blhEasRequest } from '../../../../utils/request';


const Loading = ()=>{
    return <Stack sx={{ p:2 }}>
        <Skeleton variant="text" width={100} height={40}/>
        <Skeleton variant="rectangular" sx={{ width: "100%" }} height={100}/>
    </Stack>; 
};

const DetailsExpenseLogsSection = ({ expenseId })=>{
    const { t } = useTranslation();
    const { isPending, error, data } = useQuery({
        queryKey: [`expense-logs`],
        queryFn: ()=> blhEasRequest({ withToken: true })
            .get(`api/eas/${expenseId}/comment-list`)
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
                title={t("history")}
            />
            <CardContent>
                <TableContainer component={Paper}>
                    <Table aria-label="Simple Table" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell align="center">{t("status")}</TableCell>
                                <TableCell  sx={{ align:"center", maxWidth: 400 }} >{t("comment")}</TableCell>
                                <TableCell align="center">{t("date-and-time")}</TableCell>
                                <TableCell align="center">{t("author")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.data.commentsStatusLog.map((row, index)=>{
                                return row.eas_comment.map((comment, commentIndex)=>{
                                        const date = new Date(comment.create_at);
                                        return <TableRow key={commentIndex}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 },'word-break':'break-all' }}>
                                            <TableCell sx={{ textAlign: "center" }}>{row.id}</TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>{row.eas_status.name}</TableCell>
                                            <TableCell sx={{ textAlign: "center", maxWidth: 400 }}>{comment.comment}</TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>{`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}</TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>{(comment.user) ? `${comment.user.employee?.first_name} ${comment.user.employee?.surname}` : ` - `}</TableCell>
                                        </TableRow>
                                    });
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    </Box>;
};

export default DetailsExpenseLogsSection;