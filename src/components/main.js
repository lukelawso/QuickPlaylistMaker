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
            selectedIndices: [], 
            songQueue: {
                position: 0,
                tracks: null,
                offset: 0,
                total: null
            },
            currentTrack: null,
            playlistTracks: {}
        };
        this.handleClick=this.handleClick.bind(this);
        this.updatePlaylistTracks=this.updatePlaylistTracks.bind(this);
    }    

    async getPlaylistSongs(url) {
        return axios.get(url, {headers: {'Authorization': 'Bearer ' + this.state.token}})
        .then(res => {
            let songs = res.data.items.map(item => {
                return item.track.uri;
            });
            if (res.data.next) {
                return songs.concat(this.getPlaylistSongs(res.data.next));
            } else {
                return songs;
            }
        })
    }

    async handleClick(index) {
        //Fetch playlist items if first time choosing
        if (!this.state.playlistTracks.hasOwnProperty(this.state.playlists[index].uri)) {
            let list = await this.getPlaylistSongs(this.state.playlists[index].tracks.href);
            let temp = {};
            for (var i in this.state.playlistTracks) {
                temp[i] = this.state.playlistTracks[i];    
            }
            temp[this.state.playlists[index].uri] = list;
            this.setState({playlistTracks: temp});
                        
        }

        //Update state selected attribute
        const list = this.state.playlists.map((item, j) => {
            if (j === index) {
                let temp = item;
                temp.selected = item.selected ? false : true;
                return temp;
            } else {
                return item;
            }
        });
        this.setState({
            playlists: list
        });
    }

    updatePlaylistTracks(playlistUri, trackUri) {
        let temp = this.state.playlistTracks;
        if (temp[playlistUri].includes(trackUri)) {
            temp[playlistUri].splice(temp[playlistUri].indexOf(trackUri), 1);
        } else {
            temp[playlistUri].push(trackUri);
        }
        this.setState({playlistTracks: temp});
    }

    componentDidMount() {
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
            .then(res => {/*console.log(res);*/ this.setState({token: _token, playlists: res.data.items})});  
            
            //Get saved songs
            axios.get(`https://api.spotify.com/v1/me/tracks?limit=50&offset=${this.state.songQueue.offset}`,
            {headers: { 'Authorization': 'Bearer ' + _token }})
            .then(res => {
                console.log(res);
                let offset = this.state.songQueue.offset+50;
                this.setState({
                    songQueue: {
                        position: 0,
                        tracks: res.data.items,
                        offset: offset,
                        total: res.data.total
                    },
                    currentTrack: res.data.items[this.state.songQueue.position % 50].track
            })})
        }
    }

    nextTrack() {
        if (this.state.songQueue.position % 50 === 49) {
            axios.get(`https://api.spotify.com/v1/me/tracks?limit=50&offset=${this.state.songQueue.offset}`,
            {headers: { 'Authorization': 'Bearer ' + this.state.token}})
            .then(res => {           
                this.setState({
                    songQueue: {
                        position: this.state.songQueue.position+1,
                        tracks: res.data.items,
                        offset: this.state.songQueue.offset+50,
                        total: this.state.songQueue.total
                    },
                    currentTrack: res.data.items[this.state.songQueue.position % 50].track
                }, () => document.getElementById("player").play());
                
                // var audio = new Audio(preview);
                // audio.play();
            })
        } else {
            this.setState({
                songQueue: {
                    position: this.state.songQueue.position+1,
                    tracks: this.state.songQueue.tracks,
                    offset: this.state.songQueue.offset,
                    total: this.state.songQueue.total
                },
                currentTrack: this.state.songQueue.tracks[this.state.songQueue.position+1].track
            }, () => document.getElementById("player").play());
        }
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
                                <select>{this.state.playlists.map((value, index) => 
                                    ( 
                                        <option key={index} value={value.name}>{value.name}</option>
                                    ))}
                                </select>       
                                <div className="text-center">                          
                                    <p id="songQueuePlace" contenteditable="true" style={{marginBottom:"8px", marginTop: "8px"}}>{this.state.songQueue.position}</p>
                                    <p for="songQueuePosition" style={{marginBottom:"0"}}>/ {this.state.songQueue.total}</p>
                                </div>                     
                            </div>
                        </div>
                        <TileList playlists={this.state.playlists} 
                            handleTileClick={this.handleTileClick} 
                            selectedIndices={this.state.selectedIndices}
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
