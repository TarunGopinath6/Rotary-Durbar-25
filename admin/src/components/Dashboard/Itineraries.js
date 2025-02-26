import React, { useState, useEffect } from 'react'
import { Box, Button, ButtonGroup, Card, CardContent, Typography, IconButton, Modal, TextField } from '@mui/material'
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import supabase from "../../API/supabase";
import { v4 as uuidv4 } from "uuid";
import { fetchDataAndExport } from '../../utils/Download';


function SimpleModal({
  open,
  onClose,
  onSubmit,
  dataValue,
}) {
  const [title, setTitle] = useState(dataValue?.title || "");
  const [type, setType] = useState(dataValue?.type || "");
  const [description, setDescription] = useState(dataValue?.description || "");
  const [venue, setVenue] = useState(dataValue?.venue || "");
  const [startTime, setStartTime] = useState(dataValue?.startTime || "");
  const [endTime, setEndTime] = useState(dataValue?.endTime || "");
  const [file, setFile] = useState(dataValue?.image || "");

  useEffect(() => {
    if (open) {
      // Convert the incoming date strings to the correct format for display
      if (dataValue?.startTime) {
        const localStartTime = new Date(dataValue?.startTime);
        const formattedStartTime = localStartTime.toLocaleString('sv-SE')
        console.log(dataValue?.startTime, formattedStartTime)
        setStartTime(formattedStartTime); // Set formatted start time
      } else {
        setStartTime("");
      }

      if (dataValue?.endTime) {
        const localEndTime = new Date(dataValue?.endTime);
        const formattedEndTime = localEndTime.toLocaleString('sv-SE')
        setEndTime(formattedEndTime); // Set formatted end time
      } else {
        setEndTime("");
      }

      setTitle(dataValue?.title || "");
      setType(dataValue?.type || "");
      setDescription(dataValue?.description || "");
      setVenue(dataValue?.venue || "");
      setFile(dataValue?.image || "");
    }
  }, [open, dataValue]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    const formData = {
      title,
      type,
      description,
      venue,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
    };

    if (onSubmit) {
      onSubmit(formData, dataValue?.id, file);
    }

    setTitle("");
    setType("");
    setDescription("");
    setVenue("");
    setStartTime("");
    setEndTime("");
    setFile(null); // Clear file input
    onClose(); // Close the modal
  };

  return (
    <Modal open={open} onClose={onClose}>
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

        {/* Title Field */}
        <TextField
          fullWidth
          variant="outlined"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Type Field */}
        <TextField
          fullWidth
          variant="outlined"
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Description Field */}
        <TextField
          fullWidth
          variant="outlined"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Venue Field */}
        <TextField
          fullWidth
          variant="outlined"
          label="Venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Start Time Field (datetime-local) */}
        <TextField
          fullWidth
          variant="outlined"
          label="Start Time"
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* End Time Field (datetime-local) */}
        <TextField
          fullWidth
          variant="outlined"
          label="End Time"
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button
          fullWidth
          href={typeof file === 'string' ? file : ''}  // Check if file is a string, otherwise set to an empty string
          target="_blank"               // Optional: to open the link in a new tab
          rel="noopener noreferrer"     // Optional: to prevent security risks when opening in a new tab
          variant="contained"
          sx={{ mb: 2 }}
        >
          Current Image
        </Button>

        {/* File Upload */}
        <Button
          variant="outlined"
          component="label"
          sx={{ mb: 2, width: "100%" }}
        >
          Upload File
          <input
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </Button>

        {/* Submit Button */}
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
        <Typography variant="h6" component="div" gutterBottom>
          {record.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date(record.startTime).toLocaleString()}
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


const Itineraries = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const emptyRecord = { id: null,  title: '',  type: '', description: "", venue: '', event: '', startTime: '', endTime: '', image: '' }
  const [currentRecord, setCurrentRecord] = useState(emptyRecord);

  const [updateKey, setUpdateKey] = useState(null)
  const [loading, setLoading] = useState(false);
  const [notifs, setNotifs] = useState([]);

  const handleModalClose = () => setModalOpen(false);

  const handleModalSubmit = async (value, id, image) => {
    setLoading(true);
    console.log("Submitted value:", value, id);

    if (id === null)
      id = uuidv4(); // Generate a random UUID

    if (image) {
      let publicUrl = ""

      const { data, errorFile } = await supabase.storage
        .from('itinerary')
        .upload(image.name, image);

      if (!errorFile) {
        // Get the public URL for the uploaded file
        publicUrl = supabase.storage
          .from('itinerary')
          .getPublicUrl(image.name);
      }

      value['image'] = publicUrl.data.publicUrl;
    }

    try {
      const { data, errorNotifs: errorPosts } = await supabase
        .from("itineraries")
        .upsert([{ id, ...value }]);

      if (errorPosts) {
        console.error("Error upserting record:", errorPosts);
      }
    } catch (error) {
      console.error("Error updating itineraries:", error);
    } finally {
      setLoading(false);
      setUpdateKey(new Date());
    }
  };

  const handleDeleteCallback = async (id) => {
    setLoading(true);
    try {
      const { data, errorDel } = await supabase
        .from('itineraries')
        .delete()
        .eq('id', id);

      if (errorDel) {
        console.error("Error deleting record:", errorDel);
      } else {
        console.log("Record deleted:", data);
      }
    } catch (error) {
      console.error("Error deleing posts:", error);
    } finally {
      setLoading(false);
      setUpdateKey(new Date())
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data: postsData, errorNotifs: errorPosts } = await supabase
        .from("itineraries")
        .select("*")
        .order("startTime", { ascending: true });
      if (errorPosts) {
        console.error("Error fetching itineraries:", errorPosts);
        return;
      }
      setNotifs(postsData);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts()
  }, [updateKey])

  useEffect(() => {
    console.log(currentRecord)
  }, [currentRecord])



  return (
    <Box>
      <ButtonGroup variant="outlined" aria-label="Basic button group">
        <Button variant='contained' onClick={
          () => {
            setCurrentRecord(emptyRecord);
            setModalOpen(true);
          }
        }>Add Record</Button>
        <Button onClick={() => fetchDataAndExport('itineraries')}>Download All</Button>
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

export default Itineraries