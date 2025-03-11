import React, { useState, useEffect } from 'react'
import { Box, Button, ButtonGroup, Card, CardContent, Typography, IconButton, Modal, TextField } from '@mui/material'
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-hot-toast";

import supabase from "../../API/supabase";
import { v4 as uuidv4 } from "uuid";
import { fetchDataAndExport } from '../../utils/Download';


function SimpleModal({
  open,
  onClose,
  onSubmit,
  dataValue,
}) {
  const [text, setText] = React.useState(dataValue?.text || "");
  const [event, setEvent] = React.useState(dataValue?.event || "");
  const [time, setTime] = React.useState(dataValue?.time || "");
  const [link, setLink] = React.useState(dataValue?.link || "");
  const [file, setFile] = React.useState(dataValue?.image || "");

  useEffect(() => {
    if (open) {

      // Convert the incoming date string to the correct format for display
      if (dataValue?.time) {
        const localDate = new Date(dataValue.time.replace(/Z|([+-]\d{2}:\d{2})$/, ""));
        const formattedTime = localDate.toLocaleString('sv-SE');
        setTime(formattedTime); // Set formatted time (without seconds and timezone)
      } else {
        setTime(""); // Reset time field if no value is provided
      }

      setText(dataValue?.text || "");
      setEvent(dataValue?.event || "");
      setLink(dataValue?.link || "");
      setFile(dataValue?.image || "");
    }
  }, [open, dataValue]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    const formData = {
      text,
      event,
      // time: new Date(time).toISOString(),
      time,
      link,
    };

    if (onSubmit) {
      onSubmit(formData, dataValue?.id, file);
    }
    setText("");
    setEvent("");
    setTime("");
    setLink("");
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

        {/* Text Field */}
        <TextField
          fullWidth
          variant="outlined"
          label="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Event Field */}
        <TextField
          fullWidth
          variant="outlined"
          label="Event"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Time Field (datetime-local) */}
        <TextField
          fullWidth
          variant="outlined"
          label="Time"
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Link Field */}
        <TextField
          fullWidth
          variant="outlined"
          label="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          sx={{ mb: 2 }}
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
          {record.text}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date(record.time.replace(/Z|([+-]\d{2}:\d{2})$/, "")).toLocaleString('sv-SE')}
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


const Posts = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const emptyRecord = { text: '', id: null, event: '', link: '', image: '', time: '' }
  const [currentRecord, setCurrentRecord] = useState(emptyRecord);

  const [updateKey, setUpdateKey] = useState(null)
  const [loading, setLoading] = useState(false);
  const [notifs, setNotifs] = useState([]);

  const handleModalClose = () => setModalOpen(false);

  function generateSalt(length = 6) {
    return Math.random().toString(36).substring(2, 2 + length);
  }


  function appendSaltToFilename(filename, length = 6) {
    let salt = generateSalt(length);
    let dotIndex = filename.lastIndexOf(".");

    if (dotIndex === -1) {
      return `${filename}_${salt}`; // If no extension, just append salt
    }

    let name = filename.substring(0, dotIndex);
    let ext = filename.substring(dotIndex);
    return `${name}_${salt}${ext}`;
  }

  const handleModalSubmit = async (value, id, image) => {
    setLoading(true);
    console.log("Submitted value:", value, id);

    if (id === null)
      id = uuidv4(); // Generate a random UUID

    if (image.name) {
      let publicUrl = ""
      const newName = appendSaltToFilename(image.name);

      const { data, errorFile } = await supabase.storage
        .from('posts')
        .upload(newName, image);

      if (!errorFile) {
        // Get the public URL for the uploaded file
        publicUrl = supabase.storage
          .from('posts')
          .getPublicUrl(newName);
        toast.success('Image upload success!')
      }
      else {
        toast.error("Image upload failure!")
      }

      value['image'] = publicUrl.data.publicUrl;
    }

    try {
      const { data, errorNotifs: errorPosts } = await supabase
        .from("posts")
        .upsert([{ id, ...value }]);

      if (errorPosts) {
        console.error("Error upserting record:", errorPosts);
        toast.error('Error upserting record. Check console.')
      }
      else {
        toast.success('Record upsert success!')
      }
    } catch (error) {
      console.error("Error updating posts:", error);
      toast.error('Error upserting record. Check console.')
    } finally {
      setLoading(false);
      setUpdateKey(new Date());
    }
  };

  const handleDeleteCallback = async (id) => {

    if (!window.confirm("Are you sure you want to delete this?")) {
      return; // Exit if the user cancels
    }

    setLoading(true);
    try {
      const { data, errorDel } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (errorDel) {
        console.error("Error deleting record:", errorDel);
        toast.error('Error deleting record. Check console.')
      } else {
        console.log("Record deleted:", data);
        toast.success('Record deleted!')
      }
    } catch (error) {
      console.error("Error deleing posts:", error);
      toast.error('Error deleting record. Check console.')
    } finally {
      setLoading(false);
      setUpdateKey(new Date())
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data: postsData, errorNotifs: errorPosts } = await supabase
        .from("posts")
        .select("*")
        .order("time", { ascending: false });
      if (errorPosts) {
        console.error("Error fetching posts:", errorPosts);
        return;
      }
      setNotifs(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
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
        <Button onClick={() => fetchDataAndExport('posts')}>Download All</Button>
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

export default Posts