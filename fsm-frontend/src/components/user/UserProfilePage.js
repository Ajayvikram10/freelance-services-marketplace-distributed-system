import React, {Component}   from 'react';
import { connect }          from 'react-redux';
import profile_image        from '../../images/profile/profile-image.png';
import NavBar               from '../../helper/navbar';
import { userWebService }   from "../../services/user.services";
import Modal                from 'react-responsive-modal';
import Dropzone             from 'react-dropzone';
import '../../stylesheet/profile.css';

class UserProfilePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isEdit: false,
            aboutMe: this.props.userDetails.user.about_me,
            aboutMeSaved: this.props.userDetails.user.about_me,
            aboutMeEdit: false,
            summary: this.props.userDetails.user.summary,
            summarySaved: this.props.userDetails.user.summary,
            summaryEdit: false,
            name: this.props.userDetails.user.name,
            nameSaved: this.props.userDetails.user.name,
            nameEdit: false,
            phone: this.props.userDetails.user.phone,
            phoneSaved: this.props.userDetails.user.phone,
            phoneEdit: false,
            profileImage: "",
            skills : this.props.userDetails.user.skills,
            skillsSaved : (!this.props.userDetails.user.skills ? [] : this.props.userDetails.user.skills.split(',')),
            modalIsOpen: false,
            openImageModal: false,
            isUploaded          : false,
            previewImage    : [],
            openSkillModal: false,
        };
    }

    componentWillMount(){
        this.fetchProfileImage();
    }

    handleProfileImage = (event) => {

        event.preventDefault();

        this.setState({ profileImage : this.state.previewImage[0][0] });

        var profileImageData = new FormData();
        profileImageData.append('file', this.state.previewImage[0][0]);

        userWebService.uploadProfileImageWS(profileImageData).then(
            () => {
                this.fetchProfileImage();
            });

        this.onCloseImageModal();
    };

    fetchProfileImage(){
        const user  = this.props.userDetails.user;
        userWebService.fetchProfileImageWS(user.username).then((response) => {
            this.setState( { profileImage : response.data.profileImage }) ;
        });
    }

    onDrop = (acceptedFiles, rejectedFiles) => {

        var previewImages = this.state.previewImage;
        previewImages.splice(0,1);
        previewImages.push(acceptedFiles);
        this.setState({
            previewImage: previewImages,
            isUploaded : true
        });
    }


    onOpenImageModal = () => {
        this.setState({ openImageModal: true });
    };

    onOpenSkillModal = () => {
        this.setState({ openSkillModal: true });
    };

    onCloseImageModal = () => {
        this.setState({ openImageModal: false, previewImage: [] });
    };

    onCloseSkillModal = () => {
        this.setState({ openSkillModal: false });
    };

    handleChangePhone = (event) => {

        this.setState({
            phone: event.target.value
        });
    };

    handleChangeName = (event) => {

        this.setState({
            name: event.target.value
        });
    };

    handleSummaryChange = (event) => {

        this.setState({
            summary: event.target.value
        });
    };

    handleChangeAboutMe = (event) => {

        this.setState({
            aboutMe: event.target.value
        });
    };

    toggleViewEditBtn = (event) => {
        this.setState({
            isEdit: !this.state.isEdit,
        });
    };

    toggleEditPhone = (event) => {
        this.setState({
            phoneEdit: !this.state.phoneEdit
        });
    };

    toggleEditName = (event) => {
        this.setState({
            nameEdit: !this.state.nameEdit
        });
    };

    toggleEditAboutMe = (event) => {
        this.setState({
            aboutMeEdit: !this.state.aboutMeEdit
        });
    };

    toggleEditSummary = (event) => {
        this.setState({
            summaryEdit: !this.state.summaryEdit
        });
    };

    savePhone = (event) => {
        this.setState({
            phoneSaved: this.state.phone,
            phoneEdit: false
        });
        userWebService.updatePhoneDetailsWS({ phone : this.state.phone });
    };

    saveName = (event) => {
        this.setState({
            nameSaved: this.state.name,
            nameEdit: false
        });
        userWebService.updateNameDetailsWS({ name : this.state.name });
    };

    saveSummary = (event) => {
        this.setState({
            summarySaved: this.state.summary,
            summaryEdit: false
        });
        userWebService.updateSummaryWS({ summary : this.state.summary });
    };

    saveAboutMe = (event) => {
        this.setState({
            aboutMeSaved: this.state.aboutMe,
            aboutMeEdit: false
        });
        userWebService.updateAboutMeWS({ aboutme : this.state.aboutMe });
    };

    saveSkills = (event) => {
        event.preventDefault();
        let skillsArr = this.refs.skills.value.split(',');
        this.setState({
            skillsSaved: skillsArr
        });
        this.onCloseSkillModal();
        userWebService.updateSkillsWS({ skills : this.refs.skills.value });
    };

    render() {

        const user  = this.props.userDetails.user;
        const { isEdit, aboutMeEdit, summaryEdit, profileImage, nameEdit, phoneEdit } = this.state;
        var imgSrc = profileImage ? 'data:image/jpeg;base64,' + profileImage : profile_image;

        return (
            <div className="main-content">
                <NavBar searchAllowed={false} currentPage={"profile"}/>
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
                                                        <img className="avatar-image" src={imgSrc} alt="Profile"/>
                                                        <a className="picture-upload-trigger" href="#" onClick={ this.onOpenImageModal }>
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
                                                        onChange={this.handleChangePhone}
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
                                                        onChange={this.handleChangeName}
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
                                                    onChange={this.handleChangeAboutMe}
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
                                <span className="pf-modal-text">Add your skills</span>
                            </h3>
                            <div className="pf-modal-body-skills">
                                    <textarea className="pf-summary-textarea" ref="skills"
                                              placeholder="Enter your top skills seperated by comma"
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
                                        !this.state.isUploaded &&
                                        <span className="pf-text-pad">Drag your picture here or click in this area.</span>
                                    }

                                    {
                                        this.state.isUploaded &&
                                        this.state.previewImage.map((data, index) =>
                                            <img key={index} className="pf-avatar-image" id='img-upload' alt="Upload" src={URL.createObjectURL(data[0])}/>
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

export default connect(mapStateToProps)(UserProfilePage);