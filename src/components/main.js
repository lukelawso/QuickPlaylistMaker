import React, { Component } from 'react';
import axios from 'axios';
import Sidebar from './sidebar.js'
import hash from '../hash';
import TileList from './tileList.js';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Main extends Component {
    constructor(props) {
        super();
        this.state = {token: null, 
            playlists: [], 
            currentTrack: null,
            position: 0,
            activeSourceIndex: 0
        };
        this.handleClick=this.handleClick.bind(this);
        this.updatePlaylistTracks=this.updatePlaylistTracks.bind(this);
        this.changeSource=this.changeSource.bind(this);
        this.posChanged=this.posChanged.bind(this);
    }    

    async getPlaylistSongs(url, token = this.state.token) {
        return axios.get(url, {headers: {'Authorization': 'Bearer ' + token}})
        .then(res => {
            console.log(res);
            let songs = res.data.items.map(item => {
                return item.track.uri;
            });
            if (res.data.next) {
                return songs.concat(this.getPlaylistSongs(res.data.next, token));
            } else {
                return songs;
            }
        })
    }

    async handleClick(index) {
        //Fetch playlist items if first time choosing
        if (!this.state.playlists[index].loadedTracks) {
            let list = await this.getPlaylistSongs(this.state.playlists[index].tracks.href);
            let temp = this.state.playlists;
            temp[index].loadedTracks = list;
            temp[index].selected = temp[index].selected ? false : true;
            this.setState({playlists: temp});    
                                
        }
    }

    updatePlaylistTracks(playlistIndex, trackUri) {
        let temp = this.state.playlists;
        if (temp[playlistIndex].loadedTracks.includes(trackUri)) {
            temp[playlistIndex].loadedTracks.splice(temp[playlistIndex].loadedTracks.indexOf(trackUri), 1);
        } else {
            temp[playlistIndex].loadedTracks.push(trackUri);
        }
        this.setState({playlistTracks: temp});
    }

    componentDidMount() {
        this.timer = null;

        //add event listener for keyboard shortcuts
        document.addEventListener('keyup', event => {
            if (event.code === "KeyN") {
                document.getElementById("nextButton").click();
            }            
        });        

        // Set token
        let _token = hash.access_token;
        if (_token) {
            // Get playlists
            axios.get('https://api.spotify.com/v1/me/playlists/?limit=50',
            {headers: { 'Authorization': 'Bearer ' + _token }})
            .then(res => {
                console.log(res); 

                this.getPlaylistSongs("https://api.spotify.com/v1/me/tracks?limit=50", _token)
                .then(list => {
                    let temp = {name: "Like Songs", loadedTracks: list, uri: "likedSongs"};
                    this.setState({token: _token, playlists: [res.data.items.unshift(temp)], position: 0, activeSourceIndex: 0});
                });  
            });                        
        }
    }

    nextTrack() {
        this.setState({position: position+1, currentTrack: this.state.playlists[index].loadedTracks[position+1].track}, 
            () => {
            document.getElementById("player").play(); 
            document.getElementById("songQueuePlace").value = this.state.songQueue.position+1;
        });
    }

    changeSource(e) {
        var index = e.target.selectedIndex;
        if (index === 0) {
            axios.get(`https://api.spotify.com/v1/me/tracks?limit=50&offset=${this.state.songQueue.offset}`,
                {headers: { 'Authorization': 'Bearer ' + this.state.token }})
                .then(res => {
                    this.setState({
                        songQueue: {
                            position: 0,
                            tracks: res.data.items,
                            offset: 0,
                            total: res.data.total,
                            sourceUrl: "https://api.spotify.com/v1/me/tracks"
                        },
                        currentTrack: res.data.items[0].track
                })})
        } else {      
            axios.get(`${this.state.playlists[index-1].tracks.href}?limit=50&offset=${this.state.songQueue.offset}`,
                {headers: { 'Authorization': 'Bearer ' + this.state.token }})
                .then(res => {
                    this.setState({
                        songQueue: {
                            position: 0,
                            tracks: res.data.items,
                            offset: 0,
                            total: res.data.total,
                            sourceUrl: this.state.playlists[index-1].tracks.href
                        },
                        currentTrack: res.data.items[0].track
                })})
        }
    }

    posChanged() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            var val = document.getElementById("songQueuePlace").value;
            if (val >= 1 && val <= this.state.songQueue.total) {
                axios.get(`${this.state.songQueue.sourceUrl}?limit=50&offset=${Math.floor((val-1)/50)*50}`,
                {headers: { 'Authorization': 'Bearer ' + this.state.token }})
                .then(res => {
                    this.setState({
                        songQueue: {
                            position: (val-1),
                            tracks: res.data.items,
                            offset: Math.floor((val-1)/50)*50,
                            total: res.data.total,
                            sourceUrl: this.state.songQueue.sourceUrl
                        },
                        currentTrack: res.data.items[(val-1)].track
                })})
            }            
        }, 700);
    }

    render() {    
        return (
        <div>
            {this.state.token != null && (
                <div className="d-flex">
                    <div className="bg-light border-right" id="sidebar-wrapper"
                        style={{
                            width: "20%",
                            minWidth: "20%"
                        }}>
                        <Sidebar playlists={this.state.playlists} handleClick={this.handleClick}                        
                            currentTrack={this.state.currentTrack} songQueue={this.state.songQueue}></Sidebar>
                    </div>                    
                    <div className="text-center" style={{width: "80%"}}>
                        <div className="" id="tileHeading" style={{paddingBottom: "10px"}}>
                            <h3 className="">Select Playlists</h3>
                            <div>
                                <select id="sourcePlaylist" onChange={this.changeSource}>
                                    <option key={0} value="Liked Songs">Liked Songs</option>
                                    {this.state.playlists.map((value, index) => 
                                    ( 
                                        <option key={index+1} value={value.name}>{value.name}</option>
                                    ))}
                                </select>       
                                <div className="text-center">                          
                                    <input id="songQueuePlace" type="number" contentEditable="true" onChange={this.posChanged} 
                                        style={{marginBottom:"8px", marginTop: "8px"}} defaultValue={this.state.songQueue.position+1}></input>
                                    <p id="songQueuePosition" style={{marginBottom:"0"}}>/ {this.state.songQueue.total}</p>
                                </div>                     
                            </div>
                        </div>
                        <TileList playlists={this.state.playlists} 
                            handleTileClick={this.handleTileClick} 
                            playlistTracks={this.state.playlistTracks}
                            currentTrack={this.state.currentTrack}
                            token={this.state.token}
                            updatePlaylistTracks={this.updatePlaylistTracks}></TileList>
                        <button id="nextButton" className="btn btn-success" onClick={() => {this.nextTrack();}}
                            style={{
                                width: "80%",
                                height: "10vh",
                                marginLeft: "10px",
                                marginRight: "10px"
                            }}>Next (N)</button>
                    </div>
                </div>
            )}        
        </div>
        )
    }
}
