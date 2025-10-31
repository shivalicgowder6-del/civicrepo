import React, { useState } from 'react';
import axios from 'axios';

const ReportForm = () => {
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select an image to upload.');
      return;
    }
    setMessage('Submitting...');

    // Get user's location
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const formData = new FormData();
      formData.append('image', file);
      formData.append('notes', notes);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      // We'll add addressText and issueCategory later

      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token,
          },
        };

        const res = await axios.post('/api/reports', formData, config);
        
        console.log(res.data);
        setMessage('Report submitted successfully!');
        setFile(null);
        setNotes('');
        // We can add logic here to refresh the list of reports
      } catch (err) {
        console.error(err.response.data);
        setMessage('Error submitting report. Please try again.');
      }
    }, (err) => {
      console.error(err);
      setMessage('Could not get location. Please enable location services.');
    });
  };

  return (
    <div className="form-container">
      <h2 className="text-primary">Report a New Issue</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="image">Upload Image</label>
          <input type="file" name="image" onChange={onFileChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Optional Notes</label>
          <textarea
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., This pothole is in Avinashi road, Coimatore"
          ></textarea>
        </div>
        <input
          type="submit"
          value="Submit Report"
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};

export default ReportForm;