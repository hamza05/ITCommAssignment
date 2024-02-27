import React, { Component } from 'react';

export class Assignment1Grid extends Component {
    render() {
        const { userInputs } = this.props;

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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
