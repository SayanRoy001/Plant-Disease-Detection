import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography ,Box,Card,CardContent,Grid,makeStyles, CircularProgress} from "@material-ui/core";
const useStyles = makeStyles({
  card: {
    backgroundColor: "#F1F8E9",
    boxShadow: "0px 6px 15px rgba(0, 100, 0, 0.2)",
    borderRadius: "12px",
    padding: "16px",
    transition: "transform 0.3s ease-in-out",
    "&:hover": { transform: "scale(1.05)" }, 
  },
  title: {
    fontWeight: "bold",
    fontFamily: "'Poppins', sans-serif",
    color: "#2E7D32",
    marginBottom:"10px"
  },
  content: {
    fontSize: "15px",
    fontFamily: "'Poppins', sans-serif",
    lineHeight: 1.6,
    color: "#333",
  },
});
const Info = () => {
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [formattedPrediction, setFormattedPrediction] = useState("");
  const [loading,setLoading]=useState(true);
  const { prediction } = useParams();
   const classes=useStyles();
  const extractSections = (text) => {
    text = text.replace(/\*\s*/g, "").trim();
    const regex = /(What it is:|Causes:|Symptoms:|Effects[\w\s]*?:|Treatment Plan:|Prevention Methods:)[\s\S]*?(?=(What it is:|Causes:|Symptoms:|Effects[\w\s]*?:|Treatment Plan:|Prevention Methods:|$))/g;

    const matches = [...text.matchAll(regex)];

    const sectionData = {};
    matches.forEach((match) => {
      const key = match[1].replace(":", "").trim();
      sectionData[key] = match[0].replace(match[1], "").trim();
    });
    console.log(sectionData);
    return sectionData;
  };
  useEffect(() => {
    if(!prediction)
    console.log(prediction)
    const cleanPrediction = prediction.replace(/_/g, " ").trim();
    setFormattedPrediction(cleanPrediction); // Update formatted prediction

    fetch(`http://127.0.0.1:5000/diseaseinfo?prediction=${cleanPrediction}`, {
      method: "GET",
    }).then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch disease details");
        }
        return response.json();
      })
      .then(data => {
        const extracted=extractSections(data.info)
        setDiseaseInfo(extracted);
        console.log(diseaseInfo)
        setLoading(false)
      })
      .catch(error => {
        console.error("Error fetching disease details:", error);
      });
  }, [prediction]); 

  if(loading)
    return (<Box
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop:"5px"
  }}
>
  <CircularProgress style={{ color: "#1B5E20" }} />
</Box>)

  return (
   <Box style={{marginTop:"4px",display: "flex", flexDirection: "column" }}>
    <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#2E7D32", textAlign: "center",marginBottom:"30px" }}>
        {formattedPrediction} disease information
      </Typography>
     <Grid container spacing={3} justifyContent="center">
        {Object.entries(diseaseInfo).map(([title, content], index) => (
          <Grid item xs={12} sm={6} key={index}> 
            <Card
              className={classes.card}
            >
              <CardContent style={{ padding: 3 }}>
                <Typography variant="h6" className={classes.title}>
                  {title}
                </Typography>
                <Typography variant="body1" classname={classes.content}>
                  {content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
   </Box>
  );
};

export default Info;
