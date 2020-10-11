import axios from 'axios';
import React, { Component } from 'react';
export default class TileList extends Component {
    selectTile(uri) {
        if (this.props.playlistTracks[uri].includes(this.props.currentTrackUri)) {
            let config = {
                url: `https://api.spotify.com/v1/playlists/${uri.substring(uri.lastIndexOf(':')+1)}/tracks`,
                method: 'delete',
                headers: {"Content-Type": "application/json; charset=utf-8",'Authorization': 'Bearer ' + this.props.token},
                data: {tracks:[{uri: this.props.currentTrackUri}]}
            }
            axios(config)
            .then(res => {this.props.updatePlaylistTracks(uri, this.props.currentTrackUri)})
            .catch(err => {alert("Error removing track"); console.log(err);});       
        } else {
            axios.post(`https://api.spotify.com/v1/playlists/${uri.substring(uri.lastIndexOf(':')+1)}/tracks?uris=${this.props.currentTrackUri}`,
            {}, {headers: {'Authorization': 'Bearer ' + this.props.token}})
            .then(res => {this.props.updatePlaylistTracks(uri, this.props.currentTrackUri)})
            .catch(err => {alert("Error adding to playlist (might be full)"); console.log(err);});
        }
    }

    render() {
        const bList = [];
        for (let i = 0; i < this.props.playlists.length; i++) {
            let playlistUri = this.props.playlists[i].uri;
            if (this.props.playlists[i].selected) {
                //Show button
                bList.push(<button 
                    className={`list-group-item list-group-item-action btn btn-success text-center ${this.props.playlistTracks[playlistUri].includes(this.props.currentTrackUri) ? "active" : ""}`} 
                    style={{
                        height: "20vh",
                        width: "20vh",
                        borderRadius: "5px"
                    }}
                    key={i} 
                    onClick={() => {
                        this.selectTile(playlistUri);
                    }}>
                    {this.props.playlists[i].name}
                </button>);
            }
        }
        return (
            <div style={{margin: "10px"}}>
                <div className="sidebar-heading">Select Playlists</div>
                <ul className="btn-group"
                    style={{maxHeight: "800px"}}>
                    {bList}
                </ul>
            </div>
        )
    }
}
