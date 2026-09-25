import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })

export class Common{
    
    // ── Toast ──
    toast(msg:string, type:'success' | 'error' | 'info') {
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        const icons = {
            success: '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
            error: '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
            info: '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/></svg>'
        };
        el.innerHTML = `${icons[type]||''} ${msg}`;
        document.getElementById('toast-container')!.appendChild(el);
        setTimeout(() => el.remove(), 3500);
    }
}