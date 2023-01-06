import React from 'react';

const HomePage = (user) => {
    console.log('here')
    return (
        <>
        <h1>Logged in as { user.user.name }</h1>
        </>
    )
}

export default HomePage;