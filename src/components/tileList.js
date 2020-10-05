import React, { Component } from 'react';
export default class TileList extends Component {
    render() {
        const bList = [];
        for (let i = 0; i < this.props.playlists.length; i++) {
            if (this.props.playlists[i].selected) {
                bList.push(<button 
                    className={`list-group-item list-group-item-action btn btn-success text-center ${this.props.selectedIndices.includes(i) ? "active" : ""}`} 
                    style={{
                        height: "20vh",
                        width: "20vh",
                        borderRadius: "5px"
                    }}
                    key={i} 
                    onClick={() => {
                        this.props.handleTileClick(i);
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
