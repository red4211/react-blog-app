import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {setFullPost, setPostVisibility} from './actions';
import FullPost from './FullPost';
import CreateNewPost from './CreateNewPost';


class App extends Component {
    constructor() {
        super();

        this.state = {
            allPosts: [],
            showAllPosts: true
        }
    }

    componentDidMount() {
        fetch("https://bloggy-api.herokuapp.com/posts")
            .then(response => response.json())
            .then(response => {
                this.setState({ allPosts: response })
            })
    }

    displayFullPost = (num) => {
        fetch("https://bloggy-api.herokuapp.com/posts/" + num + "?_embed=comments")
            .then(response => response.json())
            .then(response => {
                this.setState({showAllPosts: false });
                this.props.dispatch(setFullPost(response));
                this.props.dispatch(setPostVisibility(true));
            })
    }

    backToList = () => {
        this.setState({ showAllPosts: true });
        this.props.dispatch(setPostVisibility(false));
    }

    deletePost = (num) => {
        fetch("https://bloggy-api.herokuapp.com/posts/" + num, {
                method: "DELETE"
            })
            .then(
                fetch("https://bloggy-api.herokuapp.com/posts")
                .then(response => response.json())
                .then(response => {
                    this.setState({ allPosts: response, showAllPosts: true });
                    this.props.dispatch(setPostVisibility(false));
                })
            )
    }

    handleChange = (event) => {
        var name = event.target.name;
        var inpVal = event.target.value;
        this.setState({
            [name]: inpVal
        })
    }

    render() {
        return (
        <div className="App">
            <AllPosts blogsList = {this.state.allPosts} displayFullPost={this.displayFullPost} showAllPosts={this.state.showAllPosts}
            handleChange={this.handleChange} />
          
            <FullPost backToList={this.backToList} deletePost={this.deletePost}/>
        </div>
        );
    }
}

function AllPosts(props) {
    if (props.showAllPosts === true) {
        var list = props.blogsList.map((element, index) => {
            return <div key={index} className="post" onClick={()=>{props.displayFullPost(element.id)}} >
      <h2 className="title" >{element.title} </h2>
      <p>{element.body} </p>
    </div>
        })

        return (
            <div>
      <CreateNewPost/>
      <div className="all-posts">
        {list}
      </div>
      </div>
        )
    } else { return null; }
}

const mapStateToProps = (state)=>({
    fullPost: state.fullPost
})
export default connect(mapStateToProps)(App);