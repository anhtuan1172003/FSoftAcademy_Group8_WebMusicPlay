import React, { useState, useRef } from 'react';
import { FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp, FaVolumeDown } from 'react-icons/fa';
import './MusicPlayer.css';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio('path_to_your_song.mp3'));
    const [volume, setVolume] = useState(0.5);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
        if (!isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    };

    const handleVolumeChange = (e) => {
        setVolume(e.target.value);
        audioRef.current.volume = e.target.value;
    };

    return (
        <div className="music-player">
            <div className="cover">
                <img src="path_to_your_cover_image.jpg" alt="Cover" />
            </div>
            <div className="controls">
                <FaBackward />
                <button onClick={togglePlayPause}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <FaForward />
            </div>
            <div className="volume-controls">
                <FaVolumeDown />
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
                <FaVolumeUp />
            </div>
        </div>
    );
};

export default MusicPlayer;
