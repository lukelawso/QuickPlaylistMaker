import React, { Component } from 'react';
export default class Sidebar extends Component {
    render() {
        
        return (
            <div>
                <div className="sidebar-heading">Select Playlists</div>
                <div className="list-group list-group-flush">
                    {this.props.viewList}
                </div>
            </div>
        )
    }
}
