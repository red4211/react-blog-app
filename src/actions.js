
export function setFullPost(data){
	return {
		type: "SETFULLPOST",
		fullPost: data
	}
}

export function makeComment(){
	return function(dispatch, getState){
		if(getState().commentText!==""){
				fetch("https://bloggy-api.herokuapp.com/comments", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        postId: getState().fullPost.id,
                        body: getState().commentText
                    })
                })
                .then(
                    dispatch(handleChange("commentText", ""))
                )
		}
	}
}

export function setPostVisibility(bool){
	return{
		type: "TOGGLEPOST",
		showFullPost: bool
	}
}

export const setEditTitle = {
	type: "SETEDITTITLE"
}

export function handleChange(name, text){
	return {
		type: "HANDLECHANGE",
		text:text,
		name:name
	}
}

export const TOGGLEFORM = {
	type: "TOGGLEFORM"
}

export function createPost(){
	return function(dispatch, getState){
		if(getState().createPostTitle.length===0||getState().createPostText.length===0){return}else{
		fetch("https://bloggy-api.herokuapp.com/posts", {
		method: "POST",
		headers: {
		'Content-Type': 'application/json'
		},
		body: JSON.stringify({
		title: getState().createPostTitle,
		body: getState().createPostText
		})
		})
		.then(dispatch(TOGGLEFORM))
		}
	}
}

export function setPostChanges(){
	return function(dispatch, getState){
				fetch("https://bloggy-api.herokuapp.com/posts/" + getState().fullPost.id ,{
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: getState().editPostTitle,
                    body: getState().editPostText
                })
            })
			.then(dispatch(toggleEditPost()))
            
	}
}

export function toggleEditPost(){
	return {
		type: "TOGGLEEDITPOST"
	}
}