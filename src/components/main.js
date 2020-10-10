import React, { Component } from 'react';
import axios from 'axios';
import Sidebar from './sidebar.js'
import hash from '../hash';
import TileList from './tileList.js';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {token: null, 
            playlists: [], 
            selectedIndices: [], 
            songQueue: {
                current: null,
                position: 0,
                tracks: null,
                offset: 0
            },
            currentTrackUri: null,
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
                console.log(songs);
                return songs;
            }
        })
    }

    async handleClick(index) {
        //Fetch playlist items if first time choosing
        if (!this.state.playlistTracks.hasOwnProperty(this.state.playlists[index].uri)) {
            let list = await this.getPlaylistSongs(this.state.playlists[index].tracks.href);
            
            console.log(list);
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
        let temp = this.state.playlistTracks[playlistUri];
        if (trackUri in this.state.playlistTracks) {
            temp.remove(trackUri);
        } else {
            temp.push(trackUri);
        }
        this.setState({playlistTracks: temp});
    }

    componentDidMount() {
        // Set token
        let _token = hash.access_token;
        if (_token) {
            // Get playlists
            axios.get('https://api.spotify.com/v1/me/playlists/?limit=50',
            {headers: { 'Authorization': 'Bearer ' + _token }})
            .then(res => {this.setState({token: _token, playlists: res.data.items})});  
            
            //Get saved songs
            axios.get(`https://api.spotify.com/v1/me/tracks?limit=50&offset=${this.state.songQueue.offset}`,
            {headers: { 'Authorization': 'Bearer ' + _token }})
            .then(res => {
                let offset = this.state.songQueue.offset+50;
                let uri = res.data.items[this.state.songQueue.position % 50].track.uri;
                this.setState({
                    songQueue: {
                        current: null,
                        position: this.state.songQueue.position,
                        tracks: res.data.items,
                        offset: offset
                    },
                    currentTrackUri: uri
            })})
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
                            currentTrackUri={this.state.currentTrackUri}></Sidebar>
                    </div>
                    <TileList playlists={this.state.playlists} 
                        handleTileClick={this.handleTileClick} 
                        selectedIndices={this.state.selectedIndices}
                        playlistTracks={this.state.playlistTracks}
                        currentTrackUri={this.state.currentTrackUri}
                        token={this.state.token}
                        updatePlaylistTracks={this.updatePlaylistTracks}></TileList>
                </div>
            )}
            <div id="page-content-wrapper">
            </div>         
        </div>
        )
    }
}
