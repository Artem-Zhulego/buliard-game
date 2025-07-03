import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../store/store';

import './footer.css';

function Footer() {
    const { t } = useTranslation();
    const location = useLocation();
    const { settings } = useSettingsStore();


    return (
        <>
            <footer className="footer">
                
            </footer>
        </>
    );
}

export default Footer;
