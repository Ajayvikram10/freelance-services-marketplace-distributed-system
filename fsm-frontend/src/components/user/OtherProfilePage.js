import React                    from "react";
import profile_image            from '../../images/profile/profile-image.png';
import { connect }              from "react-redux";
import { profileWebService }    from "../../services/profile.services";
import NavBar                   from "../../helper/navbar";
import '../../stylesheet/other-profile.css'

class OtherProfilePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profileImage: "",
            profileUser: ""
        };
    }
    componentWillMount(){
        console.log(this.props);
        console.log("###this.:" + this.props.match.params.username);
        let username = this.props.match.params.username;
        this.fetchProfileImage(username);
        this.fetchOtherUserDetails(username);
    }

    fetchProfileImage(username){
        profileWebService.fetchProfileImageWS(username).then((response) => {
            this.setState( { profileImage : response.data.profileImage }) ;
        });
    }

    fetchOtherUserDetails(username){
        profileWebService.fetchOtherUserDetailsWS(username).then((response) => {
            this.setState({profileUser : response.data.user})
        });
    }

    render() {
        const { profileImage, profileUser } = this.state;

        let profileSkills = [];
        if(profileUser.skills)
            profileSkills = profileUser.skills;

        let imgSrc = profileImage ? 'data:image/jpeg;base64,' + profileImage : profile_image;

        return (
            <div className="main-content">
                <NavBar currentPage={"profile"}/>
                <div className="profile-info">
                    <div className="container-info">
                        <div className="grid-info">
                            <div className="grid-col">
                                <div className="row profile-info-card">
                                    <div className="col-sm-3 col-md-3 col-lg-3 profile-avatar">
                                        <div className="profile-avatar-image">
                                            <div className="profile-avatar-image-uploader">
                                                <div className="profile-avatar-image-wrapper">
                                                    <div className="profile-avatar-image-done">
                                                        <img className="avatar-image" src={imgSrc} alt="Profile"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="profile-avatar-email-phone pad-down">
                                            <div>@{ profileUser.username }</div>
                                        </div>
                                        <div className="profile-avatar-email-phone pad-down">
                                            <div>{ profileUser.email }</div>
                                        </div>
                                        <div className="profile-avatar-email-phone">
                                            <div>
                                                <div className="edit-widget">
                                                    {profileUser.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-md-6 col-lg-6 profile-about">
                                        <div>
                                            <div className="profile-about-name-wrapper">
                                                <h1 className="profile-intro-username">
                                                    <div className="edit-widget">
                                                        {profileUser.name}
                                                    </div>
                                                </h1>
                                            </div>
                                            <div className="profile-user-byline">
                                                <div className="edit-widget">
                                                    {profileUser.summary}
                                                </div>
                                            </div>
                                            <div className="profile-about-wrapper">
                                                <div className="profile-about-description edit-widget"
                                                     id="about-me-display">
                                                    {profileUser.about}
                                                </div>
                                                <p>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-3 col-md-3 col-lg-3 profile-stats">
                                        <div className="vpf-side-card">
                                        <h2 className="view-profile-stats-skills">
                                            Top Skills
                                        </h2>
                                        {/*{*/}
                                            {/*<div className="profile-skills edit-widget">*/}
                                                {/*{profileUser.skills}*/}
                                            {/*</div>*/}
                                        {/*}*/}

                                            {
                                                <div className="profile-skills edit-widget"
                                                     id="about-me-display">
                                                    <ul className="pf-skills-ul">
                                                        {
                                                            profileSkills.map((data, index) =>
                                                                <li className="pf-skills-li" key={index}>{data}</li>
                                                            )
                                                        }
                                                    </ul>
                                                </div>

                                            }
                                        </div>
                                    </div>
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

export default connect(mapStateToProps)(OtherProfilePage);