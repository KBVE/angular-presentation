import { Api } from '../api.service';
import { app_html, video_video_component_html } from '../code';
import { AppComponent } from '../app.component';
import { AppModule } from '../app.module';
import { TestBed } from '@angular/core/testing';
import { VideoComponent } from '../video/video.component';
import { VideoService } from '../video/video.service';
import 'initTestBed';

beforeEach(() => {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [VideoService],
    declarations: [AppComponent, VideoComponent]
  });
  TestBed.overrideComponent(AppComponent, {
    set: {
      template: app_html,
      templateUrl: undefined
    }
  });
  TestBed.overrideComponent(VideoComponent, {
    set: {
      template: video_video_component_html,
      templateUrl: undefined
    }
  });
  TestBed.compileComponents();
});

describe('Component Tree', () => {
  it(`app.module.ts: Add the VideoComponent to the AppModule 'declarations'.`, () => {
    let metadata;
    try {
      metadata = Reflect.getMetadata('annotations', AppModule);
    } catch (e) {
      // Do nothing, we have assertions below for this case
    }
    chai.expect(metadata[0].declarations, `Video component not found`).contains(VideoComponent);
    chai.expect(metadata[0].declarations, `Keep the app component`).contains(AppComponent);
  });

  it(`app.html: Use video component in the template (get rid of the old title/thumbnail)`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.videos = Api.fetch('');
    // TODO: if the element is added, but the video prop is not present, this test will fail with
    // a useless message. Passing video prop should actually be tested in the next test, and this
    // one should pass.
    fixture.detectChanges();

    const myVideos = fixture.nativeElement.querySelectorAll('my-video');
    chai.expect(myVideos.length, `can't find any <my-video> elements in the app component`).is.greaterThan(0);
    chai.expect(myVideos.length, `There should be one my-video element for each element`).equals(fixture.componentInstance.videos.length);
  });

  it(`app.html: Use the data binding to pass the video object to the component (don't forget the square brackets)`, () => {
    const fixture = TestBed.createComponent(AppComponent);

    fixture.componentInstance.videos = Api.fetch('');

    fixture.detectChanges();

    const video = fixture.nativeElement.querySelector('my-video');
    chai.expect(video.getAttribute('ng-reflect-video')).equals('[object Object]');
  });
});

