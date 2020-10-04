import React, { Component } from 'react';
import axios from 'axios';
import Sidebar from './sidebar.js'
import hash from '../hash';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {token: null, playlists: [], viewList: [], selected: []};
        
    }    

    handleClick(index) {
        let temp = this.state.selected;
        temp[index] = temp[index] ? false : true;
        this.setState({selected: temp});
    }

    componentDidMount() {
        // Set token
        let _token = hash.access_token;
        if (_token) {
            // Set token
            axios.get('https://api.spotify.com/v1/me/playlists/?limit=50',
            {headers: { 'Authorization': 'Bearer ' + _token }})
            .then(res => {     
                this.setState({selected: [].fill(false, 0, res.data.items.length)});
                for (let i = 0; i < res.data.items.length; i++) {
                    this.state.viewList.push(
                        <button 
                            className={`list-group-item list-group-item-action bg-light ${this.state.selected[i] ? "" : "clicked"}`} 
                            key={i} 
                            onClick={this.handleClick(i)}>
                                {res.data.items[i].name}
                        </button>
                    );
                }           
                this.setState({
                    token: _token,
                    playlists: res.data
                });
            });
        }
        
    }

    render() {        
        return (
        <div>
            <div className="d-flex">
            <div className="bg-light border-right" id="sidebar-wrapper">
            {this.state.token != null && (
                <Sidebar token={this.state.token} viewList={this.state.viewList} handleClick={this.handleClick}></Sidebar>
            )}
            </div>
            </div>   
            <div id="page-content-wrapper">
            </div>         
        </div>
        )
    }
}
