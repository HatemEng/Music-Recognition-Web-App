import {Component, Inject, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  message = null;
  searchedVideos = [];
  selectedVideo = null;
  nextPageCode = null;
  previousPageCode = null;
  searchQuery = '';
  constructor(public http: Http, public sanitizer: DomSanitizer) { }

  ngOnInit() {
  }


  getSearch(url) {


    this.message = 'Downloading the video...';
    this.http.get('./api/media/download?url=' +  url).subscribe(res => {
      this.message = 'Converting and cut the media...';
      this.http.get('./api/media/convert').subscribe(res2 => {
        this.message = 'Recognizing the song...';
        this.http.get('./api/media/result').map(r => r.json()).subscribe( res3 => {
         try {
           const jsonData = JSON.parse(res3[res3.length - 1]);
           this.message = '<strong>Song Artist: </strong>' + jsonData.result.artist +
             ', <strong>Song Title: </strong>' + jsonData.result.title +
               '<br> <a href="./"> Return to the search</a>';
           console.log(jsonData.result);
           this.getYoutubeVideos(jsonData.result.artist);
         } catch (e) {
           this.message = 'Error occur while get recognized the song';
           this.restProcess();
         }


        });
      }, error1 => {
        this.message = null;
        this.message = 'Error occur while converting';
        this.restProcess();
      });
    }, error1 => {
      this.message = null;
      this.message = 'Error occur while downloading';
      this.restProcess();
    });
  }


  getYoutubeVideos(search, nextPage = null) {
    this.searchQuery = search;
    let url = 'https://www.googleapis.com/youtube/v3/search?' +
      'q=' + search + '&part=snippet&maxResults=6&videoType=any&type=video' +
      '&key=AIzaSyAojsHLMW-mqbUeWP9Ii1wxz8EhI3Gl0Oo';

    if (nextPage) url += '&pageToken=' + nextPage;

    this.http.get(url)
      .map(res => res.json()).subscribe(res => {
        console.log(res);
        this.searchedVideos = res.items;
        this.nextPageCode   = res.nextPageToken;
        this.previousPageCode = res.prevPageToken;
    });
  }

  restProcess() {
    setTimeout(() => {
      this.message = null;
    }, 8000);
  }

  videoURL(id) {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + id);
  }
}
