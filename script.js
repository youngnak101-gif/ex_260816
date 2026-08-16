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
const dateDialog=document.querySelector('#date-dialog');
const dateForm=document.querySelector('#date-form');
const weddingDateInput=document.querySelector('#wedding-date');
const dateStatus=document.querySelector('#date-status');
const saveDateButton=document.querySelector('#save-date');
const closeDialogButton=document.querySelector('#close-dialog');
const venueDialog=document.querySelector('#venue-dialog');
const closeVenueDialogButton=document.querySelector('#close-venue-dialog');
const venueLink=document.querySelector('#venue-link');
let isEscaped=false;
let couple={groom:'',bride:''};
const isMobile=()=>window.matchMedia('(hover: none), (pointer: coarse)').matches;
function setText(id,text){ document.querySelector(id).textContent=text; }
function showCard(card){ card.hidden=false; card.animate([{opacity:0,transform:'translateY(14px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:450,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'}); }
nameForm.addEventListener('submit',(event)=>{ event.preventDefault(); const groom=groomInput.value.trim(); const bride=brideInput.value.trim(); if(!groom||!bride)return; couple={groom,bride}; setText('#bride-title',bride); setText('#groom-message',groom); setText('#bride-celebration',bride); setText('#groom-celebration',groom); setup.hidden=true; showCard(questionCard); });
function moveNoButton(){ const buttonRect=noButton.getBoundingClientRect(); const padding=18; const maxX=window.innerWidth-buttonRect.width-padding; const maxY=window.innerHeight-buttonRect.height-padding; const x=Math.max(padding,Math.random()*maxX); const y=Math.max(padding,Math.random()*maxY); if(!isEscaped){ const rect=noButton.getBoundingClientRect(); const placeholder=document.createElement('span'); placeholder.style.width=`${rect.width}px`; placeholder.style.height=`${rect.height}px`; buttonArea.replaceChild(placeholder,noButton); proposal.appendChild(noButton); noButton.style.position='fixed'; isEscaped=true; } noButton.style.left=`${x}px`; noButton.style.top=`${y}px`; }
noButton.addEventListener('pointerenter',()=>{ if(!isMobile())moveNoButton(); });
noButton.addEventListener('click',(event)=>{ if(isMobile()){ event.preventDefault(); moveNoButton(); } });
function openDateDialog(){ dateStatus.textContent=''; dateStatus.className='date-status'; dateDialog.showModal(); weddingDateInput.focus(); }
function showCelebration(){ questionCard.hidden=true; if(isEscaped)noButton.remove(); showCard(celebration); venueDialog.showModal(); }
yesButton.addEventListener('click',openDateDialog);
closeDialogButton.addEventListener('click',()=>dateDialog.close());
dateDialog.addEventListener('click',(event)=>{ if(event.target===dateDialog)dateDialog.close(); });
closeVenueDialogButton.addEventListener('click',()=>venueDialog.close());
venueDialog.addEventListener('click',(event)=>{ if(event.target===venueDialog)venueDialog.close(); });
venueLink.addEventListener('click',()=>{ if(typeof window.gtag==='function'){ window.gtag('event','wedding_venue_recommendation_click',{event_category:'engagement',event_label:'SKK Convention',transport_type:'beacon'}); } });
dateForm.addEventListener('submit',async(event)=>{ event.preventDefault(); const weddingDate=weddingDateInput.value; saveDateButton.disabled=true; saveDateButton.textContent='기록하는 중…'; try { const response=await fetch('/api/proposal',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({groomName:couple.groom,brideName:couple.bride,weddingDate})}); const result=await response.json(); if(!response.ok) throw new Error(result.message||'알 수 없는 오류가 발생했습니다.'); dateStatus.textContent='소중한 기록을 저장했어요.'; dateStatus.classList.add('success'); setTimeout(()=>{ dateDialog.close(); showCelebration(); },500); } catch(error) { dateStatus.textContent=`저장하지 못했어요: ${error.message}`; saveDateButton.disabled=false; saveDateButton.innerHTML='기록하고 계속하기 <b>→</b>'; } });
