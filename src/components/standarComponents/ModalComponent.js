import { Modal, Box, Typography, Divider, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../../assets/styles/scrollbar.css';

const style = {
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "90%",
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        height: "100%",
        maxHeight: "520px",
        // overflowY: "hidden",
        px:1
    },
    content: {
        overflowY: "scroll",
        maxHeight: "450px",
        px: 2,
        py: 0
    }
};

const ModalHeader = ({ title, onClose  })=>{
    return <>
        <Box sx={{ display: "flex", justifyContent: "space-between", p:1 }}>
            <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
                { title }
            </Typography>
            <CloseIcon sx={{ cursor: "pointer", my:0.5 }} onClick={onClose}/>
        </Box>
        <Divider/>
    </>;
};

/* show need be a boolean */
export default function ModalComponent({ show, setShow, children, title }) {// @todo, incluir el titulo por parametro y dejar estandar junto con el icono X para cerrar la modal
  return (
    <div>
        <Modal
            open={show}
            onClose={()=>{ setShow(false) }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style.modal}>
                { title && <ModalHeader title={title} onClose={()=>setShow(false)}/> }
                <Box sx={style.content} className="scrollbar-style">
                    {children}
                </Box>
            </Box>
        </Modal>
    </div>
  );
}