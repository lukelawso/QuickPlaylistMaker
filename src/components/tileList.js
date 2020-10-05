import React, { Component } from 'react';
export default class TileList extends Component {
    render() {
        const bList = [];
        for (var i = 0; i < this.props.playlists.length; i++) {
            if (this.props.playlists[i].selected) {
                bList.push(<button 
                    className={`list-group-item list-group-item-action`} 
                    key={i} 
                    onClick={() => {
                        console.log("wowow");
                    }}>
                    {this.props.playlists[i].name}
                </button>);
            }
        }
        return (
            <div>
                <div className="sidebar-heading">Select Playlists</div>
                <ul className="list-group list-group-flush">
                    {bList}
                </ul>
            </div>
        )
    }
}
