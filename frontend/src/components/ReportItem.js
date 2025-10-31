import React from 'react';
import './ReportItem.css';

const ReportItem = ({ report }) => {
  return (
    <div className="card bg-light report-card">
      <div className="report-image">
        <img src={report.imageUrl} alt="Civic Issue" />
      </div>
      <div className="report-details">
        <h3 className="text-primary text-left">{report.issueCategory}</h3>
        <ul className="list">
          {/* Display the user's notes (description) if they exist */}
          {report.citizenNotes && (
            <li>
              <strong>Description: </strong> {report.citizenNotes}
            </li>
          )}
          <li>
            <strong>Location: </strong> 
            {/* Display GPS coordinates, formatted to 5 decimal places */}
            {`Lat: ${report.location.coordinates[1].toFixed(5)}, Lon: ${report.location.coordinates[0].toFixed(5)}`}
          </li>
          <li>
            <strong>Status: </strong>
            <span
              className={`badge ${
                report.status === 'Resolved'
                  ? 'badge-success'
                  : 'badge-primary'
              }`}
            >
              {report.status}
            </span>
          </li>
          <li>
            <strong>Date & Time: </strong>{' '}
            {/* Format the date to show locale-specific date and time */}
            {new Date(report.createdAt).toLocaleString()}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReportItem;