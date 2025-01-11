import React, { useState, useEffect } from 'react'
import { Box, Button, ButtonGroup, Card, CardContent, Typography, IconButton, Modal, TextField } from '@mui/material'
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import supabase from "../../API/supabase";
import { v4 as uuidv4 } from "uuid";
import { fetchDataAndExport } from '../../utils/Download';


function SimpleModal({ open, onClose, onSubmit, dataValue }) {
  const [inputValue, setInputValue] = React.useState(dataValue?.data);

  useEffect(() => {
    if (open) {
      setInputValue(dataValue?.data); // Reset inputValue when modal opens
    }
  }, [open, dataValue]);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(inputValue, dataValue?.id);
    }
    setInputValue(""); // Clear the input
    onClose(); // Close the modal
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Record Data
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="Notification"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Button variant="contained" onClick={handleSubmit} fullWidth>
          Submit
        </Button>
      </Box>
    </Modal>
  );
}


function TextWithIconsCard({ record, handleUpdate, handleDelete }) {
  return (
    <Card sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, my: 3 }}>
      {/* Left Side: Text */}
      <CardContent sx={{ flex: 1, padding: "8px" }}>
        <Typography variant="h6" component="div">
          {record.data}
        </Typography>
      </CardContent>

      {/* Right Side: Icons */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton aria-label="edit" onClick={handleUpdate}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
}


const Nofications = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({ data: '', id: null });

  const [updateKey, setUpdateKey] = useState(null)
  const [loading, setLoading] = useState(false);
  const [notifs, setNotifs] = useState([]);

  const handleModalClose = () => setModalOpen(false);

  const handleModalSubmit = async (value, id) => {
    setLoading(true);
    console.log("Submitted value:", value, id);

    if (id === null)
      id = uuidv4(); // Generate a random UUID

    try {
      const { data, errorNotifs } = await supabase
        .from("notifs")
        .upsert([{ id, data: value }]);

      if (errorNotifs) {
        console.error("Error upserting record:", errorNotifs);
      }
    } catch (error) {
      console.error("Error fetching notifs:", error);
    } finally {
      setLoading(false);
      setUpdateKey(new Date());
    }
  };

  const handleDeleteCallback = async (id) => {
    setLoading(true);
    try {
      const { data, errorDel } = await supabase
        .from('notifs')
        .delete()
        .eq('id', id);

      if (errorDel) {
        console.error("Error deleting record:", errorDel);
      } else {
        console.log("Record deleted:", data);
      }
    } catch (error) {
      console.error("Error fetching notifs:", error);
    } finally {
      setLoading(false);
      setUpdateKey(new Date())
    }
  };

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const { data: notifsData, errorNotifs } = await supabase
        .from("notifs")
        .select("*");
      if (errorNotifs) {
        console.error("Error fetching notifs:", errorNotifs);
        return;
      }
      setNotifs(notifsData);
    } catch (error) {
      console.error("Error fetching notifs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs()
  }, [updateKey])


  return (
    <Box>
      <ButtonGroup variant="outlined" aria-label="Basic button group">
        <Button variant='contained' onClick={
          () => {
            setCurrentRecord({ data: '', id: null });
            setModalOpen(true);
          }
        }>Add Record</Button>
        <Button onClick={() => fetchDataAndExport('notifs')}>Download All</Button>
      </ButtonGroup>

      <Box sx={{ my: 2 }}>
        {
          loading === false && notifs.map(
            (record, index) => <TextWithIconsCard
              record={record} key={index}
              handleUpdate={() => {
                setCurrentRecord(record);
                setModalOpen(true);
              }}
              handleDelete={() => {
                handleDeleteCallback(record?.id);
              }}
            />
          )
        }
        {loading === true && "Loading..."}
      </Box>

      <SimpleModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        dataValue={currentRecord}
      />
    </Box>
  )
}

export default Nofications