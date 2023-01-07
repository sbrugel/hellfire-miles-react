import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useSelector, useDispatch } from "react-redux";
import { updateData } from '../../store/filterInputSlice';

const HomePage = (user) => {
    const fileReader = new FileReader();
    const [file, setFile] = useState({}); // selected file to be imported

    const [moves, setMoves] = useState([]); // the list of moves this user has done
    const [movesDisplay, setMovesDisplay] = useState([]); // the moves as they are displayed on the page (INCLUDES <p> tags)
    const [statsDisplay, setStatsDisplay] = useState(''); // stats display (does NOT include <p> tags)

    // filter stuff (only one or the other will have content)
    const [classFilter, setClassFilter] = useState('');
    const [locoFilter, setLocoFilter] = useState('');

    const dispatch = useDispatch();
    const filter = useSelector((state) => state.filter);

    // on page load, get moves from this user
    useEffect(() => {
        axios.get(`http://localhost:5000/moves/${user.user.name}`).then((res) => {
            setMoves(res.data);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // whenever moves update (i.e. we upload new moves), update display
    useEffect(() => {
        console.log('moves updating')
        axios.get(`http://localhost:5000/moves/${user.user.name}`).then((moves) => {
            let displayData = moves.data; // what will actually be shown, based on what the filters are set to
            if (filter.classFilter) {
                displayData = displayData.filter((m) => m.loco1.startsWith(filter.classFilter) || m.loco2.startsWith(filter.classFilter) || m.loco3.startsWith(filter.classFilter) || m.loco4.startsWith(filter.classFilter));
                displayData = displayData.filter((m) => m.loco1.length === 5); // get rid of non-loco moves
            }
            if (filter.locoFilter) {
                displayData = displayData.filter((m) => m.loco1 === filter.locoFilter || m.loco2 === filter.locoFilter || m.loco3 === filter.locoFilter || m.loco4 === filter.locoFilter);
            }
            let data = displayData.map((m) => 
                <tr key={m._id}>
                    <td>{<b>{m.loco1}</b>}</td>
                    <td>{m.loco2 ? <b>{m.loco2}</b> : 'None'}</td>
                    <td>{m.loco3 ? <b>{m.loco3}</b> : 'None'}</td>
                    <td>{m.loco4 ? <b>{m.loco4}</b> : 'None'}</td>
                    <td>{m.start}</td>
                    <td>{m.end}</td>
                    <td>{m.service}</td>
                    <td>{m.mileage}</td>
                </tr>);
            setMovesDisplay(data.length > 0 ? <table><th>Loco 1</th><th>Loco 2</th><th>Loco 3</th><th>Loco 4</th><th>Start</th><th>End</th><th>Service</th><th>Mileage</th>
                { data }</table> : <p>No moves yet</p>);

            const locos = [];
            let mileage = 0;
            for (const move of displayData) {
                mileage += move.mileage;
                if (!locos.includes(move.loco1) && move.loco1.length === 5) { // length check to see if its an actual loco, not a D/EMU or other transport
                    locos.push(move.loco1);
                }
                if (move.loco2) {
                    if (!locos.includes(move.loco2)) {
                        locos.push(move.loco2);
                    }
                }
                if (move.loco3) {
                    if (!locos.includes(move.loco3)) {
                        locos.push(move.loco3);
                    }
                }
                if (move.loco4) {
                    if (!locos.includes(move.loco4)) {
                        locos.push(move.loco4);
                    }
                }
            }
            setStatsDisplay(data.length > 0 ? `You have been on ${data.length} journeys on ${locos.length} different locos, totalling ${Math.round(mileage)} miles` : '');
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moves, filter.classFilter, filter.locoFilter]);

    /**
     * When the user uploads a new CSV file to the page, update the selected CSV file to be imported
     * @param {*} e The file picker (fires this function)
     */
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    /**
     * When the user changes the class filter, update it while clearing the loco filter
     * @param {*} e The class filter text box (fires this function)
     */
    const handleClassChange = (e) => {
        setClassFilter(e.target.value);
        setLocoFilter('');
    }

    /**
     * When the user changes the loco filter, update it while clearing the class filter
     * @param {*} e The text box (fires this function)
     */
    const handleLocoChange = (e) => {
        setLocoFilter(e.target.value);
        setClassFilter('');
    }

    /**
     * Updates the filter (proper) when the filter button is clicked. This consequently refreshes the moves list accordingly
     * @param {*} e The filter button (fires this function)
     */
    const handleFilterSubmit = (e) => {
        e.preventDefault();

        dispatch(
            updateData({
                classFilter: classFilter,
                locoFilter: locoFilter
            })
        )
    }

    /**
     * Converts the contents of a CSV file to an array, with each row corresponding to an element of the array.
     * @param {string} string: Contents of CSV file
     * @returns CSV contents in an array
     */
    const csvFileToArray = string => {
        const DELIMITER = ',';
        const headers = string.slice(0, string.indexOf("\n")).split(DELIMITER);
        const rows = string.slice(string.indexOf("\n") + 1).split("\n");
        const arr = rows.map(function (row) {
            const values = row.split(DELIMITER);
            const el = headers.reduce(function (object, header, index) {
                object[header] = values[index];
                return object;
            }, {});
            return el;
        });

        return arr;
    };

    /**
     * Handles CSV file uploading; adds all moves in this CSV file to the database under the currently logged in user's username
     * @param {*} e The import button (fires this function)
     */
    const handleFileSubmit = (e) => {
        e.preventDefault();

        if (file) {
            let movesArray, movesAdded = 0;
            fileReader.onload = async function (event) {
                const newMoves = [];
                movesArray = csvFileToArray(event.target.result);
                for (const move of movesArray) {
                    if (!move.Loco1) continue; // empty move
                    const m = {
                        user: user.user.name,
                        loco1: move.Loco1,
                        loco2: move.Loco2,
                        loco3: move.Loco3,
                        loco4: move.Loco4,
                        start: move.From,
                        end: move.To,
                        service: move.Headcode + ' ' + move.Train,
                        mileage: Number(move["Mileage\r"])
                    };
                    await axios.post("http://localhost:5000/moves", m);
                    newMoves.push(move);
                    movesAdded++;
                }
                setMoves([...moves, newMoves]);
                alert(`Added ${movesAdded} new moves!`);
            }

            fileReader.readAsText(file);
        } else {
            alert("You haven't uploaded a CSV!");
        }
    }

    return (
        <>
            <h1>{ user.user.name }'s Moves</h1>
            <button type="submit" onClick={ () => alert('Not done yet') }>Traction League</button>
            <h2>Import Moves</h2>
            <input type="file" accepts=".csv" onChange={ handleFileChange } />
            <button type="submit" onClick={ handleFileSubmit }>Import</button>
            <h2>Your Moves</h2>
            <p>Filter by Class: <input type="text" maxlength="2" value={ classFilter } onChange={ handleClassChange } /></p>
            <p>Filter by Loco: <input type="text" maxlength="5" value={ locoFilter } onChange={ handleLocoChange } /></p>
            <button type="submit" onClick={ handleFilterSubmit }>Filter</button>
            <p>{ statsDisplay }</p>
            <div>
                { movesDisplay }
            </div>
        </>
    )
}

export default HomePage;