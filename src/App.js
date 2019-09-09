import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';

class App extends Component {
  constructor(){
    super();

    this.state = {
      allPosts: [],
      fullPost:{},
      showAllPosts: true,
      showFullPost: false,
      createPostTitle: "",
      createPostText: "",
      showForm: false,
      commentText: "",
      editPostTitle: "",
      editPostText: "",
      postIsEdited: false
    }
  }

  componentDidMount(){
    fetch("https://bloggy-api.herokuapp.com/posts")
    .then(response => response.json())
    .then(response => {
      this.setState({allPosts: response})
    })
  }

  saveChanges = ()=>{
    fetch("https://bloggy-api.herokuapp.com/posts/"+this.state.fullPost.id , {
      method: "PUT",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title: this.state.editPostTitle,
        body: this.state.editPostText
      })
    })
    .then(this.setState({postIsEdited:false}))
    
  }

  makeNewComment = (e)=>{
    e.preventDefault();
    if(this.state.commentText.length===0){return}else{
      fetch("https://bloggy-api.herokuapp.com/comments", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        postId: this.state.fullPost.id,
        body: this.state.commentText
      })
    })
    .then(
        this.setState({commentText: ""})
      )
    }
  }

  displayFullPost = (num)=>{
    fetch("https://bloggy-api.herokuapp.com/posts/" + num + "?_embed=comments" )
    .then(response => response.json())
    .then(response => {
      this.setState({fullPost: response, showFullPost:true, showAllPosts:false})
    })
  }

  backToList = ()=>{
    this.setState({showAllPosts:true, showFullPost:false})
  }

  deletePost = (num)=>{
    fetch("https://bloggy-api.herokuapp.com/posts/" + num, {
      method: "DELETE"
    })
    .then(
      fetch("https://bloggy-api.herokuapp.com/posts")
    .then(response => response.json())
    .then(response => {
      this.setState({allPosts: response, showAllPosts:true, showFullPost:false})
    })
      )
  }

  editPost = ()=>{
    this.setState({postIsEdited:true, editPostTitle:this.state.fullPost.title, editPostText: this.state.fullPost.body})
  }

  createPost = (e)=>{
    e.preventDefault();
    
    if(this.state.createPostTitle.length===0||this.state.createPostText.length===0){return}else{
      fetch("https://bloggy-api.herokuapp.com/posts", {
      method: "POST",
      headers: {
                  'Content-Type': 'application/json'
              },
      body: JSON.stringify({
        title: this.state.createPostTitle,
        body: this.state.createPostText
      })
    })
    .then(this.setState({showForm:false}))
    }
  }

  handleChange = (event)=>{
    var name = event.target.name;
    var inpVal = event.target.value;
    this.setState({
      [name]: inpVal
    })
  }

  showCreateForm = ()=>{
    this.setState({showForm:true})
  }

  render(){
    return (
    <div className="App">
      <AllPosts blogsList = {this.state.allPosts} displayFullPost={this.displayFullPost} showAllPosts={this.state.showAllPosts}
       createPost={this.createPost} handleChange={this.handleChange} createPostTitle={this.state.createPostTitle} 
       createPostText={this.state.createPostText} showForm={this.state.showForm} showCreateForm={this.showCreateForm} />
      <FullPost postData = {this.state.fullPost} showFullPost={this.state.showFullPost} backToList={this.backToList} 
      deletePost={this.deletePost} makeNewComment={this.makeNewComment} handleChange={this.handleChange} editPost={this.editPost}
      postIsEdited={this.state.postIsEdited} editPostTitle={this.state.editPostTitle} editPostText={this.state.editPostText} 
      saveChanges={this.saveChanges} commentText={this.state.commentText} />
    </div>
  );
  }
}

function AllPosts(props){
  if(props.showAllPosts === true){
    var list = props.blogsList.map((element,index)=>{
    return <div key={index} className="post" onClick={()=>{props.displayFullPost(element.id)}} >
      <h2 className="title" >{element.title} </h2>
      <p>{element.body} </p>
    </div>
  })

  return(
      <div>
      <CreateNewPost createPost={props.createPost} handleChange={props.handleChange} createPostTitle={props.createPostTitle} 
      createPostText={props.createPostText} showForm={props.showForm} showCreateForm={props.showCreateForm} />
      <div className="all-posts">
        {list}
      </div>
      </div>
    )
  }else{return null;}
}

function FullPost(props){
  var commentsList;
  if(props.showFullPost === true){
if(typeof props.postData.comments !== "undefined"){
    commentsList = props.postData.comments.map((element, index)=>{
    return <li key={index}>{element.body}</li>
  })
  }

  if(props.postIsEdited===true){
return(
      <div className="blog-page">
        <button onClick={props.backToList} className="back-button">Go back</button>

          <input type="text" value={props.editPostTitle} className="edit-input" name="editPostTitle" onChange={props.handleChange} />
        <input type="text" value={props.editPostText} className="edit-input" name="editPostText" onChange={props.handleChange} />


        <button onClick={props.saveChanges} className="button-margin-r" >Save changes</button>
        <button onClick={()=>{props.deletePost(props.postData.id)}} >Delete Post</button>

        <p className="comments-title">Comments</p>
        <ul className="comments">
          {commentsList}
        </ul>
        <form onSubmit={props.makeNewComment} className="new-comment-form">
          
          <textarea onChange={props.handleChange} name="commentText" value={props.commentText} className="comment-textarea"/>
          <button >Add comment</button>
        </form>
      </div>
    )
  }else{
return(
      <div className="blog-page">
        <button onClick={props.backToList} className="back-button">Go back</button>
        <h2 className="title">{props.postData.title} </h2>
        <p>{props.postData.body} </p>
        <button onClick={props.editPost} className="button-margin-r">Edit post</button>
        <button onClick={()=>{props.deletePost(props.postData.id)}} >Delete Post</button>

        <p className="comments-title">Comments</p>
        <ul className="comments">
          {commentsList}
        </ul>
        <form onSubmit={props.makeNewComment} className="new-comment-form">
          <textarea onChange={props.handleChange} name="commentText" value={props.commentText} className="comment-textarea"/>
          <button >Add comment</button>
        </form>
      </div>
    )
  }

  }else{
    return null;
  }
}


function CreateNewPost(props){
  if(props.showForm===true){
    return(
      <div>
        <button onClick={props.showCreateForm} className="create-post-btn">Create a new post</button>
      <form onSubmit={props.createPost} className="new-post-form" >
        <label>Title <input type="text" name="createPostTitle" onChange={props.handleChange} value={props.createPostTitle} /></label>
        <label>Text <input type="text" name="createPostText" onChange={props.handleChange} value={props.createPostText} /></label>
        <button>Submit</button>
      </form>
      </div>
    )
  }else{
    return <button onClick={props.showCreateForm} className="create-post-btn" >Create a new post</button>
  }
}

export default App;
