import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesListeComponent } from './games-liste.component';

describe('GamesListeComponent', () => {
  let component: GamesListeComponent;
  let fixture: ComponentFixture<GamesListeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamesListeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
