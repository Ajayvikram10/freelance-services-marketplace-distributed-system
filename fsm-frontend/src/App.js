import React, { Component }         from 'react';
import { Router, Route}             from 'react-router-dom';
import { history }                  from "./helper/history";
import { alertActions }             from "./redux/actions/alert/alert.actions";
import RegisterPage                 from "./components/user/RegisterPage";
import LoginPage                    from "./components/user/LoginPage";
import HomePage                     from "./components/landing/HomePage"
import DashboardPage                from "./components/landing/DashboardPage";
import PostProject                  from "./components/project/PostProject";
import UserProfilePage              from "./components/user/UserProfilePage";
import OtherProfilePage             from "./components/user/OtherProfilePage";
import BidProject                   from "./components/project/BidProject";
import HireProject                  from "./components/project/HireProject";
import TransactionsPage             from "./components/transactions/TransactionsPage";
import { connect }                  from "react-redux";
import { userDispatch }             from "./redux/actions/user/user.dispatch";
import Alert                        from 'react-s-alert';
// mandatory
import 'react-s-alert/dist/s-alert-default.css';
// optional
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import './App.css';



class App extends Component {

    constructor(props) {
        super(props);

        history.listen((location, action) => {
            // clear alert on location change
            this.props.clearAlert();
        });
    }

    componentWillMount() {
        // Check if user is authenticated.
        this.props.authenticateUser();
    }

    render() {

        const isAuth = this.props.userDetails.isAuthenticated;

        return (

            <div className="App">

                <Router history={history}>
                    <div>

                        { !isAuth ? <Route exact path="/" component={LoginPage}/> : <Route exact path="/" component={HomePage}/> }

                        { !isAuth ? <Route exact path="/login" component={LoginPage}/> : <Route exact path="/login" component={HomePage}/> }

                        { !isAuth ? <Route exact path="/signup" component={RegisterPage}/> : <Route exact path="/signup" component={HomePage}/> }

                        { !isAuth ? <Route exact path="/home" component={LoginPage}/> : <Route exact path="/home" component={HomePage}/> }

                        { !isAuth ? <Route exact path="/dashboard" component={LoginPage}/> : <Route exact path="/dashboard" component={DashboardPage}/> }

                        { !isAuth ? <Route exact path="/profile" component={LoginPage}/> : <Route exact path="/profile" component={UserProfilePage}/> }

                        { !isAuth ? <Route exact path="/post-project" component={LoginPage}/> : <Route exact path="/post-project" component={PostProject}/> }

                        { !isAuth ? <Route exact path="/visitor-profile/:username" component={LoginPage}/> : <Route exact path="/visitor-profile/:username" component={OtherProfilePage}/>}

                        { !isAuth ? <Route exact path="/visitor-profile" component={LoginPage}/> : <Route exact path="/visitor-profile" component={UserProfilePage}/>}

                        { !isAuth ? <Route startsWith path="/bid-project" component={LoginPage}/> : <Route startsWith path="/bid-project" component={BidProject}/>}

                        { !isAuth ? <Route startsWith path="/hire-project" component={LoginPage}/> : <Route startsWith path="/hire-project" component={HireProject}/>}

                        { !isAuth ? <Route startsWith path="/transaction" component={LoginPage}/> : <Route startsWith path="/transaction" component={TransactionsPage}/>}

                    </div>
                </Router>
                <Alert stack={{limit: 3}} />
            </div>
        );
    }
}


function mapStateToProps(state) {

    const {userDetails} = state;
    return {
        userDetails
    };
}


function mapDispatchToProps(dispatch) {
    return {
        authenticateUser    : () => dispatch(userDispatch.authenticateUser()),
        clearAlert          : () => dispatch(alertActions.clear())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);