import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  let fixture: any;
  let component: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
  });

  it("should create the app and test elements", () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeTruthy();
    expect(component.title).toEqual("angular-graphql");
    fixture.detectChanges();
    const htmlElement = fixture.debugElement.nativeElement;
    const span = htmlElement.querySelector("div.toolbar span");
    component.name = "GitHub";
    expect(span.textContent).toEqual("GitHub");
    const img = htmlElement.querySelector("div.toolbar img");
    expect(img.src).toContain("git_cat_logo.png");
    const routerOutlet = htmlElement.querySelector("div.content router-outlet");
    expect(routerOutlet).toBeTruthy();
  });
});
