import React, { Component } from 'react';
import queryString          from 'query-string';
import { connect }          from 'react-redux';
import NavBar               from "../../helper/navbar";
import {history}            from "../../helper/history";
import {projectWebService}  from "../../services/project.services";
import profile_image        from '../../images/profile/profile-image.png';
import moment               from 'moment';

import "../../stylesheet/hire-bid.css";
import {transactionWebService} from "../../services/transaction.services";
import Alert from "react-s-alert";

class HireProject extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project_details: {
                "_id": {
                    "id"                    : '',
                    "emp_username"          : '',
                    "title"                 : '',
                    "description"           : '',
                    "budget_range"          : '',
                    "skills_req"            : [],
                    "complete_by_shortdate" : '',
                    "filenames"             : '',
                    "name"                  : ''
                }
            },
            bid_table_data      : {},
            bid_header          : {
                "bid_count"     : '',
                "average_bid"   : '',
            },
            showtable           : false,
            bid_price           : '0',
            bid_date            : '0',
            Project_Fee         :'0',
            Your_Total_Bid      :'0',
            Weekly_Milestone    :'0',
            filenames           :[],
            sort                : {
                column          : null,
                direction       : 'desc',
            },
            project_status      : true,
            status_Submitted    : false,
            status_Closed       :false,
            freelancer_fees     : 0,
            sum                 : 0,
        };

    };

    componentWillMount() {

        let parsed = queryString.parse( this.props.location.search );

        let projectId = parsed.project_id;
        const user  = this.props.userDetails.user;
        console.log("before");
        projectWebService.fetchProjectDetailsWS(projectId)
            .then(
                response => {
                    if (response.data.projectDetails.length === 0) {
                        history.push('/home');  //home page if no project found
                    }
                    this.setState({"project_details": response.data.projectDetails[0]});

                    if(response.data.projectDetails[0]._id.filenames && response.data.projectDetails[0]._id.filenames.indexOf(",") > 0)
                        this.setState({"filenames": response.data.projectDetails[0]._id.filenames.split(",")});
                    else
                        this.setState({"filenames": []});

                    if (response.data.projectDetails[0]._id.freelancer_files && response.data.projectDetails[0]._id.freelancer_files.indexOf(",") > 0)
                        this.setState({"freelancer_files": response.data.projectDetails[0]._id.freelancer_files.split(",")});
                    else
                        this.setState({"freelancer_files": []});

                    if (response.data.projectDetails[0]._id.status === "ASSIGNED") {
                        this.setState({"project_status": false});
                    }
                    if (response.data.projectDetails[0]._id.status === "SUBMITTED") {
                        this.setState({"status_Submitted": true});
                    }

                    if (response.data.projectDetails[0]._id.status === "CLOSED") {
                        this.setState({"status_Closed": true});
                    }
                    console.log("response.data.projectDetails FILES");
                    console.log(response.data.projectDetails);
                    projectWebService.fetchProjectBidDetailsWS({ projectId : projectId }).then(
                        response_inside => {
                            console.log("after");
                            console.log(response_inside.data.bidDetails);
                            console.log("response_inside.data.bidDetails");
                            this.setState({"bid_table_data": response_inside.data.bidDetails});
                            if (response_inside.data.bidDetails.length > 0 && response_inside.data.bidDetails[0].bids) {

                                this.setState({"showtable": true});
                                for (let i = 0; i < response_inside.data.bidDetails.length; i++) {
                                    console.log("inside loop");
                                    if (response_inside.data.bidDetails[i].bids && response.data.projectDetails[0]._id.freelancer_username === response_inside.data.bidDetails[i].bids.username) {
                                        this.setState({"freelancer_fees": response_inside.data.bidDetails[i].bids.bid_price});
                                        break;
                                    }
                                }
                            }

                        });
                });

        transactionWebService.fetchTransactionDetailsWS()
            .then(
                response => {
                    let sum = 0;
                    for (let i = 0; i < response.data.transactionDetails.length; i++) {
                        if (response.data.transactionDetails[i].type === "Add") {
                            sum += response.data.transactionDetails[i].amount;
                        }
                        else if (response.data.transactionDetails[i].type === "Withdraw") {
                            sum -= response.data.transactionDetails[i].amount;
                        }
                        else if (response.data.transactionDetails[i].type === "Transfer" && response.data.transactionDetails[i].from === user.username) {
                            sum -= response.data.transactionDetails[i].amount;
                        }
                        else if (response.data.transactionDetails[i].type === "Transfer" && response.data.transactionDetails[i].to === user.username) {
                            sum += response.data.transactionDetails[i].amount;
                        }
                    }
                    this.setState({sum: sum});
                },
                error => {
                    console.log(error);
                }
            );

    }

    onSort = (column) => (e) => {
        const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const sortedData = this.state.bid_table_data.sort((first, second) => {
            if (column === 'bid_price') {
                const first_bid = first.bids.bid_price;
                const second_bid = second.bids.bid_price;
                if (first_bid < second_bid) {
                    return -1;
                }
                if (first_bid > second_bid) {
                    return 1;
                }
                return 0;
            }
        });

        if (direction === 'desc') {
            sortedData.reverse();
        }

        this.setState({
            bid_table_data: sortedData,
            sort: {
                column,
                direction,
            }
        });
    };


    handleSubmit( e) {
        e.preventDefault();

        let data = {
            freelancer_username: e.target.value,
            project_id: this.state.project_details._id.id,
        };

        projectWebService.hireFreelancerWS(data)
            .then(
                response => {
                    Alert.info("Hired", {
                        effect: 'jelly',
                        timeout: 1500,
                        offset: 50
                    });
                    history.push("/home")
                },
                error => {
                }
            );
    }

    handlePayMoney = (event) => {

        const user  = this.props.userDetails.user;

        event.preventDefault();

        let dif = this.state.sum - this.state.freelancer_fees;
        if (dif < 0) {
            Alert.error("Insufficient funds in your account!", {
                effect: 'jelly',
                timeout: 1500,
                offset: 50
            });
        }
        else {
            const Transaction = {
                from        : user.username,
                to          : this.state.project_details._id.freelancer_username,
                type        : "Transfer",
                amount      : this.state.freelancer_fees,
                project     : this.state.project_details._id.id,
            };

            transactionWebService.makeTransactionWS(Transaction).then(
                response => {
                    Alert.info(response.data.message, {
                        effect: 'jelly',
                        timeout: 3000,
                        offset: 50
                    });
                    history.push("/dashboard")
                },
                error => {

                }
            );
        }
    };

    render() {

        console.log("this.state.freelancer_files");
        console.log(this.state.project_details._id.freelancer_username);
        console.log("sum");
        console.log(this.state.sum);

        return (
            <div>
                <NavBar />
                <div className="main-content">
                    <div className="row ml-0 mr-0 mt-3 row-bid-height">
                        <div className="col-md-12 col-md-offset-0">
                            <span className="ProjectTitleBid"> {this.state.project_details._id.title}</span>
                        </div>
                    </div>

                    <div>
                        <div>
                            <div className = "row ml-0 mr-0">
                                <div className="col-md-12">
                            <div className="row panel panel-primary ml-0" id="shadowPanel-bid">
                                <div className="row BidProject-ProjectDetailHeader">
                                    <div className="col-sm-2 col-sm-offset-0" id="ProjectDetailBox">
                                        <span>Bids</span>
                                        <br/><span
                                        className="ProjectHeaderValue">
                                            {this.state.project_details._id.bid_count}
                                        </span>
                                    </div>
                                    <div className="col-sm-2 col-sm-offset-0" id="ProjectDetailBox">


                                        <span>Avg Bid</span>
                                        <br/><span
                                        className="ProjectHeaderValue">{Number(this.state.project_details.avg_bid).toFixed(2)}$</span>
                                    </div>
                                    <div className="col-sm-3 col-sm-offset-0" id="ProjectDetailBox">


                                        <span>Project Budget </span>
                                        <br/><span
                                        className="ProjectHeaderValue">{this.state.project_details._id.budget_range}</span>
                                    </div>
                                    <div className="col-sm-4 col-sm-offset-0" id="ProjectDetailBoxEnd">
                                        <span>Expected</span>
                                        <br/><span
                                        className="ProjectHeaderValue">{moment(this.state.project_details._id.complete_by).format("MM-DD-YYYY")}</span>

                                    </div>

                                </div>
                            </div>
                                </div>
                            </div>
                            <div className = "row ml-0 mr-0">
                                <div className="col-md-12">
                            <div className="panel panel-primary" id="shadowPanel-bid">
                                <div className="row ProjectDetails">
                                    <div className="col-sm-8 col-sm-offset-0">
                                        <span className="ProjectTitleSubheading"> Project Description </span>
                                        <br/>
                                        <span>{this.state.project_details._id.description}</span>
                                        <br/>
                                        <br/>
                                        <span className="ProjectTitleSubheading"> Employer</span>
                                        <span>{this.state.project_details.name}
                                            <a href={`/visitor-profile/${this.state.project_details._id.emp_username}`}>@{this.state.project_details._id.emp_username}</a>
                                        </span>
                                        <br/>
                                        <br/>
                                        <span className="ProjectTitleSubheading"> Skills Required</span>
                                        <span>{this.state.project_details._id.skills_req.join(", ")}</span>
                                        <br/>
                                        <br/>
                                        <span className="ProjectTitleSubheading">Files</span>
                                        <span>
                                            {
                                                this.state.filenames &&
                                                this.state.filenames.map((data) =>
                                                    <div key={data}>
                                                        <a target="_blank" href={`/project_files/${this.state.project_details._id.emp_username}/${data}`}>
                                                            {data}
                                                        </a>
                                                        <br/>
                                                    </div>
                                                )
                                            }
                                        </span>
                                        <br/>
                                    </div>
                                    <div className="col-sm-4 project-div">
                                        <div className="row"><b>Project Id:  &nbsp;</b> {this.state.project_details._id.id}</div>
                                    </div>
                                </div>
                            </div>
                                </div>
                            </div>

                            {
                                !this.state.status_Submitted &&
                                    !this.state.status_Closed &&
                                <div className="row ml-0 mr-0">
                                    <div className="col-md-12">
                                        <div className="panel panel-primary" id="shadowPanel-bid">
                                            <div className="BidDetailsTable">
                                                <table className="bids m-table w-100">
                                                    <thead>
                                                    <tr className="BidProject-ProjectFeedTitle pt-2">
                                                        <th>Profile Image</th>
                                                        <th>Freelancer Name</th>
                                                        <th onClick={this.onSort('Bid Price')}>
                                                            Bid Price
                                                            {
                                                                this.state.sort.column &&
                                                                this.state.sort.direction === 'desc' &&
                                                                <i class="ml-1 fa fa-sort-desc"></i>
                                                            }
                                                            {
                                                                this.state.sort.column &&
                                                                this.state.sort.direction === 'asc' &&
                                                                <i class="ml-1 fa fa-sort-asc"></i>
                                                            }
                                                        </th>
                                                        <th>Period Days</th>
                                                        <th></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        !this.state.showtable &&
                                                        <tr>
                                                            <td>No one has bid yet!</td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                        </tr>
                                                    }
                                                    {this.state.showtable &&
                                                    this.state.bid_table_data.map((data) =>
                                                        <tr key={data._id + data.bids.username}>
                                                            <td><img alt="Profile" className="ProfileImageIcon"
                                                                     src={`/profile_images/${data.bids.username}/${data.bids.username}.jpg`}
                                                                     onError={(e) => {
                                                                         e.target.src = profile_image
                                                                     }}/></td>
                                                            <td className="pl-2">
                                                                <p className="mb-0">{data.bids.name}</p>
                                                                <a href={`/visitor-profile/${data.bids.username}`}> @{data.bids.username}</a>
                                                            </td>
                                                            <td>{data.bids.bid_price} USD</td>
                                                            <td>{data.bids.days_req} days</td>
                                                            <td>
                                                                {
                                                                    this.state.project_details._id.freelancer_username != data.bids.username
                                                                    &&
                                                                    <button className="btn btn-primary"
                                                                            id="BidProjectButton"
                                                                            value={data.bids.username}
                                                                            onClick={this.handleSubmit.bind(this)}>Hire
                                                                    </button>
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                this.state.status_Submitted &&
                                <div className = "row ml-0 mr-0">
                                    <div className="col-md-12">

                                        <div className="panel panel-primary panel-bid" id="shadowPanel">

                                            <table className="m-table" id="shadowpanel">
                                                <thead>
                                                <tr className="BidProject-ProjectFeedTitle">
                                                    <th className="hm-content-title-hire">Pay to</th>
                                                    <th className="hm-content-avg-bid">Freelancer Fees</th>
                                                    <th className="hm-content-freelnc">Your Balance</th>
                                                    <th className="hm-content-budget">Files</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                        <tr key={this.state.project_details._id.freelancer_username} className="btn-display">
                                                            <td>
                                                                {this.state.project_details._id.freelancer_username && <a href={`/visitor-profile/${this.state.project_details._id.freelancer_username}`}> @{this.state.project_details._id.freelancer_username}</a> }
                                                            </td>
                                                            <td className="hm-content-td">{this.state.freelancer_fees}</td>
                                                            <td className="hm-content-td">{this.state.sum}</td>
                                                            <td>
                                                                <div className="row">
                                                                    <div className="col-sm-6">
                                                                    <span>
                                                                        {
                                                                            this.state.freelancer_files &&
                                                                            this.state.freelancer_files.map((data) =>
                                                                                data &&
                                                                                <div key={data}>
                                                                                    <a target="_blank"
                                                                                       href={`/project_files/${this.state.project_details._id.freelancer_username}/${data}`}>
                                                                                        {data}
                                                                                    </a>
                                                                                    <br/>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </span>
                                                                    </div>
                                                                    <div className="col-sm-6 mt-3">
                                                                        <button className="btn btn-primary" id="hm-bid-now-btn"
                                                                                // value={data._id}
                                                                                onClick={this.handlePayMoney.bind(this)}
                                                                        >Pay Freelancer
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                this.state.status_Closed &&
                                <div className="row ml-0 mr-0">
                                    <div className="col-md-12">

                                        <div className="panel panel-primary panel-bid" id="shadowPanel">

                                            <table className="m-table" id="shadowpanel">
                                                <thead>
                                                <tr className="BidProject-ProjectFeedTitle">
                                                    <th className="hm-content-title-hire">Freelancer Involved</th>
                                                    <th className="hm-content-avg-bid">Freelancer Fees Paid</th>
                                                    <th className="hm-content-budget">Files</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr key={this.state.project_details._id.freelancer_username}
                                                    className="btn-display">
                                                    <td>
                                                        {this.state.project_details._id.freelancer_username &&
                                                        <a href={`/visitor-profile/${this.state.project_details._id.freelancer_username}`}> @{this.state.project_details._id.freelancer_username}</a>}
                                                    </td>
                                                    <td className="hm-content-td">{this.state.freelancer_fees}</td>
                                                    <td>
                                                        <div className="row">
                                                            <div className="col-sm-12" style={{paddingLeft: 60}}>
                                                                    <span>
                                                                        {
                                                                            this.state.freelancer_files &&
                                                                            this.state.freelancer_files.map((data) =>
                                                                                data &&
                                                                                <div key={data}>
                                                                                    <a target="_blank"
                                                                                       href={`/project_files/${this.state.project_details._id.freelancer_username}/${data}`}>
                                                                                        {data}
                                                                                    </a>
                                                                                    <br/>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
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

export default connect(mapStateToProps)(HireProject);