const proposal=document.querySelector('#proposal');
const setup=document.querySelector('#setup');
const nameForm=document.querySelector('#name-form');
const groomInput=document.querySelector('#groom-name');
const brideInput=document.querySelector('#bride-name');
const buttonArea=document.querySelector('#button-area');
const noButton=document.querySelector('#no-button');
const yesButton=document.querySelector('#yes-button');
const questionCard=document.querySelector('#question-card');
const celebration=document.querySelector('#celebration');
let isEscaped=false;
const isMobile=()=>window.matchMedia('(hover: none), (pointer: coarse)').matches;
function setText(id,text){ document.querySelector(id).textContent=text; }
function showCard(card){ card.hidden=false; card.animate([{opacity:0,transform:'translateY(14px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:450,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'}); }
nameForm.addEventListener('submit',(event)=>{ event.preventDefault(); const groom=groomInput.value.trim(); const bride=brideInput.value.trim(); if(!groom||!bride)return; setText('#bride-title',bride); setText('#groom-message',groom); setText('#bride-celebration',bride); setText('#groom-celebration',groom); setup.hidden=true; showCard(questionCard); });
function moveNoButton(){ const buttonRect=noButton.getBoundingClientRect(); const padding=18; const maxX=window.innerWidth-buttonRect.width-padding; const maxY=window.innerHeight-buttonRect.height-padding; const x=Math.max(padding,Math.random()*maxX); const y=Math.max(padding,Math.random()*maxY); if(!isEscaped){ const rect=noButton.getBoundingClientRect(); const placeholder=document.createElement('span'); placeholder.style.width=`${rect.width}px`; placeholder.style.height=`${rect.height}px`; buttonArea.replaceChild(placeholder,noButton); proposal.appendChild(noButton); noButton.style.position='fixed'; isEscaped=true; } noButton.style.left=`${x}px`; noButton.style.top=`${y}px`; }
noButton.addEventListener('pointerenter',()=>{ if(!isMobile())moveNoButton(); });
noButton.addEventListener('click',(event)=>{ if(isMobile()){ event.preventDefault(); moveNoButton(); } });
yesButton.addEventListener('click',()=>{ questionCard.hidden=true; if(isEscaped)noButton.remove(); showCard(celebration); });
