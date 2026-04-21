import { useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { styled, useTheme } from '@mui/material/styles';
import { 
    Box,
    Drawer,
    CssBaseline,
    AppBar as MuiAppBar,
    Toolbar,
    Container,
    Tooltip,
    Avatar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Popover,
    Card,
    CardHeader,
    CardContent,
    MenuList,
    MenuItem
} from '@mui/material';
import { 
    Menu as MenuIcon,
    Brightness4 as Brightness4Icon,
    Brightness7 as Brightness7Icon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    List as ListIcon,
    GTranslate as GTranslateIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from "../../utils/browserStorage/browserStorage";
import { useTranslation } from "react-i18next";


const queryClient = new QueryClient();

const drawerWidth = 210;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
        ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'end',
}));

export default function AuthenticatedMenu() {
    const { t, i18n } = useTranslation();
    const userData = getLocalStorage("auth-user", true);
    const employeeContract = userData.employee.contract[0];
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [usedTheme, setUsedTheme] = useState(getLocalStorage("page-theme") ?? 'light');
    const navigate = useNavigate();
    const menuOptions = [
        {
            text: t("expenses-list"),
            Icon: <ListIcon sx={{ ml:1 }}/>,
            route: ""
        },
        {
            text: t("create-expense"),
            Icon: <AddCircleIcon sx={{ ml:1 }}/>,
            route: "create"
        },
        {
            text: t("report"),
            Icon: <AddCircleIcon sx={{ ml:1 }}/>,
            route: "report"
        }
    ];

    const selectedTheme = createTheme({
        palette: {
            mode: usedTheme,
        },
    });

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleChangeThemeColor = () =>{
        const newColor = (usedTheme == 'light') ? 'dark' : 'light';
        setLocalStorage("page-theme", newColor);
        setUsedTheme(newColor);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return <ThemeProvider theme={selectedTheme}>
        <Box sx={{ display: 'flex' }}>
            <CssBaseline/>
            <AppBar position="fixed" open={open}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ mr: 2, ...(open && { display: 'none' }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ flexGrow:1 }}>
                            <Typography 
                                variant="h6" 
                                noWrap 
                                component="div"
                                sx={{
                                    display: {md: 'flex'}
                                }}
                                >
                                {t("expense-approval-system-title-page")}
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title={t("settings")}>
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={`${userData.employee.first_name} ${userData.employee.surname}`} src={userData.picture} />
                                </IconButton>
                            </Tooltip>
                            <Popover 
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                                anchorEl={anchorElUser}
                            >
                                <Card>
                                    <CardHeader
                                        avatar={
                                            <Avatar 
                                                alt={`${userData.employee.first_name} ${userData.employee.surname}`} 
                                                src={userData.picture} 
                                                sx={{ width: 60, height: 60 }}
                                            />
                                        }
                                        title={
                                            <Typography variant="subtitle1">
                                                {`${userData.employee.first_name.trim()} ${userData.employee.surname.trim()}`}
                                            </Typography>
                                        }
                                        subheader={`${employeeContract.position.name}`}
                                        sx={{ pb:0 }}
                                    />
                                    <CardContent sx={{ width: 350, py: 0 }}>
                                        <MenuList>
                                            <MenuItem onClick={()=>{ i18n.changeLanguage((i18n.language == "en") ? "es" : "en") }}>
                                                <ListItemIcon>
                                                    <GTranslateIcon fontSize="small"/>
                                                </ListItemIcon>
                                                <ListItemText sx={{ textTransform: "capitalize" }}>{t("change-language")}</ListItemText>
                                                <Typography variant="body2" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                                                    {i18n.language}
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem onClick={handleChangeThemeColor}>
                                                <ListItemIcon>
                                                    {usedTheme === 'dark' ? <Brightness7Icon fontSize="small"/> : <Brightness4Icon fontSize="small"/>}
                                                </ListItemIcon>
                                                <ListItemText sx={{ textTransform: "capitalize" }}>{t("theme")}</ListItemText>
                                                <Typography variant="body2" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                                                    {usedTheme}
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem onClick={()=>{
                                                removeLocalStorage("auth-user");
                                                removeLocalStorage("auth-token");
                                                removeLocalStorage("paramsOfSearch");
                                                handleCloseUserMenu();
                                                navigate("/");
                                            }}>
                                                <ListItemIcon>
                                                    <LogoutIcon fontSize="small"/>
                                                </ListItemIcon>
                                                <ListItemText sx={{ textTransform: "capitalize" }}>{t("logout")}</ListItemText>
                                            </MenuItem>
                                        </MenuList>
                                    </CardContent>
                                </Card>
                            </Popover>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Drawer
                sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose} color="primary">
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider/>
                <List disablePadding>
                    {menuOptions.map((item, index) => (
                        <ListItem key={index} disablePadding onClick={()=>{ navigate(item.route) }}>
                            <ListItemButton>
                                <ListItemIcon sx={{ my: 0 }}>
                                    {item.Icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text}  sx={{ my: 0, mr:0 }}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider/>
            </Drawer>
            <Main open={open}>
                <DrawerHeader/>

                <QueryClientProvider client={queryClient}>
                    <Outlet/>
                </QueryClientProvider>
            </Main>
        </Box>
    </ThemeProvider>;
}