import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Modal,
  Avatar,
  useTheme,
} from "@mui/material";
import GoogleLogin from "./GoogleLogin";
import LoginProfile from "./LoginProfile";

// Sütun verileri
const columns = [
  {
    title: "Sonuçlananlar",
    bgColor: "#FFEBEE",
    cards: [
      {
        image: "https://via.placeholder.com/150",
        title: "Kart 7",
        text: "Bu kartın durumu olumlu.",
        status: "green", // green or red
        lawyerName: "Avukat A", // Lawyer's name
        lawyerImage: "https://via.placeholder.com/50", // Lawyer's image (Avatar)
        sonuc: "Başarıyla sonuçlandı", // Sonuç field
      },
      {
        image: "https://via.placeholder.com/150",
        title: "Kart 8",
        text: "Bu kartın durumu olumsuz.",
        status: "red", // green or red
        lawyerName: "Avukat B", // Lawyer's name
        lawyerImage: "https://via.placeholder.com/50", // Lawyer's image (Avatar)
        sonuc: "Olumsuz sonuçlandı", // Sonuç field
      },
    ],
  },
  {
    title: "İşleme Alınanlar",
    bgColor: "#D7CCC8",
    cards: [
      {
        image: "https://via.placeholder.com/300x150",
        title: "Kart 1",
        text: "Kart 1 içeriği burada olacak.",
        lawyerName: "Avukat C", // Lawyer's name
        lawyerImage: "https://via.placeholder.com/50", // Lawyer's image (Avatar)
      },
      {
        image: "https://via.placeholder.com/200x150",
        title: "Kart 2",
        text: "Kart 2 içeriği burada olacak.",
        lawyerName: "Avukat D", // Lawyer's name
        lawyerImage: "https://via.placeholder.com/50", // Lawyer's image (Avatar)
      },
    ],
  },
  {
    title: "Haftanın Enleri",
    bgColor: "#BCAAA4",
    cards: [
      {
        image: "https://via.placeholder.com/400x150",
        title: "Kart 3",
        text: "Kart 3 içeriği burada olacak.",
      },
      {
        image: "https://via.placeholder.com/100x150",
        title: "Kart 4",
        text: "Kart 4 içeriği burada olacak.",
      },
    ],
  },
  {
    title: "En Tazeler",
    bgColor: "#8D6E63",
    cards: [
      {
        image: "https://via.placeholder.com/150",
        title: "Kart 5",
        text: "Kart 5 içeriği burada olacak.",
      },
      {
        image: "https://via.placeholder.com/150",
        title: "Kart 6",
        text: "Kart 6 içeriği burada olacak.",
      },
    ],
  },
];

function App() {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [user, setUser] = useState(null);

  // Handle opening the modal with card details
  const handleOpenModal = (card) => {
    setModalContent(card);
    setOpenModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setModalContent(null);
  };
  
  const handleLoginSuccess = (user) => {
    setUser(user);  // Update the user state after successful login
  };

  return (
    <Box>
      {/* Header */}
      <AppBar
        position="static"
        sx={{ backgroundColor: theme.palette.primary.main, boxShadow: 6 }}
      >
        <Box sx={{ padding: 2 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography
              variant="h5"
              sx={{ color: theme.palette.common.white, fontWeight: "bold" }}
            >
              Türkiye Yeni Nesil Adalet Sistemi
            </Typography>
            <Box>
              <LoginProfile setUser={setUser} handleLoginSuccess={handleLoginSuccess} theme={theme} />
            </Box>
          </Grid>
        </Box>
      </AppBar>

      {/* Body */}
      <Container sx={{ marginTop: 2, maxWidth: "none !important" }}>
        <Grid container spacing={4}>
          {columns.map((column, index) => (
            <Grid item xs={12} md={3} key={index}>
              {/* Changed md={4} to md={3 */}
              <Box
                sx={{
                  backgroundColor: column.bgColor,
                  padding: 4,
                  borderRadius: 3,
                  boxShadow: 4,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: 12,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                    marginBottom: 2,
                  }}
                >
                  {column.title}
                </Typography>
                <Grid container spacing={2}>
                  {column.cards.map((card, idx) => (
                    <Grid item xs={12} key={idx}>
                      <Card
                        sx={{
                          boxShadow: 3,
                          borderRadius: 2,
                          position: "relative", // Make card relative to position avatar absolutely
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: 8,
                          },
                          backgroundColor:
                            card.status === "green"
                              ? "#c8e6c9"
                              : card.status === "red"
                              ? "#ffcdd2"
                              : "white", // Apply green/red background
                        }}
                      >
                        {/* Container for Avatar and Lawyer Name */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            position: "absolute",
                            top: 10,
                            left: 10,
                          }}
                        >
                          {/* Lawyer's Avatar */}
                          {card.lawyerImage && (
                            <Avatar
                              alt={card.lawyerName}
                              src={card.lawyerImage}
                              sx={{
                                width: 40,
                                height: 40,
                                border: "2px solid white", // Optional: Add border to Avatar
                                marginRight: 1,
                              }}
                            />
                          )}
                          {/* Lawyer's Name */}
                          {card.lawyerName && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.primary.main,
                                fontWeight: "bold",
                              }}
                            >
                              {card.lawyerName}
                            </Typography>
                          )}
                        </Box>

                        <CardMedia
                          component="img"
                          height="140"
                          image={card.image}
                          alt={card.title}
                        />
                        <CardContent>
                          <Typography variant="h6">{card.title}</Typography>
                          <Typography variant="body2">{card.text}</Typography>
                          {card.sonuc && (
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "bold",
                                color: card.status === "green" ? "green" : "red",
                              }}
                            >
                              {card.sonuc}
                            </Typography>
                          )}
                        </CardContent>
                        <CardActions sx={{ justifyContent: "space-between" }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{
                              borderRadius: "15px",
                              textTransform: "capitalize",
                            }}
                            onClick={() => handleOpenModal(card)} // Open modal with card details
                          >
                            Detaylar
                          </Button>

                          {/* Conditionally render 'Destekle' button only when logged in */}
                          {user && (column.title === "En Tazeler" || column.title === "Haftanın Enleri") ? (
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              sx={{
                                borderRadius: "15px",
                                textTransform: "capitalize",
                              }}
                            >
                              Destekle
                            </Button>
                          ) : null}
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Modal for displaying card details */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {modalContent && (
            <>
              <Typography variant="h6">{modalContent.title}</Typography>
              <Typography variant="body2">{modalContent.text}</Typography>
              <Typography variant="body2">{modalContent.sonuc}</Typography>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default App;
