import React, { Component } from 'react';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      bookname:"harry potter",
      books :[], 
      errorMessage : '',
      isLoading : true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleFirstLoad = this.handleFirstLoad.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount(){
    this.handleFirstLoad();
  }
  handleFirstLoad(e){
    axios.get('https://www.googleapis.com/books/v1/volumes?q=harry')
    .then(response => {     
      this.setState({books : response.data.items , isLoading: false});
    }).catch( error => {
      this.setState( { errorMessage : 'Something went wrong', isLoading: false});
    });
  }

  handleChange(e){
    const bookname = e.target.bookname;
    this.setState({ bookname : e.target.value });
  }
  handleReset(){
    this.setState({bookname : ''})
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.handleSubmit(e);
    }
  }

  handleSubmit(e){
    e.preventDefault();
    console.log(this.state);
    {this.state.bookname && 
      axios.get('https://www.googleapis.com/books/v1/volumes?q=' + this.state.bookname)
        .then(response => {        
        this.setState({books : response.data.items , isLoading: false});
        }).catch( error => {
       this.setState( { errorMessage : 'no books found for' + this.state.bookname, isLoading: false});
      });
    }
  }

  render(){    
    console.log('in render', this.state);  
    const {isLoading } = this.state;
    return (    
    <div className="App">
     <h1>Search for the Book Collection</h1>
      <input
        name='bookname'
        value={this.state.bookname}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
      ></input> &nbsp;
      {/* <button type="submit" onClick={this.handleSubmit}>
        Search
      </button> &nbsp; */}
      <button type="reset" onClick={this.handleReset} >Reset </button>
      {this.state.errorMessage && 
      (<p> {this.state.errorMessage} </p> )}   

      {!isLoading ?  
      this.state.books.map((book) => {   
        return (
          <div>           
            <section>
            <div key={book.volumeInfo.title} >     
              <nav> {book.volumeInfo.imageLinks && <img src={book.volumeInfo.imageLinks.thumbnail} alt="no image" style={{width : 100}} ></img> }</nav>
                <article> 
                  <a href={book.volumeInfo.previewLink} target="_blank">{book.volumeInfo.title}</a><br></br>
                  {book.volumeInfo.description && (<p className="text"> Description: {book.volumeInfo.description} </p> )}
                  {book.volumeInfo.categories && <h5 style={{width: '50%', float:'inline-start'}}>Category: {book.volumeInfo.categories.map( (category) => (<li style={{width: '85%', textAlign: 'initial', float:'inline-start'}} key={category}>{category}</li>))}</h5> } 
                  <br></br>              
                </article>           
              </div>
            </section>
          </div>
        );
      })    
      : 
      <div style={{ width: "100%", height: "100", display: "flex", justifyContent: "center", alignItems: "center" }} >
      <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
      </div>
  }
    </div>
  );
  }
}
export default App;
