/* Load external boards only when the visitor opens one. */
document.querySelectorAll('.padlet-load').forEach(button=>{
 button.addEventListener('click',()=>{
  const panel=document.getElementById(button.getAttribute('aria-controls'));
  const show=panel.hidden;panel.hidden=!show;
  button.setAttribute('aria-expanded',String(show));button.textContent=show?'ซ่อนกระดาน':'แสดงกระดานในหน้านี้';
  if(show&&!panel.firstElementChild){
   const frame=document.createElement('iframe');frame.src='https://padlet.com/embed/'+button.dataset.board;frame.title=button.closest('article').querySelector('h4').textContent;frame.loading='lazy';frame.allow='clipboard-write';frame.referrerPolicy='strict-origin-when-cross-origin';panel.append(frame);
   const hint=document.createElement('p');hint.className='muted';hint.textContent='หากกระดานไม่แสดง ให้เลือก “เปิด Padlet” เพื่อดูในแท็บใหม่';panel.append(hint);
  }
 });
});
