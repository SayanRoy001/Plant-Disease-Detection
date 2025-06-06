

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/components/navigation/navigation.min.css";
import SwiperCore, { Navigation, Autoplay } from "swiper";
import axios from "axios";
import { Typography ,Box,CircularProgress} from "@material-ui/core";

// Install Swiper modules
SwiperCore.use([Navigation, Autoplay]);

const API_KEY = "sk-mrWl67e1927ba94389380";
const perenual_url = `https://perenual.com/api/pest-disease-list?key=${API_KEY}`;

const SwiperCarousel = () => {
  const [diseases, setDiseases] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await axios.get(perenual_url);
        console.log(response.data);
        setDiseases(response.data.data || []);
      } catch (error) {
        console.log("Error fetching diseases:", error);
      }
    };
    fetchDiseases();
  }, []);

  const handleClick = (disease) => {
    navigate(`/disease-info`, { state: { disease } });
  };

  return (
    <div style={{ width: "80%", margin: "auto", paddingTop: "20px" }}>
      {diseases.length > 0 ? (
        <Swiper
          spaceBetween={15}
          slidesPerView={3}
          navigation
          autoplay={{ delay: 1000, disableOnInteraction: false }}
          loop={true}
          pagination={false} 
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {diseases.map((disease) => {
            const imageUrl = decodeURIComponent(disease.images?.[0]?.medium_url || disease.images?.[0]?.small_url);

            return (
              <SwiperSlide key={disease.id} onClick={() => handleClick(disease)}>
                <div style={{ textAlign: "center", cursor: "pointer", padding: "10px" }}>
                  <img
                    src={imageUrl}
                    alt={disease.common_name}
                    style={{
                      width: "90%", // ⬅️ Reduced image size
                      height: "200px", // ⬅️ Reduced height
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                  <Typography variant="h6" style={{ fontSize: "16px", marginTop: "8px" }}>
                    {disease.common_name}
                  </Typography>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop:"5px"
            }}
          >
            <CircularProgress style={{ color: "#1B5E20" }} />
          </Box>
      )}
    </div>
  );
};

export default SwiperCarousel;






