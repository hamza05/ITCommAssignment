import React, { Component } from 'react';
import { Assignment1Grid } from './Assignment1Grid';
export class Assignment1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            controlType: '',
            gridColumns: '',
            labelEnglish: '',
            validationExpressionEnglish: '',
            maxSizeEnglish: '',
            labelArabic: '',
            validationExpressionArabic: '',
            maxSizeArabic: '',
            displayOrder: '',
            mandatory: false,
            errors: {}, // Initialize errors object
            userInputs: [], // Initialize userInputs array
        };
    }
    async componentDidMount() {
        // Fetch the initial data from the server and set it in the state
        const response = await fetch('assignment');
        const initialUserInputs = await response.json();

        this.setState({
            userInputs: initialUserInputs,
        });
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;

        // If the property is a number, convert the input value to a number
        const newValue = name === 'gridColumns' || name === 'maxSizeEnglish' || name === 'maxSizeArabic' || name === 'displayOrder'
            ? +value
            : value;

        this.setState({
            [name]: newValue,
            errors: { ...this.state.errors, [name]: '' }, // Clear previous errors for the input
        });
    }

    handleCheckboxChange = () => {
        this.setState({ mandatory: !this.state.mandatory });
    }


    handleSave = async () => {
        if (this.validateForm()) {
            const {
                controlType,
                gridColumns,
                labelEnglish,
                validationExpressionEnglish,
                maxSizeEnglish,
                labelArabic,
                validationExpressionArabic,
                maxSizeArabic,
                displayOrder,
                mandatory
            } = this.state;

            // TODO: Call the API endpoint to save user input
            const response = await fetch('assignment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    controlType,
                    gridColumns,
                    labelEnglish,
                    validationExpressionEnglish,
                    maxSizeEnglish,
                    labelArabic,
                    validationExpressionArabic,
                    maxSizeArabic,
                    displayOrder,
                    mandatory
                }),
            });

            // Handle the response or errors as needed
            if (response.ok) {
                // Retrieve the updated list from the server after successful save
                const updatedUserInputs = await response.json();

                // Clear the form after successful save
                this.setState({
                    userInputs: updatedUserInputs,
                    controlType: '',
                    gridColumns: '',
                    labelEnglish: '',
                    validationExpressionEnglish: '',
                    maxSizeEnglish: '',
                    labelArabic: '',
                    validationExpressionArabic: '',
                    maxSizeArabic: '',
                    displayOrder: '',
                    mandatory: false,
                });
            } else {
                // Handle errors
                console.error('Failed to save user input');
            }
        }
    }
    validateForm = () => {
        const {
            controlType,
            gridColumns,
            labelEnglish,
            validationExpressionEnglish,
            maxSizeEnglish,
            labelArabic,
            validationExpressionArabic,
            maxSizeArabic,
            displayOrder,
        } = this.state;

        const errors = {};

        if (!controlType) {
            errors.controlType = 'Control Type is required.';
        }

        if (!gridColumns || isNaN(gridColumns) || +gridColumns <= 0) {
            errors.gridColumns = 'Grid Columns must be a positive number.';
        }

        if (!labelEnglish) {
            errors.labelEnglish = 'Label (English) is required.';
        }

        if (validationExpressionEnglish === 'Select') {
            errors.validationExpressionEnglish = 'Validation Expression (English) is required.';
        }

        if (!maxSizeEnglish || isNaN(maxSizeEnglish) || +maxSizeEnglish <= 0) {
            errors.maxSizeEnglish = 'Max Size (English) must be a positive number.';
        }

        if (!labelArabic) {
            errors.labelArabic = 'Label (Arabic) is required.';
        }

        if (validationExpressionArabic === 'Select') {
            errors.validationExpressionArabic = 'Validation Expression (Arabic) is required.';
        }

        if (!maxSizeArabic || isNaN(maxSizeArabic) || +maxSizeArabic <= 0) {
            errors.maxSizeArabic = 'Max Size (Arabic) must be a positive number.';
        }

        if (!displayOrder || isNaN(displayOrder) || +displayOrder <= 0) {
            errors.displayOrder = 'Display Order must be a positive number.';
        }

        this.setState({ errors });

        return Object.keys(errors).length === 0;
    }
    render() {
        const { errors, userInputs  } = this.state;

        return (
            <div>
            <div className="user-input-form">
                <h2>Assignment 1 Input Form</h2>
                <form>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="form-group">
                                        <label>Control Type:</label>
                                        <select name="controlType" value={this.state.controlType} onChange={this.handleInputChange}>
                                            <option value="">Select</option>
                                            <option value="Type 1">Type 1</option>
                                            <option value="Type 2">Type 2</option>
                                            <option value="Type 3">Type 3</option>
                                        </select>
                                        {errors.controlType && <span className="error-message">{errors.controlType}</span>}
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group">
                                        <label>Grid Columns:</label>
                                        <input type="number" name="gridColumns" value={this.state.gridColumns} onChange={this.handleInputChange} />
                                        {errors.gridColumns && <span className="error-message">{errors.gridColumns}</span>}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="form-group">
                                        <label>Label (English):</label>
                                        <input type="text" name="labelEnglish" value={this.state.labelEnglish} onChange={this.handleInputChange} />
                                        {errors.labelEnglish && <span className="error-message">{errors.labelEnglish}</span>}
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group">
                                        <label>Validation Expression (English):</label>
                                        <select name="validationExpressionEnglish" value={this.state.validationExpressionEnglish} onChange={this.handleInputChange}>
                                            <option value="Select">Select</option>
                                            <option value="Expression 1">Expression 1</option>
                                            <option value="Expression 2">Expression 2</option>
                                            <option value="Expression 3">Expression 3</option>
                                        </select>
                                        {errors.validationExpressionEnglish && <span className="error-message">{errors.validationExpressionEnglish}</span>}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="form-group">
                                        <label>Max Size (English):</label>
                                        <input type="number" name="maxSizeEnglish" value={this.state.maxSizeEnglish} onChange={this.handleInputChange} />
                                        {errors.maxSizeEnglish && <span className="error-message">{errors.maxSizeEnglish}</span>}
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group">
                                        <label>Label (Arabic):</label>
                                        <input type="text" name="labelArabic" value={this.state.labelArabic} onChange={this.handleInputChange} />
                                        {errors.labelArabic && <span className="error-message">{errors.labelArabic}</span>}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="form-group">
                                        <label>Validation Expression (Arabic):</label>
                                        <select name="validationExpressionArabic" value={this.state.validationExpressionArabic} onChange={this.handleInputChange}>
                                            <option value="Select">Select</option>
                                            <option value="امتحان 1">امتحان 1</option>
                                            <option value="امتحان 2">امتحان 2</option>
                                            <option value="امتحان 3">امتحان 3</option>
                                        </select>
                                        {errors.validationExpressionArabic && <span className="error-message">{errors.validationExpressionArabic}</span>}
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group">
                                        <label>Max Size (Arabic):</label>
                                        <input type="number" name="maxSizeArabic" value={this.state.maxSizeArabic} onChange={this.handleInputChange} />
                                        {errors.maxSizeArabic && <span className="error-message">{errors.maxSizeArabic}</span>}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="form-group">
                                        <label>Display Order:</label>
                                        <input type="number" name="displayOrder" value={this.state.displayOrder} onChange={this.handleInputChange} />
                                        {errors.displayOrder && <span className="error-message">{errors.displayOrder}</span>}
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group">
                                        <label>Mandatory:</label>
                                        <input type="checkbox" name="mandatory" checked={this.state.mandatory} onChange={this.handleCheckboxChange} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="form-row">
                        <button type="button" onClick={this.handleSave}>Save</button>
                        <button type="button" onClick={this.handleClear}>Clear</button>
                    </div>
                </form>
            </div>
                <Assignment1Grid userInputs={userInputs} />
            </div>
        );
    }
}
