import { Box, Breadcrumbs as MUIBreadcrumbs, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme }) => {
    return {
        height: theme.spacing(3),
        textTransform: "capitalize"
    };
});

const Breadcrumbs = ({ items })=>{
    return <Box sx={{ mb:1 }}>
        <MUIBreadcrumbs>
            {items.map((item, index)=><StyledChip 
                key={index}
                icon={item.Icon}
                label={item.label}
                onClick={item.onClick}
                color={item.color}
            />)}
        </MUIBreadcrumbs>
    </Box>
};

export default Breadcrumbs;