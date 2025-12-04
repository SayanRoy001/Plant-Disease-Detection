import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography ,Box,Card,CardContent,Grid,makeStyles, CircularProgress} from "@material-ui/core";
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
  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';
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
    if(!prediction) return;
    console.log(prediction)
    const cleanPrediction = prediction.replace(/_/g, " ").trim();
    setFormattedPrediction(cleanPrediction); // Update formatted prediction

    fetch(`${API_BASE}/diseaseinfo?prediction=${encodeURIComponent(cleanPrediction)}`, {
      method: "GET",
    }).then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch disease details");
        }
        return response.json();
      })
      .then(data => {
        // Check if the response contains an error message (like quota exceeded)
        if (data.info && (data.info.includes("Error:") || data.info.includes("429"))) {
             setDiseaseInfo({ "⚠️ Service Busy": "We are experiencing high traffic with our AI service. Please wait a minute and try again." });
             setLoading(false);
             return;
        }

        const extracted=extractSections(data.info || "");
        // Fallback: if extraction yields nothing, show the raw text
        if (!extracted || Object.keys(extracted).length === 0) {
          setDiseaseInfo({ "Details": data.info || "No details available." });
        } else {
          setDiseaseInfo(extracted);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching disease details:", error);
        setDiseaseInfo({ "Error": "Could not load disease details. Please try again." });
        setLoading(false);
      });
  }, [prediction, API_BASE]); 

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

  // If nothing to show after loading, render a simple message
  if (!loading && (!diseaseInfo || Object.keys(diseaseInfo).length === 0)) {
    return (
      <Box style={{marginTop:"12px"}}>
        <Typography variant="h6" style={{ textAlign: "center", color: "#2E7D32" }}>
          No disease details available.
        </Typography>
      </Box>
    );
  }

  return (
   <Box style={{marginTop:"4px",display: "flex", flexDirection: "column" }}>
    <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#2E7D32", textAlign: "center",marginBottom:"30px" }}>
        {formattedPrediction} disease information
      </Typography>
     <Grid container spacing={3} justifyContent="center">
        {diseaseInfo && Object.entries(diseaseInfo).map(([title, content], index) => (
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
