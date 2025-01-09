import React, { useState } from 'react'
import { fetchDataAndExport } from '../utils/Download'
import { processFile } from '../utils/Upload';
import { downloadGoogle } from '../utils/Storage';


const Downloads = () => {
  const [selectedOption, setSelectedOption] = useState('members');
  const tables = ["members", "posts", "notifs", "itineraries"];
  
  const [file, setFile] = useState(null);


  return (
    <div>
      <h1>Download Data</h1>
      <label htmlFor="dropdown">Select an option: </label>
      <select id="dropdown" value={selectedOption} onChange={(event) => setSelectedOption(event.target.value)}>
        {
          tables.map((value, index) => 
            <option value={value} key={index}>{value}</option>
          )
        }
      </select>
      <button onClick={() => fetchDataAndExport(selectedOption)}>Export {selectedOption} to Excel</button>
      <hr />


      <h1>Insert Members</h1>
      <input type="file" accept=".xlsx, .xls" onChange={(event) => setFile(event.target.files[0]) } />
      <button onClick={() => processFile(file)}>Process File</button>
      <hr />

      <button onClick={() => downloadGoogle('a', 'https://drive.google.com/open?id=13WWgh0j02LNEXDZfzBz2zyPxZ3LjNkGr')}>Dowload Image</button>
      
    </div>
  )
}

export default Downloads