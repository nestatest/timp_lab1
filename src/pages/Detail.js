import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://69dfcd3629c070e6597ae821.mockapi.io/incidents";

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [incident, setIncident] = useState(null);
    
    const titleRef = useRef(null);
    const stationRef = useRef(null);
    const statusRef = useRef(null);
    const categoryRef = useRef(null);
    const severityRef = useRef(null);
    const reportedAtRef = useRef(null);
    const assignedToRef = useRef(null);
    const etaMinutesRef = useRef(null);
    const descriptionRef = useRef(null);

    // Снова GET, но уже конкретного объекта по ID
    useEffect(() => {
        axios.get(`${API_URL}/${id}`)
            .then(response => setIncident(response.data))
            .catch(err => console.error(err));
    }, [id]);

    // 4. PUT-запрос: обновление данных
    const handleUpdate = (e) => {
        e.preventDefault();

        const updatedData = {
            title: titleRef.current.value,
            station: stationRef.current.value,
            status: statusRef.current.value,
            category: categoryRef.current.value,
            severity: severityRef.current.value,
            reportedAt: reportedAtRef.current.value,
            assignedTo: assignedToRef.current.value,
            etaMinutes: Number(etaMinutesRef.current.value),
            description: descriptionRef.current.value
        };

        axios.put(`${API_URL}/${id}`, updatedData)
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
                        <option value="Новый">Новый</option>
                        <option value="На рассмотрении">На рассмотрении</option>
                        <option value="В работе">В работе</option>
                        <option value="Устранено">Устранено</option>
                    </select>
                </label>
                <label>Категория:
                    <input type="text" ref={categoryRef} defaultValue={incident.category || ''} style={{ width: '100%' }} />
                </label>
                <label>Приоритет:
                    <input type="text" ref={severityRef} defaultValue={incident.severity || ''} style={{ width: '100%' }} />
                </label>
                <label>Время регистрации:
                    <input type="text" ref={reportedAtRef} defaultValue={incident.reportedAt || ''} style={{ width: '100%' }} />
                </label>
                <label>Ответственный:
                    <input type="text" ref={assignedToRef} defaultValue={incident.assignedTo || ''} style={{ width: '100%' }} />
                </label>
                <label>ETA (мин):
                    <input type="number" ref={etaMinutesRef} defaultValue={incident.etaMinutes ?? 0} style={{ width: '100%' }} />
                </label>
                <label>Описание:
                    <textarea ref={descriptionRef} defaultValue={incident.description || ''} rows={3} style={{ width: '100%' }} />
                </label>
                <button type="submit" style={{ cursor: 'pointer', padding: '5px' }}>Обновить</button>
            </form>
            <br />
            <button onClick={() => navigate('/')}>Назад</button>
        </div>
    );
};

export default Detail;