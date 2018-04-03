import React, {Component}   from 'react';
import { Link }             from 'react-router-dom';
import { connect }          from 'react-redux';
import freeLogo             from '../../images/freelancer.logos/fl-logo.svg';
import { userDispatch }     from '../../redux/actions/user/user.dispatch';
import '../../stylesheet/signup-login.css';

class LoginPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user : {
                username    : '',
                password    : '',
            },
            formErrors : {
                userName    : '',
                passWord    : ''
            },
            isUserNameValid   : false,
            isPassWordValid   : false,
            isSubmitted     : false
        }
    }

    handleChange = (event) => {

        const { name, value }   = event.target;
        const { user }          = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleLogin = (event) => {

        event.preventDefault();

        this.setState({ isSubmitted: true });
        const { user }      = this.state;

        if (user.username && user.password) {
            this.props.login(user);
        }
    }

    render() {

        const { user, isSubmitted } = this.state;
        const { alert }             = this.props;

        return (
            <div className="main-content">
                <div className="row justify-content-md-center">
                    <div>
                        <div className="header-login-form header-login-form-child">
                            <div className="modal-header">
                                <div className="modal-header-logo">
                                    <img className="flicon-logo-fullcolor" src={freeLogo} alt="Freelancer"></img>
                                </div>
                            </div>
                            <div className="modal-body">

                                {
                                    alert.isAlert &&
                                    <div className={`alert alert-btm ` + alert.type}>
                                        {alert.message}
                                    </div>
                                }

                                <form className="large-form" onSubmit={this.handleLogin}>

                                    <div className="form-group form-step">
                                        <input
                                            className={`form-control large-input` + (isSubmitted && !user.username ? ' form-step-has-error' : '')}
                                            name        = "username"
                                            value       = { user.username }
                                            type        = "text"
                                            label       = "Username"
                                            placeholder = "Username"
                                            onChange    = { this.handleChange }
                                        />
                                        {
                                            isSubmitted && !user.username &&
                                            <div className="form-error signup-form-error">
                                                Please enter your username
                                            </div>
                                        }
                                    </div>

                                    <div className="form-group form-step">
                                        <input
                                            className={`form-control large-input` + (isSubmitted && !user.password ? ' form-step-has-error' : '')}
                                            name        = "password"
                                            value       = { user.password }
                                            type        = "password"
                                            label       = "Password"
                                            placeholder = "Password"
                                            onChange    = { this.handleChange }
                                        />
                                        {
                                            isSubmitted && !user.password &&
                                            <div className="form-error signup-form-error">
                                                Please enter your password
                                            </div>
                                        }
                                    </div>

                                    <div className="form-group form-step">
                                        <button id="signupBtn" type="submit"
                                                className="form-control large-input btn btn-info btn-large btn-submit btn-create-account">
                                            Log In
                                        </button>
                                    </div>

                                </form>

                            </div>
                            <div className="modal-footer">
                                <span className="login-form-signup-link">
                                    Don't have an account?&nbsp;
                                    <Link to="/signup" className="a-tag">Sign Up</Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {

    const { alert } = state;
    return {
        alert
    };
}

function mapDispatchToProps(dispatch) {
    return {
        login : (user) => dispatch(userDispatch.login(user))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);