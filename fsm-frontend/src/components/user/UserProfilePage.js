import React, {Component}   from 'react';
import { connect }          from 'react-redux';
import profile_image        from '../../images/profile/profile-image.png';
import NavBar               from '../../helper/navbar';
import { profileWebService }from "../../services/profile.services";
import Modal                from 'react-responsive-modal';
import Dropzone             from 'react-dropzone';
import '../../stylesheet/profile.css';
import {userDispatch} from "../../redux/actions/user/user.dispatch";

class UserProfilePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isEdit          : false,
            aboutMe         : this.props.userDetails.user.about_me,
            aboutMeSaved    : this.props.userDetails.user.about_me,
            aboutMeEdit     : false,
            summary         : this.props.userDetails.user.summary,
            summarySaved    : this.props.userDetails.user.summary,
            summaryEdit     : false,
            name            : this.props.userDetails.user.name,
            nameSaved       : this.props.userDetails.user.name,
            nameEdit        : false,
            phone           : this.props.userDetails.user.phone,
            phoneSaved      : this.props.userDetails.user.phone,
            phoneEdit       : false,
            profileImage    : "",
            skills          : this.props.userDetails.user.skills,
            skillsSaved     : (!this.props.userDetails.user.skills ? [] : this.props.userDetails.user.skills),
            modalIsOpen     : false,
            openImageModal  : false,
            isUploaded      : false,
            previewImage    : [],
            openSkillModal  : false,
        };
    }

    componentWillMount(){
        // this.fetchProfileImage();
    }

    handleNameChange = (event) => {

        this.setState({
            name: event.target.value
        });
    };
    toggleEditName = (event) => {
        this.setState({
            nameEdit: !this.state.nameEdit
        });
    };
    saveName = (event) => {
        this.setState({
            nameSaved: this.state.name,
            nameEdit: false
        });
        this.props.updateInfo({ field : "name", value : this.state.name });
    };

    handleSummaryChange = (event) => {

        this.setState({
            summary: event.target.value
        });
    };
    toggleEditSummary = (event) => {
        this.setState({
            summaryEdit: !this.state.summaryEdit
        });
    };
    saveSummary = (event) => {
        this.setState({
            summarySaved: this.state.summary,
            summaryEdit: false
        });
        this.props.updateInfo({ field : "summary", value : this.state.summary });
    };

    handleAboutMeChange = (event) => {

        this.setState({
            aboutMe: event.target.value
        });
    };
    toggleEditAboutMe = (event) => {
        this.setState({
            aboutMeEdit: !this.state.aboutMeEdit
        });
    };
    saveAboutMe = (event) => {
        this.setState({
            aboutMeSaved: this.state.aboutMe,
            aboutMeEdit: false
        });
        this.props.updateInfo({ field : "about_me", value : this.state.aboutMe });
    };

    onOpenSkillModal = () => { this.setState({ openSkillModal: true }); };
    onCloseSkillModal = () => { this.setState({ openSkillModal: false }); };
    saveSkills = (event) => {
        event.preventDefault();

        let skillsArr = [];
        if(this.refs.skills.value.trim().length > 0) {
            skillsArr = this.refs.skills.value.trim().split(',');
        }
        this.setState({
            skillsSaved: skillsArr
        });
        this.onCloseSkillModal();
        this.props.updateInfo({ field : "skills", value : skillsArr });
    };

    handlePhoneChange = (event) => {

        this.setState({
            phone: event.target.value
        });
    };
    toggleEditPhone = (event) => {
        this.setState({
            phoneEdit: !this.state.phoneEdit
        });
    };
    savePhone = (event) => {
        this.setState({
            phoneSaved: this.state.phone,
            phoneEdit: false
        });
        this.props.updateInfo({ field : "phone", value : this.state.phone });
    };

    onOpenImageModal = () => { this.setState({ openImageModal: true }); };
    onCloseImageModal = () => { this.setState({ openImageModal: false, previewImage: [] }); };
    onDrop = (acceptedFiles, rejectedFiles) => {

        let previewImages = this.state.previewImage;
        previewImages.splice(0,1);
        previewImages.push(acceptedFiles);
        this.setState({
            previewImage: previewImages,
            isFileUploaded : true
        });
    };
    handleProfileImage = (event) => {

        event.preventDefault();

        this.setState({ profileImage : this.state.previewImage[0][0] });

        let profileImageData = new FormData();
        profileImageData.append('file', this.state.previewImage[0][0]);

        profileWebService.uploadProfileImageWS(profileImageData)
            .then( () => {
                this.setState({ profileImage : this.state.previewImage[0][0] });
            });

        this.onCloseImageModal();
    };

    fetchProfileImage(){
        const user  = this.props.userDetails.user;
        profileWebService.fetchProfileImageWS(user.username).then((response) => {
            this.setState( { profileImage : response.data.profileImage }) ;
        });
    }

    toggleViewEditBtn = (event) => {
        this.setState({
            isEdit: !this.state.isEdit,
        });
    };

    render() {

        const user  = this.props.userDetails.user;
        const { isEdit, aboutMeEdit, summaryEdit, profileImage, nameEdit, phoneEdit } = this.state;

        return (
            <div className="main-content">
                <NavBar currentPage={"profile"}/>
                <div className="profile-info">
                    <div className="container-info">
                        <div className="grid-info">
                            <div className="grid-col">
                                <div className="row profile-info-card" id="profilepage-shadowpanel">
                                    <div className="col-sm-3 col-md-3 col-lg-3 profile-avatar">
                                        <div className="profile-avatar-image" >
                                            <div className="profile-avatar-image-uploader">
                                                <div className="profile-avatar-image-wrapper">
                                                    <div className="profile-avatar-image-done">
                                                        <img className="avatar-image" src={ profileImage ?  URL.createObjectURL(profileImage) : `/profile_images/${user.username}/${user.username}.jpg`} alt="Profile" onError={ (e)=>{ e.target.src = profile_image } }/>
                                                        <a className="picture-upload-trigger" onClick={ this.onOpenImageModal }>
                                                            <span className="picture-upload-trigger-inner fa fa-camera">
                                                                <span className="picture-upload-trigger-text">Edit profile picture</span>
                                                            </span>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="profile-avatar-email-phone pad-down">
                                            <div>@{ user.username }</div>
                                        </div>
                                        <div className="profile-avatar-email-phone pad-down">
                                            <div>{ user.email }</div>
                                        </div>
                                        <div className="profile-avatar-email-phone">
                                            <div>
                                                {/*{ user.phone }*/}
                                                {   !isEdit &&
                                                <div className="edit-widget">
                                                    {this.state.phoneSaved}
                                                </div>
                                                }
                                                {   isEdit && !phoneEdit &&
                                                <div className="profile-about-description edit-widget">
                                                    {this.state.phoneSaved}
                                                    <button className="edit-widget-trigger"
                                                            onClick={this.toggleEditPhone}>
                                                        <span className="Button-icon fa fa-pencil inline-pencil"/>
                                                    </button>
                                                </div>
                                                }
                                                {   isEdit && phoneEdit &&
                                                <div className="profile-phone-div">
                                                    <input
                                                        defaultValue={this.state.phone}
                                                        disabled={false}
                                                        onChange={this.handlePhoneChange}
                                                        className="profile-phone-text"
                                                        placeholder="Phone Number"
                                                    />
                                                </div>
                                                }
                                                {   isEdit && phoneEdit &&
                                                <button className="btn btn-small btn-info edit-widget-btn"
                                                        disabled={!this.state.phone}
                                                        onClick={this.savePhone}>
                                                    Save
                                                </button>
                                                }
                                                {   isEdit && phoneEdit &&
                                                <button className="btn-small btn edit-widget-btn"
                                                        onClick={this.toggleEditPhone}>
                                                    Cancel
                                                </button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-md-6 col-lg-6 profile-about">
                                        <div>
                                            <div className="profile-about-name-wrapper">
                                                <h1 className="profile-intro-username">
                                                    {   !isEdit &&
                                                    <div className="edit-widget">
                                                        {this.state.nameSaved}
                                                    </div>
                                                    }
                                                    {   isEdit && !nameEdit &&
                                                    <div className="profile-about-description edit-widget"
                                                         id="about-me">
                                                        {this.state.nameSaved}
                                                        <button className="edit-widget-trigger"
                                                                onClick={this.toggleEditName}>
                                                            <span className="Button-icon fa fa-pencil inline-pencil"/>
                                                        </button>
                                                    </div>
                                                    }
                                                    {   isEdit && nameEdit &&
                                                    <input
                                                        defaultValue={this.state.name}
                                                        disabled={false}
                                                        onChange={this.handleNameChange}
                                                        className="profile-name-text"
                                                        placeholder="Full Name"
                                                        />
                                                    }
                                                    {   isEdit && nameEdit &&
                                                    <button className="btn btn-small btn-info edit-widget-btn"
                                                            disabled={!this.state.name}
                                                            onClick={this.saveName}>
                                                        Save
                                                    </button>
                                                    }
                                                    {   isEdit && nameEdit &&
                                                    <button className="btn-small btn edit-widget-btn"
                                                            onClick={this.toggleEditName}>
                                                        Cancel
                                                    </button>
                                                    }
                                                </h1>
                                            </div>
                                            <div className="profile-user-byline">
                                                {!isEdit &&
                                                <div className="edit-widget">
                                                    {this.state.summarySaved}
                                                </div>
                                                }
                                                {   isEdit && !summaryEdit &&
                                                <div className="profile-about-description edit-widget">
                                                    {this.state.summarySaved}
                                                    <button className="edit-widget-trigger"
                                                            onClick={this.toggleEditSummary}>
                                                        <span className="Button-icon fa fa-pencil inline-pencil"/>
                                                    </button>
                                                </div>
                                                }
                                                {isEdit && summaryEdit &&
                                                <textarea
                                                    defaultValue={this.state.summary}
                                                    disabled={false}
                                                    onChange={this.handleSummaryChange}
                                                    className="profile-summary-textarea"
                                                    placeholder="Professional headline - e.g. Graphic designer"
                                                    />
                                                }
                                                {isEdit && summaryEdit &&
                                                <button className="btn btn-small btn-info edit-widget-btn"
                                                        disabled={!this.state.summary}
                                                        onClick={this.saveSummary}>
                                                    Save
                                                </button>
                                                }
                                                {isEdit && summaryEdit &&
                                                <button className="btn-small btn edit-widget-btn"
                                                        onClick={this.toggleEditSummary}>
                                                    Cancel
                                                </button>
                                                }
                                            </div>
                                            <div className="profile-about-wrapper">
                                                {!isEdit &&
                                                <div className="profile-about-description edit-widget"
                                                     id="about-me-display">
                                                    {this.state.aboutMeSaved}
                                                </div>
                                                }
                                                {isEdit && !aboutMeEdit &&
                                                <div className="profile-about-description edit-widget"
                                                     id="about-me">
                                                    {this.state.aboutMeSaved}
                                                    <button className="edit-widget-trigger"
                                                            onClick={this.toggleEditAboutMe}
                                                    >
                                                        <span className="Button-icon fa fa-pencil inline-pencil"/>
                                                    </button>
                                                </div>
                                                }
                                                {isEdit && aboutMeEdit &&
                                                <textarea
                                                    defaultValue={this.state.aboutMe}
                                                    disabled={false}
                                                    onChange={this.handleAboutMeChange}
                                                    className="profile-about-textarea"
                                                    placeholder="Tell us a bit about yourself"
                                                    name="aboutMe"
                                                />
                                                }
                                                {isEdit && aboutMeEdit &&
                                                <button className="btn btn-small btn-info edit-widget-btn"
                                                        disabled={!this.state.aboutMe}
                                                        onClick={this.saveAboutMe}>
                                                    Save
                                                </button>
                                                }
                                                {isEdit && aboutMeEdit &&
                                                <button className="btn-small btn edit-widget-btn"
                                                        onClick={this.toggleEditAboutMe}>
                                                    Cancel
                                                </button>
                                                }
                                                <p>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-3 col-md-3 col-lg-3 profile-stats">
                                        <div className="pf-side-card">
                                        { !isEdit &&
                                        <button id="editProfile" type="submit"
                                                className="form-control tn btn-info btn-large btn-submit btn-edit-account"
                                                onClick={this.toggleViewEditBtn}>
                                            <span className="Button-icon fa fa-pencil"/>
                                            Edit Profile
                                        </button>
                                        }

                                        { isEdit &&
                                        <button id="editProfile" type="submit"
                                                className="form-control tn btn-info btn-large btn-submit btn-edit-account"
                                                onClick={this.toggleViewEditBtn}>
                                            <span className="Button-icon fa fa-user"/>
                                            View Profile
                                        </button>
                                        }
                                        <h2 className="profile-stats-skills">
                                            Top Skills

                                            {   isEdit &&
                                            <button className="pf-skills-btn"
                                                    onClick={this.onOpenSkillModal}>
                                                + Skill
                                            </button>
                                            }
                                        </h2>
                                        {
                                            <div className="profile-skills edit-widget"
                                                 id="about-me-display">
                                                <ul className="pf-skills-ul">
                                                {
                                                    this.state.skillsSaved.map((data, index) =>
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

                <Modal showCloseIcon={false} open={this.state.openSkillModal} onClose={this.onCloseSkillModal} little>
                    <div className="pf-modal-content">
                        <form ref = "projectForm" className="skills-form">
                            <h3 className="pf-modal-title" id="exampleModalLabel">
                                <span className="pf-modal-text">Add your skills separated by comma</span>
                            </h3>
                            <div className="pf-modal-body-skills">
                                    <textarea className="pf-summary-textarea" ref="skills"
                                              placeholder="Enter your top skills separated by comma"
                                              defaultValue={this.state.skillsSaved}
                                              name="skillsText">
                                    </textarea>
                                <div className="pf-modal-btn-pad">
                                    <button type="button" className="btn btn-success pf-modal-save"
                                            data-dismiss="modal" onClick={this.saveSkills}>Save
                                    </button>
                                    <button type="button" className="btn btn-secondary pf-modal-cancel"
                                            data-dismiss="modal" onClick={this.onCloseSkillModal}>Close
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Modal>
                <Modal showCloseIcon={false} open={this.state.openImageModal} onClose={this.onCloseImageModal} little>
                    <div className="pf-modal-content">
                        <h3 className="pf-modal-title" id="exampleModalLabel">
                            <span className="pf-modal-text">Edit profile picture</span>
                        </h3>
                        <div className="pf-modal-body">
                            <Dropzone
                                className = "pf-modal-dropzone"
                                onDrop    = { (files) => this.onDrop(files) }
                            >

                                <div>
                                    {
                                        !this.state.isFileUploaded &&
                                        <span className="pf-text-pad">Drag your picture here or click in this area.</span>
                                    }

                                    {
                                        this.state.isFileUploaded &&
                                        this.state.previewImage.map((data, index) =>
                                            <img key={index} className="pf-avatar-image" id='img-upload' alt="Upload" src={ URL.createObjectURL(data[0]) }/>
                                        )
                                    }
                                </div>
                            </Dropzone>
                            <div className="pf-modal-btn-pad">
                                <button type="button" className="btn btn-success pf-modal-save" data-dismiss="modal" onClick={this.handleProfileImage}>Set as Profile Picture</button>
                                <button type="button" className="btn btn-secondary pf-modal-cancel" data-dismiss="modal" onClick={this.onCloseImageModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </Modal>
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

function mapDispatchToProps(dispatch) {
    return {
        updateInfo    : (updateInfo) => dispatch(userDispatch.updateInfo(updateInfo)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfilePage);