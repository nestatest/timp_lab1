import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://69dfcd3629c070e6597ae821.mockapi.io/incidents";

const Form = () => {
    const titleRef = useRef(null);
    const stationRef = useRef(null);
    const statusRef = useRef(null);
    const categoryRef = useRef(null);
    const severityRef = useRef(null);
    const reportedAtRef = useRef(null);
    const assignedToRef = useRef(null);
    const etaMinutesRef = useRef(null);
    const descriptionRef = useRef(null);
    const navigate = useNavigate();

    // 3. POST-запрос: отправка новых данных
    const handleSubmit = (e) => {
        e.preventDefault();

        const newIncident = {
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

        axios.post(API_URL, newIncident)
            .then(() => {
                alert("Инцидент успешно добавлен!");
                navigate('/');
            })
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h1>Регистрация нового инцидента</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
                <label>Тип нарушения:
                    <input type="text" ref={titleRef} required style={{ width: '100%' }} />
                </label>
                <label>Станция:
                    <input type="text" ref={stationRef} required style={{ width: '100%' }} />
                </label>
                <label>Статус:
                    <select ref={statusRef} defaultValue="Новый" style={{ width: '100%' }}>
                        <option value="Новый">Новый</option>
                        <option value="На рассмотрении">На рассмотрении</option>
                        <option value="В работе">В работе</option>
                        <option value="Устранено">Устранено</option>
                    </select>
                </label>
                <label>Категория:
                    <input type="text" ref={categoryRef} required style={{ width: '100%' }} />
                </label>
                <label>Приоритет:
                    <input type="text" ref={severityRef} required style={{ width: '100%' }} />
                </label>
                <label>Время регистрации:
                    <input type="text" ref={reportedAtRef} placeholder="2026-04-20T13:25:00Z" required style={{ width: '100%' }} />
                </label>
                <label>Ответственный:
                    <input type="text" ref={assignedToRef} required style={{ width: '100%' }} />
                </label>
                <label>ETA (мин):
                    <input type="number" ref={etaMinutesRef} defaultValue={0} required style={{ width: '100%' }} />
                </label>
                <label>Описание:
                    <textarea ref={descriptionRef} rows={3} required style={{ width: '100%' }} />
                </label>
                <button type="submit" style={{ cursor: 'pointer', padding: '5px' }}>Сохранить</button>
            </form>
            <br />
            <button onClick={() => navigate('/')}>Назад</button>
        </div>
    );
};

export default Form;