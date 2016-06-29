const React = require('react');
const Link = require('react-router').Link;
const SessionStore = require('../stores/session_store');
const SessionActions = require('../actions/session_actions');

// Forms
const LoginForm = require('./login_form');
const SignUpForm = require('./signup_form');

// Modal
const Modal = require('react-modal');
const ModalStyle = require('../constants/modal_style');

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
  },

  componentDidMount() {
  },


  // redirect to root
  _signOut(e) {
    e.preventDefault();
    SessionActions.logOut();
  },

  // <nav className="login-signup">
  //   <Link to="/login" activeClassName="current">Login!</Link>
  //   <br/>
  //   <Link to="/signup" activeClassName="current">Sign up!</Link>
  // </nav>

  greeting() {
  const component = (this.state.signIn) ? <LoginForm cb={this.onModalClose}/> : <SignUpForm cb={this.onModalClose}/>;

  if (SessionStore.isUserLoggedIn()) {
    return(
      <hgroup className="header-group">
        <h2 className="header-name">Welcome, {SessionStore.currentUser().username}!</h2>
        <br/>
        <input className="header-button" type="submit" value="Log out!" onClick={this._signOut} />
      </hgroup>
    );
  } else {
      return (
        <div>
          <div className="header-group2"></div>
          <button id="sign-in-button"
                  onClick={this._handleClick.bind(this, true)}>
              Sign In
          </button>
          <button id="sign-up-button"
                  onClick={this._handleClick.bind(this, false)}>
              Sign Up
          </button>

        <Modal
          isOpen={this.state.modalOpen}
          onRequestClose={this.onModalClose}
          style={ModalStyle}>

          <button onClick={this.onModalClose}>Close</button>
          {component}
        </Modal>
      </div>
      );
    }
  },

  render: function() {
    return (
      <div>
        <header>
          <Link to="/" className="header-link"><h1>Sideline</h1></Link>
          { this.greeting() }
        </header>
        <br/>
        {this.props.children}
      </div>
    );
  }

});

module.exports = App;
