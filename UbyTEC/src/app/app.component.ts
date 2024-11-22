import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderClientComponent } from './client/components/header-client/header-client.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers:[],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'UbyTEC';
}
