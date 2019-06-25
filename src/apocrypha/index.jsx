import React, { Component } from 'react';
import DataInsight from './ShowsDetail/DataInsight'
import GrowthAssistant from './ShowsDetail/GrowthAssistant'
import MerchantTools from './ShowsDetail/MerchantTools'
import AlgorithmLab from './ShowsDetail/AlgorithmLab'
//import DataTeam from './ShowsDetail/DataTeam'
//import Footer from './ShowsDetail/Footer'

import './index.styl'

export default class extends Component{
  componentDidMount(){
    const byline = document.getElementById('byline');  	// Find the H2
    const bylineText = byline.innerHTML;										// Get the content of the H2
    const bylineArr = bylineText.split('');									// Split content into array
    byline.innerHTML = '';														// Empty current content

    var span;					// Create variables to create elements
    var letter;

    let preLetter;
    for(let i=0;i<bylineArr.length;i++){									// Loop for every letter
      span = document.createElement("span");					// Create a <span> element
      letter = document.createTextNode(bylineArr[i]);	// Create the letter
      if(bylineArr[i] === ' ') {											// If the letter is a space...
        preLetter = ' '
        byline.appendChild(letter);					// ...Add the space without a span
      } else {
        span.appendChild(letter);						// Add the letter to the span
        if(preLetter === ' ' && (bylineArr[i] === 'F' || 
        bylineArr[i] === 'A' || bylineArr[i] === 'T' || bylineArr[i] === 'E')){
          span.style.color = '#ffffff'
        }
        byline.appendChild(span); 					// Add the span to the h2
        preLetter = bylineArr[i]
      }
    }
  }
  render(){
    return(
      <div className="welcome-page">
        <div className="banner">
          <div className="animate">
            <div className="pannel">
              <img alt="" src={require('../assets/img/animate-circle-gold.png')} />
            </div>
          </div>
          <div className="star-container" id="starContainer" ref={(el) => { this.animateContainer = el }} />
          <div className="content">
            <div class="data-logo">
              <h2 class="star">数据驱动给用户更好的体验</h2>
              <h3 class="byline" id="byline">Data Driven Provide Fantastic And Terrific Experience</h3>
            </div>
          </div>
        </div>
        <div style={{width:"100%"}}>
          <DataInsight/>
          <GrowthAssistant/>
          <MerchantTools/>
          <AlgorithmLab/>
          {/* <DataTeam/> */}
          {/* <Footer/> */}
        </div>
      </div>
    )
  }
}