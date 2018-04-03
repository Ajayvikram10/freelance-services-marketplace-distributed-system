import React, { Component } from 'react';
import {connect}            from 'react-redux';
import {history}            from "../../helper/history";
import profile_image        from '../../images/profile/profile-image.png';
import NavBar               from "../../helper/navbar";
import queryString          from 'query-string';
import "../../stylesheet/hire-bid.css";
import {projectWebService} from "../../services/project.services";

class BidProject extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bid_button: false,
            project_details: {
                "project_id": '',
                "emp_username": '',
                "title": '',
                "description": '',
                "budget_range": '',
                "skills_req": '',
                "complete_by_shortdate": '',
                "filenames": '',
                "name": ''
            },
            bid_table_data: {},
            bid_header: {
                "bid_count": '',
                "average_bid": '',
            },
            showtable: false,
            bid_price: '0',
            bid_date: '0',
            Project_Fee:'0',
            Freelancer_fee:'0',
            Your_Total_Bid:'0',
            filenames:[]
        };
        this.handleChange = this.handleChange.bind(this);
    };

    handleChange(e) {

        const { name, value } = e.target;
        this.setState({ [name]: value });

        let bid= this.refs.bid_price.value;
        let day=this.refs.bid_date.value;

        if(bid!=='' && day!=='')
        {
            this.setState({ Project_Fee: (bid/day).toFixed(2) });
            this.setState({ Freelancer_fee: (0.1*bid).toFixed(2) });
            this.setState({ Your_Total_Bid: (1.1*bid/day).toFixed(2) });
        }else {
            this.setState({
                Project_Fee: '0',
                Freelancer_fee: '0',
                Your_Total_Bid: '0'
            });
        }
    }

    componentWillMount() {

        let parsed = queryString.parse(this.props.location.search);

        let projectId = parsed.project_id;

        projectWebService.fetchProjectBidDetailsWS({ projectId : projectId })
            .then(
                response => {
                    console.log("bid pro");
                    console.log(response);
                    this.setState({"bid_table_data": response.data.bidDetails});
                    if (response.data.bidDetails.length > 0)
                        this.setState({"showtable": true});
                });

        projectWebService.fetchProjectDetailsWS(projectId)
            .then(
                response => {
                    this.setState({"project_details": response.data.projectDetails[0]});
                    if(this.state.project_details.filenames && this.state.project_details.filenames.indexOf(",") > 0)
                        this.setState({"filenames": this.state.project_details.filenames.split(",")});
                    else
                        this.setState({"filenames": []});
                    console.log(this.state.filenames);
                    console.log(this.state.project_details);
                });

        projectWebService.fetchBidHeaderDetailsWS(projectId)
            .then(
                response => {
                    this.setState({"bid_header": response.data.bidHeaderDetails[0]});
                    console.log(this.state.project_details);
                });
    }

    handleBidProject(e) {
        e.preventDefault();
        this.setState({
            bid_button: !this.state.bid_button,
        });
    }

    handleBid(e) {
        e.preventDefault();
        const user = this.props.userDetails.user;

        if(!isNaN(this.state.bid_price) && !isNaN(this.state.bid_date) && this.state.bid_price!=='' && this.state.bid_date!=='') {
            let data = {
                user_id:user.user_id,
                project_id:this.state.project_details.project_id,
                bid_price:this.state.bid_price,
                days_req:this.state.bid_date,

            };

            console.log(data.user_id);

            projectWebService.postBidWS(data)
                .then(
                    response => {
                        console.log(response);
                        history.push("/home")

                    },
                    error => {
                        console.log(error);
                    }
                );
        } else {
            window.alert('Invalid Input!');
        }
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="jumbotron">
                    <div className="row col-sm-8 offset-sm-2">
                        <div className="col-md-12 col-md-offset-0">
                            <span className="ProjectTitleBid"> {this.state.project_details.title}</span>
                        </div>
                    </div>
                    <div className="col-sm-8 offset-sm-2">
                        <div className="col-md-12 col-md-offset-0">
                            <div className="panel panel-primary" id="shadowPanel">
                                <div className="row BidProject-ProjectDetailHeader">
                                    <div className="col-sm-2 offset-sm-0" id="ProjectDetailBox">
                                        <span>Bids</span>
                                        <br/><span className="ProjectHeaderValue">
                                                {this.state.bid_header.bid_count}
                                            </span>
                                    </div>
                                    <div className="col-sm-2 offset-sm-0" id="ProjectDetailBox">
                                        <span>Avg Bid</span>
                                        <br/><span className="ProjectHeaderValue">
                                                {Number(this.state.bid_header.average_bid).toFixed(2)}$
                                            </span>
                                    </div>
                                    <div className="col-sm-3 offset-sm-0" id="ProjectDetailBox">
                                        <span>Project Budget </span>
                                        <br/><span className="ProjectHeaderValue">
                                                {this.state.project_details.budget_range}
                                            </span>
                                    </div>
                                    <div className="col-sm-4 offset-sm-0" id="ProjectDetailBoxEnd">
                                        <span>Expected</span>
                                        <br/><span className="ProjectHeaderValue">
                                                {this.state.project_details.complete_by_shortdate}
                                            </span>
                                    </div>
                                </div>
                            </div>
                            {   this.state.bid_button &&
                            <div className="panel panel-primary" id="shadowPanel">
                                <div className="BidDetails">
                                    <div className="col-sm-10 col-sm-offset-0">
                                        <span className="ProjectTitleSubheading">  Bid Proposal </span>
                                        <br/>
                                        <br/>
                                        <div className="row col-sm-12 offset-sm-0">
                                            <div className="col-md-4 mr-4">
                                                <b>Bid Price</b>
                                                <br/>
                                                <span className="input-group">
                                                        <span className="add-on">$</span>
                                                        <input className="BidProposal-form-input" ref="bid_price" name="bid_price" type="text" placeholder="0"  onChange={this.handleChange}/>
                                                        <span className="add-on">USD</span>
                                                    </span>
                                                <br/>
                                            </div>
                                            <div className="col-md-4 offset-md-0">
                                                <b>Bid Days</b>
                                                <br/>
                                                <span className="input-group">
                                                        <span className="add-on"> </span>
                                                        <input className="BidProposal-form-input" ref="bid_date" name="bid_date" type="text"  placeholder="0"  onChange={this.handleChange}/>
                                                        <span className="add-on">Days</span>
                                                    </span>
                                                <br/>
                                            </div>
                                        </div>
                                        <div className="row col-sm-8 offset-sm-0">
                                            <div className="col-md-6 offset-md-0">
                                                <span><em>Project Fee   </em></span>
                                            </div>
                                            <div className="col-md-6 offset-md-0">
                                                <b>${this.state.Project_Fee} USD / Day</b>
                                            </div>
                                        </div>
                                        <div className="row col-sm-8 offset-sm-0">
                                            <div className="col-md-6 offset-md-0">
                                                <span><em>Freelancer Fee   </em></span>
                                            </div>
                                            <div className="col-md-6 offset-md-2">
                                                <b>${this.state.Freelancer_fee} USD </b>
                                            </div>
                                        </div>
                                        <div className="row col-sm-8 offset-sm-0">
                                            <div className="col-md-6 offset-md-2">
                                                <span><em>Your Total Bid    </em></span>
                                            </div>
                                            <div className="col-md-6 offset-md-0">
                                                <b>${this.state.Your_Total_Bid} USD</b>
                                            </div>
                                        </div>
                                        <br/>
                                        <div className="col-sm-8 offset-sm-0" id="borderlighttop">
                                            <div className="text-right">
                                                <button className="btn btn-primary"
                                                        id="BidProjectButtonProjectDetails"
                                                        onClick={this.handleBid.bind(this)}>Place Bid</button>
                                                <a onClick={this.handleBidProject.bind(this)}>Cancel</a>
                                                <br/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }
                            <div className="panel panel-primary" id="shadowPanel">
                                <div className="row ProjectDetails">
                                    <div className="col-sm-8 offset-sm-0">
                                        <span className="ProjectTitleSubheading"> Project Description </span>
                                        <br/>
                                        <span>{this.state.project_details.description}</span>
                                        <br/>
                                        <br/>
                                        <span className="ProjectTitleSubheading"> Employer</span>
                                        <br/>
                                        <span>{this.state.project_details.name}
                                            <br/>
                                            <a href={`/visitor-profile/${this.state.project_details.emp_username}`}>@{this.state.project_details.emp_username}</a>
                                        </span>
                                        <br/>
                                        <br/>
                                        <span className="ProjectTitleSubheading"> Skills Required</span>
                                        <span>{this.state.project_details.skills_req}</span>
                                        <br/>
                                        <br/>
                                        <span className="ProjectTitleSubheading">Files</span>
                                        <span>
                                            {
                                                this.state.filenames.map((data) =>
                                                    <div key={data}>
                                                        <a target="_blank" href={`http://localhost:3000/project_files/${this.state.project_details.emp_username}/${data}`}>
                                                            {data}
                                                        </a>
                                                        <br/>
                                                    </div>
                                                )
                                            }
                                        </span>
                                        <br/>
                                    </div>
                                    <div className="col-sm-4 offset-sm-0">
                                        <button className="btn btn-primary" id="BidProjectButtonBig"
                                                onClick={this.handleBidProject.bind(this)}>Bid On This Project
                                        </button>
                                        <span id="projectID"><b>Project Id: </b></span>{this.state.project_details.project_id}
                                    </div>
                                </div>
                            </div>
                            <div className="panel panel-primary" id="shadowPanel">
                                <div className="BidDetailsTable">
                                    <table className="bids m-table w-100">
                                        <thead>
                                        <tr className="BidProject-ProjectFeedTitle pt-2">
                                            <th>Profile Image</th>
                                            <th>Freelancer Name</th>
                                            <th>Bid Price</th>
                                            <th>Period Days</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            !this.state.showtable &&
                                            <tr>
                                                <td>Be the first one to bid!</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        }
                                        {   this.state.showtable &&
                                        this.state.bid_table_data.map((data) =>
                                            <tr key={data.id}>
                                                <td> <img alt="Profile" className="ProfileImageIcon" src={`http://localhost:3000/profile_images/${data.username}.jpg`} onError={(e)=>{e.target.src=profile_image}}/></td>
                                                <td className="pl-2">
                                                    <p className="mb-0">{data.name}</p>
                                                    <a href={`/visitor-profile/${data.username}`}> @{data.username}</a>
                                                </td>
                                                <td>{data.bid_price} USD</td>
                                                <td>{data.days_req} days</td>
                                            </tr>
                                        )
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
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

export default connect(mapStateToProps)(BidProject);