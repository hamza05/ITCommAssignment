import React, { useState } from 'react';
import Dropzone from 'react-dropzone';

const ExcelImport = () => {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false); // State variable for loading status

    const onDrop = async (acceptedFiles) => {
        setLoading(true); // Set loading to true when starting file upload
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/excelimport', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                console.error('Failed to upload Excel file');
                setLoading(false); // Set loading to false if upload fails
                return;
            }

            const jsonData = await response.json();
            setTableData(jsonData);
        } catch (error) {
            console.error('Error during file upload:', error);
        } finally {
            setLoading(false); // Set loading to false after upload completes (whether successful or not)
        }
    };

    return (
        <div>
            <h2>Assignment 4</h2>
            <h5>Upload the files here to view it dynamically.</h5>

            <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} style={dropzoneStyles}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop an Excel file here, or click to select one</p>
                    </div>
                )}
            </Dropzone>

            {loading && <p>Loading...</p>} {/* Display loading indicator while loading is true */}

            <div>
                {/* Render the table using the imported data */}
                <table>
                    <thead>
                        <tr>
                            {tableData.length > 0 &&
                                tableData[0].map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.slice(1).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const dropzoneStyles = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
};

export default ExcelImport;
