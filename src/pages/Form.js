import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Form = () => {
    const titleRef = useRef(null);
    const stationRef = useRef(null);
    const navigate = useNavigate();

    // 3. POST-запрос: отправка новых данных
    const handleSubmit = (e) => {
        e.preventDefault();

        const newIncident = {
            title: titleRef.current.value,
            station: stationRef.current.value,
            status: "На рассмотрении"
        };

        axios.post("https://69dfcd3629c070e6597ae821.mockapi.io/incidents", newIncident)
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
                <button type="submit" style={{ cursor: 'pointer', padding: '5px' }}>Сохранить</button>
            </form>
            <br />
            <button onClick={() => navigate('/')}>Назад</button>
        </div>
    );
};

export default Form;