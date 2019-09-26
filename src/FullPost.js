import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {handleChange, setPostChanges, toggleEditPost, setEditTitle, makeComment} from './actions';

class FullPost extends Component{
    handleChange = (e)=>{
        let name = e.target.name;
        let inpVal = e.target.value;
        this.props.dispatch(handleChange(name, inpVal));
    }
    saveChanges = () => {
        this.props.dispatch(setPostChanges());
    }
    editPost = () => {
        this.props.dispatch(toggleEditPost());
        this.props.dispatch(setEditTitle);
    }
    makeNewComment=(e)=>{
        e.preventDefault();
            this.props.dispatch(makeComment());
        }

  render(){
    var commentsList;
    if (this.props.showFullPost === true) {
       commentsList = this.props.fullPost.comments.map((element, index) => {
                return <li key={index}>{element.body}</li>
            })

        if (this.props.postIsEdited === true) { 
            return (
                <div className="blog-page">
        <button onClick={this.props.backToList} className="back-button">Go back</button>

          <input type="text" value={this.props.editPostTitle} className="edit-input" name="editPostTitle" onChange={this.handleChange} />
        <input type="text" value={this.props.editPostText} className="edit-input" name="editPostText" onChange={this.handleChange} />


        <button onClick={this.saveChanges} className="button-margin-r" >Save changes</button>
        <button onClick={()=>{this.props.deletePost(this.props.fullPost.id)}} >Delete Post</button>

        <p className="comments-title">Comments</p>
        <ul className="comments">
          {commentsList}
        </ul>
        <form onSubmit={this.makeNewComment} className="new-comment-form">
          
          <textarea onChange={this.handleChange} name="commentText" value={this.props.commentText} className="comment-textarea"/>
          <button >Add comment</button>
        </form>
      </div>
            )
        } else { 
            return (
                <div className="blog-page">
        <button onClick={this.props.backToList} className="back-button">Go back</button>
        <h2 className="title">{this.props.fullPost.title} </h2>
        <p>{this.props.fullPost.body} </p>
        <button onClick={this.editPost} className="button-margin-r">Edit post</button>
        <button onClick={()=>{this.props.deletePost(this.props.fullPost.id)}} >Delete Post</button>

        <p className="comments-title">Comments</p>
        <ul className="comments">
          {commentsList}
        </ul>
        <form onSubmit={this.makeNewComment} className="new-comment-form">
          <textarea onChange={this.handleChange} name="commentText" value={this.props.commentText} className="comment-textarea"/>
          <button >Add comment</button>
        </form>
      </div>
            )
        }

    } else {
        return null;
    }    
  }
}

const mapStateToProps = (state)=>({
    fullPost: state.fullPost,
    showFullPost: state.showFullPost,
    editPostTitle: state.editPostTitle,
    editPostText: state.editPostText,
    postIsEdited: state.postIsEdited,
    commentText: state.commentText
})


export default connect(mapStateToProps)(FullPost);