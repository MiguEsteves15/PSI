import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.css'
})
export class SplashComponent implements OnInit {
  showSplash = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Aguarda 3.5 segundos (tempo da animação + um pouco extra)
    setTimeout(() => {
      this.showSplash = false;
      // Navega para login após a animação terminar
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 200);
    }, 2000);
  }
}
