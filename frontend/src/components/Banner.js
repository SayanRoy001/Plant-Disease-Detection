import React from 'react'
import { makeStyles ,Typography,Button} from '@material-ui/core';
const useStyles=makeStyles(()=>({
banner:{
    backgroundImage:"url('/Plant.png')",
    backgroundSize:'100% 100%',
  backgroundRepeat: "no-repeat",
  height: "80vh", 
  width:'100vw',
  display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    flexDirection:'column',
    position:"relative"
},
title: {
    color: "white",  
    textShadow: "3px 3px 5px rgba(0, 77, 37, 1)", /* Deep green shadow */
    fontWeight: "bold",
    borderRadius: "10px",
    fontSize: "2.5rem",
    fontWeight: "bold",
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: "2px",
    position: "absolute",
    top: "10%", // Move title to the top
    left: "28%",
  },
  button:{
    backgroundColor:"#00563B",
    color:"white",
    border:'none',
    padding: "16px 16px",
    marginRight:'15px',
    fontWeight: "bold",
    fontSize: "1.5rem",
    transition: "transform 0.3s ease, background-color 0.3s ease",
    "&:hover": {
  backgroundColor: "#009e60", // Lighter green on hover
  transform: "scale(1.1)", // Pop-up effect
   },
}
}));
const Banner = ({setOpen}) => {
    const classes=useStyles();
  return (
    <div className={classes.banner}>
      <Typography variant="h3" className={classes.title}>
        🌿 PLANT DISEASE PREDICTION 🌿
      </Typography>
      <Button className={classes.button}  onClick={()=>setOpen(true)}>Predict Disease</Button>
    </div>
  )
}

export default Banner
