import React, { Component } from 'react';

export class Assignment1Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPreviewOpen: false,
            previewData: null,
            editedData: null,
        };
    }

    handlePreview = (data) => {
        this.setState({
            isPreviewOpen: true,
            previewData: data,
            editedData: { ...data }, // Clone the data for editing
        });
    };

    handleClosePreview = () => {
        this.setState({
            isPreviewOpen: false,
            previewData: null,
            editedData: null,
        });
    };

    handleEditChange = (event) => {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            editedData: {
                ...prevState.editedData,
                [name]: value,
            },
        }));
    };

    handleSave = async () => {
        const { editedData } = this.state;

        // Extract the ID from editedData
        const { id, ...updatedFields } = editedData;

        // Send edited data to the backend
        const response = await fetch(`assignment/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFields),
        });

        if (response.ok) {
            // Reload the grid data
            this.reloadGridData();

            // Close the preview popup
            this.handleClosePreview();
        } else {
            // Handle errors
            console.error('Failed to save edited data');
        }
    };

    reloadGridData = async () => {
        // Fetch updated data from the backend
        const response = await fetch('assignment');
        const updatedUserInputs = await response.json();

        // Update the userInputs state in the parent component
        this.props.onDataReload(updatedUserInputs); // Assuming onDataReload is a method passed from the parent component
    };


    render() {
        const { userInputs } = this.props;
        const { isPreviewOpen, previewData, editedData } = this.state;

        return (
            <div className="user-inputs-grid">
                <h2>User Inputs Grid</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Control Type</th>
                            <th>Grid Columns</th>
                            <th>Label (English)</th>
                            <th>Validation Expression (English)</th>
                            <th>Max Size (English)</th>
                            <th>Label (Arabic)</th>
                            <th>Validation Expression (Arabic)</th>
                            <th>Max Size (Arabic)</th>
                            <th>Display Order</th>
                            <th>Mandatory</th>
                            <th>Actions</th> {/* Added column for Preview button */}
                        </tr>
                    </thead>
                    <tbody>
                        {userInputs.map((input, index) => (
                            <tr key={index}>
                                <td>{input.controlType}</td>
                                <td>{input.gridColumns}</td>
                                <td>{input.labelEnglish}</td>
                                <td>{input.validationExpressionEnglish}</td>
                                <td>{input.maxSizeEnglish}</td>
                                <td>{input.labelArabic}</td>
                                <td>{input.validationExpressionArabic}</td>
                                <td>{input.maxSizeArabic}</td>
                                <td>{input.displayOrder}</td>
                                <td>{input.mandatory ? 'Yes' : 'No'}</td>
                                <td>
                                    <button onClick={() => this.handlePreview(input)}>Preview</button> {/* Preview button */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Preview Popup */}
                {isPreviewOpen && (
                    <div className="preview-popup">
                        <h3>Edit User Input</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Control Type:</td>
                                    <td>
                                        <input type="text" name="controlType" value={editedData.controlType} disabled="true" onChange={this.handleEditChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Grid Columns:</td>
                                    <td>
                                        <input type="number" name="gridColumns" value={editedData.gridColumns} onChange={this.handleEditChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Label (English):</td>
                                    <td>
                                        <input type="text" name="labelEnglish" value={editedData.labelEnglish} onChange={this.handleEditChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Validation Expression (English):</td>
                                    <td>
                                        <input type="text" name="validationExpressionEnglish" value={editedData.validationExpressionEnglish} onChange={this.handleEditChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Max Size (English):</td>
                                    <td>
                                        <input type="number" name="maxSizeEnglish" value={editedData.maxSizeEnglish} onChange={this.handleEditChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Label (Arabic):</td>
                                    <td>
                                        <input type="text" name="labelArabic" value={editedData.labelArabic} onChange={this.handleEditChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Validation Expression (Arabic):</td>
                                    <td>
                                        <input type="text" name="validationExpressionArabic" value={editedData.validationExpressionArabic} onChange={this.handleEditChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Max Size (Arabic):</td>
                                    <td>
                                        <input type="number" name="maxSizeArabic" value={editedData.maxSizeArabic} onChange={this.handleEditChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Display Order:</td>
                                    <td>
                                        <input type="number" name="displayOrder" value={editedData.displayOrder} onChange={this.handleEditChange} />
                                    </td>
                                </tr>
                              
                            </tbody>
                        </table>
                        <div>
                            <button onClick={this.handleSave}>Save</button>
                            <button onClick={this.handleClosePreview}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
