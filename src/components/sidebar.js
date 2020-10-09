import React, { Component } from 'react';
export default class Sidebar extends Component {
    render() {
        return (
            <div>
                <div className="sidebar-heading" style={{height: "3vh"}}>Select Playlists</div>
                <ul className="list-group list-group-flush"
                    style={{
                        overflow: "hidden",
                        overflowY: "scroll",
                        maxHeight: "86vh"
                    }}>
                    {this.props.playlists.map((item, index)=> (
                        <button 
                            className={`list-group-item list-group-item-action ${item.selected ? "active" : ""}`} 
                            //className={"list-group-item list-group-item-action bg-light "}
                            key={index} 
                            onClick={async () => {
                                await this.props.handleClick(index);
                            }}>
                            {item.name}
                        </button>
                    ))}
                </ul>
                <div id="sidebarFooter" style={{
                    maxHeight: "11vh"
                }}>
                    <iframe style={{maxHeight: "11vh", width: "100%"}} 
                        src={"https://open.spotify.com/embed?uri="+this.props.currentTrackUri} 
                        frameBorder="0" 
                        allowtransparency="true"
                        title="player"></iframe>
                </div>                
            </div>
        )
    }
}
