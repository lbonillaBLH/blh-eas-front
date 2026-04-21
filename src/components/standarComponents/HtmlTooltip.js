import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      color: 'rgba(0, 0, 0, 0.87)',
      fontSize: theme.typography.pxToRem(12),
      padding: 0,
      boxShadow: `2px 4px 5px 0px ${(theme.palette.mode == "light") ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"}`
    }
}));

export default HtmlTooltip;