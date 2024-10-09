import React, { useState, useEffect } from "react";
import { db } from "./FirebaseConfig";
import { ref, get, update } from "firebase/database";
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
  Alert,
} from "@mui/material";
import LoginProfile from "./LoginProfile";

function App() {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [user, setUser] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [columns, setColumns] = useState([]);
  const [userSupportedCards, setUserSupportedCards] = useState(new Set()); // To track supported cards

  const modalStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: 3,
    boxShadow: 24,
    padding: 4,
  };

  // Fetch columns data from Firebase
  useEffect(() => {
    const fetchColumnsData = async () => {
      const columnsRef = ref(db); // Reference to the root of the Realtime Database
      try {
        const snapshot = await get(columnsRef);
        console.log(snapshot.val())
        if (snapshot.exists()) {
          setColumns(snapshot.val()); // Set the columns state with fetched data
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchColumnsData();
  }, []); // Run this effect once when the component is mounted

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

  // Handle successful login
  const handleLoginSuccess = (user) => {
    setUser(user); // Update the user state after successful login
    fetchUserSupportedCards(user.uid); // Fetch supported cards after login
  };

  // Fetch the list of cards the user has supported from Firebase
  const fetchUserSupportedCards = async (userId) => {
    const userRef = ref(db, `users/${userId}/supportedCards`);
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setUserSupportedCards(new Set(snapshot.val())); // Update supported cards state
      }
    } catch (error) {
      console.error("Error fetching supported cards: ", error);
    }
  };

  // Handle 'Destekle' button click inside modal
  const handleSupportClick = async (card) => {
    if (!user) {
      alert("Please log in first!");
      return;
    }
  
    // Ensure card has valid data
    if (!card || !card.columnIndex || card.cardIndex === undefined) {
      alert("Invalid card data!");
      return;
    }
  
    // Check if the user has already supported this card
    if (userSupportedCards.has(card?.uuid)) {
      alert("You have already supported this card!");
      return;
    }
  
    try {
      // Log the path to check the data location
      const cardPath = `columns/${card.columnIndex}/cards/${card.cardIndex}`;
      console.log("Fetching card at path:", cardPath);
  
      // Get a reference to the specific card in Firebase
      const cardRef = ref(db, cardPath);
      const snapshot = await get(cardRef);
  
      if (snapshot.exists()) {
        // Retrieve the current support count
        const currentSupportCount = snapshot.val().supportCount || 0;
  
        // Increment the support count in Firebase
        await update(cardRef, {
          supportCount: currentSupportCount + 1,
        });
  
        // Update the supported cards for the current user
        const userRef = ref(db, `users/${user.uid}/supportedCards`);
        await update(userRef, {
          [card.uuid]: true,
        });
  
        // Update the state locally
        setUserSupportedCards((prev) => new Set(prev).add(card.uuid));
        setAlertOpen(true); // Show success alert
        setOpenModal(false); // Close the modal if open
  
      } else {
        console.log("No data found at the specified path:", cardPath);
      }
    } catch (error) {
      console.error("Error updating support count: ", error);
      alert("An error occurred while processing your support. Please try again.");
    }
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
              <LoginProfile
                setUser={setUser}
                handleLoginSuccess={handleLoginSuccess}
                theme={theme}
              />
            </Box>
          </Grid>
        </Box>
      </AppBar>

      {/* Body */}
      <Container sx={{ marginTop: 2, maxWidth: "none !important" }}>
        <Grid container spacing={4}>
          {columns && Array.isArray(columns) && columns.map((column, index) => (
            <Grid item xs={12} md={3} key={index}>
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
                  {column.cards.map((card, cardIndex) => (
                    <Grid item xs={12} key={card.uuid}>
                      <Card
                        sx={{
                          boxShadow: 3,
                          borderRadius: 2,
                          position: "relative",
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
                              : "white",
                        }}
                      >
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
                          {card.lawyerImage && (
                            <Avatar
                              alt={card.lawyerName}
                              src={card.lawyerImage}
                              sx={{
                                width: 40,
                                height: 40,
                                border: "2px solid white",
                                marginRight: 1,
                              }}
                            />
                          )}
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
                          {card.supportCount !== undefined && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.secondary.main,
                                fontWeight: "bold",
                              }}
                            >
                              📢: {card.supportCount}
                            </Typography>
                          )}
                          <Typography variant="body2">{card.text}</Typography>
                          {card.sonuc && (
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: "bold",
                                color:
                                  card.status === "green" ? "green" : "red",
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
                            onClick={() => handleOpenModal(card)}
                          >
                            Detaylar
                          </Button>

                          {user &&
                          (column.title === "En Tazeler" ||
                            column.title === "Haftanın Enleri") ? (
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              sx={{
                                borderRadius: "15px",
                                textTransform: "capitalize",
                              }}
                              onClick={() => handleSupportClick({ ...card, columnIndex: index, cardIndex })}
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

      {/* Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ ...modalStyles, maxWidth: "700px" }}>
          {modalContent && (
            <>
              <Typography
                variant="h5"
                id="modal-title"
                sx={{ marginBottom: 2 }}
              >
                {modalContent.title}
              </Typography>
              <Typography
                variant="body2"
                id="modal-description"
                sx={{ marginBottom: 2 }}
              >
                {modalContent.text}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 2 }}>
                Support count: {modalContent.supportCount}
              </Typography>
            </>
          )}
        </Box>
      </Modal>

      {/* Alert */}
      {alertOpen && (
        <Alert
          severity="success"
          onClose={() => setAlertOpen(false)}
          sx={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Your support has been recorded successfully!
        </Alert>
      )}
    </Box>
  );
}

export default App;
