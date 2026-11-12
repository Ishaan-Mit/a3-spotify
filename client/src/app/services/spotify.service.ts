import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://127.0.0.1:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    var uri:string = this.expressBaseUrl + endpoint;

    return firstValueFrom(this.http.get(uri)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    var endpoint = '/search/' + category + "/" + encodeURIComponent(resource);
    
    return this.sendRequestToExpress(endpoint).then((data) => {
      if (category == "artist") {
        return data.artists.items.map((a) => new ArtistData(a));
      } else if (category == "album") {
        return data.albums.items.map((a) => new AlbumData(a));
      } else {
        return data.tracks.items.map((a) => new TrackData(a));
      }
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    return this.sendRequestToExpress("/artist/" + encodeURIComponent(artistId)).then(
      (data) => new ArtistData(data)
    );
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    return this.sendRequestToExpress("/artist-top-tracks/" + encodeURIComponent(artistId)).then(
      (data) => data.tracks.map((a) => new TrackData(a))
    );
  }
  
  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    return this.sendRequestToExpress("/artist-albums/" + encodeURIComponent(artistId)).then(
      (data) => data.items.map((a) => new AlbumData(a))
    );
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    return this.sendRequestToExpress("/album/" + encodeURIComponent(albumId)).then(
      (data) => new AlbumData(data)
    );
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    return this.sendRequestToExpress("/album-tracks/" + encodeURIComponent(albumId)).then(
      (data) => data.tracks.map((a) => new TrackData(a))
    );
  }

  getTrack(trackId:string):Promise<TrackData> {
    return this.sendRequestToExpress("/track/" + encodeURIComponent(trackId)).then(
      (data) => new TrackData(data)
    );
  }
}