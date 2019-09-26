import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware  } from "redux";
import { Provider } from "react-redux";
import thunk from 'redux-thunk';

const initialState = {
	commentText: "",
	fullPost: {
		comments: []
	},
	showFullPost:false,
	editPostTitle: "",
	editPostText: "",
	createPostText: "",
    createPostTitle: "",
    showForm: false,
    postIsEdited:false
}
function reducer(state=initialState,action){
	switch(action.type){
		case "SETFULLPOST":
		return {
			...state,
			fullPost: action.fullPost
		};

		case "TOGGLEPOST":
		return{
			...state,
			showFullPost: action.showFullPost
		};

		case "SETEDITTITLE":
		return{
			...state,
			editPostTitle: state.fullPost.title, //questionable
			editPostText: state.fullPost.body
		};

		case "HANDLECHANGE":
		return{
			...state,
			[action.name]: action.text
		};

		case "TOGGLEFORM":
		return{
			...state,
			showForm: !state.showForm
		};

		case "SHOWEDITPOST":
		return{
			...state,
			postIsEdited:true
		};

		case "TOGGLEEDITPOST":
		return{
			...state,
			postIsEdited: !state.postIsEdited
		}
		default: 
			return state;
	}
}
const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

const Main = ()=>(
<Provider store={store}><App/></Provider>
)


ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
