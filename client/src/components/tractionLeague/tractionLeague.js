import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from "react-router-dom";

const TractionLeague = (user) => {
    const [moves, setMoves] = useState([]); // the list of moves this user has done
    const [classDisplay, setClassDisplay] = useState(<p>Fetching data...</p>);
    const [sortBy, setSortBy] = useState('mileage');

    const navigate = useNavigate();

    // on page load, get moves and show traction rankings
    useEffect(() => {
        axios.get(`http://localhost:5000/moves/${user.user.name}`).then((res) => {
            setMoves(res.data);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:5000/allclasses`).then(async (res) => {
            const classArray = []; // array of data for each class
            const divArray = []; // array of div elements holding buttons

            let totalMileage = 0, totalCleared = 0;

            for (const classNum of res.data) {
                const classData = moves.filter(
                    (m) => m.loco1.length === 5 && (m.loco1.startsWith(classNum) || m.loco2.startsWith(classNum) || m.loco3.startsWith(classNum) || m.loco4.startsWith(classNum))
                );

                let mileage = 0;
                const locos = [];
                for (const move of classData) {
                    mileage += move.mileage;
                    totalMileage += move.mileage;
                    if (!locos.includes(move.loco1) && move.loco1.length === 5) { // length check to see if its an actual loco, not a D/EMU or other transport
                        if (move.loco1.startsWith(classNum)) {
                            locos.push(move.loco1);
                            totalCleared++;
                        }
                    }
                    if (move.loco2) {
                        if (!locos.includes(move.loco2)) {
                            if (move.loco2.startsWith(classNum)) {
                                locos.push(move.loco2);
                                totalCleared++;
                            }
                        }
                    }
                    if (move.loco3) {
                        if (!locos.includes(move.loco3)) {
                            if (move.loco3.startsWith(classNum)) {
                                locos.push(move.loco3);
                                totalCleared++;
                            }
                        }
                    }
                    if (move.loco4) {
                        if (!locos.includes(move.loco4)) {
                            if (move.loco4.startsWith(classNum)) {
                                locos.push(move.loco4);
                                totalCleared++;
                            }
                        }
                    }
                }

                let totalLocos = 0;
                await axios.get(`http://localhost:5000/alllocos/${classNum}`).then((res) => {
                    totalLocos = res.data.length;
                    classArray.push({
                        classNum: classNum,
                        journeys: classData.length,
                        mileage: Math.round(mileage * 100) / 100,
                        numLocos: locos.length,
                        totalLocos: totalLocos
                    });
                });
            }

            if (sortBy === 'mileage') {
                classArray.sort((a, b) => b.mileage - a.mileage);
            } else if (sortBy === 'journeys') {
                classArray.sort((a, b) => b.journeys - a.journeys);
            } else if (sortBy === 'class')  {
                classArray.sort((a, b) => a.classNum - b.classNum);
            }

            for (const c of classArray) {
                divArray.push(
                    <div class="grid-item" key={ c.classNum } onClick={() => navigate(`/class?classNum=${ c.classNum }`)} style={{
                        backgroundColor: c.numLocos === c.totalLocos ? 'lightgreen' : 'white'
                    }}>
                        <h2>{ c.classNum }</h2>
                        <p><strong>Journeys: </strong> { c.journeys }</p>
                        <p><strong>Miles: </strong> { c.mileage }</p>
                        <p><strong>Cleared: </strong> { c.numLocos } / { c.totalLocos } ({ Math.round((c.numLocos / c.totalLocos) * 100) }%)</p>
                    </div>
                )
            }
            await axios.get(`http://localhost:5000/alllocos`).then((res) => {
                divArray.unshift(
                    <div class="grid-item" key={ 'all' } onClick={() => navigate(`/class?classNum=ALL`)} style={{
                        backgroundColor: totalCleared === res.data.length ? 'lightgreen' : 'white'
                    }}>
                        <h2>ALL</h2>
                        <p><strong>Journeys: </strong> { moves.length }</p>
                        <p><strong>Miles: </strong> { Math.round(totalMileage * 100) / 100 }</p>
                        <p><strong>Cleared: </strong> { totalCleared } / { res.data.length } ({ Math.round((totalCleared / res.data.length) * 100) }%)</p>
                    </div>
                )
                setClassDisplay(divArray);
            });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moves, sortBy]);
    
    return (
        <>
            <h1>{ user.user.name }'s Traction League</h1>
            <button type="submit" onClick={ () => navigate("/") }>Moves List</button>
            <p>
                Sort by: <select onChange={ (e) => setSortBy(e.target.value.toLowerCase()) }>
                    <option name="mileage">Mileage</option>
                    <option name="class">Class</option>
                    <option name="journeys">Journeys</option>
                </select>
            </p>
            <div class="grid-container">
                { classDisplay }
            </div>
        </>
    )
}

export default TractionLeague;