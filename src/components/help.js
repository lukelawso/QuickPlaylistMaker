import React, { Component } from 'react';
import {Modal, Button} from 'react-bootstrap'; 

export default class TileList extends Component {
    render () {
        return (
            <Modal show={this.props.showHelp} onHide={this.props.handleClose}>
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
                    <Button variant="primary" onClick={this.props.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}