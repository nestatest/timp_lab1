import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [incidents, setIncidents] = useState([]);

    // 1. GET-запрос: получаем список с сервера
    useEffect(() => {
        axios.get("https://69dfcd3629c070e6597ae821.mockapi.io/incidents")
            .then(response => setIncidents(response.data))
            .catch(err => console.error(err));
    }, []);

    // 2. DELETE-запрос: удаление записи
    const handleDelete = (id) => {
        axios.delete(`https://69dfcd3629c070e6597ae821.mockapi.io/incidents/${id}`)
            .then(() => {
                setIncidents(incidents.filter(item => item.id !== id));
            })
            .catch(err => console.error(err));
    };

    return (
    <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1>Мониторинг безопасности</h1>
            <Link to="/add" className="btn-primary">Добавить запись</Link>
        </div>
        
        <div className="list">
            {incidents.map(item => (
                <div key={item.id} className="incident-card">
                    <div>
                        <div style={{ fontSize: '18px', fontWeight: '600' }}>{item.title}</div>
                        <div style={{ color: '#6c757d', marginTop: '5px' }}> {item.station}</div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span className="status-tag">{item.status}</span>
                        <Link to={`/detail/${item.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>Изменить</Link>
                        <button onClick={() => handleDelete(item.id)} className="btn-danger">Удалить</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
};

export default Home;