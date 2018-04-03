import React, {Component}   from 'react';
import { connect }          from 'react-redux';
import { history }          from "../../helper/history";
import NavBar               from '../../helper/navbar';
import {mainProjectActions} from "../../redux/actions/project/main.project.actions";
import '../../stylesheet/dashboard.css'

class DashboardPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            publishedDetails        : [],
            publishedDetailsStatus  : false,
            bidDetails              : [],
            bidDetailsStatus        : false,
            flipView                : 'EMPLOYER'
        }
    };

    componentWillMount() {

        const user = this.props.userDetails.user;

        mainProjectActions.userPublishedDetailsAction(user.username).then((userPublishedProjects) => {
            this.setState({
                publishedDetailsStatus  : userPublishedProjects.publishedDetailsStatus,
                publishedDetails        : userPublishedProjects.publishedDetails
            });
        });

        mainProjectActions.userBidDetailsAction(user.user_id).then((userBidProjects) => {
            this.setState({
                bidDetailsStatus    : userBidProjects.bidDetailsStatus,
                bidDetails          : userBidProjects.bidDetails
            });
        });

    }

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

        const { publishedDetailsStatus, publishedDetails, bidDetailsStatus, bidDetails, flipView } = this.state;

        return (
            <div className="main-content">

                <NavBar searchAllowed={true} currentPage={"dashboard"}/>

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
                                                    publishedDetails.map((data) =>
                                                        <tr key={data.project_id}>
                                                            <td className="db-content-td">{data.title}</td>
                                                            <td className="db-content-td">{data.avg_bid}</td>
                                                            <td className="db-content-td">{data.freelancer_username}
                                                                {
                                                                    !data.freelancer_username &&
                                                                    <button className="btn btn-primary"
                                                                            id="hire-me-button"
                                                                            value={data.project_id}
                                                                            onClick={this.handleSubmitPost.bind(this, "/hire-project")}>
                                                                        Hire
                                                                    </button>
                                                                }
                                                            </td>
                                                            <td className="db-content-td">{data.complete_by_shortdate}</td>
                                                            <td className="db-content-td">{data.status}</td>
                                                        </tr>
                                                    )
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
                                                    bidDetails.map((data) =>
                                                        <tr key={data.project_id}>
                                                            <td className="db-content-td">{data.title}</td>
                                                            <td className="db-content-td">{data.emp_username}</td>
                                                            <td className="db-content-td">{data.avg_bid}</td>
                                                            <td className="db-content-td">{data.bid_price}</td>
                                                            <td className="db-content-td">{data.status}</td>
                                                        </tr>
                                                    )
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