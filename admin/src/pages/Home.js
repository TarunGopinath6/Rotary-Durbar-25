import React from 'react'
import { Container, Tabs, Tab, Typography } from "@mui/material"

import Nofications from '../components/Dashboard/Nofications';
import Posts from '../components/Dashboard/Posts';
import Itineraries from '../components/Dashboard/Itineraries';

const Home = () => {
  const [tabName, setTabName] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTabName(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ my: 3, py: 3}}>

      <Typography variant='h3' gutterBottom>Dashboard</Typography>

      <Tabs
        value={tabName}
        sx={{ my: 3}}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons={false}
        // aria-label="scrollable prevent tabs example"
      >
        <Tab label="Notifications"/>
        <Tab label="Post" />
        <Tab label="Itineraries" />
      </Tabs>

      {tabName === 0 && <Nofications />}
      {tabName === 1 && <Posts />}
      {tabName === 2 && <Itineraries />}

    </Container>
  )
}

export default Home