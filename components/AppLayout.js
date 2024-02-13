import React from 'react';
import propTypes from 'prop-types';

const AppLayout = ({ children }) => {
    return (
        <>
            {children}
        </>
    );
};

AppLayout.propTypes = {
    children: propTypes.node
};

export default AppLayout;