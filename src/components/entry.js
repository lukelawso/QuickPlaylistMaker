import React, { Component } from 'react';

export const authEndpoint = "https://accounts.spotify.com/authorize";
export const clientId = "cd158e63734a43a8b3492d49a496dede";
export const redirectUri = "http://localhost:3000/main";
export const scopes = [
    "user-top-read",
    "user-read-currently-playing",
    "user-read-playback-state",
    "playlist-read-private",
    "user-library-read"
];


export default class Entry extends Component {
    constructor(props) {
        super(props);
        this.state = {token: null};
    }   
    render() {
    return (
        <div className="text-center align-middle">
        {this.state.token == null && (
            <div id="loginBtnWrap">
            <a
            id="loginBtn" className="btn btn-success"
            href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
            >
            Login to Spotify
            </a>
            </div>
        )}
        </div>
    );
    }
}