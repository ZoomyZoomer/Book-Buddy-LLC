import React from 'react'
import RatingStatic from './RatingStatic'

const LibraryBookShowcase = ({value}) => {

    function lightenColor(color, percent) {
        // Extract the RGB values
        const num = parseInt(color?.slice(1), 16);
        let r = (num >> 16) + Math.round(255 * percent);
        let g = ((num >> 8) & 0x00FF) + Math.round(255 * percent);
        let b = (num & 0x0000FF) + Math.round(255 * percent);
    
        // Ensure values are within the 0-255 range
        r = Math.min(255, r);
        g = Math.min(255, g);
        b = Math.min(255, b);
    
        // Convert back to hex
        const newColor = (r << 16) | (g << 8) | b;
        return `#${newColor.toString(16).padStart(6, '0')}`;
      }

  return (
    <div className='library-book-container'>

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                    <div className='library-book-circle'>
                        <div style={{height: 'fit-content', width: 'fit-content', position: 'absolute', top: '4%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <div style={{position: 'relative'}}>
                                <img src={'http://books.google.com/books/content?id=mQCWEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'} className='library-cover'/>
                                <img 
                                    src={`/dapper-bird-i.png`}
                                    className={'sticker0-abs'}
                                />
                                <img 
                                    src={`/holly-i.png`}
                                    className={'sticker1-abs'}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='library-book-info'>
                    <div className='library-book-title'>Percy Jackson and the Olympians: The Chalice of the Gods</div>
                    <div className='library-book-author'>Rick Riordan</div>
                    <div id='star' style={{marginTop: '0.625rem', width: 'fit-content'}}>{<RatingStatic rating={5}/>}</div>
                    <div className='library-book-genre-tag' style={{color: 'rgb(255, 169, 169)', borderColor: 'rgb(255, 169, 169)'}}>
                        <div className='library-book-genre-circle' style={{backgroundColor: 'rgb(255, 169, 169)'}}/>
                        Juvenile Fiction
                    </div>
                </div>


                    <div className='library-vert-bar-container'>
                        <div className='library-vert-bar'>
                            <div id={`fill${0}`} className='library-vert-bar-fill'/>
                        </div>
                    </div>
            

            </div>

            <div id='star' className='library-page-abs' style={{marginRight: '0.6rem'}}>{value !== -1 ? value : 0}/{242} </div>

    </div>
  )
}

export default LibraryBookShowcase