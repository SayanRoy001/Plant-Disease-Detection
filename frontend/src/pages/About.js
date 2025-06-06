import { CardContent,Card ,makeStyles} from '@material-ui/core';
import React from 'react';
const useStyles = makeStyles({
  card: {
    backgroundColor: "#F1F8E9",
    boxShadow: "0px 6px 15px rgba(0, 100, 0, 0.2)",
    borderRadius: "12px",
    padding: "16px",
    
  },
 
  content: {
    fontSize: "15px",
    fontFamily: "'Poppins', sans-serif",
    lineHeight: 1.6,
    color: "#333",
  },
});
const About = () => {
    const classes=useStyles();
  return (
    <Card className={classes.card}>
        <CardContent className={classes.CardContent}>
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>About Plant Disease Prediction System</h1>
      <p style={{ lineHeight: '1.6', color: '#34495e' }}>
        Agriculture plays a crucial role in sustaining life, and ensuring the health of crops is essential for food security. 
        The <strong>Plant Disease Prediction System</strong> is an advanced AI-powered platform designed to assist farmers, agriculturists, 
        and researchers in identifying plant diseases accurately and efficiently.
      </p>
      
      <h2 style={{ color: '#16a085' }}>How It Works</h2>
      <p>
        Our system leverages cutting-edge machine learning and computer vision techniques to analyze leaf images and 
        predict plant diseases with high accuracy. Users can simply upload an image of a plant leaf, and the system will process 
        it to detect any possible diseases.
      </p>
      
      <h2 style={{ color: '#16a085' }}>Key Features</h2>
      <ul style={{ lineHeight: '1.6' }}>
        <li><strong>Disease Prediction:</strong> Identifies plant diseases based on leaf images using deep learning models.</li>
        <li><strong>Detailed Disease Information:</strong> Provides comprehensive details about the predicted disease, including its symptoms, causes, and effects on the plant.</li>
        <li><strong>Treatment and Prevention Guide:</strong> Offers scientifically backed treatment plans and preventive measures to help mitigate and control the disease.</li>
        <li><strong>User-Friendly Interface:</strong> Designed for ease of use, making it accessible to farmers, researchers, and agricultural professionals.</li>
      </ul>
      
      <h2 style={{ color: '#16a085' }}>Benefits</h2>
      <ul style={{ lineHeight: '1.6' }}>
        <li><strong>Early Detection:</strong> Helps in identifying diseases at an early stage, reducing crop damage and losses.</li>
        <li><strong>Improved Yield:</strong> By addressing plant health issues promptly, farmers can maximize their crop yield.</li>
        <li><strong>Cost-Effective Solutions:</strong> Reduces the need for excessive pesticide use by providing precise treatment recommendations.</li>
        <li><strong>Data-Driven Insights:</strong> Empowers users with valuable information to make informed agricultural decisions.</li>
      </ul>
      
      <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#2980b9' }}>
        With the <strong>Plant Disease Prediction System</strong>, we aim to revolutionize the way plant health is monitored and managed, 
        contributing to a more sustainable and productive agricultural ecosystem.
      </p>
    </div>
    </CardContent>
    </Card>
    
  );
};

export default About;


