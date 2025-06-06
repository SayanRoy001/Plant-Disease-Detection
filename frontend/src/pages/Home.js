
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,makeStyles,Typography,LinearProgress,Box} from '@material-ui/core'
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Carousel from '../components/Carousel';
const useStyles=makeStyles(()=>({
  appContainer: {
    backgroundColor: "#d9f2d9",
    minHeight: "100vh",
    paddingBottom: "20px",
  },
  modalContent: {
    textAlign: "center",
    padding: "30px",
    backgroundColor: "#e6ffe6", 
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    "&:hover": {
      backgroundColor: "#388E3C",
    },
  },
  uploadLabel: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "inline-block",
    fontSize: "16px",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#388E3C",
    },
  },
  fileName: {
    marginTop: "10px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#2e7d32",
  },
  hiddenInput: {
    display: "none",
  },
  dialogPaper: {
    minWidth: "400px", 
    borderRadius: "12px",
    maxHeight: "90vh",  // Prevent overflowing height
    overflow: "hidden",
  },
  resultBox: {
   
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    
  },
  button:{
    backgroundColor:"#00563B",
    color:"white",
    border:'none',
    padding: "8px 16px",
    fontWeight: "bold",
    fontSize: "1rem",
    marginRight:'15px',
    "&:hover": {
      backgroundColor: "#009e60", 
       },
  }
}));

function Home() {
  const [open,setOpen]=useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  
  
  const [loading, setLoading] = useState(false);
  const classes=useStyles();
  const navigate=useNavigate();
    useEffect(()=>{
 if(!open){
  setSelectedFile(null);
  setPrediction(null);
 }
  },[open]);
  useEffect(()=>{
   console.log(prediction)
     },[prediction]);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const handleClose=()=>{
setOpen(false);
setSelectedFile(null);
setPrediction("");
  }
  const handleMore=()=>{
    console.log(prediction)
   navigate(`/diseaseinfo/${prediction}`);
   
  }
const handlePredict=()=>{
if(selectedFile){
  setLoading(true);
  const formData = new FormData();
  formData.append('image', selectedFile);
  fetch(`http://127.0.0.1:5000/predict`,{
    method:'POST',
    body:formData
  }).then(response=>response.json())
  .then(data=>{
    console.log("Received prediction:", data);
    setPrediction(data.prediction);
    setLoading(false)
  })
  .catch(error=>{
    console.error('Error during prediction:', error);
    setLoading(false);
  });

}
console.log(prediction)
}
  return (
    <div className={classes.appContainer}>
      <Navbar setOpen={setOpen}/>
      <Banner setOpen={setOpen} />
      
      <Dialog open={open} onClose={() => setOpen(false)} classes={{ paper: classes.dialogPaper }}>
        <DialogTitle style={{ backgroundColor: "#c8e6c9", textAlign: "center" }}>
          🌱 Upload an Image
        </DialogTitle>
        <DialogContent className={classes.modalContent}>
        {/* <label htmlFor="file-upload" className={classes.uploadLabel}>
            Choose an Image
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className={classes.hiddenInput}
            onChange={handleImageChange}
          /> */}
          
  {selectedFile ? (
    <img 
      src={URL.createObjectURL(selectedFile)} 
      alt="Selected" 
      style={{ 
        maxWidth: "100%", 
        maxHeight: "200px", 
        borderRadius: "10px", 
        marginBottom: "10px" 
      }} 
    />
  ) : (
    <label htmlFor="file-upload" className={classes.uploadLabel}>
      Choose an Image
    </label>
  )}
  
  <input
    id="file-upload"
    type="file"
    accept="image/*"
    className={classes.hiddenInput}
    onChange={handleImageChange}
  />

           {selectedFile && <div className={classes.fileName}>📂 {selectedFile.name}</div>}
          <br />
        
        </DialogContent>
        <DialogActions  style={{ 
  backgroundColor: "#c8e6c9", 
  flexDirection: "column",  // Force buttons and progress bar in a column
  alignItems: "center", 
  width: "100%" 
}}>
   
  <Box style={{display:'flex',gap:'2'}}>
  <Button  className={classes.button} onClick={handleClose}>Close</Button>
          <Button className={classes.button} onClick={handlePredict} >
            Predict
          </Button>
  </Box>
          
          {loading && (
  <div style={{ width: "100%", marginTop: "10px" }}>
    <LinearProgress style={{ backgroundColor: "#00563B" }} />
  </div>
)}
        </DialogActions>
        <DialogTitle style={{ backgroundColor: "#e6ffe6", textAlign: "center" }}>
        {prediction &&(
        <Box className={classes.resultBox}>
          <Typography style={{ marginTop: "20px",
    padding: "10px",
    
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#1B5E20",
    backgroundColor: "#c8e6c9"}}>🌿 Prediction: {prediction.replace(/_/g, " ").trim()}</Typography>
          <Button className={classes.button} style={{marginTop:'20px'}} onClick={handleMore}>Know More!</Button>
          </Box>
          )}
          </DialogTitle>
      </Dialog>
      <Carousel/>
    </div>
  );
}

export default Home;
