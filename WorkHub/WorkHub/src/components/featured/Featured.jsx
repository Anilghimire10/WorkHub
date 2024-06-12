import React from 'react'
import "./featured.scss"
const Featured = () => {
  return (
    <div className='featured'>
        <div className="container">
            <div className="left">
                <h1>FIND THE PERFECT FREELANCE SERVICES FOR YOUR BUSINESS</h1>
                <div className="search">
                    <div className="searchInput">
                        <img className='imgsearch' src="./img/search.png" alt="" />
                        <input type="text" placeholder='Try "Building Mobile App"' />
                    </div>
                    <button className='searchbutton'>Search</button>
                </div>
                <div className="popular">
                    <span>Popular:</span>
                    <button className='button'>Work Design</button>
                    <button className='button'>Wordpress</button>
                    <button className='button'>Logo Design</button>
                    <button className='button'>AI service</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Featured
