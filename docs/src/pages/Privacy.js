import React from 'react'
import { Box, Container, Typography, List, ListItem, Divider } from "@mui/material";
import SectionHeader from '../components/common/SectionHeader';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";


const Privacy = () => {

  const infoItinerary = [
    "Feedback provided by users.",
    "Feedback visibility among users.",
  ]

  const infoNetwork = [
    "Name, phone number, email, joining date, title, business details (name, category, description, location, and website), blood group, gender, spouse name, wedding anniversary, birthday, residential address, emergency contact details, shirt size, T-shirt size, and meal preference.",
    "Note: Payment transaction IDs are excluded from view on this page.",
  ]

  const infoHome = [
    "Messages from the Governor.",
    "Notifications.",
    'Admin-posted content (with a "cheer" option).',
  ]

  const infoProfile = [
    "All user details visible to others on the Network Page.",
    "Payment details (amount, deadline, transaction ID if uploaded).",
    "Organizers' bank details and UPI details for payments, including redirect options for UPI apps and alert messages for transaction ID completion."
  ]

  const infoSETS = [
    "Information about committee members, similar to the Network Page layout."
  ]

  const usageInfo = [
    "Display itinerary details.",
    "Allow user feedback submissions and visibility.",
    "Enable networking among event attendees.",
    "Facilitate communication and payment processes.",
    "Share messages, notifications, and posts from event organizers.",
  ]

  const userRights = [
    "Access the data displayed within the App.",
    "Update your transaction ID via the Profile Page.",
    "Request the deletion of your account and associated data by contacting the event organizers."
  ]

  return (
    <Box>
      <SectionHeader title1={"Privacy Policy"} title2={"“Royal Durbar” App (SELS 2025)"} subtitle={"Effective Date: 07th January, 2025"} />
      <Container maxWidth="lg" sx={{ mt: 5, mb: 4 }}>
        <Typography textAlign={"justify"} gutterBottom>
          This Privacy Policy describes how the mobile application ("App") developed by Tarun
          Gopinath, commissioned by the SELS 2025 (“event”) team on behalf of Rotary District 3234
          ("we," "us," or "our"), collects, uses, and protects your information. This App is designed
          exclusively for managing an event and is accessible only to users who are pre-enrolled in
          the event using predetermined credentials.
        </Typography>

        <Typography>
          By using the App, you agree to the collection and use of information in accordance with this
          Privacy Policy. If you do not agree with this policy, please refrain from using the App.
        </Typography>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>1. Information We Collect</Typography>
          <Typography textAlign={"justify"}>
            The App does not collect any additional device data beyond what you input in the provided
            fields or what was already collected through the Google Form circulated by
            “setsdurbar25@gmail.com”. The data displayed and utilized within the App includes:
          </Typography>

          <Box sx={{ my: 1 }}>
            <Typography variant='h6' >Itinerary Page:</Typography>
            <List>
              {infoItinerary.map((item, index) => {
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
            <Typography variant='h6' >Network Page:</Typography>
            <List>
              {infoNetwork.map((item, index) => {
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
            <Typography variant='h6' >Home Page:</Typography>
            <List>
              {infoHome.map((item, index) => {
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
            <Typography variant='h6' >Profile Page:</Typography>
            <List>
              {infoProfile.map((item, index) => {
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
            <Typography variant='h6' >SETS Team Page:</Typography>
            <List>
              {infoSETS.map((item, index) => {
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
          <Typography variant='h5' gutterBottom fontWeight={700}>2. How We Use Your Information</Typography>
          <Typography textAlign={"justify"}>
            We use your information solely for the purpose of facilitating event management.
            Specifically, your data is used to:
          </Typography>

          <List>
            {usageInfo.map((item, index) => {
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
            We do not use your data for any commercial purpose, marketing, or advertisement, nor do
            we sell or share your data with third parties.
          </Typography>

          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>3. Data Sharing</Typography>
          <Typography textAlign={"justify"}>
            Your data is shared only within the closed user group of the App for event-related purposes.
            No data will be disclosed to any external party without your explicit consent, except as
            required by law.
          </Typography>

          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>4. Data Security</Typography>
          <Typography textAlign={"justify"}>
            We prioritize the security of your personal data. Measures are in place to prevent
            unauthorized access, alteration, or disclosure. However, please note that no method of
            electronic transmission or storage is completely secure, and we cannot guarantee absolute
            data security.
          </Typography>

          <Divider sx={{ my: 3 }} />
        </Box>


        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>5. User Rights</Typography>
          <Typography textAlign={"justify"}>
            As a user, you have the right to:
          </Typography>

          <List>
            {userRights.map((item, index) => {
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
          <Typography variant='h5' gutterBottom fontWeight={700}>6. Third-Party Links</Typography>
          <Typography textAlign={"justify"}>
            The App may redirect you to third-party applications such as UPI payment apps, WhatsApp,
            email, or phone. Please note that these third-party platforms have their own privacy
            policies, and we are not responsible for their practices.
          </Typography>

          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>7. Cookies and Tracking</Typography>
          <Typography textAlign={"justify"}>
            This App does not use cookies or other tracking technologies.
          </Typography>

          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>8. Children's Privacy</Typography>
          <Typography textAlign={"justify"}>
            The App is not intended for individuals under the age of 18 without parental consent. By
            using the App, you confirm that you are at least 18 years old or have obtained parental
            consent.
          </Typography>

          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>9. Changes to This Privacy Policy</Typography>
          <Typography textAlign={"justify"}>
            We may update this Privacy Policy from time to time. Any changes will be communicated
            through the App or via email. Your continued use of the App after changes are made
            constitutes acceptance of the updated policy.
          </Typography>

          <Divider sx={{ my: 3 }} />
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>10. Limitation of Liability</Typography>
          <Typography textAlign={"justify"}>
            The App is provided on an "as is" basis. Rotary District 3234 and its developers are not liable for
            any damages resulting from the use of the App, including data breaches, interruptions, or errors.
          </Typography>

          <Divider sx={{ my: 3 }} />
        </Box>




        <Box sx={{ my: 3 }}>
          <Typography variant='h5' gutterBottom fontWeight={700}>13. Contact Information</Typography>
          <Typography textAlign={"justify"}>
            If you have any questions about this Privacy Policy or how your information is used, please
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
          By using this App, you acknowledge that you have read and understood this Privacy Policy
          and agree to its terms.
        </Typography>
      </Container>
    </Box>
  )
}

export default Privacy