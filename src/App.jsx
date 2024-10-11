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
  const [sections, setSections] = useState([]); // Updated state name
  const [userSupportedCards, setUserSupportedCards] = useState(new Set());

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

  const columnOrder = {
    Sonuçlananlar: 1, // Add other sections here
    "En Tazeler": 2,
    "Haftanın Enleri": 3,

    "İşleme Alınanlar": 4,
  };

  const getColumnOrder = (title) => {
    return columnOrder[title] || Number.MAX_VALUE; // Use MAX_VALUE for unspecified sections
  };

  // Fetch sections data from Firebase
  useEffect(() => {
    const fetchColumnsData = async () => {
      const columnsRef = ref(db);
      try {
        const snapshot = await get(columnsRef);
        if (snapshot.exists()) {
          const fetchedSections = snapshot.val().sections;
          // Sort sections based on columnOrder
          const sortedSections = fetchedSections.sort((a, b) => {
            return getColumnOrder(a.title) - getColumnOrder(b.title);
          });
          setSections(sortedSections);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchColumnsData();
  }, []);

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
    setUser(user);
    fetchUserSupportedCards(user.uid);
  };

  // Fetch the list of cards the user has supported from Firebase
  const fetchUserSupportedCards = async (userId) => {
    const userRef = ref(db, `users/${userId}/supportedCards`);
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setUserSupportedCards(new Set(snapshot.val()));
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

    if (!card || !card.columnIndex || card.cardIndex === undefined) {
      alert("Invalid card data!");
      return;
    }

    if (userSupportedCards.has(card.uuid)) {
      alert("You have already supported this card!");
      return;
    }

    try {
      const cardPath = `sections/${card.columnIndex}/cards/${card.cardIndex}`; // Updated path
      const cardRef = ref(db, cardPath);
      const snapshot = await get(cardRef);

      if (snapshot.exists()) {
        const currentSupportCount = snapshot.val().supportCount || 0;
        await update(cardRef, {
          supportCount: currentSupportCount + 1,
        });

        const userRef = ref(db, `users/${user.uid}/supportedCards`);
        await update(userRef, {
          [card.uuid]: true,
        });

        setUserSupportedCards((prev) => new Set(prev).add(card.uuid));
        setAlertOpen(true);
        setOpenModal(false);
      } else {
        console.log("No data found at the specified path:", cardPath);
      }
    } catch (error) {
      console.error("Error updating support count: ", error);
      alert(
        "An error occurred while processing your support. Please try again."
      );
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
          {sections &&
            Array.isArray(sections) &&
            sections.map((section, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Box
                  sx={{
                    backgroundColor: section.bgColor,
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
                    {section.title}
                  </Typography>
                  <Grid container spacing={2}>
                    {section.cards &&
                      Array.isArray(section.cards) &&
                      section.cards.map((card, cardIndex) => (
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
                              <Typography variant="body2">
                                {card.text}
                              </Typography>
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
                            <CardActions
                              sx={{ justifyContent: "space-between" }}
                            >
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
                              (section.title === "En Tazeler" ||
                                section.title === "Haftanın Enleri") ? (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  sx={{
                                    borderRadius: "15px",
                                    textTransform: "capitalize",
                                  }}
                                  onClick={() =>
                                    handleSupportClick({
                                      ...card,
                                      columnIndex: index,
                                      cardIndex,
                                    })
                                  }
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
