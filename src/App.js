
import { useEffect, useState } from 'react';
import './index.css';



const KEY = "78fbf3c6";
function App() {
  const [query,setQuery] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [isLoaded, setIsLoaded] = useState(true)
  const [error,setError] = useState('')
  const [selectedId,setSelectedId] = useState(null)
  // useEffect(()=>{
  //   fetch(`http://www.omdbapi.com/?s=inception&apikey=${KEY}`).then(
  //   res=> res.json()
  // ).then(result=> setSearchResult(result.Search))
  // },[])

  useEffect(()=>{
    async function getData(){
      setIsLoaded(false)
      setError('')
      try {
        const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${KEY}`)
        if(!res.ok){
          throw new Error("Something went wrong with fetching movies!!!")
        }
        const movies = await res.json();
        console.log(movies)
        if(movies.Response === "False"){
          setError(movies.Error)
        }
        setSearchResult(movies.Search)
      } catch (err) {
        setError(err.message)
      } finally{
        setIsLoaded(true)
      }
    }
    if(query.length<3){
      setError('Search a movie...')
      setSearchResult([])
      return;
    }
    getData();
  },[query]);

  function handleSelectId(id){
    setSelectedId((selectedId)=> selectedId===id? null:id)
  }

  return (
    <div className="app">
      <Nav>
        <Searchbox movieList={searchResult} query={query} setQuery={setQuery}/>
      </Nav>
      <Main>
        <Box>
          {!isLoaded && <Loader />}
          {isLoaded && !error && <Movielist movieList={searchResult} handleSelectId={handleSelectId}/>}
          {error && <Error message={error}/>}
        </Box>
          <Box>
          {selectedId===null?
            <Boxheading />:
            <Moviedetails id={selectedId} setSelectedId={setSelectedId}/>
          }
          </Box>
      </Main>
    </div>
  );
}

function Starrating(){
  const [hoverStarNo,setHoverStarNo] = useState(0);
  const [rating,setRating] = useState(null)
  console.log(hoverStarNo)
  return <div className='rating'>
    {Array.from({length:5},(_,i)=><span
      key={i+1}
      onMouseEnter={()=>setHoverStarNo(i+1)}
      onMouseLeave={()=>setHoverStarNo(0)}
      onClick={()=>{setRating(i+1)}}
    >{i>=hoverStarNo&&i>=rating?<svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#FFFF00"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="{2}"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>:
          <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="#FFFF00"
          stroke="#FFFF00"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
          }</span>)}
          <p>{rating? rating :hoverStarNo}</p>
  </div>
}

function Nav({children}){
  return(
    <div className="nav">
      <div className="logo">
        <span className="icon">🍿</span>
        <h3 className="logo-text">usePopcorn</h3>
      </div>
      {children}
    </div>
  )
}

function Main({children}){
  return(
    <div className="main">
      {children}
    </div>
  )
}

function Searchbox({movieList,query,setQuery}){
  function onQueryChange(e){
    setQuery(e.target.value);
    console.log(e.target.value);
  }
  return(<><div className="search-bar">
  <input type="text" value={query} onChange={(e)=>onQueryChange(e)} placeholder='Enter movie name...' />
</div>
<div className="result">Found {movieList?.length} result</div></>
)
}

function Boxheading(){
  return(
    <div className='boxHeading'>
      <h1>Movies you watched</h1>
      <ul className="status">
        <li>#️⃣ 0 movies</li>
        <li>⭐ 0.00</li>
        <li>🌟 0.00</li>
        <li>⌛ 0.00</li>
      </ul>
    </div>
  )
}

function Moviedetails({setSelectedId,id}){
  useEffect(()=>{
    console.log(id)
    async function getDetails(){
      try {
        const res = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=${KEY}`)
        if(!res.ok){
          throw new Error("Something went wrong with fetching movies!!!")
        }
        const data = await res.json()
        console.log(data)
        
      } catch (error) {
        
      }
    }
    getDetails()
  },[])
  return(<>
    <button className='btn-back' onClick={()=>setSelectedId(null)}>&larr;</button>
    <Starrating />
    </>
  )
}

function Box({children}){ 
  const [isOpen,setIsOpen] = useState(true)
  return (<div className="box">
  <div className='cross' onClick={()=> setIsOpen(!isOpen)}>{isOpen?'❌':'➕'}</div>
  { isOpen && children}
</div>)
}

function Movielist({movieList,handleSelectId}){
  return(<ul className="list">
  {movieList.map(item=> <Item movie={item} key={item.imdbID} handleSelectId={handleSelectId}/>)}
</ul>)
}

function Loader(){
  return(
    <p className='loader'>Loading...</p>
  )
}

function Error({message}){
  return(
    <p className='loader'>{message}</p>
  )
}

function Item({movie,handleSelectId}){
  const id = movie.imdbID;
  return (<li onClick={()=>handleSelectId(id)}>
    <img src={movie.Poster} alt="img" />
    <h3>{movie.Title}</h3>
    <div>
      <span>📅</span>
      <span>{movie.Year}</span>
    </div>
  </li>)
}

export default App;
