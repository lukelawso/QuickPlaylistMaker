import React, { Component } from 'react';
export default class TileList extends Component {
    render() {
        const bList = [];
        for (let i = 0; i < this.props.playlists.length; i++) {
            if (this.props.playlists[i].selected) {
                bList.push(<button 
                    className={`list-group-item list-group-item-action ${this.props.selectedIndices.includes(i) ? "active" : ""}`} 
                    key={i} 
                    onClick={() => {
                        this.props.handleTileClick(i);
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
