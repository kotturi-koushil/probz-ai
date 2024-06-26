import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { transformData } from '../utils/dataTransform';

const ChartComponent = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [timeframe, setTimeframe] = useState('daily');
    const [selectedData, setSelectedData] = useState(null);

    useEffect(() => {
        fetch('/data.json')
            .then(response => response.json())
            .then(data => {
                setData(data);
                setFilteredData(transformData(data, 'daily'));
            });
    }, []);

    useEffect(() => {
        setFilteredData(transformData(data, timeframe));
    }, [timeframe, data]);

    const handleClick = (data) => {
        setSelectedData(data);
    };

    const exportChart = () => {
        const chartElement = document.querySelector('.recharts-wrapper');
        if (chartElement) {
            html2canvas(chartElement).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'chart.png';
                link.click();
            });
        }
    };

    return (
        <div className="chart-container">
            <div className="controls">
                <button onClick={() => setTimeframe('daily')}>Daily</button>
                <button onClick={() => setTimeframe('weekly')}>Weekly</button>
                <button onClick={() => setTimeframe('monthly')}>Monthly</button>
                <button onClick={exportChart}>Export Chart</button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredData} onClick={handleClick}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
            <Modal show={!!selectedData} onHide={() => setSelectedData(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Data Point Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedData && (
                        <div>
                            <p>Timestamp: {selectedData.timestamp}</p>
                            <p>Value: {selectedData.value}</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ChartComponent;
