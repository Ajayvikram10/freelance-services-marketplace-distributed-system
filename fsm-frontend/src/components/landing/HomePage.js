import React, {Component}   from 'react';
import { connect }          from 'react-redux';
import  NavBar              from '../../helper/navbar';
import profileImage         from '../../images/freelancer.logos/profile-image.png';
import {mainProjectActions} from "../../redux/actions/project/main.project.actions";
import { history }          from "../../helper/history";
import '../../stylesheet/home.css';

class HomePage extends Component {

    handleSubmit(nextPage, e) {
        e.preventDefault();

        console.log(e.target.value);

        let project_id = e.target.value;
        history.push(nextPage+"?project_id="+project_id);
    }


    componentWillMount() {
        // Fetch all open projects.
        this.props.openProjectsAction();
    }

    render() {

        const user      = this.props.userDetails.user;
        const projects  = this.props.projectDetails.projects;

        return (
            <div>
                <NavBar searchAllowed={true} currentPage={"home"}/>
                <div className="main-content">
                    <div className="row mt-4 row-height">
                        <div className="col-md-7 offset-md-1 ml-5 mr-4">
                            <div className="col-md-12 offset-md-0">
                                <div className="panel panel-primary" id="shadowPanel">
                                    <div className="home-container">
                                        <div className="home-container-grid">
                                            <div className="home-container-grid-col">
                                                {/*<img className="home-banner" src={ homePageBanner } alt="Home Banner"/>*/}
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
                                            <img alt="Profile" className="free-icon profile-icon" src={`http://localhost:3000/profile_images/${user.username}.jpg`} onError={(e)=>{e.target.src=profileImage}}/>
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
                                        projects.map((data) =>
                                            <tr key={data.project_id}>
                                                {/*<td>{data.title}</td>*/}
                                                <td>
                                                    <a href={`/bid-project?project_id=${data.project_id}`}>
                                                        <span className="hm-prj-title"> {data.title}</span>
                                                    </a>
                                                    <br/>
                                                    <span className="hm-prj-desc"> {data.description}</span>
                                                    <br/>
                                                    <span className="hm-prj-skills"> {data.skills_req}</span>
                                                </td>
                                                <td className="hm-content-td">{data.bid_count}</td>
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
                                                                    value={data.project_id}
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
                                    </tbody>
                                </table>

                                {/*<div className="row hm-prj-feed-title">*/}
                                {/*<div className="col-sm-5 offset-sm-0 pl-0">*/}
                                {/*<b>PROJECT NAME</b>*/}
                                {/*</div>*/}
                                {/*<div className="col-sm-2 offset-sm-0">*/}
                                {/*<b>BIDS</b>*/}
                                {/*</div>*/}
                                {/*<div className="col-sm-2 offset-sm-0">*/}
                                {/*<b>EMPLOYER</b>*/}
                                {/*</div>*/}
                                {/*<div className="col-sm-3 offset-sm-0 pr-4">*/}
                                {/*<b>BUDGET RANGE</b>*/}
                                {/*</div>*/}
                                {/*</div>*/}

                                {/*{*/}
                                {/*projects.map((data) =>*/}
                                {/*<div className="row hm-prj-feed" key={data.project_id}>*/}
                                {/*<div className="col-sm-5 offset-sm-0 pl-0 h-text-left">*/}
                                {/*<a href={`/bid-project?project_id=${data.project_id}`}>*/}
                                {/*<span className="hm-prj-title"> {data.title}</span>*/}
                                {/*</a>*/}
                                {/*<br/>*/}
                                {/*<span className="hm-prj-desc"> {data.description}</span>*/}
                                {/*<br/>*/}
                                {/*<br/>*/}
                                {/*<span className="hm-prj-skills"> {data.skills_req}</span>*/}
                                {/*</div>*/}
                                {/*<div className="col-sm-2 offset-sm-0 h-text-align">*/}
                                {/*{data.bid_count}*/}
                                {/*</div>*/}
                                {/*<div className="col-sm-2 offset-sm-0 h-text-align">*/}
                                {/*<a href={`/visitor-profile/${data.emp_username}`}>*/}
                                {/*<span className="hm-span-left">{data.emp_username}</span>*/}
                                {/*</a>*/}
                                {/*</div>*/}
                                {/*<div className="col-sm-3 offset-sm-0 pl-0 h-text-align">*/}

                                {/*<span className="hm-span-left">{data.budget_range}</span>*/}
                                {/*<br/> <br/>*/}
                                {/*<button className="btn btn-primary" id="hm-bid-now-btn" value={data.project_id} >Bid Now*/}
                                {/*</button>*/}

                                {/*</div>*/}
                                {/*</div>*/}
                                {/*)*/}
                                {/*}*/}
                                {/**/}

                            </div>
                        </div>
                    </div>


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


function mapDispatchToProps(dispatch) {
    return {
        openProjectsAction  : () => dispatch(mainProjectActions.openProjectsAction())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);