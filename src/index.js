import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import reportWebVitals from './reportWebVitals';



function Generation(props){

  return <div id="generation">
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
    <br/>
    <p>Or</p>
    <input type="text" placeholder="Custom subreddit" value={props.customSubreddit} onChange={props.handleCustomChange}/>
    <br/><br/>
    <input type="checkbox" onChange={props.handleNsfwChange}/><span>NSFW Filter</span>
    <br/><br/>
    <input type="submit" value="Generate"/>
    </form>
  </div>

}


function Meme(props){

  return <div id="memeContainer">
    <h2>{props.memeTitle}</h2>
    <p>{props.subredditText}<br/>
    {props.descriptionText}&nbsp;{props.upvotes}<br/>
    <a href={props.originalLink} target="_blank">{props.originalLink}</a><br/></p>

    <a href={props.downloadLink} target="_blank" rel="noreferrer">
      <img src="" alt="Meme be here" ref={props.imgRef}></img>
    </a>
  </div>

}


function App(){

  let [subreddit, setSubreddit] = useState("");
  const handleChange = e => setSubreddit(e.target.value);
  let [customSubreddit, setCustomSubreddit] = useState("");
  const handleCustomChange = e => setCustomSubreddit(e.target.value);
  let [nsfwFilter, setNsfwFilter] = useState(false);
  const handleNsfwChange = e => setNsfwFilter(e.target.checked ? true : false);

  let [memeTitle, setMemeTitle] = useState("");

  let [descriptionText, setDescriptionText] = useState("");
  let [subredditText, setSubredditText] = useState("");
  let [originalLink, setOriginalLink] = useState("");
  let [downloadLink, setDownloadLink] = useState("");
  let [upvotes, setUpvotes] = useState("");

  let imgRef = useRef();

  function handleErrors(res){
    if(!res.ok){
      throw setMemeTitle(res.statusText);
    }
    return res;
  }

  function generateMeme(e){
    e.preventDefault();

    let apiUrl = "https://meme-api.herokuapp.com/gimme";


    if(subreddit==="" && customSubreddit===""){
      console.log("hello")
    } else if (subreddit!=="" && customSubreddit===""){
      apiUrl = apiUrl + `/${subreddit}`;
    } else if (subreddit==="" && customSubreddit!==""){
      apiUrl = apiUrl + `/${customSubreddit}`;
    } else if (subreddit!=="" && customSubreddit!==""){
      apiUrl = apiUrl + `/${customSubreddit}`;
    }

    fetch(apiUrl)
    .then(res => handleErrors(res))
    .then(res => res.json())
    .then(data => {
      if(nsfwFilter){
        if(data.nsfw){
          imgRef.current.src = "";
          imgRef.current.alt = "Something went wrong";
          setMemeTitle("The Post is NSFW");
          return;
        }
      }
      imgRef.current.src = data.url;
      setMemeTitle(data.title);
      setDescriptionText("Posted by " + data.author);
      setOriginalLink(data.postLink);
      setSubredditText(`Freshly picked from ${data.subreddit}`);
      setDownloadLink(data.url);
      setUpvotes(`| ${data.ups} Upvotes`);
    
    }).catch(err => {
      imgRef.current.src = "";
      imgRef.current.alt = "Something went wrong";
      customSubreddit === "" ? setMemeTitle("Something went wrong") : setMemeTitle("The Custom Subreddit can't be found");
      setDescriptionText("");
      setOriginalLink("");
      setSubredditText("");
      setUpvotes("");
    });

  }

  return <div id="container">

    <h2>Meme Generator</h2>
    <p>
      Generate a meme from the subreddits in the dropdown menu or enter a custom subreddit to generate from!<br>
      </br>
      Some posts take time to load. Either wait or generate a new one!
    </p>
    
    <Generation 
    subreddit={subreddit} 
    handleChange={handleChange} 
    generateMeme={generateMeme}
    customSubreddit={customSubreddit}
    handleCustomChange={handleCustomChange}
    handleNsfwChange={handleNsfwChange}
    />
    <br/>
    <Meme imgRef={imgRef} 
    memeTitle={memeTitle} 
    descriptionText={descriptionText}
    originalLink={originalLink}
    subredditText={subredditText}
    downloadLink={downloadLink}
    upvotes={upvotes}/>
    
  </div>
}


const el = <App/>;

ReactDOM.render(el, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
