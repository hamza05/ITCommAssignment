import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div>
        <h1>Hello !</h1>
        <p>All Assignments are available here</p>
        
        <p>Please use the header navigation to navigate to each assignment.</p>
      </div>
    );
  }
}
