import React, {Component}   from 'react';
import { connect }          from 'react-redux';
import  NavBar              from '../../helper/navbar';
import profileImage         from '../../images/freelancer.logos/profile-image.png';
import { history }          from "../../helper/history";
import '../../stylesheet/home.css';
import {projectWebService} from "../../services/project.services";

class HomePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectsPerPage         : 10,
            flipView                : 'ALL_PROJECTS',
            openCurrentPage         : 1,
            openProjectsDisplay     : [],
            openProjectsAll         : [],
            relevantCurrentPage     : 1,
            relevantProjectsDisplay : [],
            relevantProjectsAll     : [],

        }
    };

    handleSubmit(nextPage, e) {
        e.preventDefault();

        console.log(e.target.value);

        let project_id = e.target.value;
        history.push(nextPage+"?project_id="+project_id);
    }


    componentWillMount() {
        // Fetch all open projects.
        const user  = this.props.userDetails.user;

        projectWebService.openProjectsWS({ username : user.username })
            .then( response => { this.setState({ openProjectsDisplay: response.data.projects, openProjectsAll: response.data.projects }); },
                   error    => { console.log(error.data.message); } );

        projectWebService.relevantProjectsWS({ skills : user.skills })
            .then( response => { this.setState({ relevantProjectsDisplay: response.data.relevantProjects, relevantProjectsAll: response.data.relevantProjects }); },
                   error    => { console.log(error.data.message); } );
    }

    handleSearch(e) {
        e.preventDefault();

        console.log(e.target.value);
        let searchParam = e.target.value;

        const flipView = this.state.flipView;
        let filtered_array = [];
        if(flipView === 'ALL_PROJECTS') {

            this.setState({ openCurrentPage: 1 });
            const { openProjectsAll } = this.state;

            let filterIndex = 0;
            for (let index = 0; index < openProjectsAll.length; index++) {
                if ((new RegExp(searchParam, 'i')).test(openProjectsAll[index].title) || (new RegExp(searchParam, 'i')).test(openProjectsAll[index].skills_req)) {
                    filtered_array[filterIndex++] = openProjectsAll[index];
                }
            }
            if (filtered_array.length > 0) {
                this.setState( { openProjectsDisplay: filtered_array } );
            }
            else {
                this.setState( { openProjectsDisplay : [] } );
            }
        }
        else if (flipView === 'SKILLS_PROJECT') {

            this.setState({ relevantCurrentPage: 1 });
            const { relevantProjectsAll } = this.state;

            let filterIndex = 0;
            for (let index = 0; index < relevantProjectsAll.length; index++) {
                if ((new RegExp(searchParam, 'i')).test(relevantProjectsAll[index].title) || (new RegExp(searchParam, 'i')).test(relevantProjectsAll[index].skills_req)) {
                    filtered_array[filterIndex++] = relevantProjectsAll[index];
                }
            }
            if (filtered_array.length > 0)
                this.setState( { relevantProjectsDisplay : filtered_array } );
            else {
                this.setState( { relevantProjectsDisplay : [] } );
            }
        }

    }

    handleOpenPagination = (pageNumber) => {
        this.setState({
            openCurrentPage: Number(pageNumber)
        });
    };

    handleRelevantPagination = (pageNumber) => {
        this.setState({
            relevantCurrentPage: Number(pageNumber)
        });
    };

    onFlip = (event) => {

        event.preventDefault();
        this.setState({
            flipView    : event.target.value
        });
    };

    render() {

        const user= this.props.userDetails.user;

        const { flipView, openCurrentPage, openProjectsDisplay, relevantCurrentPage, relevantProjectsDisplay, projectsPerPage } = this.state;

        let currentOpenProjects, currentRelevantProjects;
        const openPageNumbers = [];
        const relevantPageNumbers = [];

        if (openProjectsDisplay) {
            // Logic for displaying current items
            const indexOfLastItem   = openCurrentPage * projectsPerPage;
            const indexOfFirstItem  = indexOfLastItem - projectsPerPage;
            currentOpenProjects     = openProjectsDisplay.slice(indexOfFirstItem, indexOfLastItem);

            // Logic for displaying page numbers
            for (let i = 1; i <= Math.ceil(openProjectsDisplay.length / projectsPerPage); i++) {
                openPageNumbers.push(i);
            }
        }

        if(relevantProjectsDisplay) {
            // Logic for displaying current items
            const indexOfLastItem   = relevantCurrentPage * projectsPerPage;
            const indexOfFirstItem  = indexOfLastItem - projectsPerPage;
            currentRelevantProjects = relevantProjectsDisplay.slice(indexOfFirstItem, indexOfLastItem);

            // Logic for displaying page numbers
            for (let i = 1; i <= Math.ceil(relevantProjectsDisplay.length / projectsPerPage); i++) {
                relevantPageNumbers.push(i);
            }
        }

        const renderOpenPageNumbers = openPageNumbers.map(number => {
            return (
                <li key={ number } id={ number } className="pagination-item">
                    <a className="pagination-item-link" onClick = { () => this.handleOpenPagination(number) } >
                        { number }
                    </a>
                </li>
            );
        });

        const renderRelevantPageNumbers = relevantPageNumbers.map(number => {
            return (
                <li key={ number } id={ number } className="pagination-item">
                    <a className="pagination-item-link" onClick = { () => this.handleRelevantPagination(number) } >
                        { number }
                    </a>
                </li>
            );
        });

        return (
            <div>
                <NavBar currentPage={"home"}/>
                <div className="main-content">
                    <div className="row mt-4 row-height">
                        <div className="col-md-7 offset-md-1 ml-5 mr-4">
                            <div className="col-md-12 offset-md-0">
                                <div className="panel panel-primary" id="shadowPanel">
                                    <div className="home-container">
                                        <div className="home-container-grid">
                                            <div className="home-container-grid-col">
                                                <h3 className="home-banner-text">Freelancer Community</h3>
                                                <h4 className="home-banner-text-2">Post Projects, Hire Freelancers, and Work on projects</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>

                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 offset-md-0">
                            <div className="col-md-11 col-md-offset-0">
                                <div className="row panel panel-primary panel-welcome" id="shadowPanelProfile">
                                    <div className="col-sm-5 offset-sm-0 pl-0 pr-0">
                                        <div className="col-md-12 col-md-offset-0 d-inline-flex">
                                            <img alt="Profile" className="free-icon profile-icon" src={`/profile_images/${user.username}/${user.username}.jpg`} onError={(e)=>{e.target.src=profileImage}}/>
                                        </div>
                                    </div>


                                    <div className="col-sm-7 offset-sm-0">
                                        <div className="col-md-11 col-md-offset-0">
                                            <h6><b>Welcome back,</b></h6>
                                            <h5>
                                                <a href={`/profile`}>
                                                    <b>{user.name}</b>
                                                </a>
                                            </h5>
                                            <h6>
                                                <b>@{user.username}</b>
                                            </h6>
                                            <h6>
                                                <b>{user.summary}</b>
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row flip-height">
                            <div className="ul-list-style search-style">
                                <div className="search-container">
                                    <div className="search-inner-container">
                                        <span className="search-icon fa fa-search fa-lg"></span>
                                        <input
                                            placeholder="Search Project or Technology name ..."
                                            ref={input => this.search = input}
                                            className="form-control search-bar"
                                            onChange={this.handleSearch.bind(this)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="freelancer-toggle-home">
                                <input
                                    id="allProjectsOption"
                                    className="db-radio-input"
                                    name="ALL_PROJECTS"
                                    value="ALL_PROJECTS"
                                    checked={flipView === 'ALL_PROJECTS'}
                                    type="radio"
                                    label="HomeAllProjects"
                                    onChange={this.onFlip}
                                />
                                <label
                                    className={flipView === 'ALL_PROJECTS' ? 'db-radio-label-on' : 'db-radio-label-off'}
                                    htmlFor="allProjectsOption"
                                >
                                    All Projects
                                </label>

                                <input
                                    id="skillsProjectOption"
                                    className="db-radio-input"
                                    name="SKILLS_PROJECT"
                                    value="SKILLS_PROJECT"
                                    checked={flipView === 'SKILLS_PROJECT'}
                                    type="radio"
                                    label="HomeSkillsProjects"
                                    onChange={this.onFlip}
                                />
                                <label
                                    className={flipView === 'SKILLS_PROJECT' ? 'db-radio-label-on' : 'db-radio-label-off'}
                                    htmlFor="skillsProjectOption"
                                >
                                    Relevant Projects
                                </label>
                            </div>
                    </div>
                    {
                        (flipView === 'ALL_PROJECTS') &&
                        <div className="row row-size">
                            <div className="col-md-12">

                                <div className="panel panel-primary panel-bid" id="shadowPanel">

                                    <table className="m-table" id="shadowpanel">
                                        <thead>
                                        <tr>
                                            <th className="hm-content-title">Project Name</th>
                                            <th className="hm-content-avg-bid">Bids</th>
                                            <th className="hm-content-freelnc">Employer</th>
                                            <th className="hm-content-budget">Budget Range</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            openProjectsDisplay.length > 0 &&
                                            currentOpenProjects.map((data) =>
                                                <tr key={data._id} className="btn-display">
                                                    <td>
                                                        <a href={`/bid-project?project_id=${data._id}`}>
                                                            <span className="hm-prj-title"> {data.title}</span>
                                                        </a>
                                                        <br/>
                                                        <span className="hm-prj-desc"> {data.description}</span>
                                                        <br/>
                                                        <span
                                                            className="hm-prj-skills"> {data.skills_req.join(", ")}</span>
                                                    </td>
                                                    <td className="hm-content-td">{data.bids.length}</td>
                                                    <td className="hm-content-td">
                                                        <a href={`/visitor-profile/${data.emp_username}`}>
                                                            <span className="hm-span-left">{data.emp_username}</span>
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <div className="row">
                                                            <div className="col-sm-2"></div>
                                                            <div className="col-sm-4">
                                                                <span
                                                                    className="hm-span-between">{data.budget_range}</span>
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <button className="btn btn-primary" id="hm-bid-now-btn"
                                                                        value={data._id}
                                                                        onClick={this.handleSubmit.bind(this, "/bid-project")}
                                                                >Bid Now
                                                                </button>
                                                            </div>
                                                            <div className="col-sm-2"></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        {
                                            openProjectsDisplay.length > 0 &&
                                            <tr className="pagination-tr">
                                                <ul className="pagination">
                                                    { renderOpenPageNumbers }
                                                </ul>
                                            </tr>
                                        }
                                        {
                                            openProjectsDisplay.length === 0 &&
                                            <tr>
                                                <td className="home-no-project" colSpan="6">
                                                    <h4 className="home-no-project-h4">
                                                        No open projects
                                                    </h4>
                                                </td>
                                            </tr>
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        (flipView === 'SKILLS_PROJECT') &&
                        <div className="row row-size">
                            <div className="col-md-12">

                                <div className="panel panel-primary panel-bid" id="shadowPanel">

                                    <table className="m-table" id="shadowpanel">
                                        <thead>
                                        <tr>
                                            <th className="hm-content-title">Project Name</th>
                                            <th className="hm-content-avg-bid">Bids</th>
                                            <th className="hm-content-freelnc">Employer</th>
                                            <th className="hm-content-budget">Budget Range</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            relevantProjectsDisplay.length > 0 &&
                                            currentRelevantProjects.map((data) =>
                                                <tr key={data._id} className="btn-display">
                                                    <td>
                                                        <a href={`/bid-project?project_id=${data._id}`}>
                                                            <span className="hm-prj-title"> {data.title}</span>
                                                        </a>
                                                        <br/>
                                                        <span className="hm-prj-desc"> {data.description}</span>
                                                        <br/>
                                                        <span className="hm-prj-skills"> {data.skills_req.join(", ")}</span>
                                                    </td>
                                                    <td className="hm-content-td">{data.bids.length}</td>
                                                    <td className="hm-content-td">
                                                        <a href={`/visitor-profile/${data.emp_username}`}>
                                                            <span className="hm-span-left">{data.emp_username}</span>
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <div className="row">
                                                            <div className="col-sm-2"></div>
                                                            <div className="col-sm-4">
                                                                <span className="hm-span-between">{data.budget_range}</span>
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <button className="btn btn-primary" id="hm-bid-now-btn"
                                                                        value={data._id}
                                                                        onClick={this.handleSubmit.bind(this, "/bid-project")}
                                                                >Bid Now
                                                                </button>
                                                            </div>
                                                            <div className="col-sm-2"></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        {
                                            relevantProjectsDisplay.length > 0 &&
                                            <tr className="pagination-tr">
                                                <ul className="pagination">
                                                    { renderRelevantPageNumbers }
                                                </ul>
                                            </tr>
                                        }
                                        {
                                            relevantProjectsDisplay.length === 0 &&
                                            <tr>
                                                <td className="home-no-project" colSpan="6">
                                                    <h4 className="home-no-project-h4">
                                                        No Relevant projects
                                                    </h4>
                                                </td>
                                            </tr>
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {

    const { userDetails }  = state;
    const { projectDetails }  = state;
    return {
        userDetails,
        projectDetails
    };

}

export default connect(mapStateToProps)(HomePage);