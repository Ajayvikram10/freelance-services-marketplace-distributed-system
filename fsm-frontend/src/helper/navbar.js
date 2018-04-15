import React, { Component } from 'react';
import { connect }          from 'react-redux';
import { history }          from "./history";
import { userDispatch }     from "../redux/actions/user/user.dispatch";
import '../stylesheet/navbar.css'


class NavBar extends Component {

    handleNavSubmit(nextPage, e) {
        e.preventDefault();
        history.push(nextPage);
    }

    handleLogout = (e) => {
        e.preventDefault();
        this.props.logout();
    };


    render() {

        const currentPage = this.props.currentPage;

        return (
            <div className="nb-con fixed-top">
                <div className="nb-inside-con">
                    <nav className="nb-con-nav navbar navbar-expand-lg">
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                                data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                            <span className="navbar-toggler-icon"></span>
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                                <li
                                    onClick = { this.handleNavSubmit.bind(this, "/home") }
                                    className={`nav-item nv-itm ` + (currentPage === 'home' ? 'is-active' :'' )}
                                >
                                    <span className="nav-link nv-link">Home</span>
                                </li>

                                <li
                                    onClick = { this.handleNavSubmit.bind(this, "/dashboard") }
                                    className={`nav-item nv-itm ` + (currentPage === 'dashboard' ? 'is-active' :'' )}
                                >
                                    <span className="nav-link nv-link">Dashboard</span>
                                </li>
                                <li
                                    onClick = { this.handleNavSubmit.bind(this, "/profile") }
                                    className={`nav-item nv-itm ` + (currentPage === 'profile' ? 'is-active' :'' )}
                                >
                                    <span className="nav-link nv-link">Profile</span>
                                </li>
                                <li
                                    onClick = { this.handleNavSubmit.bind(this, "/transaction") }
                                    className={`nav-item nv-itm ` + (currentPage === 'transaction' ? 'is-active' :'' )}
                                >
                                    <span className="nav-link nv-link">My Transactions</span>
                                </li>
                            </ul>
                            <ul className="ul-list-style">
                                <li className="nb-btn">
                                    <button type="button" className = "pap-link"
                                            onClick = { this.handleNavSubmit.bind(this, "/post-project") }>
                                        Post a Project
                                    </button>
                                </li>
                            </ul>
                            <ul className="ul-list-style logout-margin">
                                <button type="button" className="nb-btn-logout"
                                        onClick = { this.handleLogout }>
                                    Logout
                                </button>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(userDispatch.logout())
    };
}

export default connect(null, mapDispatchToProps)(NavBar);