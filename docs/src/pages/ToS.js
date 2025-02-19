import React from 'react'
import { Box, Container, Typography, List, ListItem, Divider } from "@mui/material";
import SectionHeader from '../components/common/SectionHeader';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";


const ToS = () => {
  const dataCollected = [
    "Name, phone, email",
    "Joining date, title, business name, category, description, location, website",
    "Blood group, gender, spouse name, wedding anniversary, birthday, residential address",
    "Emergency contact (name, phone, relationship)",
    "Shirt size, t-shirt size, meal preference",
    "Payment details (amount, deadline, transaction ID if uploaded)"
  ]

  const dataUsage = [
    "The data collected will only be used for event management purposes.",
    "The data will not be sold, shared, or used for any commercial purpose.",
    "Users can contact others through the App using pre-defined redirect features (e.g., to email, call, or WhatsApp)."
  ]

  const featuresItinerary = [
    "Users can view the event itinerary uploaded by the admin.",
    "Users can submit feedback on events and view feedback from others."
  ]

  const featuresNetwork = [
    "Users can view information about other event participants.",
    "Users can contact others using the App’s redirection features (call, email, WhatsApp)."
  ]

  const featuresHome = [
    "Displays a message from the governor, notifications, and admin posts.",
    'Users can "cheer" admin posts by double-clicking on them.'
  ]

  const featuresProfileMain = [
    "Users can view and manage their own information.",
    'Payment-related functionality includes:'
  ]

  const featuresProfileSub = [
    "Viewing bank and UPI details of the organizers.",
    'Copying payment details or redirecting to the UPI app with the amount pre-filled.',
    "Users will see an alert reminding them to input their transaction ID after completing payments."
  ]

  const featuresTeam = [
    "Displays information about the organizing committee members."
  ]

  const adminRights = [
    "Admins are responsible for uploading and managing event data, posts, and itinerary elements.",
    "Admin decisions regarding data visibility and feature access are final."
  ]

  return (
    <Box>
      <SectionHeader title1={"Terms and Conditions"} title2={"“Royal Durbar” App (SELS 2025)"} subtitle={"Effective Date: 07th January, 2025"} />
      <Container maxWidth="lg" sx={{ mt: 5, mb: 4 }}>
        <Typography textAlign={"justify"}>
          Welcome to the SELS 2025 Mobile Application ("App"), developed by Tarun Gopinath under
          commission by the SELS 2025 (“event”) team on behalf of Rotary District 3234 ("we," "us,"
          or "our"). By using this App, you agree to the following terms and conditions. Please read
          them carefully.
        </Typography>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>1. Acceptance of Terms</Typography>
          <Typography textAlign={"justify"}>
            By accessing or using this App, you agree to be bound by these Terms and Conditions
            ("Terms"). If you do not agree to these Terms, you may not use the App.
          </Typography>
          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>2. Purpose of the App</Typography>
          <Typography textAlign={"justify"}>
            This App is intended to facilitate event management for SELS 2025 participants. Access is
            restricted to users who are already enrolled in the event and provided with predetermined
            credentials, obtained from teh google form circulated by “setsdurbar25@gmail.com”. The
            App is a closed environment and not available for public use.
          </Typography>

          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>3. Data Collection and Usage</Typography>

          <Box sx={{ my: 1 }}>
            <Typography variant='h6' gutterBottom>3.1 Data Collected</Typography>
            <Typography textAlign={"justify"}>
              The App displays only the information submitted by users via the Google Form filled during
              the event registration process. This includes:
            </Typography>
            <List>
              {dataCollected.map((item, index) => {
                return (
                  <ListItem sx={{ m: 0, p: 0 }} key={index}>
                    <FiberManualRecordIcon sx={{ mr: 1, fontSize: "10px" }} />
                    <Typography textAlign={"justify"}>{item}</Typography>
                  </ListItem>
                )
              }
              )}
            </List>

            <Typography textAlign={"justify"}>
              Certain sensitive information, such as payment transaction IDs, will not be displayed to other
              users except in the Profile Page where the respective user can view it.
            </Typography>
          </Box>

          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant='h6' gutterBottom>3.2 Usage of Data</Typography>
            <List>
              {dataUsage.map((item, index) => {
                return (
                  <ListItem sx={{ m: 0, p: 0 }} key={index}>
                    <FiberManualRecordIcon sx={{ mr: 1, fontSize: "10px" }} />
                    <Typography textAlign={"justify"}>{item}</Typography>
                  </ListItem>
                )
              }
              )}
            </List>
          </Box>
          <Box sx={{ my: 1 }}>
            <Typography variant='h6' gutterBottom>3.3 Data Security</Typography>
            <Typography textAlign={"justify"}>
              The App employs reasonable measures to protect user data from unauthorized access,
              disclosure, or misuse. However, the App is not responsible for security breaches that occur
              beyond its reasonable control.
            </Typography>
          </Box>
          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>4. User Responsibilities</Typography>
          <Box sx={{ my: 1 }}>
            <Typography variant='h6' gutterBottom>4.1 Credentials</Typography>
            <Typography textAlign={"justify"}>
              Users must maintain the confidentiality of their login credentials and are responsible for all
              activities conducted under their accounts.
            </Typography>
          </Box>

          <Box sx={{ my: 1 }}>
            <Typography variant='h6' gutterBottom>4.2 Appropriate Use</Typography>
            <Typography textAlign={"justify"}>
              Users agree not to use the App for unlawful purposes or in ways that disrupt its functionality,
              compromise its security, or infringe on the rights of others.
            </Typography>
          </Box>
          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>5. Features and Functionalities</Typography>
          <Box sx={{ my: 1 }}>
            <Typography variant='h6' gutterBottom>5.1 Itinerary Page</Typography>
            <List>
              {featuresItinerary.map((item, index) => {
                return (
                  <ListItem sx={{ m: 0, p: 0 }} key={index}>
                    <FiberManualRecordIcon sx={{ mr: 1, fontSize: "10px" }} />
                    <Typography textAlign={"justify"}>{item}</Typography>
                  </ListItem>
                )
              }
              )}
            </List>
          </Box>

          <Box sx={{ my: 1 }}>
            <Typography variant='h6' gutterBottom>5.2 Network Page</Typography>
            <List>
              {featuresNetwork.map((item, index) => {
                return (
                  <ListItem sx={{ m: 0, p: 0 }} key={index}>
                    <FiberManualRecordIcon sx={{ mr: 1, fontSize: "10px" }} />
                    <Typography textAlign={"justify"}>{item}</Typography>
                  </ListItem>
                )
              }
              )}
            </List>
          </Box>

          <Box sx={{ my: 1 }}>
            <Typography variant='h6' gutterBottom>5.3 Home Page</Typography>
            <List>
              {featuresHome.map((item, index) => {
                return (
                  <ListItem sx={{ m: 0, p: 0 }} key={index}>
                    <FiberManualRecordIcon sx={{ mr: 1, fontSize: "10px" }} />
                    <Typography textAlign={"justify"}>{item}</Typography>
                  </ListItem>
                )
              }
              )}
            </List>
          </Box>

          <Box sx={{ my: 1 }}>
            <Typography variant='h6' gutterBottom>5.4 Profile Page</Typography>
            <List sx={{ mb: 0, pb: 0 }}>
              {featuresProfileMain.map((item, index) => {
                return (
                  <ListItem sx={{ m: 0, p: 0 }} key={index}>
                    <FiberManualRecordIcon sx={{ mr: 1, fontSize: "10px" }} />
                    <Typography textAlign={"justify"}>{item}</Typography>
                  </ListItem>
                )
              }
              )}
            </List>

            <List sx={{ mt: 0, pt: 0 }}>
              {featuresProfileSub.map((item, index) => {
                return (
                  <ListItem sx={{ ml: 3, p: 0 }} key={index}>
                    <FiberManualRecordIcon sx={{ mr: 1, fontSize: "10px" }} />
                    <Typography textAlign={"justify"}>{item}</Typography>
                  </ListItem>
                )
              }
              )}
            </List>
          </Box>

          <Box sx={{ my: 1 }}>
            <Typography variant='h6' gutterBottom>5.5 SETS Team Page</Typography>
            <List>
              {featuresTeam.map((item, index) => {
                return (
                  <ListItem sx={{ m: 0, p: 0 }} key={index}>
                    <FiberManualRecordIcon sx={{ mr: 1, fontSize: "10px" }} />
                    <Typography textAlign={"justify"}>{item}</Typography>
                  </ListItem>
                )
              }
              )}
            </List>
          </Box>

          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>6. Admin Rights</Typography>
          <List>
            {adminRights.map((item, index) => {
              return (
                <ListItem sx={{ m: 0, p: 0 }} key={index}>
                  <FiberManualRecordIcon sx={{ mr: 1, fontSize: "10px" }} />
                  <Typography textAlign={"justify"}>{item}</Typography>
                </ListItem>
              )
            }
            )}
          </List>
          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>7. Third-Party Services</Typography>
          <Typography textAlign={"justify"}>
            The App may redirect users to third-party platforms (e.g., WhatsApp, UPI apps). The App is
            not responsible for the policies, content, or security of these external platforms.
          </Typography>

          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>8. Intellectual Property</Typography>
          <Typography textAlign={"justify"}>
            The App, including its design, content, and functionality, is the property of Rotary District
            3234 and its developers. Users may not reproduce, distribute, or modify any part of the App
            without prior permission.
          </Typography>

          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>9. Limitation of Liability</Typography>
          <Typography textAlign={"justify"}>
            The App is provided on an "as is" basis. Rotary District 3234 and its developers are not
            liable for any damages resulting from the use of the App, including data breaches,
            interruptions, or errors.
          </Typography>

          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>10. Termination</Typography>
          <Typography textAlign={"justify"}>
            Access to the App may be revoked at the discretion of the SELS 2025 team for any violation
            of these Terms or if deemed necessary for operational reasons.
          </Typography>

          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>11. Changes to the Terms</Typography>
          <Typography textAlign={"justify"}>
            These Terms may be updated periodically. Users will be notified of significant changes, and
            continued use of the App constitutes acceptance of the updated Terms.
          </Typography>

          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>12. Governing Law</Typography>
          <Typography textAlign={"justify"}>
            These Terms are governed by and construed in accordance with the laws of India. Any
            disputes arising from these Terms will be subject to the jurisdiction of courts in Chennai,
            Tamil Nadu.
          </Typography>

          <Divider sx={{ my: 3 }} />
        </Box>


        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>13. Contact Information</Typography>
          <Typography textAlign={"justify"}>
            If you have any questions about this Terms of Service or how your information is used, please
            contact:
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography fontWeight={700}>Tarun Gopinath</Typography>
            <Typography>Email: <a href="mailto:tarungopinath6@gmail.com">tarungopinath6@gmail.com</a> </Typography>
            <Typography gutterBottom>Phone: +91 73585 43242</Typography>

            <Typography fontWeight={700}>SELS 2025 Team</Typography>
            <Typography>Email: <a href="mailto:setsdurbar25@gmail.com">setsdurbar25@gmail.com</a> </Typography>
            <Typography>Phone: +91 98410 61758</Typography>
          </Box>

          <Divider sx={{ my: 3 }} />
        </Box>

        <Typography textAlign={"justify"} gutterBottom>
          By using the App, you acknowledge that you have read, understood, and agree to these
          Terms and Conditions.
        </Typography>
      </Container>
    </Box>
  )
}

export default ToS