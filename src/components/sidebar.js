import React, { Component } from 'react';
import {Modal, Button} from 'react-bootstrap'; 
export default class Sidebar extends Component {
    state = { showHelp: false };

    handleClose = () => this.setState({showHelp: false});
    handleShow = () => this.setState({showHelp: true});

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
            <div>
                <Modal show={this.state.showHelp} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Quick Playlist Maker Help</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Welcome to Quick Playlist Maker. Use this web app to quickly add or remove songs to multiple spotify playlists.<br></br><br></br>
                        
                        To use, start by choosing which playlists to want to be able to modify by clicking them on the sidebar. 
                        They will then show up as buttons in the center of the screen. 
                        To add the current song to a playlist click the button with the playlist name in the center of the screen.
                        If a song is already in a given playlist, the button will show as green, and clicking the button again will remove the song.<br></br><br></br>
                        
                        To move to the next song, click the green next button or press 'n'. 
                        Alternatively, you can change the number below the drop down to skip to a different location in the source playlist.<br></br><br></br>
                        
                        By default, the app goes through all songs in the 'liked songs' playlist.
                        You can change the source playlist using the drop down menu, this changes the queue of songs you go through as you hit the next button.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div style={{height: "4vh"}} className="sidebar-heading row text-center" >
                    <div className="col-6" style={{paddingTop: "5px"}}><b>Select Playlists</b></div>
                    <div className="col-6">
                    <button className="btn btn-primary" style={{marginRight: "5px", width: "100%", overflow: "hidden"}}
                        onClick={this.handleShow}
                        >
                        Help</button>
                    </div>
                </div>
                <ul className="list-group list-group-flush"
                    style={{
                        overflow: "hidden",
                        overflowY: "scroll",
                        maxHeight: "81vh"
                    }}>
                    {destinationPlaylists}
                </ul>
                <div id="sidebarFooter" style={{
                    maxHeight: "15vh"
                }}>                    
                    <div>
                        <img src={this.props.currentTrack ? this.props.currentTrack.album.images[1].url : ""} alt=""
                            style={{float: "left", width: "80px", height: "80px"}}></img>
                        <div style={{float:"left", marginLeft: "12px", marginTop: "12px", maxWidth: "65%", maxHeight: "80px"}}>
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
