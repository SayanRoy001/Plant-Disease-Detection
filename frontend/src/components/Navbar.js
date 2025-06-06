import React from 'react'
import {AppBar,Toolbar,makeStyles,Button} from '@material-ui/core'
import { useNavigate } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor:"#00563B"
    },
   
    title: {
      flexGrow: 1,
      fontFamily: "'Poppins', sans-serif", 
      fontSize: "2.5rem", 
      fontWeight: "bold",
      color: "white",
    },
    button:{
        backgroundColor:"#00563B",
        color:"white",
        border:'none',
        padding: "8px 16px",
        marginRight:'15px',
        fontWeight: "bold",
        fontSize: "1rem",
        transition: "transform 0.3s ease, background-color 0.3s ease",
        "&:hover": {
      backgroundColor: "#009e60", // Lighter green on hover
      transform: "scale(1.1)", // Pop-up effect
       },
    }
  }));
const Navbar = ({setOpen}) => {
  const navigate=useNavigate()
 const handleAbout=()=>{
  navigate(`/about`);
 }  
    const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.root}>
         
          <Button className={classes.button} onClick={handleAbout}>About</Button>
        </Toolbar>
      </AppBar>
    </div>
  );

}

export default Navbar
