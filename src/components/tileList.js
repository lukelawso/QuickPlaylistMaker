import axios from 'axios';
import React, { Component } from 'react';
export default class TileList extends Component {
    constructor(props) {
        super();
        this.state = {
            selectedUris: []
        }
    }

    selectTile(uri) {
        console.log(uri);
        var list = this.state.selectedUris;
        var index = list.indexOf(uri);
        console.log(uri, uri.substring(uri.lastIndexOf(':')+1));
        if (index !== -1) {
            list.splice(uri, 1);  
            //const toRemove = "{\"tracks\":[{\"uri\": \""+this.props.currentTrackUri+"\"}]}";  
            const toRemove = {tracks:[{uri: this.props.currentTrackUri}]};  
            console.log(JSON.stringify(toRemove));
            axios.delete(`https://api.spotify.com/v1/playlists/${uri.substring(uri.lastIndexOf(':')+1)}/tracks`,toRemove,
            {headers: {'Authorization': 'Bearer ' + this.props.token, "Content-Type": "application/json"}})
            .then(res => {this.props.updatePlaylistTracks(uri, this.props.currentTrackUri)})
            .catch(err => {alert("Error removing track"); console.log(err);});       
        } else {
            list.push(uri);
            axios.post(`https://api.spotify.com/v1/playlists/${uri.substring(uri.lastIndexOf(':')+1)}/tracks?uris=${this.props.currentTrackUri}`,
            {headers: {'Authorization': 'Bearer ' + this.props.token}})
            .then(res => {this.props.updatePlaylistTracks(uri, this.props.currentTrackUri)})
            .catch(err => {alert("Error adding to playlist (might be full)"); console.log(err);});
        }
        this.setState({selectedUris: list});
    }

    render() {
        const bList = [];
        for (let i = 0; i < this.props.playlists.length; i++) {
            let playlistUri = this.props.playlists[i].uri;
            if (this.props.playlists[i].selected) {
                //Check if playlist contains the current track
                if (this.props.playlistTracks[playlistUri].includes(this.props.currentTrackUri) && !this.state.selectedUris.includes(playlistUri)) {
                    let temp = this.state.selectedUris;
                    temp.push(playlistUri);
                    this.setState({selectedUris: temp});
                }

                //Show button
                bList.push(<button 
                    className={`list-group-item list-group-item-action btn btn-success text-center ${this.state.selectedUris.includes(playlistUri) ? "active" : ""}`} 
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
