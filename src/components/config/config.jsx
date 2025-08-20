import React, { useState} from 'react';
import './config.css';
import { Sidebar } from '../rss/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GeneralConfig } from './tabs/GeneralConfig';
import { UsersConfig } from './tabs/UsersConfig';
import { PlayersConfig } from './tabs/PlayersConfig';
import { FinanceConfig } from './tabs/FinanceConfig';
import { SystemConfig } from './tabs/SystemConfig';
import { useClubConfig } from '../../hooks/useClubConfig';
import { useUsers } from '../../hooks/useUsers';
import { useAccount} from '../../hooks/useAccount';

export function Config() {
    const [activeTab, setActiveTab] = useState('general');
    const { clubData, handleInputChange, handleSubmit } = useClubConfig();
    const { users, handleRoleChange, handleStatusChange } = useUsers();
    const { account } = useAccount();

    const tabs = [
        { id: 'general', label: 'General', component: GeneralConfig },
        { id: 'usuarios', label: 'Usuarios', component: UsersConfig },
        { id: 'jugadores', label: 'Jugadores', component: PlayersConfig },
        { id: 'finanzas', label: 'Finanzas', component: FinanceConfig },
        { id: 'sistema', label: 'Sistema', component: SystemConfig }
    ];

    const renderTabContent = () => {
        const TabComponent = tabs.find(tab => tab.id === activeTab)?.component;
        if (!TabComponent) return null;

        return (
            <TabComponent 
                clubData={clubData}
                users={users}
                account={account}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onRoleChange={handleRoleChange}
                onStatusChange={handleStatusChange}
            />
        );
    };

    return (
        <div className="home-wrapper">
            <Sidebar />
            <div className="body-container">
                <div className="config-container">
                    <div className="tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="tab-content-container">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}
