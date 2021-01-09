import React,{Component} from 'react'
import './JokeList.css'
import axios from 'axios'
import uuid from 'uuid'
class JokeList extends Component{
    static defaultProps={
        proxyUrl:"https://cors-anywhere.herokuapp.com/"
    }
    constructor(props){
        super(props)
        this.state={jokes:[],loading:true}
        this.handleNewJokesClick=this.handleNewJokesClick.bind(this)
        this.upVote=this.upVote.bind(this)
        this.downVote=this.downVote.bind(this)
    }
    componentDidMount(){
        
var localData = JSON.parse(localStorage.getItem('jokes')|| "[]");
        if(localData.length===0){
            this.getJokes();
        }
        else{
            this.setState({jokes:localData,loading:false})
        }
       
    }
    componentDidUpdate(){
        localStorage.setItem('jokes', JSON.stringify(this.state.jokes));
    }
  async getJokes(){
    let seenJokes=new Set()
    let newJokes=[]; 
    this.state.jokes.map(x=>seenJokes.add(x.joke))
        try{   
          do{
            let res=await axios.get('https://icanhazdadjoke.com/',{headers:{Accept:'application/json'}})
                   let data=res.data
                    if(!seenJokes.has(data.joke)){
                        newJokes.push({...data,rating:0})
                        seenJokes.add(data.joke)
                                                         
                    }
                   
           
        }while(seenJokes.size%10!==0)
        this.setState(st=>{
              
            return {jokes:[...st.jokes,...newJokes],loading:false}

        }); 
    }
      catch(e){
          alert(e);
      }
    }
handleNewJokesClick(evt){
this.setState({loading:true})
this.getJokes()
}
upVote(evt){
  
    const evtIdx= evt.target.id;
    const newRating=this.state.jokes[evtIdx].rating+1

this.setState((st)=>{
    st.jokes[evtIdx].rating=newRating;
        
        
    return {jokes:[...st.jokes]}
});

}
getEmoji(rating){
    if(rating<-8){return "🤬"}
    else if(rating<-6){return "😡" }
    else if(rating<-4){return "😤"}
    else if(rating<-2){return "😠"}
    else if(rating<0){return "😒"}
    else if(rating<=2){return "😀"}
    else if(rating<=4){return "😃"}
    else if(rating<=6){return "😄"}
    else if(rating<=8){return "😁" }
    else if(rating<=10){return "😆"}
    else if(rating<=12){return "😂"}
    else {return "🤣"}
}
getColor(rating){
    if(rating>12){return "#4CAF50"}
      
    else if(rating>10){return "#8BC34A"}
    
    else if(rating>8){return "#CDDC39"}

    else if(rating>6){return "#FFEB3B"}
    
    else if(rating>4){return "#FFC107"}

    else if(rating>2){return "#FF9800"}
    
    else {return "#f44336"}
}
downVote(evt){
    const evtIdx= evt.target.id;
    const newRating=this.state.jokes[evtIdx].rating-1
    this.setState((st)=>{
        st.jokes[evtIdx].rating=newRating;
        
        
          return {jokes:[...st.jokes]}
       });
      
    
}

    render(){

        let jokes=this.state.jokes.sort((a,b)=>b.rating-a.rating)
        
        return (
       
    this.state.loading?<div><i className="fa fa-smile-o JokeList-loading fa-8x" aria-hidden="true"></i><h1 className="JokeList-title">Loading...</h1></div>:<div className="JokeList"> 

    <div className="JokeList-Header">  <h1 className="JokeList-title"><span>Dad</span> JOKES</h1><span className='laughing'role="img">😂</span><button className="JokeList-getmore" onClick={this.handleNewJokesClick}>Fetch Jokes</button></div>
        <div className="JokeList-Jokes">{jokes.map((x,idx)=><div className="JokeList-Joke" key={x.id}><div className="Joke-buttons"><i id={idx} className="fa fa-arrow-up" aria-hidden="true" onClick={this.upVote}></i><span className="Joke-rating" style={{border: "3px solid "+this.getColor(x.rating)}}>{x.rating}</span><i id={idx} className="fa fa-arrow-down" aria-hidden="true"onClick={this.downVote}></i></div><div className="Joke-Text">{x.joke}</div><div role="img" className="Joke-smiley">{this.getEmoji(x.rating)}</div></div>)}</div>


        </div>)
    }
}
export default JokeList