const React = require('react');
const Link = require('react-router').Link;
const hashHistory = require('react-router').hashHistory;
const SessionStore = require('../stores/session_store');
const ErrorStore = require('../stores/error_store');
const SessionActions = require('../actions/session_actions');
const Search = require('./search');

// React-BS
const ButtonGroup = require('react-bootstrap').ButtonGroup;
const Button = require('react-bootstrap').Button;
const Navbar = require('react-bootstrap').Navbar;

// Forms
const LoginForm = require('./login_form');
const SignUpForm = require('./signup_form');
// const StoryForm = require('./story_form');

// Modal
const Modal = require('react-modal');
const ModalStyle = require('../constants/modal_style');

String.prototype.capitalize = function() {
  return this.slice(0, 1).toUpperCase() + this.slice(1);
};

const App  = React.createClass({
  getInitialState() {
    return({
      modalOpen: false,
      signIn: false
     });
  },

  _handleClick(bool) {
      this.setState({
      modalOpen: true,
      signIn: bool
     });
  },

  onModalClose() {
    this.setState({ modalOpen: false });
    ModalStyle.content.opacity = 0;
    ErrorStore.resetErrors();
  },

  onModalOpen() {
    ModalStyle.content.opacity = 100;
  },

  _redirectToStoryForm() {
    if (SessionStore.isUserLoggedIn()) {
      hashHistory.push("/stories/new");
    } else {
      alert("Please login or sign up first!");
    }
  },

  greeting() {
  if (SessionStore.isUserLoggedIn()) {
    return(
        <Search />
        );
    } else {
      return (
        <Navbar className="nav-bar">
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/" className="logo"></a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>

            <Navbar.Form pullRight>

                <ButtonGroup>

                <Button className="login-button"
                  onClick={this._redirectToStoryForm}>
                  Write your story!
                </Button>

                <Button className="login-button"
                  onClick={this._handleClick.bind(this, true)}>
                  Sign In
                </Button>

                <Button className="login-button"
                  onClick={this._handleClick.bind(this, false)}>
                  Sign Up
                  </Button>

                </ButtonGroup>
             </Navbar.Form>
          </Navbar.Collapse>
        </Navbar>
      );
    }
  },

  _switchForms() {
    this.setState({ signIn: !this.state.signIn });
  },

  // header footer & modal

  render: function() {
    const component = (this.state.signIn) ? <LoginForm cb={this.onModalClose} modal={this._switchForms}/> : <SignUpForm cb={this.onModalClose} modal={this._switchForms}/>;

    return (
      <div>
        <header>
          { this.greeting() }
        </header>

        <div>
          <Modal
            isOpen={this.state.modalOpen}
            onRequestClose={this.onModalClose}
            style={ModalStyle}
            onAfterOpen={this.onModalOpen}>

            <button className="modal-close"
                    onClick={this.onModalClose}>
                    Close</button>
            {component}
          </Modal>
        </div>

          {this.props.children}
      </div>
    );
  }

});

module.exports = App;
