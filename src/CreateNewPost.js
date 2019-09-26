import React, { Component } from 'react';
import { connect } from "react-redux";
import {handleChange, TOGGLEFORM, createPost} from './actions';

class CreateNewPost extends Component {
    showCreateForm = () => {
        this.props.dispatch(TOGGLEFORM);
    }

    createPost = (e) => {
        e.preventDefault();
        this.props.dispatch(createPost()); 
    }

    handleChange = (event) => {
        var name = event.target.name;
        var inpVal = event.target.value;
        this.props.dispatch(handleChange(name,inpVal));
    }

    render(){
        if (this.props.showForm) {
        return (
            <div>
            <button onClick={this.showCreateForm} className="create-post-btn">Hide form</button>
          <form onSubmit={this.createPost} className="new-post-form" >
            <label>Title <input type="text" name="createPostTitle" onChange={this.handleChange} value={this.props.createPostTitle} /></label>
            <label>Text <input type="text" name="createPostText" onChange={this.handleChange} value={this.props.createPostText} /></label>
            <button>Submit</button>
          </form>
          </div>
        )
        } else {
            return <button onClick={this.showCreateForm} className="create-post-btn" >Create a new post</button>
        }
    }
}

const mapStateToProps = (state)=>({
    createPostText: state.createPostText,
    createPostTitle: state.createPostTitle,
    showForm: state.showForm
})

export default connect(mapStateToProps)(CreateNewPost);