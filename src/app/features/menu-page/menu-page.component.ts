import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { Router, RouterModule } from '@angular/router';
import { DarkModeService } from '../../services/dark-mode.service';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-menu-page',
  templateUrl: './menu-page.component.html',
  styleUrls: ['./menu-page.component.css'],
  imports: [BackButtonComponent, CommonModule, RouterModule],
})
export class MenuPageComponent implements OnInit {
  constructor(
    private router: Router,
    public darkModeService: DarkModeService,
    private commonService: CommonService,
    public userService: UserService
  ) {}

  ngOnInit() {
    // Redirection supprimée, gérée par le guard
  }

  goToUserModify() {
    this.router.navigate(['/user/modify']);
  }

  logout() {
    this.commonService.showLogout();
  }
}
