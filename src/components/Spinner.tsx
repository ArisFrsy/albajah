import React from 'react';

function Loading() {
    return (
        <div className='blur-background'>
            <div className="ring">
                Loading
                <div className='circle'></div>
            </div>
        </div>
    );
}

export default Loading;
