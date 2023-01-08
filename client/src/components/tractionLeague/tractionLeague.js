import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from "react-router-dom";

const TractionLeague = (user) => {
    const [moves, setMoves] = useState([]); // the list of moves this user has done

    const [classDisplay, setClassDisplay] = useState(<p>Fetching data...</p>);

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
            const classArray = []; // array of div elements holding buttons
            for (const classNum of res.data) {
                const classData = moves.filter(
                    (m) => m.loco1.length === 5 && (m.loco1.startsWith(classNum) || m.loco2.startsWith(classNum) || m.loco3.startsWith(classNum) || m.loco4.startsWith(classNum))
                );

                let mileage = 0;
                const locos = [];
                for (const move of classData) {
                    mileage += move.mileage;
                    if (!locos.includes(move.loco1) && move.loco1.length === 5) { // length check to see if its an actual loco, not a D/EMU or other transport
                        if (move.loco1.startsWith(classNum)) {
                            locos.push(move.loco1);
                        }
                    }
                    if (move.loco2) {
                        if (!locos.includes(move.loco2)) {
                            if (move.loco2.startsWith(classNum)) {
                                locos.push(move.loco2);
                            }
                        }
                    }
                    if (move.loco3) {
                        if (!locos.includes(move.loco3)) {
                            if (move.loco3.startsWith(classNum)) {
                                locos.push(move.loco3);
                            }
                        }
                    }
                    if (move.loco4) {
                        if (!locos.includes(move.loco4)) {
                            if (move.loco4.startsWith(classNum)) {
                                locos.push(move.loco4);
                            }
                        }
                    }
                }

                let totalLocos = 0;
                await axios.get(`http://localhost:5000/alllocos/${classNum}`).then((res) => {
                    totalLocos = res.data.length;
                    classArray.push(
                        <div class="grid-item" key={classNum} onClick={() => navigate(`/class?classNum=${classNum}`)} style={{
                            backgroundColor: locos.length === totalLocos ? 'lightgreen' : 'white'
                        }}>
                            <h2>{ classNum }</h2>
                            <p><strong>Journeys: </strong> { classData.length }</p>
                            <p><strong>Miles: </strong> { Math.round(mileage) }</p>
                            <p><strong>Cleared: </strong> { locos.length } / { totalLocos }</p>
                        </div>
                    )
                });
            }
            setClassDisplay(classArray);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moves]);
    
    return (
        <>
            <h1>{ user.user.name }'s Traction League</h1>
            <button type="submit" onClick={ () => navigate("/") }>Moves List</button>
            <p>Placeholder <input type="text" maxlength="2" onChange={ () => console.log('df') } /></p>
            <div class="grid-container">
                { classDisplay }
            </div>
        </>
    )
}

export default TractionLeague;