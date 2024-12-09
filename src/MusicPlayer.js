import React, { useEffect, useRef, useState } from 'react';
import './MusicPlayer.css';
import { useSongId } from './hooks/useSongId';
import { Row } from 'react-bootstrap';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const PREMIUM_SONG_LIMIT = 44;

const MusicPlayer = () => {
    const [songId] = useSongId();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const progressBarRef = useRef(null);
    const audioRef = useRef(new Audio());
    const [song, setSong] = useState({});
    const [plays, setPlays] = useState(0);
    const [viewIncremented, setViewIncremented] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        setCurrentUser(storedUser);
    }, []);

    useEffect(() => {
        if (songId) {
            fetch(`http://localhost:9999/listsongs/${songId}`)
                .then(res => res.json())
                .then(data => {
                    setSong(data);
                    setPlays(data.plays ?? 0);
                    setViewIncremented(false);
                    setIsPremium(data?.premium ?? false);
                    
                })
                .catch(e => console.error(e));
        }
    }, [songId]);

    console.log(songId);
    const incrementPlays = async () => {
        if (viewIncremented) return;

        const newPlays = plays + 1;
        setPlays(newPlays);

        try {
            const response = await fetch(`http://localhost:9999/listsongs/${songId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ plays: newPlays }),
            });

            if (!response.ok) {
                throw new Error('Failed to update play count');
            }
        } catch (error) {
            console.error('Error updating play count:', error);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (song.src) {
            audio.src = song.src;
            audio.addEventListener('timeupdate', updateProgress);
            audio.addEventListener('loadedmetadata', () => {
                setDuration(audio.duration);
            });

            return () => {
                audio.removeEventListener('timeupdate', updateProgress);
                audio.removeEventListener('loadedmetadata', () => {});
            };
        }
    }, [song]);

    const updateProgress = () => {
        const audio = audioRef.current;
        setCurrentTime(audio.currentTime);

        if (isPremium && !currentUser?.Premium && audio.currentTime >= PREMIUM_SONG_LIMIT) {
            audio.pause();
            setIsPlaying(false);
            audio.currentTime = PREMIUM_SONG_LIMIT;
        }

        if (audio.currentTime > audio.duration / 2 && !viewIncremented) {
            incrementPlays();
            setViewIncremented(true);
        }
    };

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleProgressChange = (e) => {
        const audio = audioRef.current;
        const clickPosition = (e.pageX - progressBarRef.current.offsetLeft) / progressBarRef.current.offsetWidth;
        let newTime = clickPosition * audio.duration;
        
        if (isPremium && !currentUser?.Premium && newTime > PREMIUM_SONG_LIMIT) {
            newTime = PREMIUM_SONG_LIMIT;
        }
        
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (isMuted) {
            audio.volume = volume;
            setIsMuted(false);
        } else {
            audio.volume = 0;
            setIsMuted(true);
        }
    };

    return songId ? (
        <section className="music-player">
            <div className="player-content">
                <article className="song-info">
                    <img src={song.imgSrc} alt="Album cover" className="cover-art" />
                    <div className="song-details">
                        <h2 className="song-title">{song.title}</h2>
                        <p className="artist">{song.artist}</p>
                    </div>
                </article>
                <div className="controls" style={{ marginLeft: "20%" }}>
                    <button className="play-pause" onClick={togglePlayPause}>
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    <span className="time">
                        {`${formatTime(currentTime)} / ${formatTime(isPremium && !currentUser?.Premium ? Math.min(duration, PREMIUM_SONG_LIMIT) : duration)}`}
                    </span>
                </div>
            </div>
            <Row className="progress-container">
                <div className="progress-bar" ref={progressBarRef} onClick={handleProgressChange}>
                    <div className="progress" style={{ width: `${(currentTime / (isPremium && !currentUser?.Premium ? Math.min(duration, PREMIUM_SONG_LIMIT) : duration)) * 100}%` }}></div>
                </div>
            </Row>
            <Row className="volume-control">
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <button onClick={toggleMute}>
                        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                    />
                </div>
            </Row>
            <Row className="quality" style={{justifyContent: "flex-end"}}>128kbps</Row>
            <Row className="play-count" style={{justifyContent: "flex-start"}}>Plays: {plays}</Row>
            {isPremium && !currentUser?.Premium && (
                <div className="premium-message">
                    This is a premium song. Upgrade to listen to the full track.
                </div>
            )}
        </section>
    ) : null;
};

export default MusicPlayer;