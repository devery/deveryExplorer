import React, { Component } from 'react';
import { Navbar, Nav, NavItem} from 'react-bootstrap';
import { hot } from 'react-hot-loader';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Explorer from './Explorer.jsx';

class App extends Component {
    render() {

      return(
        <div>
          <Router>
            <div>

              <Navbar>
                <Navbar.Header>
                  <Navbar.Brand>
                    <Link to="/">Devery Explorer</Link>
                  </Navbar.Brand>
                </Navbar.Header>
              </Navbar>


              <hr/>
              <Route exact path="/" component={Explorer}/>
            </div>
          </Router>
        </div>
      );
    }
}

export default hot(module)(App);
