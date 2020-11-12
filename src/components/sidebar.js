import React, { Component } from 'react';
export default class Sidebar extends Component {
    render() {
        var destinationPlaylists = [];
        for (let i = 0; i < this.props.playlists.length; i++) {
            if (this.props.playlists[i].owner.uri === this.props.userUri) {
                destinationPlaylists.push(
                    <button 
                        className={`list-group-item list-group-item-action ${this.props.playlists[i].selected ? "active" : ""}`} 
                        //className={"list-group-item list-group-item-action bg-light "}
                        key={i} 
                        onClick={async () => {
                            await this.props.handleClick(i);
                        }}>
                        {this.props.playlists[i].name}
                    </button>);
            } 
        }

        return (
            <div style={{display: "flex", flexFlow: "column", height: "99vh", maxWidth:"20%", width: "20%"}}>                
                <div style={{flex: "0 1 auto"}} className="sidebar-heading row text-center" >
                    <div className="col-12" style={{paddingTop: "5px"}}><b>Select Playlists</b></div>
                </div>
                
                <ul className="list-group list-group-flush"
                    style={{
                        overflow: "hidden",
                        overflowY: "scroll",
                        flex: "1 1 auto"
                    }}>
                    {destinationPlaylists}
                </ul>
                
                <div id="sidebarFooter" style={{
                    flex: "0 1 134px"
                }}>                    
                    <div style={{maxHeight: "80px"}}>
                        <img src={this.props.currentTrack ? this.props.currentTrack.album.images[1].url : ""} alt=""
                            style={{float: "left", width: "80px", height: "80px"}}></img>
                        <div style={{float: "left", marginLeft: "12px", marginTop: "12px", maxWidth: "65%", maxHeight: "80px"}}>
                            <p style={{overflow: "hidden", textOverflow: "ellipsis", maxHeight:"2rem", whiteSpace: "nowrap", marginBottom: "0"}}
                                datatoggle="tooltip" title={this.props.currentTrack ? this.props.currentTrack.name : ""}>
                                <b>{this.props.currentTrack ? this.props.currentTrack.name : ""}</b></p>
                            <p style={{overflow: "hidden", textOverflow: "ellipsis", maxHeight:"2rem", whiteSpace: "nowrap", marginBottom: "0"}}
                                datatoggle="tooltip" title={this.props.currentTrack ? this.props.currentTrack.artists[0].name : ""}>
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
