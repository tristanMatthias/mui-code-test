import React from 'react';
import ReactDOM from 'react-dom';
import { Panes } from './components/Panes/Panes';


ReactDOM.render(
  <Panes panes={[
    <span className="pane1">Pane 1</span>,
    <span className="pane2">Pane 2</span>,
    <Panes vertical panes={[
      <span className="pane3">Pane 3</span>,
      <span className="pane4">Pane 4</span>
    ]} />
  ]} />,
  document.getElementById('root')
);
