import React, { useState, useEffect } from 'react'
import '../profilestyles.css'
import {ReactComponent as Heart} from '../like-heart.svg'
import {ReactComponent as HeartBig} from '../like-heart-big.svg'
import {ReactComponent as HeartBigFilled} from '../like-heart-filled.svg'
import {ReactComponent as Close} from '../n-notif-close-white.svg'
import {ReactComponent as Plus} from '../profile-plus.svg'
import {ReactComponent as Document} from '../document-profile.svg'
import {ReactComponent as Arrow} from '../arrow-down-prof.svg'
import ShowcaseBook from './ShowcaseBook'
import axios from 'axios'

const ProfilePage = ({username, setShowProfile}) => {

    const [extendBio, setExtendBio] = useState(false);
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [profileLiked, setProfileLiked] = useState(false);
    const [addingTags, setAddingTags] = useState(false);

    const searchBooks = async() => {

        const response = await axios.get('/api/getBooksBySearch', {
            params: {
              username: username,
              tab_name: 'Favorites',
              title: 'title',
              search_query: '',
              filter: null
            },
          });

        setRecommendedBooks(response.data[0]);

    }

    useEffect(() => {
        searchBooks();
    })

  return (
    <div className='n-profile-container'>

        {addingTags && (
            <></>
        )}

        <div style={{height: '100%', width: '100%', position: 'relative', filter: (addingTags) ? 'brightness(0.3)' : 'none', pointerEvents: (addingTags) ? 'none' : 'all'}} className='n-profile-cont-body'>

        <div style={{position: 'absolute', right: '2rem', top: '2rem', zIndex: '9999'}} className='exit-notif-0' onClick={() => setShowProfile(false)}><Close /></div>

        <div className='n-profile-bg'>

            <img src='/cloud0.png' style={{position: 'absolute', left: '0.7rem', bottom: '3.6rem', height: '3rem'}}/>
            <img src='/cloud1.png' style={{position: 'absolute', left: '13rem', bottom: '2.2rem', height: '4rem'}}/>
            <img src='/cloud2.png' style={{position: 'absolute', right: '1.6rem', top: '3.6rem', height: '2.6rem'}}/>

            <div className='n-profile-circle-0'>
                <div className='n-profile-circle-inner-0'>
                    <img src='/lion-0.png' style={{height: '5rem'}}/>
                    <div className='n-profile-status-0'/>
                </div>
            </div>

            <div className='n-profile-like-btn'>
                <div style={{display: 'flex'}}>{!profileLiked ? <Heart /> : <HeartBigFilled />}</div>
                <div style={{marginLeft: '0.4rem'}}>Like</div>
            </div>

        </div>

            <div style={{display: 'flex', justifyContent: 'right', color: '#9BA4B6', fontSize: '0.8125rem', marginTop: '0.4rem', marginRight: '8%', marginTop: '2rem'}}>14 books read · 17 likes</div>
            <div style={{display: 'flex', justifyContent: 'left', marginTop: '3rem', fontSize: '1.4rem', fontWeight: '600', marginLeft: '8%'}}>Whole Milky</div>
            <div style={{display: 'flex', justifyContent: 'left', fontSize: '0.8125rem', color: '#9BA4B6', marginTop: '0.2rem', marginLeft: '8%'}}>@WholeMilkOmega</div>

            <div className='n-profile-tags-reel'>
                <div className='n-profile-tag'>Non-Fiction</div>
                <div className='n-profile-tag'>Historical</div>
                <div className='n-profile-tag'>Research</div>
                <div className='n-profile-tag' style={{padding: '0rem 0.5rem 0rem 0.5rem'}} onClick={() => setAddingTags(true)}><Plus /></div>
            </div>

            <div style={{width: '100%', padding: '0 8% 0 8%', boxSizing: 'border-box'}}>

                <div className='biography-container'>

                    <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%'}}>
                        <div style={{display: 'flex', marginRight: '0.4rem'}}><Document /></div>
                        <div style={{display: 'flex'}}>Biography</div>
                    </div>
                    <div className={!extendBio ? 'bio-text' : 'bio-text-extended'}>
                        My name is Whole Milky and I really enjoy reading novels as well as academic papers on technology topics. 
                        When I’m not reading research studies, I like reading historical text such as "Historical Text #1" and other ones
                        that are really interesting.
                    </div>

                    <div className='bio-ribbon-cont'>
                        <div className='bio-rect'>
                            <div className='bio-tri-top'/>
                            <div className='bio-tri-bot'/>
                        </div>
                        <div className='ribbon-shadow'/>
                    </div>

                    <div className='more-bio-arrow' onClick={() => setExtendBio(prev => !prev)}>
                        {!extendBio && <div style={{display: 'flex'}}><Arrow /></div>}
                        {extendBio && <div style={{display: 'flex', transform: 'rotate(180deg)'}}><Arrow /></div>}
                    </div>

                </div>

            </div>
            
            {/*<div style={{width: '100%', padding: '0 8% 0 8%', boxSizing: 'border-box', height: 'fit-content', marginTop: '4rem'}}>

                <div style={{backgroundColor: '#FF9B9B', width: '100%', height: '3.6rem', borderRadius: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: '500', fontSize: '1.2rem'}}>
                    <div>Recommendations</div>
                </div>

                <div className='profile-recommendations-container'>

                    <div className='profile-book-showcase-cont'>
                       <ShowcaseBook book={recommendedBooks[0]}/>
                       <div className='profile-rec-heart'><HeartBig /></div>
                    </div>

                    <div className='profile-book-showcase-cont'>
                       <ShowcaseBook book={recommendedBooks[1]}/>
                       <div className='profile-rec-heart'><HeartBig /></div>
                    </div>

                    <div className='profile-book-showcase-cont'>
                       <ShowcaseBook book={recommendedBooks[2]}/>
                       <div className='profile-rec-heart'><HeartBig /></div>
                    </div>

                </div>

            </div>*/}

            </div>

    </div>
  )
}

export default ProfilePage