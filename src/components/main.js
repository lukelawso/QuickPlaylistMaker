import React, { Component } from 'react';
import axios from 'axios';
import Sidebar from './sidebar.js'
import hash from '../hash';
import TileList from './tileList.js';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {token: null, playlists: []};
        this.handleClick=this.handleClick.bind(this);
    }    

    handleClick(index) {
        //console.log(this.state.playlists[index].name + " at index: " + index);
        const list = this.state.playlists.map((item, j) => {
            if (j === index) {
                let temp = item;
                temp.selected = item.selected ? false : true;
                return temp;
            } else {
                return item;
            }
        });
        this.setState({
            playlists: list
        });
    }

    componentDidMount() {
        // Set token
        let _token = hash.access_token;
        if (_token) {
            // Set token
            axios.get('https://api.spotify.com/v1/me/playlists/?limit=50',
            {headers: { 'Authorization': 'Bearer ' + _token }})
            .then(res => {this.setState({token: _token, playlists: res.data.items})});          
        }
        
    }

    render() {        
        return (
        <div>
            {this.state.token != null && (
                <div className="d-flex">
                    <div className="bg-light border-right" id="sidebar-wrapper">
                        <Sidebar playlists={this.state.playlists} handleClick={this.handleClick}></Sidebar>
                    </div>
                    <TileList playlists={this.state.playlists}></TileList>
                </div>
            )}
            <div id="page-content-wrapper">
            </div>         
        </div>
        )
    }
}
