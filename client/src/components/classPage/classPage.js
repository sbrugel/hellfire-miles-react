import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate, useSearchParams } from "react-router-dom";

const ClassPage = (user) => {
    const [searchParams, ] = useSearchParams();
    const cNum = searchParams.get('classNum');

    const [moves, setMoves] = useState([]);
    const [sortBy, setSortBy] = useState('loco');

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
        axios.get(`http://localhost:5000/alllocos${cNum !== 'ALL' ? `/${cNum}` : ''}`).then(async (res) => {
            const locoArray = []; // data for each loco
            const tableArray = []; // table to show
            for (const loco of res.data) {
                const locoData = moves.filter((m) => m.loco1 === loco || m.loco2 === loco || m.loco3 === loco || m.loco4 === loco);

                let mileage = 0;
                for (const move of locoData) {
                    mileage += move.mileage;
                }

                locoArray.push({
                    loco: loco,
                    journeys: locoData.length,
                    mileage: Math.round(mileage * 100) / 100,
                });

            }
            if (sortBy === 'mileage') {
                locoArray.sort((a, b) => b.mileage - a.mileage);
            } else if (sortBy === 'journeys') {
                locoArray.sort((a, b) => b.journeys - a.journeys);
            } else if (sortBy === 'loco')  {
                locoArray.sort((a, b) => a.loco - b.loco);
            }

            for (const l of locoArray) {
                tableArray.push(
                    <tr key={ l.loco }  style={{ backgroundColor: l.journeys !== 0 ? 'lightgreen' : 'white' }}>
                        <td onClick={ () => navigate(`/?locoNum=${l.loco}`) }>{ l.loco }</td>
                        <td>{ l.journeys }</td>
                        <td>{ l.mileage }</td>
                    </tr>
                )
            }
            setLocosDisplay(<table><th>Loco</th><th># of Journeys</th><th>Mileage</th>{ tableArray }</table>);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moves, sortBy])

    return (
        <>
            <h1>{ user.user.name }'s Class { cNum } Stats</h1>
            <button type="submit" onClick={ () => navigate("/tractionleague") }>Back</button>
            <p>
                Sort by: <select onChange={ (e) => setSortBy(e.target.value.toLowerCase()) }>
                    <option name="loco">Loco</option>
                    <option name="mileage">Mileage</option>
                    <option name="journeys">Journeys</option>
                </select>
            </p>
            <div>
                { locosDisplay }
            </div>
        </>
    )
}

export default ClassPage;