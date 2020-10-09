import React, { Component } from 'react';
export default class TileList extends Component {
    constructor(props) {
        super();
        this.state = {
            selectedUris: []
        }
    }

    selectTile(uri) {
        var list = this.state.selectedUris;
        var index = list.indexOf(uri);
        if (index !== -1) {
            list.splice(uri, 1);           
        } else {
            list.push(uri);
        }
        this.setState({selectedUris: list});
    }

    render() {
        const bList = [];
        for (let i = 0; i < this.props.playlists.length; i++) {
            let playlistUri = this.props.playlists[i].uri;
            if (this.props.playlists[i].selected) {
                //Check if playlist contains the current track
                console.log(this.props.playlistTracks);
                let temp = this.props.playlistTracks[playlistUri].map(item => {return item.uri});
                if (this.props.currentTrackUri in temp) {
                    this.selectTile(playlistUri);
                }

                //Show button
                bList.push(<button 
                    className={`list-group-item list-group-item-action btn btn-success text-center ${this.selectedUris.includes(playlistUri) ? "active" : ""}`} 
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
