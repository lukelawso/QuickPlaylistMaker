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
                        maxHeight: "81vh"
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
                    maxHeight: "15vh"
                }}>
                    <div>
                        <img src={this.props.currentTrack ? this.props.currentTrack.album.images[1].url : ""} alt=""
                            style={{float: "left", width: "80px", height: "80px"}}></img>
                        <div style={{float:"left", marginLeft: "12px", marginTop: "7px"}}>
                            <p style={{marginTop: "6px"}}>
                                <b>{this.props.currentTrack ? this.props.currentTrack.name : ""}<br/></b>
                                {this.props.currentTrack ? this.props.currentTrack.artists[0].name : ""}
                            </p>                        
                        </div>
                    </div>
                    <audio id="player" controls
                        style={{width: "100%", marginBottom: "-7px"}} 
                        src={this.props.currentTrack ? this.props.currentTrack.preview_url : ""}>
                    </audio>
                </div>                
            </div>
        )
    }
}
