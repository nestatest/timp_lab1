import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [incident, setIncident] = useState(null);
    
    const titleRef = useRef(null);
    const stationRef = useRef(null);
    const statusRef = useRef(null);

    // Снова GET, но уже конкретного объекта по ID
    useEffect(() => {
        axios.get(`https://69dfcd3629c070e6597ae821.mockapi.io/incidents/${id}`)
            .then(response => setIncident(response.data))
            .catch(err => console.error(err));
    }, [id]);

    // 4. PUT-запрос: обновление данных
    const handleUpdate = (e) => {
        e.preventDefault();

        const updatedData = {
            title: titleRef.current.value,
            station: stationRef.current.value,
            status: statusRef.current.value
        };

        axios.put(`https://69dfcd3629c070e6597ae821.mockapi.io/incidents/${id}`, updatedData)
            .then(() => {
                alert("Данные успешно обновлены!");
                navigate('/');
            })
            .catch(err => console.error(err));
    };

    if (!incident) return <div>Загрузка данных...</div>;

    return (
        <div>
            <h1>Редактирование инцидента №{id}</h1>
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
                <label>Тип нарушения:
                    <input type="text" ref={titleRef} defaultValue={incident.title} required style={{ width: '100%' }} />
                </label>
                <label>Станция:
                    <input type="text" ref={stationRef} defaultValue={incident.station} required style={{ width: '100%' }} />
                </label>
                <label>Статус:
                    <select ref={statusRef} defaultValue={incident.status} style={{ width: '100%' }}>
                        <option value="На рассмотрении">На рассмотрении</option>
                        <option value="В работе">В работе</option>
                        <option value="Устранено">Устранено</option>
                    </select>
                </label>
                <button type="submit" style={{ cursor: 'pointer', padding: '5px' }}>Обновить</button>
            </form>
            <br />
            <button onClick={() => navigate('/')}>Назад</button>
        </div>
    );
};

export default Detail;