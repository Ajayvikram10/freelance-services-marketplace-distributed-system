import React, {Component}   from 'react';
import { connect }          from 'react-redux';
import { history }          from "../../helper/history";
import NavBar               from '../../helper/navbar';
import {projectDispatch}    from "../../redux/actions/project/project.dispatch";
import '../../stylesheet/dashboard.css'

class DashboardPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectsPerPage         : 10,
            publishedDetails        : [],
            publishedDetailsDisplay : [],
            publishedCurrentPage    : 1,
            publishedDetailsStatus  : false,
            bidDetails              : [],
            bidDetailsDisplay       : [],
            bidDetailsCurrentPage   : 1,
            bidDetailsStatus        : false,
            flipView                : 'EMPLOYER',
        }
    };

    componentWillMount() {

        const user = this.props.userDetails.user;

        projectDispatch.userPublishedDetailsAction(user.username).then((userPublishedProjects) => {
            this.setState({
                publishedDetailsStatus  : userPublishedProjects ? userPublishedProjects.publishedDetailsStatus : false,
                publishedDetails        : userPublishedProjects ? userPublishedProjects.publishedDetails : [],
                publishedDetailsDisplay : userPublishedProjects ? userPublishedProjects.publishedDetails : []
            });
        });

        projectDispatch.userBidDetailsAction(user.user_id).then((userBidProjects) => {
            this.setState({
                bidDetailsStatus    : userBidProjects ? userBidProjects.bidDetailsStatus : false,
                bidDetails          : userBidProjects ? userBidProjects.bidDetails : [],
                bidDetailsDisplay   : userBidProjects ? userBidProjects.bidDetails : []
            });
        });
    }

    handleSearch(e) {
        e.preventDefault();

        console.log(e.target.value);
        let searchParam = e.target.value;

        const flipView = this.state.flipView;
        let filtered_array = [];
        if(flipView === 'EMPLOYER') {

            this.setState({ publishedCurrentPage: 1 });
            const { publishedDetails } = this.state;

            let filterIndex = 0;
            for (let index = 0; index < publishedDetails.length; index++) {
                // if (publishedDetails[index].title.includes(searchParam)) {
                if ((new RegExp(searchParam, 'i')).test(publishedDetails[index].title)) {
                    console.log(publishedDetails[index]);
                    console.log(publishedDetails[index].title);
                    filtered_array[filterIndex++] = publishedDetails[index];
                }
            }
            if (filtered_array.length > 0) {
                this.setState( { publishedDetailsDisplay: filtered_array } );
            }
            else {
                this.setState( { publishedDetailsDisplay : [] } );
            }
        }
        else if (flipView === 'FREELANCER') {

            this.setState({ bidDetailsCurrentPage: 1 });
            const { bidDetails } = this.state;

            let filterIndex = 0;
            for (let index = 0; index < bidDetails.length; index++) {
                if ((new RegExp(searchParam, 'i')).test(bidDetails[index].title)) {
                    filtered_array[filterIndex++] = bidDetails[index];
                }
            }
            if (filtered_array.length > 0)
                this.setState( { bidDetailsDisplay : filtered_array } );
            else {
                this.setState( { bidDetailsDisplay : [] } );
            }
        }
    }

    handlePublishedPagination = (pageNumber) => {
        this.setState({
            publishedCurrentPage: Number(pageNumber)
        });
    };

    handleBidPagination = (pageNumber) => {
        this.setState({
            bidDetailsCurrentPage: Number(pageNumber)
        });
    };

    onFlip = (event) => {

        event.preventDefault();
        this.setState({
            flipView    : event.target.value
        });
    }

    handleSubmitPost(projectPage, e) {
        e.preventDefault();
        let project_id = e.target.value;
        history.push(projectPage + "?project_id=" + project_id);
    }

    handleSubmit(nextPage, e) {
        history.push(nextPage);
    }

    render() {

        const { publishedDetailsStatus, publishedCurrentPage,
                publishedDetailsDisplay, bidDetailsStatus, bidDetailsCurrentPage,
                bidDetailsDisplay, flipView, projectsPerPage } = this.state;

        let currentPublishedProjects, currentBidProjects;
        const publishedPageNumbers = [];
        const bidPageNumbers = [];

        if (publishedDetailsDisplay) {
            // Logic for displaying current items
            const indexOfLastItem   = publishedCurrentPage * projectsPerPage;
            const indexOfFirstItem  = indexOfLastItem - projectsPerPage;
            currentPublishedProjects     = publishedDetailsDisplay.slice(indexOfFirstItem, indexOfLastItem);

            // Logic for displaying page numbers
            for (let i = 1; i <= Math.ceil(publishedDetailsDisplay.length / projectsPerPage); i++) {
                publishedPageNumbers.push(i);
            }
        }

        if(bidDetailsDisplay) {
            // Logic for displaying current items
            const indexOfLastItem   = bidDetailsCurrentPage * projectsPerPage;
            const indexOfFirstItem  = indexOfLastItem - projectsPerPage;
            currentBidProjects = bidDetailsDisplay.slice(indexOfFirstItem, indexOfLastItem);

            // Logic for displaying page numbers
            for (let i = 1; i <= Math.ceil(bidDetailsDisplay.length / projectsPerPage); i++) {
                bidPageNumbers.push(i);
            }
        }

        const renderPublishedPageNumbers = publishedPageNumbers.map(number => {
            return (
                <li key={ number } id={ number } className="pagination-item">
                    <a className="pagination-item-link" onClick = { () => this.handlePublishedPagination(number) } >
                        { number }
                    </a>
                </li>
            );
        });

        const renderBidPageNumbers = bidPageNumbers.map(number => {
            return (
                <li key={ number } id={ number } className="pagination-item">
                    <a className="pagination-item-link" onClick = { () => this.handleBidPagination(number) } >
                        { number }
                    </a>
                </li>
            );
        });

        return (
            <div className="main-content">

                <NavBar currentPage={"dashboard"}/>

                <div className="db-container">
                    <div className="db-main-content">
                        <div>
                            {
                                (flipView === 'EMPLOYER') &&
                                <h1 className="db-title">Published Projects</h1>
                            }
                            {
                                (flipView === 'FREELANCER') &&
                                <h1 className="db-title">You have Bid on</h1>
                            }

                            <div className="ul-list-style search-style center-search">
                                <div className="search-container">
                                    <div className="search-inner-container">
                                        <span className="search-icon fa fa-search fa-lg"></span>
                                        <input
                                            placeholder="Search Project name ..."
                                            ref={input => this.search = input}
                                            className="form-control search-bar"
                                            onChange={this.handleSearch.bind(this)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="freelancer-toggle">
                                <input
                                    id="employerOption"
                                    className="db-radio-input"
                                    name="EMPLOYER"
                                    value="EMPLOYER"
                                    checked={flipView === 'EMPLOYER'}
                                    type="radio"
                                    label="DashboardEmployer"
                                    onChange={this.onFlip}
                                />
                                <label
                                    className={flipView === 'EMPLOYER' ? 'db-radio-label-on' : 'db-radio-label-off'}
                                    htmlFor="employerOption"
                                >
                                    Employer
                                </label>

                                <input
                                    id="freelancerOption"
                                    className="db-radio-input"
                                    name="FREELANCER"
                                    value="FREELANCER"
                                    checked={flipView === 'FREELANCER'}
                                    type="radio"
                                    label="DashboardFreelancer"
                                    onChange={this.onFlip}
                                />
                                <label
                                    className={flipView === 'FREELANCER' ? 'db-radio-label-on' : 'db-radio-label-off'}
                                    htmlFor="freelancerOption"
                                >
                                    Freelancer
                                </label>
                            </div>
                        </div>

                        <div>
                            {
                                (flipView === 'EMPLOYER') &&
                                <div className="panel panel-primary">
                                    <div>
                                        {
                                            !publishedDetailsStatus &&
                                            <table className="m-table" id="shadowpanel">
                                                <thead>
                                                <tr>
                                                    <th className="content-title">Project Name</th>
                                                    <th className="content-avg-bid">Average Bid</th>
                                                    <th className="content-freelnc">Freelancer</th>
                                                    <th className="content-com-by">Complete by</th>
                                                    <th className="content-status">Status</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td className="db-create-project" colSpan="6">
                                                        <a
                                                            className="db-create-link"
                                                            href="/post-project"
                                                        >
                                                            <h4 className="db-create-link-h4">
                                                                Create a New Project
                                                            </h4>

                                                        </a>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        }
                                        {
                                            publishedDetailsStatus &&
                                            <table className="m-table" id="shadowpanel">
                                                <thead>
                                                <tr>
                                                    <th className="content-title">Project Name</th>
                                                    <th className="content-avg-bid">Average Bid</th>
                                                    <th className="content-freelnc">Freelancer</th>
                                                    <th className="content-com-by">Complete by</th>
                                                    <th className="content-status">Status</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    currentPublishedProjects.map((data) =>
                                                        <tr key={data.id}>
                                                            <td className="db-content-td">{data.title}</td>
                                                            <td className="db-content-td">{data.avg_bid}</td>
                                                            <td className="db-content-td">{data.freelancer_username}
                                                                {
                                                                    !data.freelancer_username &&
                                                                    <button className="btn btn-primary"
                                                                            id="hire-me-button"
                                                                            value={data.id}
                                                                            onClick={this.handleSubmitPost.bind(this, "/hire-project")}>
                                                                        Hire
                                                                    </button>
                                                                }
                                                            </td>
                                                            <td className="db-content-td">{data.complete_by}</td>
                                                            <td className="db-content-td">{data.status}</td>
                                                        </tr>
                                                    )
                                                }
                                                {
                                                    currentPublishedProjects.length > 0 &&
                                                    <tr className="pagination-tr">
                                                        <ul className="pagination">
                                                            { renderPublishedPageNumbers }
                                                        </ul>
                                                    </tr>
                                                }
                                                {
                                                    currentPublishedProjects.length === 0 &&
                                                    <tr>
                                                        <td className="home-no-project" colSpan="6">
                                                            <h4 className="home-no-project-h4">
                                                                No results matches your search
                                                            </h4>
                                                        </td>
                                                    </tr>
                                                }
                                                </tbody>
                                            </table>
                                        }
                                    </div>
                                </div>
                            }


                            {
                                (flipView === 'FREELANCER') &&
                                <div className="panel panel-primary">
                                    <div>
                                        {
                                            !bidDetailsStatus &&
                                            <table className="m-table" id="shadowpanel">
                                                <thead>
                                                <tr>
                                                    <th className="content-title">Project Name</th>
                                                    <th className="content-avg-bid">Average Bid</th>
                                                    <th className="content-freelnc">Freelancer</th>
                                                    <th className="content-com-by">Complete by</th>
                                                    <th className="content-status">Status</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td className="db-create-project" colSpan="6">
                                                        <a
                                                            className="db-create-link"
                                                            href="/home"
                                                        >
                                                            <h4 className="db-create-link-h4">
                                                                No bids yet!
                                                                <br/>Checkout Open Projects here
                                                            </h4>

                                                        </a>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        }
                                        {
                                            bidDetailsStatus &&
                                            <table className="m-table" id="shadowpanel">
                                                <thead>
                                                <tr>
                                                    <th className="content-title">Project Name</th>
                                                    <th className="content-emp">Employer</th>
                                                    <th className="content-avg-bid">Avg Bid</th>
                                                    <th className="content-avg-bid">Your Bid</th>
                                                    <th className="content-status">Status</th>
                                                </tr>
                                                </thead>
                                                <tbody>

                                                {
                                                    currentBidProjects.map((data) =>
                                                        <tr key={data.id}>
                                                            <td className="db-content-td">{data.title}</td>
                                                            <td className="db-content-td">{data.emp_username}</td>
                                                            <td className="db-content-td">{data.avg_bid}</td>
                                                            <td className="db-content-td">{data.bid_price}</td>
                                                            <td className="db-content-td">{data.status}</td>
                                                        </tr>
                                                    )
                                                }
                                                {
                                                    currentBidProjects.length > 0 &&
                                                    <tr className="pagination-tr">
                                                        <ul className="pagination">
                                                            { renderBidPageNumbers }
                                                        </ul>
                                                    </tr>
                                                }
                                                {
                                                    currentBidProjects.length === 0 &&
                                                    <tr>
                                                        <td className="home-no-project" colSpan="6">
                                                            <h4 className="home-no-project-h4">
                                                                No results matches your search
                                                            </h4>
                                                        </td>
                                                    </tr>
                                                }
                                                </tbody>
                                            </table>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {

    const { userDetails } = state;
    return {
        userDetails
    };

}

export default connect(mapStateToProps)(DashboardPage);