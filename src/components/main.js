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
            currentTrackUrl: null
        };
        this.handleClick=this.handleClick.bind(this);
        this.handleTileClick=this.handleTileClick.bind(this);
    }    

    handleClick(index) {
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

    handleTileClick(pos) {
        var list = this.state.selectedIndices;
        var index = list.indexOf(pos);
        if (index !== -1) {
            list.splice(index, 1);           
        } else {
            list.push(pos);
        }
        this.setState({selectedIndices: list});
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
                let track = "https://open.spotify.com/embed?uri="+uri;
                this.setState({
                    songQueue: {
                        current: null,
                        position: this.state.songQueue.position,
                        tracks: res.data.items,
                        offset: offset
                    },
                    currentTrackUrl: track
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
                            currentTrackUrl={this.state.currentTrackUrl}></Sidebar>
                    </div>
                    <TileList playlists={this.state.playlists} 
                        handleTileClick={this.handleTileClick} 
                        selectedIndices={this.state.selectedIndices}></TileList>
                </div>
            )}
            <div id="page-content-wrapper">
            </div>         
        </div>
        )
    }
}
