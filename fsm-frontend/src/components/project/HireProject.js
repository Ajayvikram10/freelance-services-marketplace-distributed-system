import React, { Component } from 'react';
import queryString          from 'query-string';
import { connect }          from 'react-redux';
import NavBar               from "../../helper/navbar";
import {history}            from "../../helper/history";
import {projectWebService}  from "../../services/project.services";
import profile_image        from '../../images/profile/profile-image.png';


import "../../stylesheet/hire-bid.css";

class HireProject extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
            Your_Total_Bid:'0',
            Weekly_Milestone:'0',
            filenames:[]
        };

    };

    componentWillMount() {

        let parsed = queryString.parse( this.props.location.search );

        console.log(parsed.project_id);
        let projectId = parsed.project_id;

        projectWebService.fetchProjectBidDetailsWS({ projectId : projectId })
            .then(
                response => {
                    console.log("hire pro");
                    console.log(response.data.bidDetails);
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


    handleSubmit( e) {
        e.preventDefault();

        let data = {
            freelancer_username:e.target.value,
            project_id:this.state.project_details.project_id,
        };

        projectWebService.hireFreelancerWS(data)
            .then(
                response => {
                    console.log(response);
                    history.push("/home")
                },
                error => {
                    console.log(error);
                }
            );
    }


    render() {
        return (
            <div>
                <NavBar />
                <div className="jumbotron">
                    <div className="row col-sm-8 col-sm-offset-2">
                        <div className="col-md-12 col-md-offset-0">
                            <span className="ProjectTitleBid"> {this.state.project_details.title}</span>
                        </div>
                    </div>

                    <div className="col-sm-8 col-sm-offset-2">
                        <div className="col-md-12 col-md-offset-0">
                            <div className="row panel panel-primary ml-0" id="shadowPanel">
                                <div className="row BidProject-ProjectDetailHeader">
                                    <div className="col-sm-2 col-sm-offset-0" id="ProjectDetailBox">
                                        <span>Bids</span>
                                        <br/><span
                                        className="ProjectHeaderValue">
                                            {this.state.bid_header.bid_count}
                                        </span>
                                    </div>
                                    <div className="col-sm-2 col-sm-offset-0" id="ProjectDetailBox">


                                        <span>Avg Bid</span>
                                        <br/><span
                                        className="ProjectHeaderValue">{Number(this.state.bid_header.average_bid).toFixed(2)}$</span>
                                    </div>
                                    <div className="col-sm-3 col-sm-offset-0" id="ProjectDetailBox">


                                        <span>Project Budget </span>
                                        <br/><span
                                        className="ProjectHeaderValue">{this.state.project_details.budget_range}</span>
                                    </div>
                                    <div className="col-sm-4 col-sm-offset-0" id="ProjectDetailBoxEnd">
                                        <span>Expected</span>
                                        <br/><span
                                        className="ProjectHeaderValue">{this.state.project_details.complete_by_shortdate}</span>

                                    </div>

                                </div>
                            </div>
                            <div className="panel panel-primary" id="shadowPanel">
                                <div className="row ProjectDetails">
                                    <div className="col-sm-8 col-sm-offset-0">
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
                                    <div className="col-sm-4 project-div">
                                        <div className="mb-5"> </div>
                                        <div id="textrightshift100" className="div-align-bottom"><b>Project Id: </b>{this.state.project_details.project_id}</div>
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
                                            <tr key={data.id}>
                                                <td> <img alt="Profile" className="ProfileImageIcon" src={`http://localhost:3000/profile_images/${data.username}.jpg`} onError={(e)=>{e.target.src=profile_image}}/></td>
                                                <td className="pl-2">
                                                    <p className="mb-0">{data.name}</p>
                                                    <a href={`/visitor-profile/${data.username}`}> @{data.username}</a>
                                                </td>
                                                <td>{data.bid_price} USD</td>
                                                <td>{data.days_req} days</td>
                                                <td><button className="btn btn-primary" id="BidProjectButton" value={data.username} onClick={this.handleSubmit.bind(this)}>Hire
                                                </button></td>
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

export default connect(mapStateToProps)(HireProject);