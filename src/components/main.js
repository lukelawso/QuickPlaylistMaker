import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingOverlay from 'react-loading-overlay';

import Sidebar from './sidebar.js'
import hash from '../hash';
import TileList from './tileList.js';
import Entry from './entry.js';
import Help from './help.js';

import githubLogo from '../GitHub-Mark-32px.png'; 

export default class Main extends Component {
    constructor(props) {
        super();
        this.state = {
            token: null, 
            playlists: [], 
            currentTrack: null,
            position: 0,
            activeSourceIndex: 0,
            loadingTracks: false,
            userUri: null,
            showHelp: false
        };
        this.handleClick=this.handleClick.bind(this);
        this.updatePlaylistTracks=this.updatePlaylistTracks.bind(this);
        this.changeSource=this.changeSource.bind(this);
        this.posChanged=this.posChanged.bind(this);
        this.handleHelpClose=this.handleHelpClose.bind(this);
    }  
    
    handleHelpClose = () => this.setState({showHelp: false});
    handleHelpShow = () => this.setState({showHelp: true});

    async getPlaylistSongs(url, token = this.state.token) {
        var res = await axios.get(url, {headers: {'Authorization': 'Bearer ' + token}});   
        let songs = res.data.items.map(item => {
            return item.track;
        });
        if (res.data.next) {
            return songs.concat(await this.getPlaylistSongs(res.data.next, token));
        } else {
            return songs;
        }       
    }

    async getUserPlaylists(url, token = this.state.token) {
        var res = await axios.get(url, {headers: { 'Authorization': 'Bearer ' + token }});
        if (res.data.next) {
            return res.data.items.concat(await this.getUserPlaylists(res.data.next, token));
        } else {
            return res.data.items;
        }
    }

    async handleClick(index) {
        //Fetch playlist items if first time choosing
        if (!this.state.playlists[index].loadedTracks) {
            let list = await this.getPlaylistSongs(this.state.playlists[index].tracks.href);
            let temp = this.state.playlists;
            temp[index].loadedTracks = list;
            temp[index].selected = temp[index].selected ? false : true;
            this.setState({playlists: temp});    
                                
        } else {
            let temp = this.state.playlists;
            temp[index].selected = temp[index].selected ? false : true;
            this.setState({playlists: temp});
        }
    }

    updatePlaylistTracks(playlistIndex, currentTrack) {
        let temp = this.state.playlists;
        let index = temp[playlistIndex].loadedTracks.indexOf(currentTrack);
        if (index !== -1) {
            temp[playlistIndex].loadedTracks.splice(index, 1);
        } else {
            temp[playlistIndex].loadedTracks.push(currentTrack);
        }
        this.setState({playlistTracks: temp});
    }

    componentDidMount() {
        this.timer = null;

        //add event listener for keyboard shortcuts
        document.addEventListener('keyup', event => {
            if (event.code === "KeyN") {
                this.nextTrack();
            }            
        });        

        // Set token
        let _token = hash.access_token;
        if (_token && this.state.playlists.length === 0) {            
            this.getUserPlaylists('https://api.spotify.com/v1/me/playlists/?limit=50', _token)
            .then(async (items) => {
                var user = await axios.get('https://api.spotify.com/v1/me', {headers: { 'Authorization': 'Bearer ' + _token }});
                this.setState({token: _token, playlists: items, position: 0, activeSourceIndex: 0, loadingTracks: true, userUri: user.data.uri});                
                var list = await this.getPlaylistSongs("https://api.spotify.com/v1/me/tracks?limit=50", _token);
                let temp = {name: "Liked Songs", loadedTracks: list, uri: "likedSongs", owner: {uri: user.data.uri}};
                items.unshift(temp);
                this.setState({playlists: items, currentTrack: list[0], loadingTracks: false});                                  
            });                        
        }
    }

    nextTrack() {
        if (this.state.position+1 >= this.state.playlists[this.state.activeSourceIndex].loadedTracks.length) {
            document.getElementById("songQueuePlace").value = 1;
            this.setState({position: 0, 
                currentTrack: this.state.playlists[this.state.activeSourceIndex].loadedTracks[0]});           
        } else {
            this.setState({position: this.state.position+1, 
                currentTrack: this.state.playlists[this.state.activeSourceIndex].loadedTracks[this.state.position+1]
            },() => {
                document.getElementById("player").play()
                .then(() => document.getElementById("songQueuePlace").value = this.state.position+1);                 
            });
        }
    }

    async changeSource(e) {
        var index = e.target.selectedIndex;   
        if (!this.state.playlists[index].loadedTracks) {
            let list = await this.getPlaylistSongs(this.state.playlists[index].tracks.href);
            let temp = this.state.playlists;
            temp[index].loadedTracks = list;
            this.setState({playlists: temp, position: 0, currentTrack: list[0], activeSourceIndex: index});                                    
        } else {
            this.setState({position: 0, currentTrack: this.state.playlists[index].loadedTracks[0], activeSourceIndex: index});
        }
    }

    posChanged() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            var val = document.getElementById("songQueuePlace").value-1;
            if (val <= 0 || val > this.state.playlists[this.state.activeSourceIndex].loadedTracks.length) {
                document.getElementById("songQueuePlace").value = 1;
                this.setState({position: 0, 
                    currentTrack: this.state.playlists[this.state.activeSourceIndex].loadedTracks[0]});                
            } else {
                this.setState({position: val, 
                    currentTrack: this.state.playlists[this.state.activeSourceIndex].loadedTracks[val]});
            }
            
        }, 700);
    }

    render() {    
        let total;
        if (this.state.playlists.length > 0 && this.state.playlists[this.state.activeSourceIndex].loadedTracks) {
            total = this.state.playlists[this.state.activeSourceIndex].loadedTracks.length;
        } else {
            total = 0;
        }
        return (
        <div>            
            {this.state.token != null ? (                
            <LoadingOverlay
                active={this.state.loadingTracks}
                spinner
                text='Loading tracks...'
                >
                <div className="d-flex">          
                                            
                    
                        <Sidebar 
                            playlists={this.state.playlists} 
                            handleClick={this.handleClick}                        
                            currentTrack={this.state.currentTrack}
                            userUri={this.state.userUri}>
                        </Sidebar>
                                    
                    <div className="text-center" style={{width: "80%"}}>
                        <div>
                            <button className="btn btn-primary float-right" style={{marginRight: "5px", marginTop: "5px", overflow: "hidden"}}
                                onClick={this.handleHelpShow}>
                                Help
                            </button>
                            <a className="float-right" href="https://github.com/lukelawso/quick-playlist-maker" title="View on GitHub" 
                                style={{cursor: "pointer", marginRight: "5px", marginTop: "5px"}}>
                                <img style={{height: "30px"}} src={githubLogo} alt=""></img>
                            </a>
                        </div>
                        <Help showHelp={this.state.showHelp} handleClose={this.handleHelpClose}></Help>
                        <div className="" id="tileHeading" style={{paddingBottom: "10px"}}>
                            <h3 className="">Source Playlist</h3>
                            <div>
                                <select id="sourcePlaylist" onChange={this.changeSource}>
                                    {this.state.playlists.map((value, index) => 
                                    ( 
                                        <option key={index+1} value={value.name}>{value.name}</option>
                                    ))}
                                </select>       
                                <div className="text-center">                          
                                    <input id="songQueuePlace" type="number" onChange={this.posChanged} 
                                        style={{marginBottom:"8px", marginTop: "8px"}} defaultValue={this.state.position+1}></input>
                                    <p id="songQueuePosition" style={{marginBottom:"0"}}>/ {total}</p>
                                </div>                     
                            </div>
                        </div>
                        <TileList playlists={this.state.playlists} 
                            handleTileClick={this.handleTileClick} 
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
            </LoadingOverlay>  
            ) : <Entry></Entry>}        
        </div>
        )
    }
}
