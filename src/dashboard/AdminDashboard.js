import { useState, useEffect } from 'react';
import React from 'react'
import { BsMusicNoteBeamed, BsMicFill, BsPeopleFill, BsStarFill }
  from 'react-icons/bs'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line }
  from 'recharts';
import { Link, NavLink } from "react-router-dom";
import './dash.css'
import HeaderAdmin from '../Admin/Header';


function AdminDashboard() {
  const [songCount, setSongCount] = useState(0);
  const [artistCount, setArtistCount] = useState(0);
  const [cusCount, setCusCount] = useState(0);
  const [a, seta] = useState(0);


  useEffect(() => {
    fetch('https://yvkjyc-8080.csb.app/listsongs')
      .then(response => response.json())
      .then(data => {
        console.log('Received data:', data); // Debug log
        if (Array.isArray(data)) {
          setSongCount(data.length);
        } else if (data && Array.isArray(data.listsongs)) {
          setSongCount(data.listsongs.length);
        } else {
          console.error('Unexpected data structure:', data);
          setSongCount(0);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setSongCount(0);
      });
  }, []);
  useEffect(() => {
    fetch('https://yvkjyc-8080.csb.app/artist')
      .then(response => response.json())
      .then(data => {
        console.log('Received data:', data); // Debug log
        if (Array.isArray(data)) {
          setArtistCount(data.length);
        } else if (data && Array.isArray(data.artist)) {
          setArtistCount(data.artist.length);
        } else {
          console.error('Unexpected data structure:', data);
          setArtistCount(0);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setSongCount(0);
      });
  }, []);
  useEffect(() => {
    fetch('https://yvkjyc-8080.csb.app/users')
      .then(response => response.json())
      .then(data => {
        console.log('Received data:', data); // Debug log
        if (Array.isArray(data)) {
          setCusCount(data.length);
        } else if (data && Array.isArray(data.user)) {
          setCusCount(data.user.length);
        } else {
          console.error('Unexpected data structure:', data);
          setArtistCount(0);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setSongCount(0);
      });
  }, []);
  useEffect(() => {
    fetch('https://yvkjyc-8080.csb.app/transaction_history')
      .then(response => response.json())
      .then(data => {
        console.log('Received data:', data); // Debug log
        if (Array.isArray(data)) {
          seta(data.length);
        } else if (data && Array.isArray(data.transaction_history)) {
          seta(data.transaction_history.length);
        } else {
          console.error('Unexpected data structure:', data);
          seta(0);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setSongCount(0);
      });
  }, []);
  const [data, setData] = useState([]);


  useEffect(() => {
    // Fetch data from API
    fetch('https://yvkjyc-8080.csb.app/transaction_history')
      .then(response => response.json())
      .then(data => {
        setData(data); // Set fetched data to state
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const aggregateData = (data) => {
    const aggregated = {};

    data.forEach(item => {
      const date = item.transactionDate.split('T')[0]; // Extract date part only
      if (aggregated[date]) {
        aggregated[date] += item.amount; // Add amount if date already exists
      } else {
        aggregated[date] = item.amount; // Initialize if date doesn't exist
      }
    });

    // Convert aggregated data to array format for Recharts
    const chartData = Object.keys(aggregated).map(date => ({
      date,
      amount: aggregated[date]
    }));

    // Sort data by date
    chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

    return chartData;
  };


  const aggregatedData = aggregateData(data);


  // kiem tra user
  const [artist, setArtist] = useState([]);
  useEffect(() => {
    fetch(`https://yvkjyc-8080.csb.app/artist`)
      .then(res => res.json())
      .then(data => setArtist(data))
      .catch(e => console.log(e));
  }, []);
  const user = artist.find(u => u.email === 'sontungmtp@example.com');
  if (user) {
    sessionStorage.setItem('artist', JSON.stringify(user));
  }


  return (
    <main className='main-container' style={{ backgroundColor: 'white' }}>
      <HeaderAdmin></HeaderAdmin>
      <div className='main-title'>
        <h3 style={{ color: 'black' }}><Link to={'/artistDashboard'}>DASHBOARD</Link></h3>
      </div>
      <NavLink to={"/home1"}></NavLink>
      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>SONGS</h3>
            <BsMusicNoteBeamed className='card_icon' />
          </div>
          <h1>{songCount}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>ARTIST</h3>
            <BsMicFill className='card_icon' />
          </div>
          <h1>{artistCount}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>CUSTOMERS</h3>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>{cusCount}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>PREMIUM</h3>
            <BsStarFill className='card_icon' />
          </div>
          <h1>{a}</h1>
        </div>
      </div>

      {/* <ResponsiveContainer width="100%" height="100%">
            <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#8884d8" />
                <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer> */}


      <div style={{ padding: '20px' }}>
        <h2 style={{ color: 'black' }}>Amount PREMIUM by Date</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={aggregatedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value, name, props) => (
                <>
                  <p> {value}</p>
                  <p>Date: {props.payload.date}</p>
                </>
              )}
            />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </main>
  )
}

export default AdminDashboard
