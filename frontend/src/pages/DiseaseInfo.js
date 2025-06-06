import React from "react";
import { useLocation } from "react-router-dom";
import { Typography, Card, CardContent, Container, Grid ,makeStyles} from "@material-ui/core";
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
const DiseaseInfo = () => {
   const classes=useStyles()
  const location = useLocation();
  const { disease } = location.state || {};

  if (!disease) {
    return <Typography variant="h5" align="center">No Disease Data Available</Typography>;
  }

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      {/* Disease Title */}
       <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#2E7D32", textAlign: "center",marginBottom:"30px" }}>
              {disease.common_name||"Unknown disease"}
            </Typography>

      <Grid container spacing={3} justifyContent="center">
  {/* Description Section */}
  {disease.description && disease.description.map((desc, index) => (
    <Grid item xs={12} sm={6} key={`desc-${index}`}>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            {desc.subtitle}
          </Typography>
          <Typography variant="body1" className={classes.content}>
            {desc.description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}

  {/* Solution Section */}
  {disease.solution && disease.solution.map((sol, index) => (
    <Grid item xs={12} sm={6} key={`sol-${index}`}>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            {sol.subtitle}
          </Typography>
          <Typography variant="body1" className={classes.content} style={{ whiteSpace: "pre-line" }}>
            {sol.description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>
    </Container>
  );
};

export default DiseaseInfo;

