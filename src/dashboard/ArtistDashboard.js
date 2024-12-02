import { useState, useEffect } from 'react';
import React from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line }
    from 'recharts';
import './dash.css'
import HeaderArtist from '../Artist/HeaderArtist';

function ArtistDashboard() {
    const [listsongs, setListSong] = useState([]);

    useEffect(() => {
        // Fetch data from API
        fetch('http://localhost:9999/listsongs')
            .then(response => response.json())
            .then(data => {
                setListSong(data); // Set fetched data to state
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    const artistSession = JSON.parse(sessionStorage.getItem('artist'));
    const artistId = artistSession ? artistSession.id : null;
    const listSongsFiltered = listsongs.filter(song => song.artistID === artistId);

    const totalRevenue = listSongsFiltered.reduce((total, song) => total + song.plays * 10, 0);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const song = payload[0].payload;
            const revenue = song.plays * 100;
            return (
                <div className="custom-tooltip" style={{ backgroundColor: 'green', color: 'white' }}>
                    <p className="label">{`Title: ${song.title}`}</p>
                    <p className="intro">{`Revenue: ${revenue} VND`}</p>
                </div>
            );
        }
        return null;
    };
    return (
        <main className='main-container'>
                  <HeaderArtist></HeaderArtist>
          <div className='chart-container'>
          <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Total Revenue: {totalRevenue} VND</h2>
          <ResponsiveContainer width={1500} height={400}>
              <BarChart
                layout="vertical"
                data={listSongsFiltered}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="title" type="category" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="plays" name="Revenue" fill="#8884d8" formatter={(value) => value * 10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </main>
      );
    
}
export default ArtistDashboard
