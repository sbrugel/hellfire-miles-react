import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate, useSearchParams } from "react-router-dom";

const ClassPage = (user, classNum) => {
    const [searchParams, ] = useSearchParams();
    const cNum = searchParams.get('classNum');

    const [moves, setMoves] = useState([]);

    const [locosDisplay, setLocosDisplay] = useState(<p>Fetching data...</p>)

    const navigate = useNavigate();

    // on page load, get moves and show traction rankings
    useEffect(() => {
        axios.get(`http://localhost:5000/moves/${user.user.name}`).then((res) => {
            setMoves(res.data);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:5000/alllocos/${cNum}`).then(async (res) => {
            const locoArray = []; // table to show
            for (const loco of res.data) {
                const locoData = moves.filter((m) => m.loco1 === loco || m.loco2 === loco || m.loco3 === loco || m.loco4 === loco);

                let mileage = 0;
                for (const move of locoData) {
                    mileage += move.mileage;
                }

                locoArray.push(
                    <tr key={ loco }  style={{ backgroundColor: locoData.length !== 0 ? 'lightgreen' : 'white' }}>
                        <td>{ loco }</td>
                        <td>{ locoData.length }</td>
                        <td>{ Math.round(mileage) }</td>
                    </tr>
                )
            }
            setLocosDisplay(<table><th>Loco</th><th># of Journeys</th><th>Mileage</th>{ locoArray }</table>);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moves])

    return (
        <>
            <h1>{ user.user.name }'s Class { cNum } Stats</h1>
            <button type="submit" onClick={ () => navigate("/tractionleague") }>Back</button>
            <p>Placeholder <input type="text" maxlength="2" onChange={ () => console.log('df') } /></p>
            <div>
                { locosDisplay }
            </div>
        </>
    )
}

export default ClassPage;