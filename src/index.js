import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import reportWebVitals from './reportWebVitals';



function Generation(props){

  return <div>
    <form onSubmit={props.generateMeme}>
    <select id="select" value={props.subreddit} onChange={props.handleChange}>
      <option value="">Random (Default)</option>
      <option value="memes">memes</option>
      <option value="dankmemes">dankmemes</option>
      <option value="me_irl">me_irl</option>
      <option value="bonehurtingjuice">bonehurtingjuice</option>
      <option value="okbuddyretard">okbuddyretard</option>
      <option value="shitposting">shitposting</option>
      <option value="PrequelMemes">PrequelMemes</option>
      <option value="comedyheaven">comedyheaven</option>
    </select>
    <input type="submit" value="Generate"/>
    </form>
  </div>

}


function Meme(props){

  return <div id="memeContainer">
    <h2>{props.memeTitle}</h2>
    <p>{props.subredditText}<br/>
    {props.descriptionText}<br/>
    <a href={props.originalLink}>{props.originalLink}</a></p>
    <img src="" alt="Meme" ref={props.imgRef}></img>
  </div>

}


function App(){

  let [subreddit, setSubreddit] = useState("");
  const handleChange = e => setSubreddit(e.target.value);

  let [memeTitle, setMemeTitle] = useState("");

  let [descriptionText, setDescriptionText] = useState("");
  let [subredditText, setSubredditText] = useState("");
  let [originalLink, setOriginalLink] = useState("");

  let imgRef = useRef();

  function generateMeme(e){
    e.preventDefault();

    let apiUrl = "https://meme-api.herokuapp.com/gimme";

    apiUrl = subreddit==="" ? apiUrl : apiUrl + `/${subreddit}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
      imgRef.current.src = data.url;
      setMemeTitle(data.title);
      setDescriptionText("Posted by " + data.author);
      setOriginalLink(data.postLink);
      setSubredditText(`Freshly picked from ${data.subreddit}`)
    });

  }

  return <div id="container">
    
    <Generation 
    subreddit={subreddit} 
    handleChange={handleChange} 
    generateMeme={generateMeme}/>

    <Meme imgRef={imgRef} 
    memeTitle={memeTitle} 
    descriptionText={descriptionText}
    originalLink={originalLink}
    subredditText={subredditText}/>
    
  </div>
}


const el = <App/>;

ReactDOM.render(el, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
