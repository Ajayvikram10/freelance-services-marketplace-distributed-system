import React, { Component } from 'react';
import {connect}            from 'react-redux';
import {history}            from "../../helper/history";
import profile_image        from '../../images/profile/profile-image.png';
import NavBar               from "../../helper/navbar";
import queryString          from 'query-string';
import "../../stylesheet/hire-bid.css";
import {projectWebService}  from "../../services/project.services";
import plusIcon             from '../../images/freelancer.logos/plus_icon.png';
import uploadIcon           from '../../images/freelancer.logos/upload_file.png';
import filesize             from "filesize";
import Dropzone             from 'react-dropzone';

class BidProject extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bid_button      : false,
            project_details : {
                "_id": {
                    "project_id"    : '',
                    "emp_username"  : '',
                    "title"         : '',
                    "description"   : '',
                    "budget_range"  : '',
                    "skills_req"    : '',
                    "complete_by"   : '',
                    "filenames"     : '',
                    "name"          : ''
                }
            },
            bid_table_data  : {},
            bid_header: {
                "_id": {
                    "bid_count" : '',
                    "avg_bid"   : ''
                }
            },
            showtable               : false,
            bid_price               : '0',
            bid_date                : '0',
            Project_Fee             : '0',
            Freelancer_Fees         : '0',
            Total_Bid               : '0',
            filenames               : [],
            sort                    : {
                column      : null,
                direction   : 'desc',
            },
            freelancer_assigned     : false,
            isUploaded              : false,
            projectFiles            : [],
        };
        this.handleChange = this.handleChange.bind(this);
    };

    handleChange(e) {

        const { name, value } = e.target;
        this.setState({ [name]: value });

        let bid= this.refs.bid_price.value;
        let day=this.refs.bid_date.value;

        if(bid!=='' && day!=='') {
            this.setState({
                Project_Fee     : (bid / day).toFixed(2),
                Freelancer_Fees : (bid * 0.1).toFixed(2),
                Total_Bid       : (bid * 1.1).toFixed(2)
            });
        }else {
            this.setState({
                Project_Fee     : '0',
                Freelancer_Fees : '0',
                Total_Bid       : '0'
            });
        }
    }

    componentWillMount() {

        let parsed = queryString.parse(this.props.location.search);

        const user = this.props.userDetails.user;
        let projectId = parsed.project_id;

        projectWebService.fetchProjectBidDetailsWS({ projectId : projectId })
            .then(
                response => {
                    this.setState({"bid_table_data": response.data.bidDetails});
                    if (response.data.bidDetails.length > 0 && response.data.bidDetails[0].bids)
                        this.setState({"showtable": true});
                });

        projectWebService.fetchProjectDetailsWS(projectId)
            .then(
                response => {
                    this.setState({"project_details": response.data.projectDetails[0]});
                    let projectDet = response.data.projectDetails[0]._id;
                    if(projectDet.filenames && projectDet.filenames.indexOf(",") > 0)
                        this.setState({"filenames": projectDet.filenames.split(",")});
                    else
                        this.setState({"filenames": []});
                    if (projectDet.freelancer_username === user.username) {
                        this.setState({freelancer_assigned: true});
                    }
                });
    }

    onDrop = (acceptedFiles, rejectedFiles) => {

        let projectFiles = this.state.projectFiles;
        projectFiles.push(acceptedFiles);
        this.setState({
            projectFiles: projectFiles,
            isUploaded: true
        });
    };

    handleDeleteFile = (event) => {

        event.preventDefault();

        let fileName = event.target.value;
        let oldProjectFiles = this.state.projectFiles;
        let newProjectFiles = [];
        for (let position = 0; position < oldProjectFiles.length; position++) {
            if (oldProjectFiles[position][0].name === fileName) {
                newProjectFiles = oldProjectFiles.splice(position, 1);
            }
        }

        this.setState({isSubmitted: false});

        if (!newProjectFiles) {
            this.setState({
                projectFiles: newProjectFiles
            });
        }
    };


    onSort = (column) => (e) => {
        console.log("clc");
        const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const sortedData = this.state.bid_table_data.sort((a, b) => {
            if (column === 'Bid Price') {
                const nameA = a.bids.bid_price; // ignore upper and lowercase
                const nameB = b.bids.bid_price; // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
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
                name: user.name,
                project_id: this.state.project_details._id.id,
                bid_price: this.state.bid_price,
                days_req: this.state.bid_date
            };

            console.log(data);

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

    handleSubmit = (event) => {

        event.preventDefault();

        this.setState({isSubmitted: true});

        let file = this.state.projectFiles;

        let filenames = "";
        if (file.length > 0) {
            filenames = this.uploadFiles(file);
        }

        const project = {
            id: this.state.project_details._id.id,
            filenames: filenames,
        };


        projectWebService.submitProjectWS(project)
            .then(
                response => {
                    console.log(response.data.message);
                    window.alert(response.data.message);
                });
    };

    uploadFiles = (files) => {
        const uploadFiles = new FormData();
        let filenames = "";
        for (let index = 0; index < files.length; index++) {
            filenames = filenames.concat(files[index][0].name + ",");
            uploadFiles.append("file", files[index][0]);
        }

        projectWebService.uploadFile(uploadFiles)
            .then(
                response => {
                    console.log(response.data.message);

                },
                error => {
                    console.log(error);
                }
            );
        return filenames;
    };

    render() {
        return (
            <div>
                <NavBar />
                <div className="main-content">
                    <div className="row ml-0 mr-0 mt-3 row-bid-height">
                        <div className="col-md-12 col-md-offset-0">
                            <span className="ProjectTitleBid"> {this.state.project_details._id.title}</span>
                        </div>
                    </div>
                    {/*<div className="col-sm-8 offset-sm-2">*/}
                    <div className = "">
                        <div className="">
                            <div className = "row ml-0 mr-0">
                                <div className="col-md-12">
                            <div className="panel panel-primary" id="shadowPanel-bid">
                                <div className="row BidProject-ProjectDetailHeader">
                                    <div className="col-sm-2 offset-sm-0" id="ProjectDetailBox">
                                        <span>Bids</span>
                                        <br/><span className="ProjectHeaderValue">
                                                {this.state.project_details._id.bid_count}
                                            </span>
                                    </div>
                                    <div className="col-sm-2 offset-sm-0" id="ProjectDetailBox">
                                        <span>Avg Bid</span>
                                        <br/><span className="ProjectHeaderValue">
                                                {Number(this.state.project_details.avg_bid).toFixed(2)}$
                                            </span>
                                    </div>
                                    <div className="col-sm-3 offset-sm-0" id="ProjectDetailBox">
                                        <span>Project Budget </span>
                                        <br/><span className="ProjectHeaderValue">
                                                {this.state.project_details._id.budget_range}
                                            </span>
                                    </div>
                                    <div className="col-sm-4 offset-sm-0" id="ProjectDetailBoxEnd">
                                        <span>Expected</span>
                                        <br/><span className="ProjectHeaderValue">
                                                {this.state.project_details._id.complete_by}
                                            </span>
                                    </div>
                                </div>
                            </div>
                                </div>
                            </div>
                            {   this.state.bid_button &&
                            <div className = "row ml-0 mr-0">
                                <div className="col-md-12">
                            <div className="panel panel-primary" id="shadowPanel-bid">
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
                                                <b>${this.state.Freelancer_Fees} USD </b>
                                            </div>
                                        </div>
                                        <div className="row col-sm-8 offset-sm-0">
                                            <div className="col-md-6 offset-md-2">
                                                <span><em>Your Total Bid    </em></span>
                                            </div>
                                            <div className="col-md-6 offset-md-0">
                                                <b>${this.state.Total_Bid} USD</b>
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
                                </div>
                            </div>
                            }
                            <div className = "row ml-0 mr-0">
                                <div className="col-md-12">
                            <div className="panel panel-primary" id="shadowPanel-bid">
                                <div className="row ProjectDetails">
                                    <div className="col-sm-8 offset-sm-0">
                                        <span className="ProjectTitleSubheading"> Project Description </span>
                                        <br/>
                                        <span>{this.state.project_details._id.description}</span>
                                        <br/>
                                        <br/>
                                        <span className="ProjectTitleSubheading"> Employer</span>
                                        <br/>
                                        <span>{this.state.project_details.name}
                                            {/*<br/>*/}
                                            <a href={`/visitor-profile/${this.state.project_details._id.emp_username}`}>@{this.state.project_details._id.emp_username}</a>
                                        </span>
                                        <br/>
                                        <br/>
                                        <span className="ProjectTitleSubheading"> Skills Required</span>
                                        <span>{this.state.project_details._id.skills_req}</span>
                                        <br/>
                                        <br/>
                                        <span className="ProjectTitleSubheading">Files</span>
                                        <span>
                                            {
                                                this.state.filenames.map((data) =>
                                                    <div key={data}>
                                                        <a target="_blank" href={`http://localhost:3000/project_files/${this.state.project_details._id.emp_username}/${data}`}>
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
                                        {!this.state.freelancer_assigned &&
                                            <button className="btn btn-primary" id="BidProjectButtonBig"
                                                    onClick={this.handleBidProject.bind(this)}>Bid On This Project
                                            </button>
                                        }
                                        <br/>
                                        <span id="projectID"><b>Project Id: </b></span>{this.state.project_details._id.id}
                                    </div>
                                </div>
                            </div>
                                </div>
                            </div>
                            {!this.state.freelancer_assigned &&
                            <div className = "row ml-0 mr-0">
                                <div className="col-md-12">
                            <div className="panel panel-primary" id="shadowPanel-bid">
                                <div className="BidDetailsTable">
                                    <table className="bids m-table w-100">
                                        <thead>
                                        <tr className="BidProject-ProjectFeedTitle pt-2">
                                            <th>Profile Image</th>
                                            <th>Freelancer Name</th>
                                            <th onClick={this.onSort('Bid Price')}>Bid Price
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
                                        {this.state.showtable &&
                                        this.state.bid_table_data.map((data) =>
                                            <tr key={data._id + data.bids.username}>
                                                <td><img alt="Profile" className="ProfileImageIcon"
                                                         src={`http://localhost:3000/profile_images/${data.bids.username}.jpg`}
                                                         onError={(e) => {
                                                             e.target.src = profile_image
                                                         }}/></td>
                                                <td className="pl-2">
                                                    <p className="mb-0">{data.bids.name}</p>
                                                    <a href={`/visitor-profile/${data.bids.username}`}> @{data.bids.username}</a>
                                                </td>
                                                <td>{data.bids.bid_price} USD</td>
                                                <td>{data.bids.days_req} days</td>
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

                            {this.state.freelancer_assigned &&
                            <div className="row ml-0 mr-0">
                                <div className="col-md-12">
                                    <div className="panel panel-primary" id="shadowPanel-bid">
                                        <div className="row file-bid-margin file-upload-box">
                                            <Dropzone
                                                className="file-upload-area-bid"
                                                onDrop={(files) => this.onDrop(files)}
                                            >
                                            <span className="btn btn-plain btn-file-uploader">
                                                <span><img className="fl-icon-plus" src={plusIcon}
                                                           alt=""/></span>
                                                <span
                                                    className="file-upload-button-text">Upload File</span>
                                            </span>
                                                <p className="file-upload-text">
                                                    Drag & drop any images or documents that might be
                                                    helpful for submission of the project here.
                                                </p>
                                            </Dropzone>
                                            {
                                                this.state.isUploaded &&
                                                <table className="table-upload">
                                                    <tbody className="table-upload-body">
                                                    {
                                                        this.state.projectFiles.map((data) =>
                                                            <tr key={this.state.projectFiles.indexOf(data)}
                                                                className="table-upload-row">
                                                                <td className="table-upload-row-preview">
                                                                    <img
                                                                        className="preview-image"
                                                                        src={data[0].type === 'application/pdf' ? uploadIcon : URL.createObjectURL(data[0])}
                                                                        alt="">

                                                                    </img>
                                                                </td>
                                                                <td className="table-upload-row-name">
                                                                                <span>
                                                                                    {data[0].name}
                                                                                </span>
                                                                </td>
                                                                <td className="table-upload-row-size">
                                                                    {filesize(data[0].size)}
                                                                </td>
                                                                <td className="table-upload-row-delete">
                                                                    <button
                                                                        value={data[0].name}
                                                                        className="btn btn-danger btn-small"
                                                                        onClick={this.handleDeleteFile}
                                                                    >
                                                                        <span>Delete</span>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                    </tbody>
                                                </table>
                                            }
                                        </div>
                                        <div className="row file-bid-margin file-bid-btn">

                                            <button className="btn btn-xlarge mb-3 btn-primary"
                                                    onClick={this.handleSubmit.bind(this)}>
                                                <span>Submit</span>
                                            </button>
                                        </div>
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

export default connect(mapStateToProps)(BidProject);