import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className='descriptionbox-nav-box'>Description</div>
            <div className='descriptionbox-nav-box fade'>Reviews (122)</div>
        </div>
        <div className="descriptionbox-description">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, amet impedit facere iusto tempora doloremque laborum alias. Ad architecto labore obcaecati velit tempora sunt. Velit ut consequuntur mollitia cupiditate rem!</p> 
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium</p> 
        </div>

    </div>
  )
}

export default DescriptionBox