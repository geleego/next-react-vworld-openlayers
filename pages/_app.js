import Head from 'next/head';
import React from 'react';
import propTypes from 'prop-types';
import 'antd/dist/antd.css';
import 'ol/ol.css';
import 'font-awesome/css/font-awesome.min.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles.css';

import AppLayout from '../components/AppLayout';

const VworldOpenlayers = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <title>Vworld Openlayers</title>
            </Head>
            <AppLayout>
                <Component {...pageProps}/>
            </AppLayout>
        </>
    )
};

VworldOpenlayers.getInitialProps = async context => {
    const { ctx, Component } = context;
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
}

VworldOpenlayers.propTypes = {
    Component: propTypes.elementType
}

export default VworldOpenlayers;