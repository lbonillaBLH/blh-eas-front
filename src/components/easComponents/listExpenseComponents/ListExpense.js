import { useState, memo, useReducer, useEffect, useId, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';

import { 
    Stack,
    Skeleton,
    Box,
    Paper,
    BottomNavigation,
    BottomNavigationAction,
    Fab,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
// import DataTable, { createTheme } from 'react-data-table-component';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import {
    Add as AddIcon,
    FormatListBulleted as FormatListBulletedIcon,
    Checklist as ChecklistIcon,
    AccountBox as AccountBoxIcon,
    ManageSearch as ManageSearchIcon
} from '@mui/icons-material';
import { purple } from '@mui/material/colors';
import { blhEasRequest } from '../../../utils/request';
import { getLocalStorage, setLocalStorage } from '../../../utils/browserStorage/browserStorage';
import DataTable from './tableComponents/DataTable';
import { GeneralFilter, DialogAdvanceFilter } from './tableComponents/DataFilters';


const getSearchTypeValues = () => {
    return {
        "all-expense": {
            key: "all-expense",
            url: "api/eas/list"
        },
        "pending-by-me": {
            key: "pending-by-me",
            url: `api/eas/list-pending-by/${getLocalStorage("auth-user", true).id}`
        },
        "requested-by-me": {
            key: "requested-by-me",
            url: `api/eas/list-registered-by/${getLocalStorage("auth-user", true).id}`
        },
        "advance-search": {
            key: "advance-search",
            url: "api/eas/list-with-filters"
        }
    }
};

const getEasList = async (selectPage, selectRowsPerPage, searchType, searchParams)=>{
    switch(searchType.key){
        case "advance-search":
            return await blhEasRequest({ withToken: true })
                .post(
                    searchType.url,
                    searchParams,
                    {
                        params: {
                            page: selectPage,
                            recordByPage: selectRowsPerPage,
                        }
                    }
                );
        default:
            return await blhEasRequest({ withToken: true })
                .get(searchType.url,{
                    params: {
                        page: selectPage,
                        recordByPage: selectRowsPerPage,
                        ...searchParams
                    }
                });
    }
};

const Loading = ()=>{
    return <Stack spacing={1}>
        <Skeleton variant="text" sx={{ width: "13%" }} height={15}/>
        <Box sx={{ display: "flex"}}>
            <Skeleton variant="rectangular" sx={{ width: "20%" }} height={30}/>
            <Skeleton variant="rounded" sx={{ width: "5%", mx:1 }} height={30}/>
        </Box>
        <Skeleton variant="rectangular" sx={{ width: "100%" }} height={200}/>
    </Stack>;
};

const FloatingAddNewButton = memo(()=>{
    const navigate = useNavigate();
    const { t } = useTranslation(); 
    return <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab size="small" variant="extended" color="primary" onClick={()=>navigate("create")} aria-label={t("create-expense")} sx={{ position: "fixed", bottom: 60, right: 0}}>
            <AddIcon/> <Typography variant="overline" sx={{ textTransform: "capitalize" }}>{t("create-expense")}</Typography>
        </Fab>
    </Box>;
});

const ListNavigation = memo(({ value, setValue })=>{
    const { t } = useTranslation();
    return <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
            showLabels
            value={value}
            onChange={ (event, newValue) => {
                ///Esta seccion de codigo tiene como sentido, setear cual es el origen 
                // de llamada de la busqueda para saber si blanquear el

                //removeLocalStorage("paramsOfSearch");
                let paramsOfSearch =  JSON.parse(getLocalStorage("paramsOfSearch"));
                paramsOfSearch.origin="navigateMenu";
                setLocalStorage("paramsOfSearch",JSON.stringify(paramsOfSearch));
                ///////
                setValue(newValue);
            }}
        >
            <BottomNavigationAction 
                label={t("all-expenses")}
                value="all-expense"
                icon={<FormatListBulletedIcon/>}
                sx={{ textTransform: "capitalize" }}
            />
            <BottomNavigationAction 
                label={t("pending-by-me")}
                value="pending-by-me"
                icon={<ChecklistIcon/>}
                sx={{ textTransform: "capitalize" }}
            />
            <BottomNavigationAction 
                label={t("requested-by-me")}
                value="requested-by-me"
                icon={<AccountBoxIcon/>}
                sx={{ textTransform: "capitalize" }}
            />
            <BottomNavigationAction 
                label={t("advance-search")}
                value="show-advance-search"
                icon={<ManageSearchIcon/>}
                sx={{ textTransform: "capitalize", color: purple[400] }}
            />
        </BottomNavigation>
    </Paper>
});

const ListExpense = ()=>{
    //debugger;
    let pageStorage = 0;
    let rowsPerPageStorage = 10;

    const initialSearchWord = (() => {
        const params = localStorage.getItem("paramsOfSearch");
        if (params) {
            const parsedParams = JSON.parse(params);
            if (parsedParams.origin === 'detail' && parsedParams.searchWord) {
                return parsedParams.searchWord; // Si existen datos, úsalos
            }
        }
        return {}; // Valor por defecto si no hay datos
    })();
    
    const initialSearchType = (() => {
        const params = localStorage.getItem("paramsOfSearch");
        if (params) {
            const parsedParams = JSON.parse(params);
            if (parsedParams.origin === 'detail' && parsedParams.searchType) {
                return parsedParams.searchType; // Si existen datos, úsalos
            }
        }
        return getSearchTypeValues()['all-expense']; // Valor por defecto
    })();

    if (localStorage.getItem("paramsOfSearch") != null){
        let paramsLocalStorageObject = JSON.parse(getLocalStorage("paramsOfSearch"));
        if(paramsLocalStorageObject.origin === 'detail'){                
            pageStorage = paramsLocalStorageObject.page;
            rowsPerPageStorage = paramsLocalStorageObject.rowsPerPage
        }
    }
    const [openAdvanceFilter, setOpenAdvanceFilter] = useState(false);
    const [page, setPage] = useState(pageStorage);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageStorage);

    let [searchWord, setSearchWord] = useReducer(
        (state, newVal) => {
            if (newVal.search === '') delete newVal.search;
            return { ...state, ...newVal };
        },
        initialSearchWord // Pasa la variable como estado inicial
    );
    
    const [searchType, setSearchType] = useReducer(
        (state, newVal) => {
            if (newVal === "show-advance-search") {
                setOpenAdvanceFilter(true);
                return state; // Mantén el estado actual
            }
            setPage(0); // Reinicia la paginación
            return getSearchTypeValues()[newVal] || getSearchTypeValues()['all-expense'];
        },
        initialSearchType // Pasa la variable como estado inicial
    );

    let noHasOrigin = false;
    if (localStorage.getItem("paramsOfSearch") == null){
        noHasOrigin = true;
    }
    let paramsLocalStorageObject = null;
    if (localStorage.getItem("paramsOfSearch")){
         paramsLocalStorageObject = JSON.parse(getLocalStorage("paramsOfSearch"));
        if(!paramsLocalStorageObject.hasOwnProperty("origin")){
            noHasOrigin = true;
        }
        if(paramsLocalStorageObject.hasOwnProperty("origin") && paramsLocalStorageObject.origin !== 'detail' ){
            noHasOrigin = true;
        }
    }
    if (noHasOrigin || (paramsLocalStorageObject!=null && searchType.key !== paramsLocalStorageObject.searchType.key )){

        if (paramsLocalStorageObject!=null && paramsLocalStorageObject.origin==="navigateMenu"){
            searchWord = {}
        }
        
        setLocalStorage("paramsOfSearch", JSON.stringify({
            origin:"",
            page: page,
            rowsPerPage: rowsPerPage,
            searchType: searchType,
            searchWord: searchWord
        }))
    }

    const queryDependencies = useMemo(() => [page, rowsPerPage, searchType, searchWord], [page, rowsPerPage, searchType, searchWord]);

    
    const { isPending, isLoading, isFetching, error, data } = useQuery({
        queryKey: ['expense-list', queryDependencies],
        queryFn: () => getEasList(page + 1, rowsPerPage === -1 ? "all" : rowsPerPage, searchType, searchWord),
        keepPreviousData: true
    });
    const handleChangePage = (event, newPage) => setPage(newPage);

    const handlePerRowsChange = ({ target }) => {
        setRowsPerPage(parseInt(target.value, 10));
        setPage(0);
    };

    if (isPending) return <Loading />;


    
    const list = data?.data?.list || [];
    const totalRows = data?.data?.count || 0;
    return (
        <>
            <Box sx={{ display: "flex" }}>
                {searchType.key !== "advance-search" && (
                    <GeneralFilter 
                        value={searchWord.search}
                        setValue={(val) => setSearchWord({search: (val) })}
                    />
                )}
                <DialogAdvanceFilter
                    open={openAdvanceFilter}
                    setOpen={setOpenAdvanceFilter}
                    onSetDataFilter={(values) => {
                        setSearchType('advance-search');
                        setSearchWord({ search: '', ...values });
                        setOpenAdvanceFilter(false);
                    }}
                />
            </Box>
            <DataTable
                rows={list}
                totalRows={totalRows || list.length}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={handlePerRowsChange}
                page={page}
                setPage={handleChangePage}
            />
            <ListNavigation
                value={searchType.key}
                setValue={setSearchType}
            />
            <FloatingAddNewButton />
        </>
    );
};

export default ListExpense;