import { Component } from '@angular/core';

@Component({
  selector: 'app-blog',
  imports: [],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {
  blogPosts:string[] = ["./images/blog1.png","./images/blog2.png","./images/blog3.png","./images/blog4.png","./images/blog5.png","./images/blog6.png"]

}
