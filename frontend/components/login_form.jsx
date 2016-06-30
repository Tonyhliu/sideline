const React = require('react');
const Link = require('react-router').Link;
const ReactRouter = require('react-router');
const hashHistory = ReactRouter.hashHistory;
const SessionActions = require('../actions/session_actions');
const SessionStore = require('../stores/session_store');
const ErrorStore = require('../stores/error_store');

const LoginForm = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

  getInitialState() {
    return({ username: "", password: "" });
  },

  componentDidMount() {
		this.errorListener = ErrorStore.addListener(this.forceUpdate.bind(this));
    this.sessionListener = SessionStore.addListener(this._handleNewSession);
  },

	_handleNewSession() {
		this.props.cb();
		hashHistory.push('/stories');
	},

  componentWillUnmount() {
		this.errorListener.remove();
    this.sessionListener.remove();
  },

  _login(e) {
    e.preventDefault();
    SessionActions.logIn(this.state);
  },

	fieldErrors(field) {
		const errors = ErrorStore.formErrors("login");

		if (!errors[field]) { return; }

		const messages = errors[field].map( (errorMsg, i) => {
			return <li key={ i }>{ errorMsg }</li>;
		});

		return <ul>{ messages }</ul>;
	},

	// _redirectToSignup(e) {
	// 	e.preventDefault();
	// 	hashHistory.push("/signup");
	// },

	_guest(e) {
		e.preventDefault();
		SessionActions.logIn({username: "Guest", password: "Password"});
	},

  update(property){
    return (e) => this.setState({ [property]: e.target.value });
  },

  render() {
		return (
			<div className="login-form-container">
				<form onSubmit={this._login} className="login-form-box">
	        Welcome to Sideline!
					<br/>
					Please Login.
					<br/>


					<div className="login-form">
		        <br />
						<label> Username:
		          { this.fieldErrors("username") }
							<input type="text"
		            value={this.state.username}
		            onChange={this.update("username")}
								className="login-input"
								placeholder="Username"/>
						</label>

		        <br />
						<label> Password:
		          { this.fieldErrors("password") }
		          <input type="password"
		            value={this.state.password}
		            onChange={this.update("password")}
								className="login-input"
								placeholder="Password"/>
						</label>

						{ this.fieldErrors("base") }
		        <br />
						<button className="guest-login" onClick={this._guest}>Demo Login</button>
						<input type="submit" value="Log In" className="login-button"/>
					</div>
				</form>
			</div>
    );
  }
});

module.exports = LoginForm;
