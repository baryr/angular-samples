import { Component, OnInit, NgZone } from '@angular/core';
import { MediaQueryList } from '@angular/flex-layout';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs/Observable';

import { User } from '../../models/user';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  users: Observable<User[]>;

  isDarkTheme: boolean = false;

  constructor(
    zone: NgZone, 
    private userService: UserService,
    private router: Router
  ) {
    this.mediaMatcher.addListener(mql =>
      zone.run(() => this.mediaMatcher = mql)
    );
  }

  @ViewChild(MatSidenav) sidenav: MatSidenav;

  ngOnInit() {
    this.users = this.userService.users;
    this.userService.loadAll();

    // Logic moved to main-content component
    //this.users.subscribe(data => {
    //  if (data.length > 0) this.router.navigate(['/contactmanager', data[0].id]);
    //});

    this.router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    })
  }

  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }

}
