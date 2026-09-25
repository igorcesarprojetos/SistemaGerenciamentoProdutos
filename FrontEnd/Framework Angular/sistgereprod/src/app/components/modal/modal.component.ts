import { Component, OnInit } from "@angular/core";
import { Produto } from "../../model/produto";


@Component({  
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit{
  
  constructor(){

  }

  ngOnInit(): void {
    this.initModalClose();
  }



    // ── Modal genérico (criar/editar) ──
  openModal(title:string, bodyHtml:string, footerHtml:string) {
    document.getElementById('modal-title')!.textContent = title;
    document.getElementById('modal-body')!.innerHTML = bodyHtml;
    document.getElementById('modal-footer')!.innerHTML = footerHtml;
    document.getElementById('modal-overlay')!.classList.add('open');
  }


  // ── Confirmação (substitui window.confirm) ──
  confirmDialog(title: string , msg: string) {
    return new Promise(resolve => {
      document.getElementById('confirm-title')!.textContent = title;
      document.getElementById('confirm-msg')!.textContent = msg;
      document.getElementById('confirm-overlay')!.classList.add('open');
      document.getElementById('confirm-ok')!.onclick = () => { document.getElementById('confirm-overlay')!.classList.remove('open'); resolve(true); };
      document.getElementById('confirm-cancel')!.onclick = () => { document.getElementById('confirm-overlay')!.classList.remove('open'); resolve(false); };
    });
  }

  initModalClose() {
    const btn = document.getElementById('modal-close');
    if (btn) btn.onclick = this.closeModal;
  }

  closeModal() {
    document.getElementById('modal-overlay')!.classList.remove('open');
  } 

 


}