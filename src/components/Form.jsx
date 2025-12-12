import React, { useState } from 'react';
import Papa from 'papaparse';

const Form = ({ onDataLoaded }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a CSV file first.');
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.data && results.data.length > 0) {
                    onDataLoaded(results.data);
                } else {
                    setError('The CSV file is empty or invalid.');
                }
            },
            error: (err) => {
                setError('Error parsing CSV file: ' + err.message);
            }
        });
    };

    return (
        <div className="container">
            <div className="form-card">
                <h2 className="form-title">Upload Data</h2>
                <p className="form-subtitle">Upload your CSV file to analyze shop events.</p>
                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="file-input-wrapper">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            id="csv-file"
                            className="file-input"
                        />
                        <label htmlFor="csv-file" className="file-label">
                            {file ? file.name : "Choose CSV File"}
                        </label>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="upload-btn">
                        Analyze Data
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Form;