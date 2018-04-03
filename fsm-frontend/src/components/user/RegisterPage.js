import React, { Component } from 'react';
import { Link }             from 'react-router-dom';
import { connect }          from 'react-redux';
import { userDispatch }     from '../../redux/actions/user/user.dispatch';
import freeLogo             from '../../images/freelancer.logos/fl-logo.svg';
import { isValid }          from '../../helper/form.validation';
import '../../stylesheet/signup-login.css';

class RegisterPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
           user : {
               email           : '',
               username        : '',
               password        : '',
               confirmPassword : ''
           },
            formErrors : {
                email           : '',
                username        : '',
                password        : '',
                confirmPassword : ''
            },
            isEmailValid    : false,
            isUserNameValid : false,
            isPassWordValid : false,
            isConfPassValid : false,
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
        }, () => { this.validateFields(name, value) });
    }

    validateFields(fieldName, value) {

        let prevState = {
            fieldValidationErrors   : this.state.formErrors,
            isEmailValid            : this.state.isEmailValid,
            isUserNameValid         : this.state.isUserNameValid,
            isPassWordValid         : this.state.isPassWordValid,
        };

        prevState = isValid(fieldName, value, prevState);

        this.setState({
            formErrors      : prevState.fieldValidationErrors,
            isEmailValid    : prevState.isEmailValid,
            isUserNameValid : prevState.isUserNameValid,
            isPassWordValid : prevState.isPassWordValid,
        });
    }

    handlePasswordMatch = (event) => {

        const { name, value }       = event.target;
        const { user }              = this.state;
        let fieldValidationErrors   = this.state.formErrors;
        let isConfPassValid   = this.state.formErrors;

        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });

        if (value.trim() === "") {
            isConfPassValid = false;
            fieldValidationErrors.confirmPassword = "Please re-enter your password";
        } else if (name === 'confirmPassword' && value !== user.password) {
            isConfPassValid = false;
            fieldValidationErrors.confirmPassword = "Passwords do not match!";
        }

        this.setState({
            formErrors      : fieldValidationErrors,
            isConfPassValid : isConfPassValid
        });
    }

    handleCreate = (event) => {

        event.preventDefault();

        this.setState({ isSubmitted: true });
        const { user }      = this.state;

        if (user.email && user.username && user.password && user.confirmPassword) {
            this.props.register(user);
        }
    }

    render() {

        const { user, isSubmitted, isEmailValid, isUserNameValid, isPassWordValid, isConfPassValid, formErrors } = this.state;
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
                                <h3 className="modal-title">Sign up for <em className="modal-title-em">free</em> today!
                                </h3>
                            </div>
                            <div className="modal-body">

                                {
                                    alert.isAlert &&
                                    <div className={`alert alert-btm ` + alert.type}>
                                        {alert.message}
                                    </div>
                                }

                                <form className="large-form" onSubmit={this.handleCreate}>

                                    <div className="form-group form-step">
                                        <input
                                            className={`form-control large-input` + (isSubmitted && !user.email ? ' form-step-has-error' : '')}
                                            name        = "email"
                                            value       = { user.email }
                                            type        = "text"
                                            label       = "EmailAddress"
                                            placeholder = "Email Address"
                                            onChange    = { this.handleChange }
                                        />
                                        {
                                            !isEmailValid &&
                                            <div className="form-error signup-form-error">
                                                { formErrors.email }
                                            </div>
                                        }
                                        {
                                            isSubmitted && !user.email &&
                                            <div className="form-error signup-form-error">
                                                Please enter an email address
                                            </div>
                                        }
                                    </div>

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
                                            !isUserNameValid &&
                                            <div className="form-error signup-form-error">
                                                { formErrors.username }
                                            </div>
                                        }
                                        {
                                            isSubmitted && !user.username &&
                                            <div className="form-error signup-form-error">
                                                Please enter a username
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
                                            !isPassWordValid &&
                                            <div className="form-error signup-form-error">
                                                { formErrors.password }
                                            </div>
                                        }
                                        {
                                            isSubmitted && !user.password &&
                                            <div className="form-error signup-form-error">
                                                Please enter a password
                                            </div>
                                        }
                                    </div>

                                    <div className="form-group form-step">
                                        <input
                                            className={`form-control large-input` + (isSubmitted && !user.confirmPassword ? ' form-step-has-error' : '')}
                                            name        = "confirmPassword"
                                            value       = { user.confirmPassword }
                                            type        = "password"
                                            label       = "ConfirmPassword"
                                            placeholder = "Confirm Password"
                                            onChange    = { this.handlePasswordMatch }
                                        />
                                        {
                                            !isConfPassValid &&
                                            <div className="form-error signup-form-error">
                                                { formErrors.confirmPassword }
                                            </div>
                                        }
                                        {
                                            isSubmitted && !user.confirmPassword &&
                                            <div className="form-error signup-form-error">
                                                Please re-enter your password
                                            </div>
                                        }
                                    </div>

                                    <div className="form-group looking-for-step">
                                        <div className="button-group">
                                            <label className="btn signup-objective-label signup-objective-label-left">
                                                <input className="signup-objective-radio-left" id="lookingToHire"
                                                       value="Employer" type="radio"/>Hire
                                            </label>
                                            <label className="btn signup-objective-label signup-objective-label-right">
                                                <input className="signup-objective-radio-right" id="lookingForWork"
                                                       value="Worker" type="radio"/>Work
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-group form-step">
                                        <button id="signupBtn" type="submit"
                                                className="form-control large-input btn btn-info btn-large btn-submit btn-create-account">
                                            Create Account
                                        </button>
                                    </div>

                                </form>

                                <small className="login-form-signup-terms">
                                    By registering you confirm that you accept the <a className="a-tag">Terms
                                    and Conditions </a>
                                    and <a className="a-tag">Privacy Policy</a>
                                </small>

                            </div>
                            <div className="modal-footer">
                                <span className="login-form-signup-link">
                                    Already a Freelancer.com member?&nbsp;
                                    <Link to="/login" className="a-tag">Log In</Link>
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
        register : (user) => dispatch(userDispatch.register(user))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);